/**
 * RoleSelector - Selector de Rol Activo
 * 
 * Permite cambiar el rol activo en sesión sin re-login
 * Muestra rol activo claramente con badge visual
 * Audita todos los cambios de rol
 */

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";
import {
  Shield,
  User,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  getCurrentSession,
  changeActiveRole,
  getSuggestedRoleByRoute,
  getActiveRole,
  getAssignedRoles,
  getPrimaryRole,
  getRoleInfo,
  type RoleChangeRecord,
} from "../utils/multiRoleSession";

interface RoleSelectorProps {
  currentRoute: string;
  onRoleChange?: (newRole: string) => void;
}

export function RoleSelector({ currentRoute, onRoleChange }: RoleSelectorProps) {
  const session = getCurrentSession();
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [changeReason, setChangeReason] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedRole, setSuggestedRole] = useState<string | null>(null);

  // Verificar sugerencia de rol según ruta
  useEffect(() => {
    if (!session) return;
    
    const suggested = getSuggestedRoleByRoute(currentRoute);
    if (suggested) {
      setSuggestedRole(suggested);
      setShowSuggestion(true);
      
      // Auto-ocultar sugerencia después de 10 segundos
      const timer = setTimeout(() => {
        setShowSuggestion(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [currentRoute, session]);

  if (!session) {
    return null;
  }

  const activeRole = getActiveRole() || session.primaryRole;
  const assignedRoles = getAssignedRoles();
  const primaryRole = getPrimaryRole();
  const roleInfo = getRoleInfo(activeRole);

  const handleOpenChangeDialog = (role: string) => {
    setSelectedRole(role);
    setChangeReason("");
    setIsChangeDialogOpen(true);
  };

  const handleConfirmChange = () => {
    if (!selectedRole) return;

    try {
      const changeRecord = changeActiveRole(
        selectedRole,
        changeReason || undefined,
        'user',
        currentRoute
      );

      toast.success('Rol cambiado exitosamente', {
        description: `Ahora está trabajando como: ${selectedRole}`,
        duration: 4000,
      });

      setIsChangeDialogOpen(false);
      setChangeReason("");
      setSelectedRole(null);

      // Callback externo
      if (onRoleChange) {
        onRoleChange(selectedRole);
      }

      // Ocultar sugerencia si se cambió al rol sugerido
      if (selectedRole === suggestedRole) {
        setShowSuggestion(false);
      }

    } catch (error) {
      toast.error('Error al cambiar rol', {
        description: error instanceof Error ? error.message : 'Error desconocido',
        duration: 4000,
      });
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestedRole) {
      handleOpenChangeDialog(suggestedRole);
    }
  };

  const handleResetToPrimary = () => {
    if (activeRole === primaryRole) {
      toast.info('Ya está en su rol primario', {
        duration: 3000,
      });
      return;
    }
    
    handleOpenChangeDialog(primaryRole);
  };

  // Badge de rol activo (siempre visible)
  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'Administrador': 'bg-red-100 text-red-700 border-red-300',
      'Médico': 'bg-green-100 text-green-700 border-green-300',
      'Médico Jefe': 'bg-blue-100 text-blue-700 border-blue-300',
      'Farmacéutico': 'bg-orange-100 text-orange-700 border-orange-300',
      'Administrativo': 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      {/* Sugerencia contextual */}
      {showSuggestion && suggestedRole && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertTriangle className="w-4 h-4 text-blue-600" />
          <div className="flex items-center justify-between flex-1">
            <AlertDescription className="text-blue-900">
              <strong>Sugerencia:</strong> Esta sección normalmente requiere rol de{' '}
              <strong>{suggestedRole}</strong>
            </AlertDescription>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSuggestion(false)}
                className="border-blue-300"
              >
                Ahora no
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptSuggestion}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Cambiar a {suggestedRole}
              </Button>
            </div>
          </div>
        </Alert>
      )}

      {/* Selector de rol en TopBar */}
      <div className="flex items-center gap-3">
        {/* Badge de rol activo */}
        <Badge
          variant="outline"
          className={`px-3 py-1.5 font-medium ${getRoleBadgeColor(activeRole)}`}
        >
          <span className="mr-2">{roleInfo?.icon || '👤'}</span>
          {activeRole}
        </Badge>

        {/* Dropdown de cambio de rol (solo si tiene múltiples roles) */}
        {assignedRoles.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Cambiar rol
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Roles asignados
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {assignedRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => {
                    if (role !== activeRole) {
                      handleOpenChangeDialog(role);
                    }
                  }}
                  className={role === activeRole ? 'bg-muted' : ''}
                  disabled={role === activeRole}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span>{getRoleInfo(role)?.icon || '👤'}</span>
                    <span>{role}</span>
                    {role === activeRole && (
                      <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />
                    )}
                    {role === primaryRole && role !== activeRole && (
                      <span className="ml-auto text-xs text-muted-foreground">(Primario)</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              
              {activeRole !== primaryRole && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleResetToPrimary}>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span>Volver a rol primario</span>
                    </div>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Modal de confirmación de cambio de rol */}
      <Dialog open={isChangeDialogOpen} onOpenChange={setIsChangeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Cambio de Rol</DialogTitle>
            <DialogDescription>
              Este cambio quedará registrado en auditoría
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Cambio de rol */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Rol actual</p>
                  <p className="font-medium flex items-center gap-2">
                    {getRoleInfo(activeRole)?.icon}
                    {activeRole}
                  </p>
                </div>
                <div className="text-muted-foreground">→</div>
                <div>
                  <p className="text-sm text-muted-foreground">Nuevo rol</p>
                  <p className="font-medium flex items-center gap-2">
                    {getRoleInfo(selectedRole || '')?.icon}
                    {selectedRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Permisos que cambian */}
            {selectedRole && (
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  <strong>Los permisos cambiarán a:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    {selectedRole === 'Médico' && (
                      <>
                        <li>✓ Crear y firmar recetas</li>
                        <li>✓ Ver pacientes</li>
                        <li>✓ Consultar inventario</li>
                      </>
                    )}
                    {selectedRole === 'Médico Jefe' && (
                      <>
                        <li>✓ Crear y firmar recetas</li>
                        <li>✓ Aprobar medicamentos controlados</li>
                        <li>✓ Ver todas las recetas</li>
                        <li>✓ Generar reportes</li>
                      </>
                    )}
                    {selectedRole === 'Farmacéutico' && (
                      <>
                        <li>✓ Dispensar medicamentos</li>
                        <li>✓ Gestionar inventario</li>
                        <li>✓ Ajustar stock</li>
                      </>
                    )}
                    {selectedRole === 'Administrativo' && (
                      <>
                        <li>✓ Gestionar pacientes</li>
                        <li>✓ Generar reportes</li>
                        <li>✓ Exportar datos</li>
                      </>
                    )}
                    {selectedRole === 'Administrador' && (
                      <>
                        <li>✓ Acceso total al sistema</li>
                        <li>✓ Gestionar usuarios</li>
                        <li>✓ Configurar sistema</li>
                      </>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Razón del cambio (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                Razón del cambio (opcional)
              </Label>
              <Textarea
                id="reason"
                placeholder="Ej: Necesito dispensar medicamentos..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Esta información se incluirá en el registro de auditoría
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsChangeDialogOpen(false);
                setSelectedRole(null);
                setChangeReason("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmChange}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Cambiar rol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Componente compacto que solo muestra el badge (para espacios reducidos)
 */
export function RoleBadge() {
  const activeRole = getActiveRole();
  if (!activeRole) return null;

  const roleInfo = getRoleInfo(activeRole);
  
  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'Administrador': 'bg-red-100 text-red-700 border-red-300',
      'Médico': 'bg-green-100 text-green-700 border-green-300',
      'Médico Jefe': 'bg-blue-100 text-blue-700 border-blue-300',
      'Farmacéutico': 'bg-orange-100 text-orange-700 border-orange-300',
      'Administrativo': 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor(activeRole)}`}
    >
      <span className="mr-1.5">{roleInfo?.icon || '👤'}</span>
      {activeRole}
    </Badge>
  );
}
