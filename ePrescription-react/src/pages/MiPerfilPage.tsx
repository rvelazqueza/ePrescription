/**
 * Mi Perfil Page - Perfil del usuario conectado
 * Permite al usuario ver y editar su información personal, cambiar contraseña,
 * gestionar seguridad (2FA) y actualizar foto de perfil
 */

import { useState, useRef } from 'react';
import { PageBanner } from '../components/PageBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Shield, 
  Lock, 
  Camera,
  Save,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getCurrentSession } from '../utils/multiRoleSession';
import { getUserById, updateUser } from '../utils/usersStore';
import { 
  validatePasswordStrength, 
  getPasswordStrength,
  validatePasswordMatch,
  validatePasswordDifferent,
  validateUserProfile,
  PASSWORD_POLICIES
} from '../utils/securityValidation';

export function MiPerfilPage() {
  const session = getCurrentSession();
  const user = session ? getUserById(session.userId) : null;

  // Estados
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para cambio de contraseña
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para datos editables
  const [editedData, setEditedData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialty: user?.specialty || '',
    department: user?.department || '',
  });

  // Estado para 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);

  if (!session || !user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No hay sesión activa</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handler para subir foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor seleccione una imagen válida');
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe exceder 5MB');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        toast.success('Foto de perfil actualizada', {
          description: 'Los cambios se guardarán al hacer clic en "Guardar cambios"'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para guardar cambios
  const handleSaveChanges = () => {
    // Validar datos antes de guardar
    const validation = validateUserProfile(editedData);
    
    if (!validation.valid) {
      toast.error('Error de validación', {
        description: validation.messages[0] || 'Por favor corrige los errores'
      });
      return;
    }

    setIsSaving(true);

    // Simular guardado
    setTimeout(() => {
      // Aquí iría la actualización real al backend
      const updates = {
        ...editedData,
        // En producción, guardar también profilePhoto en backend
      };

      // Registrar en auditoría
      console.log('🔐 Cambios registrados en auditoría:', {
        userId: user?.userId,
        changes: updates,
        timestamp: new Date().toISOString(),
        requiresAuth: false
      });

      toast.success('Perfil actualizado exitosamente', {
        description: 'Tus cambios han sido registrados en auditoría según normativa HIPAA'
      });

      setIsEditing(false);
      setIsSaving(false);
    }, 1500);
  };

  // Handler para cambiar contraseña
  const handleChangePassword = () => {
    // Validación 1: Campos obligatorios
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    // Validación 2: Contraseñas coinciden
    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.valid) {
      toast.error(matchValidation.message);
      return;
    }

    // Validación 3: Nueva contraseña diferente de la actual
    const differentValidation = validatePasswordDifferent(currentPassword, newPassword);
    if (!differentValidation.valid) {
      toast.error(differentValidation.message);
      return;
    }

    // Validación 4: Fortaleza de contraseña según NIST 800-63B
    const strengthValidation = validatePasswordStrength(newPassword, {
      username: user?.username,
      email: user?.email,
      fullName: user?.fullName,
      phone: user?.phone
    });

    if (!strengthValidation.valid) {
      toast.error('Contraseña no cumple con las políticas de seguridad', {
        description: strengthValidation.message
      });
      return;
    }

    // Simular cambio de contraseña
    console.log('🔐 Cambio de contraseña registrado en auditoría:', {
      userId: user?.userId,
      timestamp: new Date().toISOString(),
      compliance: 'NIST 800-63B, HIPAA, FDA 21 CFR Part 11'
    });

    toast.success('Contraseña actualizada exitosamente', {
      description: 'Por seguridad, se cerrarán todas tus sesiones activas'
    });

    // Limpiar campos
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handler para toggle 2FA
  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    
    if (enabled) {
      toast.success('Autenticación de dos factores habilitada', {
        description: 'Tu cuenta ahora está más segura'
      });
    } else {
      toast.info('Autenticación de dos factores deshabilitada', {
        description: 'Puedes habilitarla nuevamente cuando lo desees'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        icon={User}
        title="Mi Perfil"
        description={`Gestiona tu información personal y configuración de seguridad - ${user.fullName}`}
        gradient="from-blue-600 via-indigo-600 to-purple-600"
        action={
          <Badge className="bg-white/20 text-white border-white/30">
            <Shield className="w-3 h-3 mr-1" />
            Usuario ID: {user.userId}
          </Badge>
        }
      />

      <Tabs defaultValue="informacion" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="informacion">Información Personal</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
        </TabsList>

        {/* Tab: Información Personal */}
        <TabsContent value="informacion" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información de perfil y datos de contacto
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto de perfil */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-primary" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{user.specialty}</p>
                  <p className="text-xs text-muted-foreground">
                    <Upload className="w-3 h-3 inline mr-1" />
                    Máximo 5MB - JPG, PNG o GIF
                  </p>
                </div>
              </div>

              <Separator />

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={editedData.fullName}
                      onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    value={user.username}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="specialty"
                      value={editedData.specialty}
                      onChange={(e) => setEditedData({ ...editedData, specialty: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="department"
                      value={editedData.department}
                      onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cédula profesional</Label>
                  <Input
                    value={user.certifiedId || 'No especificada'}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estado de cuenta</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status === 'active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Roles asignados */}
              <div className="space-y-3">
                <Label>Roles asignados</Label>
                <div className="flex flex-wrap gap-2">
                  {user.assignedRoles.map((role) => (
                    <Badge key={role} variant="outline" className="bg-primary/5">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de sesión */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Último inicio de sesión</p>
                  <p className="font-medium">{user.lastLogin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de inicios de sesión</p>
                  <p className="font-medium">{user.loginCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cuenta creada</p>
                  <p className="font-medium">{user.createdDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Intentos fallidos</p>
                  <p className="font-medium">{user.failedAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Seguridad */}
        <TabsContent value="seguridad" className="space-y-6">
          {/* Alert de políticas de seguridad */}
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Políticas NIST 800-63B:</strong> Las contraseñas deben tener mínimo {PASSWORD_POLICIES.MIN_LENGTH} caracteres 
              e incluir al menos {PASSWORD_POLICIES.MIN_CHAR_TYPES} tipos de caracteres (minúsculas, mayúsculas, números, símbolos).
            </AlertDescription>
          </Alert>

          {/* Cambiar contraseña */}
          <Card>
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña regularmente para mantener tu cuenta segura siguiendo estándares NIST 800-63B
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña actual *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña *</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder={`Mínimo ${PASSWORD_POLICIES.MIN_LENGTH} caracteres`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Indicador de fortaleza */}
                {newPassword && (() => {
                  const strength = getPasswordStrength(newPassword);
                  return (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Fortaleza de la contraseña</span>
                        <span className={`font-medium ${
                          strength.strength < 40 ? 'text-destructive' :
                          strength.strength < 60 ? 'text-warning' :
                          strength.strength < 80 ? 'text-yellow-600' :
                          'text-success'
                        }`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.strength}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Incluye mayúsculas, minúsculas, números y símbolos especiales
                      </p>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña *</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Repite la nueva contraseña"
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

              <Button onClick={handleChangePassword} className="w-full md:w-auto">
                <Lock className="w-4 h-4 mr-2" />
                Cambiar contraseña
              </Button>
            </CardContent>
          </Card>

          {/* Autenticación de dos factores */}
          <Card>
            <CardHeader>
              <CardTitle>Autenticación de dos factores (2FA)</CardTitle>
              <CardDescription>
                Agrega una capa adicional de seguridad a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-green-100' : 'bg-muted'}`}>
                    <Smartphone className={`w-5 h-5 ${twoFactorEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium">
                      {twoFactorEnabled ? 'Autenticación habilitada' : 'Autenticación deshabilitada'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled 
                        ? 'Tu cuenta está protegida con verificación en dos pasos'
                        : 'Habilita 2FA para mayor seguridad'
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleToggle2FA}
                />
              </div>

              {twoFactorEnabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Autenticación de dos factores activa
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Se te solicitará un código de verificación cada vez que inicies sesión desde un nuevo dispositivo.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sesiones activas */}
          <Card>
            <CardHeader>
              <CardTitle>Sesiones activas</CardTitle>
              <CardDescription>
                Gestiona dónde has iniciado sesión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sesión actual</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome en Windows • Ahora
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Activa
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Preferencias */}
        <TabsContent value="preferencias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias del sistema</CardTitle>
              <CardDescription>
                Personaliza tu experiencia en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones por correo</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones importantes por email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones push</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones en tiempo real
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de seguridad</p>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones sobre actividad sospechosa
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
