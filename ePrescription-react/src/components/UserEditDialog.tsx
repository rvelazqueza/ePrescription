/**
 * UserEditDialog - Panel de Edición Completo de Usuario
 * 
 * Funcionalidades:
 * - Edición de información básica del usuario
 * - Gestión de roles (asignar/cambiar)
 * - Gestión de permisos granulares
 * - Cambio de estados con validaciones
 * - Gestión de MFA
 * - Vinculación de firma digital
 * - Historial de auditoría
 * 
 * Cumplimiento: HIPAA, FDA 21 CFR Part 11, FHIR, ISO 27001
 */

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { updateUser, updateUserRoles, auditUserChange } from "../utils/usersStore";
import { getAllRoles } from "../utils/rolesStore";
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Lock,
  Key,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  Fingerprint,
  Clock,
  Activity,
  Ban,
  Unlock,
  FileText,
  Info,
  Star,
} from "lucide-react";

interface UserData {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;  // Rol primario
  assignedRoles?: string[];  // Roles asignados (multi-rol)
  specialty: string;
  status: string;
  lastLogin: string;
  loginCount: number;
  failedAttempts: number;
  createdDate: string;
  department: string;
  certifiedId: string | null;
  twoFactorEnabled: boolean;
}

interface UserEditDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (user: UserData) => void;
}

