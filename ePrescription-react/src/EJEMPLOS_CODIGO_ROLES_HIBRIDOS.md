# Ejemplos de Código: Sistema Híbrido de Roles

## 📚 Imports Necesarios

```typescript
import {
  // Obtener roles
  getAllBaseRoles,
  getAllCustomRoles,
  getAllRoles,
  getBaseRoleById,
  getCustomRolesByUserId,
  getCustomRolesByBaseRole,
  
  // Crear roles personalizados
  createCustomRole,
  
  // Aprobar/Rechazar
  approveCustomRole,
  rejectCustomRole,
  revokeCustomRole,
  
  // Actualizar
  updateBaseRole,
  updateCustomRole,
  
  // Tipos
  type BaseRoleDefinition,
  type CustomRoleDefinition,
  type RolePermissions
} from '../utils/rolesStore';
```

---

## 🎯 Ejemplo 1: Listar Todos los Roles

```typescript
function RolesManagementPage() {
  const [baseRoles, setBaseRoles] = useState<BaseRoleDefinition[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRoleDefinition[]>([]);

  useEffect(() => {
    // Cargar roles base
    setBaseRoles(getAllBaseRoles());
    
    // Cargar roles personalizados
    setCustomRoles(getAllCustomRoles());
  }, []);

  return (
    <div>
      <h2>Roles Base ({baseRoles.length})</h2>
      {baseRoles.map(role => (
        <div key={role.id}>
          <h3>{role.name}</h3>
          <p>{role.description}</p>
          <Badge>{role.directAssignments} asignaciones directas</Badge>
          <Badge>{role.customRolesCount} roles personalizados derivados</Badge>
          {role.canBeCustomized && (
            <Button onClick={() => handleCreateCustomRole(role.id)}>
              Crear versión personalizada
            </Button>
          )}
        </div>
      ))}

      <h2>Roles Personalizados ({customRoles.length})</h2>
      {customRoles.map(role => (
        <div key={role.id}>
          <h3>{role.name}</h3>
          <p>Base: {role.baseRoleName}</p>
          <p>Usuario: {role.userName}</p>
          <Badge>{role.approvalStatus}</Badge>
          <Badge>{role.status}</Badge>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Ejemplo 2: Crear Rol Personalizado - Médico ER

```typescript
function handleCreateERDoctorRole(doctorId: string, doctorName: string, doctorEmail: string) {
  const result = createCustomRole(
    'ROLE-004', // Base: Médico Jefe
    {
      name: 'Médico Jefe ER',
      description: 'Médico jefe de sala de emergencias con capacidad de anular alertas críticas',
      userId: doctorId,
      userName: doctorName,
      userEmail: doctorEmail,
      permissionAdjustments: {
        added: ['clinical_alerts.override'], // Permiso CRÍTICO
        removed: []
      },
      justification: `Médico jefe de sala de emergencias del Hospital Central requiere capacidad de anular alertas clínicas en situaciones críticas de vida o muerte donde el juicio clínico inmediato prevalece sobre alertas automatizadas del sistema.

Justificación médica:
- Situaciones de trauma severo requieren decisiones inmediatas
- Interacciones menores vs salvar vida (riesgo/beneficio)
- Protocolo de emergencias ER-2024-002

Controles:
- Cada anulación requiere justificación en expediente médico
- Sistema audita cada uso del permiso override
- Revisión mensual por comité de calidad

Aprobado por: Director Médico el 2024-09-10
Vigencia: Permanente (mientras esté en el puesto)`,
      validUntil: undefined // Permanente
    },
    currentUser.id,
    currentUser.fullName
  );

  if (result.success) {
    toast.success('Rol personalizado creado', {
      description: `Rol "${result.roleId}" requiere aprobación del Director Médico y Oficial de Seguridad`,
      duration: 6000
    });
    
    // Enviar notificación a aprobadores
    sendApprovalNotification(result.roleId);
  } else {
    toast.error('Error al crear rol', {
      description: result.error,
      duration: 5000
    });
  }
}
```

---

## 🎯 Ejemplo 3: Crear Rol Personalizado - Admin Respaldo

```typescript
function handleCreateBackupAdminRole(userId: string, userName: string, userEmail: string) {
  const result = createCustomRole(
    'ROLE-001', // Base: Administrador
    {
      name: 'Admin Respaldo TI',
      description: 'Administrador de soporte técnico nivel 2, sin acceso a funciones críticas de eliminación',
      userId,
      userName,
      userEmail,
      permissionAdjustments: {
        added: [], // No agregar nada
        removed: [
          'users.delete',      // No puede eliminar usuarios
          'system.restore',    // No puede restaurar sistema
          'security.manage'    // No puede gestión total de seguridad
        ]
      },
      justification: `Administrador de soporte técnico nivel 2 para el departamento de TI.

Razón de personalización:
- Soporte técnico diario y resolución de incidencias
- NO requiere capacidad de eliminar usuarios (protección extra)
- NO requiere restaurar sistema (operación crítica)
- Mantiene acceso a crear/editar usuarios y configuraciones

Principio de mínimo privilegio:
- Solo permisos necesarios para funciones de soporte
- Reduce superficie de riesgo en operaciones críticas
- Admin principal mantiene permisos completos

Aprobado por: Director de TI
Revisión: Trimestral`,
      validUntil: undefined // Permanente
    },
    currentUser.id,
    currentUser.fullName
  );

  if (result.success) {
    // No requiere aprobación (solo quitó permisos)
    toast.success('Rol personalizado creado y activo', {
      description: `El usuario puede iniciar sesión inmediatamente con los permisos asignados`,
      duration: 4000
    });
  } else {
    toast.error('Error', { description: result.error });
  }
}
```

---

## 🎯 Ejemplo 4: Crear Rol Temporal - Consultor Externo

```typescript
function handleCreateConsultantRole(
  consultantId: string,
  consultantName: string,
  consultantEmail: string,
  projectEndDate: string
) {
  const result = createCustomRole(
    'ROLE-002', // Base: Médico
    {
      name: `Médico Consultor - ${consultantName}`,
      description: 'Consultor médico externo con acceso limitado para revisión de casos',
      userId: consultantId,
      userName: consultantName,
      userEmail: consultantEmail,
      permissionAdjustments: {
        added: [],
        removed: [
          'prescriptions.create',  // No puede crear recetas
          'prescriptions.sign',    // No puede firmar
          'patients.create',       // No puede registrar pacientes
          'patients.update'        // No puede modificar datos
        ]
        // Solo puede VER (read)
      },
      justification: `Médico consultor externo contratado para el proyecto de revisión de casos clínicos complejos 2024-Q4.

Alcance del proyecto:
- Revisión y segunda opinión de casos oncológicos
- Solo lectura de historias clínicas necesarias
- NO prescripción ni modificación de datos

Contrato:
- Duración: ${projectEndDate}
- Aprobado por: Director Médico
- Acuerdo de confidencialidad: Firmado
- Credenciales profesionales: Verificadas

Acceso limitado de solo lectura cumple con HIPAA minimal necessary standard.`,
      validUntil: projectEndDate // ⚠️ TEMPORAL - Expira automáticamente
    },
    currentUser.id,
    currentUser.fullName
  );

  if (result.success) {
    toast.success('Rol temporal creado', {
      description: `Expira automáticamente el ${projectEndDate}`,
      duration: 5000
    });
  } else {
    toast.error('Error', { description: result.error });
  }
}
```

---

## 🎯 Ejemplo 5: Panel de Aprobaciones

```typescript
function ApprovalsPanel() {
  const [pendingRoles, setPendingRoles] = useState<CustomRoleDefinition[]>([]);

  useEffect(() => {
    // Obtener solo roles pendientes
    const allCustom = getAllCustomRoles();
    const pending = allCustom.filter(r => r.approvalStatus === 'pending');
    setPendingRoles(pending);
  }, []);

  const handleApprove = async (roleId: string) => {
    const result = approveCustomRole(
      roleId,
      currentUser.id,
      currentUser.fullName
    );

    if (result.success) {
      toast.success('Rol aprobado', {
        description: 'El usuario ahora tiene acceso con los permisos aprobados'
      });
      
      // Recargar lista
      const updated = getAllCustomRoles().filter(r => r.approvalStatus === 'pending');
      setPendingRoles(updated);
      
      // Notificar al usuario
      notifyUser(roleId, 'approved');
    } else {
      toast.error('Error', { description: result.error });
    }
  };

  const handleReject = async (roleId: string, reason: string) => {
    const result = rejectCustomRole(
      roleId,
      currentUser.id,
      currentUser.fullName,
      reason
    );

    if (result.success) {
      toast.success('Rol rechazado', {
        description: 'El usuario ha sido notificado del rechazo'
      });
      
      // Recargar lista
      const updated = getAllCustomRoles().filter(r => r.approvalStatus === 'pending');
      setPendingRoles(updated);
      
      // Notificar al usuario
      notifyUser(roleId, 'rejected', reason);
    } else {
      toast.error('Error', { description: result.error });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles Pendientes de Aprobación ({pendingRoles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingRoles.map(role => (
          <div key={role.id} className="border p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3>{role.name}</h3>
                <p className="text-sm text-gray-600">Base: {role.baseRoleName}</p>
                <p className="text-sm">Usuario: {role.userName}</p>
                <p className="text-sm text-gray-600">Creado por: {role.createdByName}</p>
              </div>
              <Badge variant="warning">Pendiente</Badge>
            </div>

            <div className="mt-4">
              <h4>Ajustes de Permisos:</h4>
              {role.permissionAdjustments.added.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700">➕ Agregados:</p>
                  <ul className="text-sm ml-4">
                    {role.permissionAdjustments.added.map(perm => (
                      <li key={perm}>
                        {perm}
                        {perm.includes('override') && (
                          <Badge variant="destructive" className="ml-2">CRÍTICO</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {role.permissionAdjustments.removed.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-700">➖ Quitados:</p>
                  <ul className="text-sm ml-4">
                    {role.permissionAdjustments.removed.map(perm => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4>Justificación:</h4>
              <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-line">
                {role.justification}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => handleApprove(role.id)}
                variant="default"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Aprobar
              </Button>
              
              <Button
                onClick={() => {
                  const reason = prompt('Razón del rechazo:');
                  if (reason) handleReject(role.id, reason);
                }}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rechazar
              </Button>
            </div>
          </div>
        ))}

        {pendingRoles.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No hay roles pendientes de aprobación
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🎯 Ejemplo 6: Dashboard de Roles por Usuario

```typescript
function UserRolesDashboard({ userId }: { userId: string }) {
  const [userCustomRoles, setUserCustomRoles] = useState<CustomRoleDefinition[]>([]);

  useEffect(() => {
    // Obtener todos los roles personalizados del usuario
    const roles = getCustomRolesByUserId(userId);
    setUserCustomRoles(roles);
  }, [userId]);

  const handleRevokeRole = (roleId: string) => {
    const reason = prompt('Razón de la revocación:');
    if (!reason) return;

    const result = revokeCustomRole(
      roleId,
      currentUser.id,
      currentUser.fullName,
      reason
    );

    if (result.success) {
      toast.success('Rol revocado', {
        description: 'El rol personalizado ha sido desactivado'
      });
      
      // Recargar
      setUserCustomRoles(getCustomRolesByUserId(userId));
    } else {
      toast.error('Error', { description: result.error });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles Personalizados del Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        {userCustomRoles.map(role => (
          <div key={role.id} className="border p-4 rounded-lg mb-4">
            <div className="flex justify-between">
              <div>
                <h3>{role.name}</h3>
                <p className="text-sm text-gray-600">
                  Derivado de: {role.baseRoleName}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={
                  role.status === 'active' ? 'success' :
                  role.status === 'suspended' ? 'warning' :
                  'destructive'
                }>
                  {role.status}
                </Badge>
                <Badge variant={
                  role.approvalStatus === 'approved' ? 'success' :
                  role.approvalStatus === 'pending' ? 'warning' :
                  'destructive'
                }>
                  {role.approvalStatus}
                </Badge>
              </div>
            </div>

            {role.validUntil && (
              <p className="text-sm text-orange-600 mt-2">
                ⏰ Expira: {role.validUntil}
              </p>
            )}

            <div className="mt-4">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRevokeRole(role.id)}
                disabled={role.status === 'revoked'}
              >
                Revocar rol
              </Button>
            </div>
          </div>
        ))}

        {userCustomRoles.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Este usuario no tiene roles personalizados
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🎯 Ejemplo 7: Reportes de Roles Personalizados

```typescript
function CustomRolesReport() {
  const [stats, setStats] = useState({
    total: 0,
    byBaseRole: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    expiringSoon: 0,
    pendingApproval: 0
  });

  useEffect(() => {
    const customRoles = getAllCustomRoles();
    const baseRoles = getAllBaseRoles();

    // Total
    const total = customRoles.length;

    // Por rol base
    const byBaseRole: Record<string, number> = {};
    baseRoles.forEach(base => {
      byBaseRole[base.name] = customRoles.filter(c => c.baseRoleId === base.id).length;
    });

    // Por estado
    const byStatus: Record<string, number> = {
      active: customRoles.filter(r => r.status === 'active').length,
      suspended: customRoles.filter(r => r.status === 'suspended').length,
      expired: customRoles.filter(r => r.status === 'expired').length,
      revoked: customRoles.filter(r => r.status === 'revoked').length
    };

    // Próximos a vencer (30 días)
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = customRoles.filter(r => {
      if (!r.validUntil) return false;
      const expiry = new Date(r.validUntil);
      return expiry > now && expiry <= in30Days;
    }).length;

    // Pendientes de aprobación
    const pendingApproval = customRoles.filter(r => r.approvalStatus === 'pending').length;

    setStats({ total, byBaseRole, byStatus, expiringSoon, pendingApproval });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Roles Personalizados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pendientes de Aprobación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-orange-600">{stats.pendingApproval}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expiran en 30 días</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-red-600">{stats.expiringSoon}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Distribución por Rol Base</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(stats.byBaseRole).map(([baseName, count]) => (
            <div key={baseName} className="flex justify-between py-2 border-b">
              <span>{baseName}</span>
              <Badge>{count} personalizados</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🎯 Ejemplo 8: Validación en Tiempo Real

```typescript
function CustomRoleCreationForm() {
  const [selectedBaseRole, setSelectedBaseRole] = useState<string>('');
  const [permissionsToAdd, setPermissionsToAdd] = useState<string[]>([]);
  const [permissionsToRemove, setPermissionsToRemove] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Validar en tiempo real
  useEffect(() => {
    if (!selectedBaseRole) return;

    const baseRole = getBaseRoleById(selectedBaseRole);
    if (!baseRole) return;

    // Calcular permisos efectivos
    const effective = calculateEffectivePermissions(
      baseRole.permissions,
      {
        added: permissionsToAdd,
        removed: permissionsToRemove
      }
    );

    // Validar
    const validation = validateRolePermissions(effective);
    setValidationErrors(validation.errors);
    setValidationWarnings(validation.warnings);
  }, [selectedBaseRole, permissionsToAdd, permissionsToRemove]);

  return (
    <div>
      {/* Form fields... */}

      {/* Errores en tiempo real */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Errores de Validación</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ml-4">
              {validationErrors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Advertencias en tiempo real */}
      {validationWarnings.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Advertencias</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ml-4">
              {validationWarnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Button
        disabled={validationErrors.length > 0}
        onClick={handleSubmit}
      >
        Crear Rol Personalizado
      </Button>
    </div>
  );
}
```

---

## 📋 Funciones Auxiliares Útiles

```typescript
// Calcular permisos efectivos (exportada del store)
import { calculateEffectivePermissions } from '../utils/rolesStore';

// Helper: ¿Requiere aprobación?
function willRequireApproval(adjustments: { added: string[] }): boolean {
  return adjustments.added.some(perm => {
    const [module, permCode] = perm.split('.');
    const modulePerms = AVAILABLE_PERMISSIONS[module] || [];
    const permDef = modulePerms.find(p => p.code === permCode);
    return permDef?.securityImpact === 'critical';
  });
}

// Helper: Formatear ajustes de permisos
function formatPermissionAdjustments(adjustments: { added: string[]; removed: string[] }): string {
  const parts: string[] = [];
  
  if (adjustments.added.length > 0) {
    parts.push(`➕ Agregados: ${adjustments.added.join(', ')}`);
  }
  
  if (adjustments.removed.length > 0) {
    parts.push(`➖ Quitados: ${adjustments.removed.join(', ')}`);
  }
  
  return parts.join('\n') || 'Sin cambios';
}

// Helper: Tiempo hasta expiración
function getTimeUntilExpiry(validUntil?: string): string {
  if (!validUntil) return 'Permanente';
  
  const now = new Date();
  const expiry = new Date(validUntil);
  const diffDays = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expirado';
  if (diffDays === 0) return 'Expira hoy';
  if (diffDays === 1) return 'Expira mañana';
  if (diffDays <= 7) return `Expira en ${diffDays} días`;
  if (diffDays <= 30) return `Expira en ${diffDays} días`;
  return `Expira el ${validUntil}`;
}
```

---

Estos ejemplos cubren todos los casos de uso comunes del sistema híbrido de roles. Cópialos y adáptalos según tus necesidades específicas.
