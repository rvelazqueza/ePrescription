/**
 * MultiRoleDemoPage - Demostración Interactiva del Sistema Multi-Rol
 * 
 * Esta página muestra:
 * 1. Cómo funciona el sistema de múltiples roles
 * 2. Cambio de rol en tiempo real
 * 3. Asignación de roles a usuarios
 * 4. Auditoría de cambios de rol
 * 5. Permisos dinámicos según rol activo
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import {
  Shield,
  User,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Info,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  getCurrentSession,
  changeActiveRole,
  getActiveRole,
  getAssignedRoles,
  getPrimaryRole,
  getRoleChangeHistory,
  hasPermission,
  getEffectivePermissions,
  getRoleInfo,
  type MultiRoleSession,
  type RoleChangeRecord,
} from "../utils/multiRoleSession";

export function MultiRoleDemoPage() {
  const [session, setSession] = useState<MultiRoleSession | null>(getCurrentSession());
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Actualizar estado después de cambio de rol
  const handleRoleChange = (newRole: string) => {
    try {
      changeActiveRole(newRole, `Cambio manual desde demo`, 'user', '/demo/multi-rol');
      setSession(getCurrentSession());
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  };

  const activeRole = getActiveRole();
  const assignedRoles = getAssignedRoles();
  const primaryRole = getPrimaryRole();
  const roleHistory = getRoleChangeHistory();
  const permissions = getEffectivePermissions();

  // Acciones de ejemplo para probar permisos
  const sampleActions = [
    { 
      id: 'prescribe', 
      name: 'Prescribir medicamentos', 
      module: 'prescriptions' as const, 
      action: 'create',
      description: 'Crear nuevas recetas médicas'
    },
    { 
      id: 'sign', 
      name: 'Firmar recetas', 
      module: 'prescriptions' as const, 
      action: 'sign',
      description: 'Firmar electrónicamente recetas'
    },
    { 
      id: 'approve', 
      name: 'Aprobar medicamentos controlados', 
      module: 'prescriptions' as const, 
      action: 'approve',
      description: 'Aprobar recetas de sustancias controladas'
    },
    { 
      id: 'dispense', 
      name: 'Dispensar medicamentos', 
      module: 'inventory' as const, 
      action: 'update',
      description: 'Dispensar medicamentos en farmacia'
    },
    { 
      id: 'adjust-stock', 
      name: 'Ajustar inventario', 
      module: 'inventory' as const, 
      action: 'adjust',
      description: 'Realizar ajustes de stock'
    },
    { 
      id: 'manage-users', 
      name: 'Gestionar usuarios', 
      module: 'users' as const, 
      action: 'update',
      description: 'Administrar usuarios del sistema'
    },
    { 
      id: 'export-reports', 
      name: 'Exportar reportes', 
      module: 'reports' as const, 
      action: 'export',
      description: 'Exportar reportes a Excel/PDF'
    },
    { 
      id: 'configure-system', 
      name: 'Configurar sistema', 
      module: 'system' as const, 
      action: 'configure',
      description: 'Configurar parámetros del sistema'
    },
  ];

  if (!session) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            No hay sesión activa. Por favor, inicie sesión para ver la demostración.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const roleInfo = getRoleInfo(activeRole || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sistema Multi-Rol</h1>
        <p className="text-muted-foreground mt-1">
          Demostración interactiva del sistema de roles múltiples con cambio dinámico
        </p>
      </div>

      {/* Sesión Actual */}
      <Card>
        <CardHeader>
          <CardTitle>Sesión Actual</CardTitle>
          <CardDescription>Información del usuario y rol activo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Usuario */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Usuario</Label>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{session.fullName}</p>
                  <p className="text-sm text-muted-foreground">@{session.username}</p>
                </div>
              </div>
            </div>

            {/* Rol Primario */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Rol Primario</Label>
              <Badge variant="outline" className="text-sm">
                {getRoleInfo(primaryRole || '')?.icon} {primaryRole}
              </Badge>
              <p className="text-xs text-muted-foreground">Por defecto al login</p>
            </div>

            {/* Rol Activo */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Rol Activo</Label>
              <Badge className={`text-sm ${
                activeRole === 'Administrador' ? 'bg-red-100 text-red-700' :
                activeRole === 'Médico' ? 'bg-green-100 text-green-700' :
                activeRole === 'Médico Jefe' ? 'bg-blue-100 text-blue-700' :
                activeRole === 'Farmacéutico' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {roleInfo?.icon} {activeRole}
              </Badge>
              <p className="text-xs text-muted-foreground">Permisos activos ahora</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="change-role" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="change-role">Cambiar Rol</TabsTrigger>
          <TabsTrigger value="permissions">Permisos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="info">Información</TabsTrigger>
        </TabsList>

        {/* TAB 1: Cambiar Rol */}
        <TabsContent value="change-role" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Rol Activo</CardTitle>
              <CardDescription>
                Seleccione el rol con el que desea trabajar ahora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedRoles.map((role) => {
                  const isActive = role === activeRole;
                  const isPrimary = role === primaryRole;
                  const info = getRoleInfo(role);
                  
                  return (
                    <Card 
                      key={role} 
                      className={`cursor-pointer transition-all ${
                        isActive 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'hover:border-primary/50 hover:shadow-sm'
                      }`}
                      onClick={() => !isActive && handleRoleChange(role)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{info?.icon}</div>
                            <div>
                              <p className="font-medium">{role}</p>
                              <p className="text-xs text-muted-foreground">{info?.description}</p>
                            </div>
                          </div>
                          {isActive && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        {isPrimary && !isActive && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Primario
                          </Badge>
                        )}
                        {isActive && (
                          <Badge className="mt-2 text-xs bg-primary">
                            Activo ahora
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>Cambio sin re-login:</strong> Puede cambiar entre sus roles asignados 
                  sin necesidad de cerrar sesión. Todos los cambios se auditan automáticamente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Permisos */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permisos del Rol Activo</CardTitle>
              <CardDescription>
                Permisos efectivos según el rol <strong>{activeRole}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    Los permisos son del <strong>rol activo únicamente</strong>. No hay suma de permisos.
                    Esto garantiza el principio de menor privilegio (HIPAA).
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-medium">Acciones Disponibles</h4>
                  {sampleActions.map((action) => {
                    const hasAccess = hasPermission(action.module, action.action);
                    
                    return (
                      <div 
                        key={action.id}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          hasAccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {hasAccess ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{action.name}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <Badge variant={hasAccess ? "default" : "destructive"}>
                          {hasAccess ? 'Permitido' : 'Denegado'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matriz de Permisos */}
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Permisos Detallada</CardTitle>
              <CardDescription>Todos los permisos del rol {activeRole}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions && Object.entries(permissions).map(([module, actions]) => (
                      Object.entries(actions as Record<string, boolean>).map(([action, allowed]) => (
                        <TableRow key={`${module}-${action}`}>
                          <TableCell className="font-medium capitalize">{module}</TableCell>
                          <TableCell className="capitalize">{action}</TableCell>
                          <TableCell>
                            {allowed ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Permitido
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Denegado
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Historial */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios de Rol</CardTitle>
              <CardDescription>
                Auditoría completa de cambios de rol en esta sesión
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roleHistory.length === 0 ? (
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    No hay cambios de rol registrados en esta sesión todavía.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {[...roleHistory].reverse().map((change, index) => (
                      <Card key={change.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Activity className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{getRoleInfo(change.previousRole)?.icon}</Badge>
                                  <span className="text-sm">{change.previousRole}</span>
                                  <span className="text-muted-foreground">→</span>
                                  <Badge variant="outline">{getRoleInfo(change.newRole)?.icon}</Badge>
                                  <span className="text-sm font-medium">{change.newRole}</span>
                                </div>
                                {change.reason && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Razón: {change.reason}
                                  </p>
                                )}
                                {change.route && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Ruta: {change.route}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(change.timestamp).toLocaleString('es-CR')}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {change.triggeredBy}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">#{roleHistory.length - index}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: Información */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cómo Funciona el Sistema Multi-Rol</CardTitle>
              <CardDescription>Guía completa del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">🎯 Concepto Principal</h4>
                <p className="text-sm text-muted-foreground">
                  Un usuario puede tener <strong>múltiples roles asignados</strong>, pero trabaja con 
                  <strong> UN rol activo</strong> a la vez. Puede cambiar de rol durante la sesión 
                  sin necesidad de volver a autenticarse.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">🔐 Seguridad</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✅ <strong>Menor privilegio:</strong> Solo permisos del rol activo (no suma)</li>
                  <li>✅ <strong>Auditoría total:</strong> Cada cambio de rol se registra</li>
                  <li>✅ <strong>Trazabilidad:</strong> Cada acción vinculada a rol específico</li>
                  <li>✅ <strong>Rate limiting:</strong> Máximo 10 cambios de rol por hora</li>
                  <li>✅ <strong>Timeout:</strong> Vuelve a rol primario tras 30 min de inactividad</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">📊 Cumplimiento Normativo</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Badge variant="outline" className="justify-center py-2">
                    ✅ HIPAA
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    ✅ FDA 21 CFR Part 11
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    ✅ FHIR
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    ✅ ISO 27001
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">👥 Casos de Uso</h4>
                <div className="space-y-3">
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium">Médico Jefe de Cardiología</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Roles: Médico + Médico Jefe<br />
                        Mañana: Supervisa como Jefe | Tarde: Consultas como Médico
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium">Farmacéutica Jefe</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Roles: Farmacéutico + Administrativo<br />
                        Dispensa medicamentos | Genera reportes administrativos
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