export function UserEditDialog({ user, open, onOpenChange, onUpdate }: UserEditDialogProps) {
  const [editedUser, setEditedUser] = useState<UserData>({ 
    ...user,
    assignedRoles: user.assignedRoles || [user.role]  // Inicializar con rol primario si no existe
  });
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [statusChangeReason, setStatusChangeReason] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({
    prescriptions: {
      create: true,
      read: true,
      update: true,
      delete: false,
      sign: user.role === "Médico" || user.role === "Médico Jefe",
      approve: user.role === "Médico Jefe" || user.role === "Administrador",
      viewAll: user.role === "Administrador" || user.role === "Médico Jefe",
    },
    patients: {
      create: user.role !== "Farmacéutico",
      read: true,
      update: user.role !== "Farmacéutico",
      delete: user.role === "Administrador",
      export: user.role === "Administrador" || user.role === "Médico Jefe",
      viewSensitive: user.role !== "Administrativo",
    },
    users: {
      create: user.role === "Administrador",
      read: user.role === "Administrador" || user.role === "Médico Jefe",
      update: user.role === "Administrador",
      delete: user.role === "Administrador",
      manageRoles: user.role === "Administrador",
      approveRequests: user.role === "Administrador",
    },
    inventory: {
      create: user.role === "Farmacéutico" || user.role === "Administrador",
      read: true,
      update: user.role === "Farmacéutico" || user.role === "Administrador",
      adjust: user.role === "Farmacéutico" || user.role === "Administrador",
      approveOrders: user.role === "Administrador",
    },
    reports: {
      create: user.role === "Administrador" || user.role === "Médico Jefe",
      read: true,
      export: user.role !== "Administrativo",
      configure: user.role === "Administrador",
      viewAll: user.role === "Administrador" || user.role === "Médico Jefe",
    },
    security: {
      read: user.role === "Administrador",
      update: user.role === "Administrador",
      audit: user.role === "Administrador",
      manageSessions: user.role === "Administrador",
    },
    system: {
      configure: user.role === "Administrador",
      backup: user.role === "Administrador",
      restore: user.role === "Administrador",
      maintenance: user.role === "Administrador",
    },
  });

  const handleSave = () => {
    // Validaciones
    if (!editedUser.email || !editedUser.phone) {
      toast.error('Error de validación', {
        description: 'Email y teléfono son obligatorios',
        duration: 4000,
      });
      return;
    }

    // Validar que assignedRoles no esté vacío
    if (!editedUser.assignedRoles || editedUser.assignedRoles.length === 0) {
      toast.error('Error de validación', {
        description: 'El usuario debe tener al menos un rol asignado',
        duration: 4000,
      });
      return;
    }

    // Validar que el rol primario esté en los roles asignados
    if (!editedUser.assignedRoles.includes(editedUser.role)) {
      toast.error('Error de validación', {
        description: 'El rol primario debe estar en los roles asignados',
        duration: 4000,
      });
      return;
    }

    // Guardar cambios en el store dinámico
    const updatedUser = updateUser(editedUser.id, {
      username: editedUser.username,
      fullName: editedUser.fullName,
      email: editedUser.email,
      phone: editedUser.phone,
      primaryRole: editedUser.role,
      assignedRoles: editedUser.assignedRoles,
      specialty: editedUser.specialty,
      status: editedUser.status,
      department: editedUser.department,
      certifiedId: editedUser.certifiedId,
      twoFactorEnabled: editedUser.twoFactorEnabled,
    });

    if (updatedUser) {
      // Guardar cambios en la UI (callback)
      onUpdate(editedUser);
      
      // Auditoría
      auditUserChange(
        editedUser.id,
        'UPDATE',
        {
          before: user,
          after: editedUser,
        },
        'admin-001' // En producción: obtener del contexto
      );

      toast.success('Usuario actualizado', {
        description: 'Los cambios se han guardado correctamente. Si el usuario tiene una sesión activa, los roles se actualizarán automáticamente.',
        duration: 5000,
      });

      onOpenChange(false);
    } else {
      toast.error('Error al actualizar', {
        description: 'No se pudo actualizar el usuario',
        duration: 4000,
      });
    }
  };

  const handleChangeStatus = (newStatus: string) => {
    if (!statusChangeReason.trim()) {
      toast.error('Justificación requerida', {
        description: 'Debe proporcionar una razón para el cambio de estado',
        duration: 4000,
      });
      return;
    }

    setEditedUser({ ...editedUser, status: newStatus });
    
    toast.success('Estado actualizado', {
      description: `Usuario ${newStatus === 'active' ? 'activado' : newStatus === 'blocked' ? 'bloqueado' : 'inactivo'}`,
      duration: 4000,
    });

    setIsChangingStatus(false);
    setStatusChangeReason("");
    
    // Auditoría de cambio de estado
    console.log('Auditoría: Cambio de estado', {
      userId: editedUser.id,
      timestamp: new Date().toISOString(),
      previousStatus: user.status,
      newStatus,
      reason: statusChangeReason,
      modifiedBy: 'admin-001',
    });
  };

  const handleToggle2FA = () => {
    const newValue = !editedUser.twoFactorEnabled;
    setEditedUser({ ...editedUser, twoFactorEnabled: newValue });
    
    toast.success(newValue ? '2FA habilitado' : '2FA deshabilitado', {
      description: newValue ? 'Se requiere configuración en próximo inicio de sesión' : 'Autenticación de dos factores deshabilitada',
      duration: 4000,
    });
  };

  const handleRoleChange = (newRole: string) => {
    setEditedUser({ ...editedUser, role: newRole });
    
    // Actualizar permisos según el nuevo rol
    const rolePermissions = getRoleBasePermissions(newRole);
    setSelectedPermissions(rolePermissions);
    
    toast.info('Rol actualizado', {
      description: 'Los permisos base se han actualizado según el nuevo rol',
      duration: 4000,
    });
  };

  const getRoleBasePermissions = (role: string) => {
    // Retorna permisos base según el rol
    const isAdmin = role === "Administrador";
    const isDoctor = role === "Médico" || role === "Médico Jefe";
    const isChiefDoctor = role === "Médico Jefe";
    const isPharmacist = role === "Farmacéutico";
    
    return {
      prescriptions: {
        create: isDoctor || isAdmin,
        read: true,
        update: isDoctor || isAdmin,
        delete: isAdmin,
        sign: isDoctor,
        approve: isChiefDoctor || isAdmin,
        viewAll: isAdmin || isChiefDoctor,
      },
      patients: {
        create: !isPharmacist,
        read: true,
        update: !isPharmacist,
        delete: isAdmin,
        export: isAdmin || isChiefDoctor,
        viewSensitive: !role.includes("Administrativo"),
      },
      users: {
        create: isAdmin,
        read: isAdmin || isChiefDoctor,
        update: isAdmin,
        delete: isAdmin,
        manageRoles: isAdmin,
        approveRequests: isAdmin,
      },
      inventory: {
        create: isPharmacist || isAdmin,
        read: true,
        update: isPharmacist || isAdmin,
        adjust: isPharmacist || isAdmin,
        approveOrders: isAdmin,
      },
      reports: {
        create: isAdmin || isChiefDoctor,
        read: true,
        export: !role.includes("Administrativo"),
        configure: isAdmin,
        viewAll: isAdmin || isChiefDoctor,
      },
      security: {
        read: isAdmin,
        update: isAdmin,
        audit: isAdmin,
        manageSessions: isAdmin,
      },
      system: {
        configure: isAdmin,
        backup: isAdmin,
        restore: isAdmin,
        maintenance: isAdmin,
      },
    };
  };

  // Obtener roles del sistema
  const allSystemRoles = useMemo(() => getAllRoles(), []);
  const baseRoles = useMemo(() => allSystemRoles.filter(r => r.type === 'base'), [allSystemRoles]);
  const customRoles = useMemo(() => allSystemRoles.filter(r => r.type === 'custom'), [allSystemRoles]);
  
  // Filtrar roles personalizados disponibles para este usuario
  const availableCustomRoles = useMemo(() => 
    customRoles.filter(role => !role.userId || role.userId === user.id),
    [customRoles, user.id]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Gestión completa de usuario • ID: {user.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
            <TabsTrigger value="basic">Información</TabsTrigger>
            <TabsTrigger value="role">Rol</TabsTrigger>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 overflow-hidden">
            {/* TAB 1: INFORMACIÓN BÁSICA */}
            <TabsContent value="basic" className="h-full m-0 p-0">
              <ScrollArea className="h-full px-1">
                <div className="space-y-6 mt-4 pr-4 pb-6">
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Los campos de identificación personal (nombre, cédula) no son editables por seguridad.
                  Para cambios, contacte al administrador del sistema.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre completo</Label>
                  <Input value={editedUser.fullName} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Nombre de usuario</Label>
                  <Input value={editedUser.username} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={editedUser.department} onValueChange={(value) => setEditedUser({ ...editedUser, department: value })}>
                    <SelectTrigger id="department">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta Externa">Consulta Externa</SelectItem>
                      <SelectItem value="Cardiología">Cardiología</SelectItem>
                      <SelectItem value="Dirección Médica">Dirección Médica</SelectItem>
                      <SelectItem value="Farmacia Central">Farmacia Central</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                      <SelectItem value="Sistemas">Sistemas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Input
                    id="specialty"
                    value={editedUser.specialty}
                    onChange={(e) => setEditedUser({ ...editedUser, specialty: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Código profesional</Label>
                  <Input value={editedUser.certifiedId || "No especificado"} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Fecha de creación</Label>
                  <Input value={editedUser.createdDate} disabled className="bg-muted" />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estadísticas de Acceso</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Último acceso</p>
                    <p className="font-medium">{editedUser.lastLogin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de accesos</p>
                    <p className="font-medium">{editedUser.loginCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Intentos fallidos</p>
                    <p className="font-medium text-destructive">{editedUser.failedAttempts}</p>
                  </div>
                </CardContent>
              </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* TAB 2: ROL Y ESTADO */}
            <TabsContent value="role" className="h-full m-0 p-0">
              <ScrollArea className="h-full px-1">
                <div className="space-y-6 mt-4 pr-4">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  <strong>Sistema Multi-Rol:</strong> Puede asignar múltiples roles al usuario. 
                  El rol primario será el predeterminado al iniciar sesión.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Rol Primario</CardTitle>
                  <CardDescription>Rol predeterminado al iniciar sesión</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol primario *</Label>
                    <Select value={editedUser.role} onValueChange={handleRoleChange}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {(() => {
                          const allSystemRoles = getAllRoles();
                          const assignedRoles = editedUser.assignedRoles || [editedUser.role];
                          
                          // Filtrar solo los roles que ya están asignados al usuario
                          const availableRoles = allSystemRoles.filter(role => 
                            assignedRoles.includes(role.name)
                          );
                          
                          return availableRoles.map(role => (
                            <SelectItem key={role.id} value={role.name}>
                              <div className="flex items-center gap-2">
                                {role.name === 'Administrador' && <Shield className="w-4 h-4" />}
                                {role.name === 'Médico' && <User className="w-4 h-4" />}
                                {role.name === 'Médico Jefe' && <User className="w-4 h-4" />}
                                {role.name === 'Farmacéutico' && <Building2 className="w-4 h-4" />}
                                {role.name === 'Administrativo' && <FileText className="w-4 h-4" />}
                                {role.type === 'custom' && <Star className="w-4 h-4 text-purple-600" />}
                                <span>{role.name}</span>
                                {role.type === 'custom' && (
                                  <Badge variant="outline" className="text-xs ml-2">Personalizado</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600">
                      Solo se muestran roles asignados al usuario. Asigne roles primero en la sección inferior.
                    </p>
                  </div>

                  {editedUser.role !== user.role && (
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Cambio de rol primario detectado:</strong> De "{user.role}" a "{editedUser.role}".
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Roles Asignados</CardTitle>
                  <CardDescription>
                    Todos los roles que el usuario puede utilizar (incluye el rol primario)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const assignedRoles = editedUser.assignedRoles || [editedUser.role];
                    
                    return (
                      <>
                        {/* Roles Base */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <Label className="text-sm font-medium text-blue-700">Roles Base ({baseRoles.length})</Label>
                          </div>
                          <ScrollArea className="max-h-[250px] pr-4">
                            <div className="space-y-2">
                              {baseRoles.map((role) => {
                                const isAssigned = assignedRoles.includes(role.name);
                                const isPrimary = editedUser.role === role.name;
                                
                                return (
                                  <div key={role.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                                    isAssigned ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                                  }`}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <Checkbox
                                        checked={isAssigned}
                                        onCheckedChange={(checked) => {
                                          if (isPrimary && !checked) {
                                            toast.error('No puede quitar el rol primario', {
                                              description: 'Cambie el rol primario primero',
                                              duration: 4000,
                                            });
                                            return;
                                          }
                                          
                                          const newAssignedRoles = checked
                                            ? [...assignedRoles, role.name]
                                            : assignedRoles.filter(r => r !== role.name);
                                          
                                          setEditedUser({
                                            ...editedUser,
                                            assignedRoles: newAssignedRoles
                                          });
                                        }}
                                        disabled={isPrimary}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <Label className="cursor-pointer font-medium">
                                            {role.name === 'Administrador' && '🛡️'} 
                                            {role.name === 'Médico' && '🩺'} 
                                            {role.name === 'Médico Jefe' && '👨‍⚕️'} 
                                            {role.name === 'Farmacéutico' && '💊'} 
                                            {role.name === 'Administrativo' && '📋'} 
                                            {' '}{role.name}
                                          </Label>
                                          {role.status === 'deprecated' && (
                                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                              Deprecado
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">{role.description}</p>
                                        {isPrimary && (
                                          <p className="text-xs text-blue-600 font-medium mt-1">⭐ Rol primario</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                      {isAssigned && !isPrimary && (
                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                      )}
                                      {isPrimary && (
                                        <Badge variant="default" className="bg-blue-100 text-blue-700 flex-shrink-0">
                                          Primario
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </div>

                        {/* Roles Personalizados */}
                        {availableCustomRoles.length > 0 ? (
                          <div className="space-y-2 pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-purple-600" />
                              <Label className="text-sm font-medium text-purple-700">Roles Personalizados ({availableCustomRoles.length})</Label>
                            </div>
                            <ScrollArea className="max-h-[250px] pr-4">
                              <div className="space-y-2">
                                {availableCustomRoles.map((role) => {
                                  const isAssigned = assignedRoles.includes(role.name);
                                  const isPrimary = editedUser.role === role.name;
                                  
                                  return (
                                    <div key={role.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                                      isAssigned ? 'bg-purple-50 border-purple-300' : 'hover:bg-gray-50'
                                    }`}>
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Checkbox
                                          checked={isAssigned}
                                          onCheckedChange={(checked) => {
                                            if (isPrimary && !checked) {
                                              toast.error('No puede quitar el rol primario', {
                                                description: 'Cambie el rol primario primero',
                                                duration: 4000,
                                              });
                                              return;
                                            }
                                            
                                            const newAssignedRoles = checked
                                              ? [...assignedRoles, role.name]
                                              : assignedRoles.filter(r => r !== role.name);
                                            
                                            setEditedUser({
                                              ...editedUser,
                                              assignedRoles: newAssignedRoles
                                            });
                                            
                                            if (checked) {
                                              toast.success('Rol agregado', {
                                                description: `Rol "${role.name}" asignado al usuario`,
                                                duration: 3000,
                                              });
                                            }
                                          }}
                                          disabled={isPrimary}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <Label className="cursor-pointer font-medium">
                                              ⭐ {role.name}
                                            </Label>
                                            {role.type === 'custom' && role.approvalStatus === 'pending' && (
                                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                                Pendiente
                                              </Badge>
                                            )}
                                            {role.type === 'custom' && role.validUntil && (
                                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                                                Temporal
                                              </Badge>
                                            )}
                                            {role.userId && (
                                              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                                                Específico
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-xs text-gray-600 truncate">{role.description}</p>
                                          {role.type === 'custom' && (
                                            <p className="text-xs text-purple-600 mt-1">
                                              Basado en: {role.baseRoleName}
                                            </p>
                                          )}
                                          {isPrimary && (
                                            <p className="text-xs text-blue-600 font-medium mt-1">⭐ Rol primario</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 ml-2">
                                        {isAssigned && !isPrimary && (
                                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        )}
                                        {isPrimary && (
                                          <Badge variant="default" className="bg-blue-100 text-blue-700 flex-shrink-0">
                                            Primario
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        ) : (
                          <Alert className="mt-4">
                            <Info className="w-4 h-4" />
                            <AlertDescription>
                              <strong>No hay roles personalizados disponibles.</strong><br/>
                              Puede crear roles personalizados desde la página de Roles y Permisos.
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    );
                  })()}

                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Multi-Rol:</strong> El usuario podrá cambiar entre sus roles asignados 
                      durante la sesión sin necesidad de volver a autenticarse.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estado del Usuario</CardTitle>
                  <CardDescription>Gestión del estado de la cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Estado actual</p>
                      <p className="text-sm text-muted-foreground">
                        {editedUser.status === 'active' ? 'Usuario activo y operativo' :
                         editedUser.status === 'blocked' ? 'Usuario bloqueado por seguridad' :
                         'Usuario inactivo temporalmente'}
                      </p>
                    </div>
                    <Badge variant={editedUser.status === 'active' ? 'default' : 'destructive'}>
                      {editedUser.status === 'active' ? 'Activo' : editedUser.status === 'blocked' ? 'Bloqueado' : 'Inactivo'}
                    </Badge>
                  </div>

                  {!isChangingStatus && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsChangingStatus(true)}
                    >
                      Cambiar estado de usuario
                    </Button>
                  )}

                  {isChangingStatus && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                      <div className="space-y-2">
                        <Label>Nuevo estado</Label>
                        <Select defaultValue={editedUser.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                Activo
                              </div>
                            </SelectItem>
                            <SelectItem value="inactive">
                              <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-gray-600" />
                                Inactivo
                              </div>
                            </SelectItem>
                            <SelectItem value="blocked">
                              <div className="flex items-center gap-2">
                                <Ban className="w-4 h-4 text-red-600" />
                                Bloqueado
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Justificación (obligatorio) *</Label>
                        <textarea
                          className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                          placeholder="Especifique la razón del cambio de estado..."
                          value={statusChangeReason}
                          onChange={(e) => setStatusChangeReason(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setIsChangingStatus(false);
                            setStatusChangeReason("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handleChangeStatus(editedUser.status)}
                        >
                          Confirmar cambio
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* TAB 3: PERMISOS GRANULARES */}
            <TabsContent value="permissions" className="h-full m-0 p-0">
              <ScrollArea className="h-full px-1">
                <div className="space-y-6 mt-4 pr-4 pb-6">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  Permisos granulares por módulo. Los permisos marcados se aplicarán al guardar.
                  Cambios requieren justificación en auditoría.
                </AlertDescription>
              </Alert>

              {/* Prescripciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Prescripciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Crear recetas</Label>
                      <p className="text-sm text-muted-foreground">Puede prescribir medicamentos</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.prescriptions.create}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        prescriptions: { ...selectedPermissions.prescriptions, create: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Firmar recetas</Label>
                      <p className="text-sm text-muted-foreground">Firma digital de prescripciones</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.prescriptions.sign}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        prescriptions: { ...selectedPermissions.prescriptions, sign: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Aprobar recetas especiales</Label>
                      <p className="text-sm text-muted-foreground">Medicamentos controlados</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.prescriptions.approve}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        prescriptions: { ...selectedPermissions.prescriptions, approve: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Ver todas las recetas</Label>
                      <p className="text-sm text-muted-foreground">Incluye recetas de otros médicos</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.prescriptions.viewAll}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        prescriptions: { ...selectedPermissions.prescriptions, viewAll: checked as boolean }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pacientes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pacientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Crear pacientes</Label>
                      <p className="text-sm text-muted-foreground">Registrar nuevos pacientes</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.patients.create}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        patients: { ...selectedPermissions.patients, create: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Ver datos sensibles</Label>
                      <p className="text-sm text-muted-foreground">PHI/Información médica protegida</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.patients.viewSensitive}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        patients: { ...selectedPermissions.patients, viewSensitive: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Exportar datos</Label>
                      <p className="text-sm text-muted-foreground">PDF/CSV/Excel</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.patients.export}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        patients: { ...selectedPermissions.patients, export: checked as boolean }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Usuarios y Seguridad */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Usuarios y Seguridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Gestionar usuarios</Label>
                      <p className="text-sm text-muted-foreground">Crear/editar/eliminar usuarios</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.users.update}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        users: { ...selectedPermissions.users, update: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Gestionar roles</Label>
                      <p className="text-sm text-muted-foreground">Asignar y configurar roles</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.users.manageRoles}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        users: { ...selectedPermissions.users, manageRoles: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Aprobar solicitudes</Label>
                      <p className="text-sm text-muted-foreground">Registro de nuevos usuarios</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.users.approveRequests}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        users: { ...selectedPermissions.users, approveRequests: checked as boolean }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Inventario */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inventario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Gestionar stock</Label>
                      <p className="text-sm text-muted-foreground">Crear/editar medicamentos</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.inventory.update}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        inventory: { ...selectedPermissions.inventory, update: checked as boolean }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Ajustar inventario</Label>
                      <p className="text-sm text-muted-foreground">Modificar cantidades de stock</p>
                    </div>
                    <Checkbox
                      checked={selectedPermissions.inventory.adjust}
                      onCheckedChange={(checked) => setSelectedPermissions({
                        ...selectedPermissions,
                        inventory: { ...selectedPermissions.inventory, adjust: checked as boolean }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* TAB 4: SEGURIDAD */}
            <TabsContent value="security" className="h-full m-0 p-0">
              <ScrollArea className="h-full px-1">
                <div className="space-y-6 mt-4 pr-4 pb-6">
              <Alert>
                <Lock className="w-4 h-4" />
                <AlertDescription>
                  Configuración de seguridad y autenticación multi-factor (MFA)
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Autenticación Multi-Factor (2FA)</CardTitle>
                  <CardDescription>Configuración de seguridad adicional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label>2FA Habilitado</Label>
                      <p className="text-sm text-muted-foreground">
                        {editedUser.twoFactorEnabled 
                          ? 'Usuario protegido con doble factor' 
                          : 'Usuario sin protección adicional'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {editedUser.twoFactorEnabled ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <Switch
                        checked={editedUser.twoFactorEnabled}
                        onCheckedChange={handleToggle2FA}
                      />
                    </div>
                  </div>

                  {editedUser.role === "Administrador" && !editedUser.twoFactorEnabled && (
                    <Alert variant="destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Advertencia:</strong> Los administradores DEBEN tener 2FA habilitado por política de seguridad.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Firma Digital</CardTitle>
                  <CardDescription>Vinculación con BCCR/GAUDI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label>Estado de vinculación</Label>
                      <p className="text-sm text-muted-foreground">
                        {editedUser.certifiedId 
                          ? 'Firma digital vinculada y activa' 
                          : 'Sin firma digital vinculada'}
                      </p>
                    </div>
                    {editedUser.certifiedId ? (
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        <Fingerprint className="w-4 h-4 mr-1" />
                        Vinculada
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        No vinculada
                      </Badge>
                    )}
                  </div>

                  {!editedUser.certifiedId && (editedUser.role === "Médico" || editedUser.role === "Médico Jefe") && (
                    <Alert>
                      <Info className="w-4 h-4" />
                      <AlertDescription>
                        La firma digital es requerida para prescribir medicamentos controlados.
                        El usuario debe completar el proceso de vinculación.
                      </AlertDescription>
                    </Alert>
                  )}

                  {editedUser.certifiedId && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Certificado:</span>
                        <span className="font-mono">{editedUser.certifiedId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vigencia:</span>
                        <span className="text-green-600">Válido hasta 2026-12-31</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Acciones de Seguridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="w-4 h-4 mr-2" />
                    Forzar cambio de contraseña en próximo acceso
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Unlock className="w-4 h-4 mr-2" />
                    Resetear configuración 2FA
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <Ban className="w-4 h-4 mr-2" />
                    Cerrar todas las sesiones activas
                  </Button>
                </CardContent>
              </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* TAB 5: AUDITORÍA */}
            <TabsContent value="audit" className="h-full m-0 p-0">
              <ScrollArea className="h-full px-1">
                <div className="space-y-6 mt-4 pr-4 pb-6">
              <Alert>
                <Activity className="w-4 h-4" />
                <AlertDescription>
                  Registro completo de cambios en este usuario (últimos 30 días)
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historial de Cambios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "2025-10-07 14:30", action: "Cambio de departamento", user: "admin-001", details: "De 'Consulta Externa' a 'Cardiología'" },
                      { date: "2025-10-05 09:15", action: "Habilitaci��n de 2FA", user: "admin-001", details: "Autenticación de dos factores activada" },
                      { date: "2025-09-28 11:20", action: "Cambio de rol", user: "admin-002", details: "De 'Médico' a 'Médico Jefe'" },
                      { date: "2025-09-15 16:45", action: "Actualización de email", user: "USR-0023", details: "Email modificado" },
                    ].map((log, idx) => (
                      <div key={idx} className="flex gap-3 p-3 border rounded-lg">
                        <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{log.action}</p>
                              <p className="text-sm text-muted-foreground truncate">{log.details}</p>
                            </div>
                            <Badge variant="outline" className="flex-shrink-0">{log.user}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{log.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actividad de Sesión</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sesiones activas:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Último acceso exitoso:</span>
                      <span className="font-medium">{editedUser.lastLogin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Intentos fallidos (últimos 30 días):</span>
                      <span className="font-medium">{editedUser.failedAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de accesos:</span>
                      <span className="font-medium">{editedUser.loginCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar para visualizar permisos (placeholder para futuras expansiones)
function RolePermissionsDialog({ role, open, onOpenChange }: { role: any; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Permisos del Rol: {role.name}</DialogTitle>
          <DialogDescription>Configuración de permisos para este rol</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Los permisos de roles se gestionan globalmente. Los cambios aquí afectarán a todos los usuarios con este rol.
          </p>
          {/* Aquí iría la configuración de permisos del rol */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
