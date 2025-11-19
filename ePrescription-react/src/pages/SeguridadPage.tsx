import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { UserEditDialog } from "../components/UserEditDialog";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";
import { getAllUsers, type UserProfile } from "../utils/usersStore";
import { 
  getAllRoles, 
  getAllBaseRoles, 
  getAllCustomRoles,
  getCustomRolesByBaseRole,
  createCustomRole,
  approveCustomRole,
  rejectCustomRole,
  revokeCustomRole,
  updateRole, 
  type RoleDefinition,
  type BaseRoleDefinition,
  type CustomRoleDefinition
} from "../utils/rolesStore";
import {
  Shield,
  Users,
  Settings,
  Lock,
  Activity,
  Search,
  FilterX,
  Eye,
  Edit,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Monitor,
  MapPin,
  Key,
  UserPlus,
  Save,
  Unlock,
  Ban,
  TrendingUp,
  Globe,
  Download,
  Star,
  Copy,
  FileText,
  Info
} from "lucide-react";

// Datos mock de usuarios
const mockUsers = [
  {
    id: "USR-7890",
    username: "juan.perez",
    fullName: "Dr. Juan Pérez",
    email: "juan.perez@hospital.com",
    phone: "+506 8888-9999",
    role: "Médico",
    assignedRoles: ["Médico", "Médico Jefe"],  // Multi-rol
    specialty: "Medicina General",
    status: "active",
    lastLogin: "2025-10-08 09:30",
    loginCount: 567,
    failedAttempts: 0,
    createdDate: "2023-02-10",
    department: "Consulta Externa",
    certifiedId: "MED-123456",
    twoFactorEnabled: true
  },
  {
    id: "USR-0023",
    username: "carlos.martinez",
    fullName: "Dr. Carlos Andrés Martínez López",
    email: "carlos.martinez@hospital.com",
    phone: "+1 555-0123",
    role: "Médico",
    specialty: "Medicina Interna",
    status: "active",
    lastLogin: "2024-10-01 14:35",
    loginCount: 1247,
    failedAttempts: 0,
    createdDate: "2023-01-15",
    department: "Consulta Externa",
    certifiedId: "MED-12345",
    twoFactorEnabled: true
  },
  {
    id: "USR-0045",
    username: "ana.garcia",
    fullName: "Farmacéutica Ana María García Pérez",
    email: "ana.garcia@hospital.com",
    phone: "+1 555-0124",
    role: "Farmacéutico",
    specialty: "Farmacia Clínica",
    status: "active",
    lastLogin: "2024-10-01 14:28",
    loginCount: 892,
    failedAttempts: 0,
    createdDate: "2023-03-22",
    department: "Farmacia Central",
    certifiedId: "FARM-67890",
    twoFactorEnabled: true
  },
  {
    id: "USR-0001",
    username: "admin.sistema",
    fullName: "Administrador del Sistema",
    email: "admin@hospital.com",
    phone: "+1 555-0100",
    role: "Administrador",
    specialty: "TI",
    status: "active",
    lastLogin: "2024-10-01 13:45",
    loginCount: 3456,
    failedAttempts: 0,
    createdDate: "2022-06-01",
    department: "Sistemas",
    certifiedId: "ADMIN-001",
    twoFactorEnabled: true
  },
  {
    id: "USR-0067",
    username: "jose.torres",
    fullName: "Dr. José Luis Torres Mendoza",
    email: "jose.torres@hospital.com",
    phone: "+1 555-0125",
    role: "Médico",
    specialty: "Cardiología",
    status: "active",
    lastLogin: "2024-10-01 13:12",
    loginCount: 756,
    failedAttempts: 0,
    createdDate: "2023-05-10",
    department: "Cardiología",
    certifiedId: "MED-54321",
    twoFactorEnabled: false
  },
  {
    id: "USR-0089",
    username: "laura.ramirez",
    fullName: "Dra. Laura Sofía Ramírez Gómez",
    email: "laura.ramirez@hospital.com",
    phone: "+1 555-0126",
    role: "Médico Jefe",
    specialty: "Medicina Familiar",
    status: "active",
    lastLogin: "2024-10-01 12:45",
    loginCount: 2134,
    failedAttempts: 0,
    createdDate: "2022-09-18",
    department: "Dirección Médica",
    certifiedId: "MED-98765",
    twoFactorEnabled: true
  },
  {
    id: "USR-0156",
    username: "usuario.bloqueado",
    fullName: "Usuario Test Bloqueado",
    email: "bloqueado@hospital.com",
    phone: "+1 555-0127",
    role: "Médico",
    specialty: "General",
    status: "blocked",
    lastLogin: "2024-09-25 08:30",
    loginCount: 45,
    failedAttempts: 5,
    createdDate: "2024-08-01",
    department: "Consulta Externa",
    certifiedId: "MED-00000",
    twoFactorEnabled: false
  },
  {
    id: "USR-0178",
    username: "pedro.silva",
    fullName: "Lic. Pedro Silva Morales",
    email: "pedro.silva@hospital.com",
    phone: "+1 555-0128",
    role: "Administrativo",
    specialty: "Admisiones",
    status: "inactive",
    lastLogin: "2024-08-15 16:20",
    loginCount: 234,
    failedAttempts: 0,
    createdDate: "2023-11-05",
    department: "Administración",
    certifiedId: null,
    twoFactorEnabled: false
  }
];

// Datos mock de roles
const mockRoles = [
  {
    id: "ROLE-001",
    name: "Administrador",
    code: "ADMIN",
    description: "Acceso total al sistema. Gestión de usuarios, configuración y auditoría",
    usersCount: 2,
    status: "active",
    permissions: {
      prescriptions: ["create", "read", "update", "delete", "approve"],
      patients: ["create", "read", "update", "delete", "export"],
      users: ["create", "read", "update", "delete", "manage_roles"],
      inventory: ["create", "read", "update", "delete", "adjust"],
      reports: ["create", "read", "export", "configure"],
      security: ["read", "update", "audit", "manage"],
      system: ["configure", "backup", "restore", "maintenance"]
    },
    createdDate: "2022-06-01",
    lastModified: "2024-09-15"
  },
  {
    id: "ROLE-002",
    name: "Médico",
    code: "DOCTOR",
    description: "Profesional médico. Prescripción de recetas, acceso a historias clínicas",
    usersCount: 45,
    status: "active",
    permissions: {
      prescriptions: ["create", "read", "update", "sign"],
      patients: ["create", "read", "update"],
      users: ["read_self"],
      inventory: ["read"],
      reports: ["read", "export_own"],
      security: ["read_self"],
      system: []
    },
    createdDate: "2022-06-01",
    lastModified: "2024-08-20"
  },
  {
    id: "ROLE-003",
    name: "Farmacéutico",
    code: "PHARMACIST",
    description: "Profesional farmacéutico. Dispensación, verificación de recetas, gestión de inventario",
    usersCount: 12,
    status: "active",
    permissions: {
      prescriptions: ["read", "verify", "dispense"],
      patients: ["read"],
      users: ["read_self"],
      inventory: ["create", "read", "update", "adjust"],
      reports: ["read", "export_own"],
      security: ["read_self"],
      system: []
    },
    createdDate: "2022-06-01",
    lastModified: "2024-07-30"
  },
  {
    id: "ROLE-004",
    name: "Médico Jefe",
    code: "CHIEF_DOCTOR",
    description: "Médico con funciones de supervisión. Aprobación de prescripciones especiales",
    usersCount: 5,
    status: "active",
    permissions: {
      prescriptions: ["create", "read", "update", "sign", "approve", "review_all"],
      patients: ["create", "read", "update"],
      users: ["read"],
      inventory: ["read"],
      reports: ["read", "export", "configure"],
      security: ["read_self"],
      system: []
    },
    createdDate: "2022-06-01",
    lastModified: "2024-09-01"
  },
  {
    id: "ROLE-005",
    name: "Administrativo",
    code: "ADMIN_STAFF",
    description: "Personal administrativo. Gestión de pacientes y reportes",
    usersCount: 18,
    status: "active",
    permissions: {
      prescriptions: ["read"],
      patients: ["create", "read", "update"],
      users: ["read_self"],
      inventory: [],
      reports: ["read", "export"],
      security: ["read_self"],
      system: []
    },
    createdDate: "2022-06-01",
    lastModified: "2024-06-15"
  }
];

// Datos mock de sesiones activas
const mockActiveSessions = [
  {
    id: "SESS-45678-ABC",
    userId: "USR-0023",
    userName: "Dr. Carlos Martínez",
    ipAddress: "192.168.1.45",
    location: "Consultorio 3B",
    device: "Windows PC",
    browser: "Chrome 118.0",
    loginTime: "2024-10-01 08:00:15",
    lastActivity: "2024-10-01 14:35:22",
    duration: "6h 35m",
    status: "active"
  },
  {
    id: "SESS-45679-DEF",
    userId: "USR-0045",
    userName: "Farmacéutica Ana García",
    ipAddress: "192.168.1.78",
    location: "Farmacia Central",
    device: "Windows PC",
    browser: "Firefox 119.0",
    loginTime: "2024-10-01 07:30:00",
    lastActivity: "2024-10-01 14:28:15",
    duration: "6h 58m",
    status: "active"
  },
  {
    id: "SESS-45680-GHI",
    userId: "USR-0001",
    userName: "Admin Sistema",
    ipAddress: "192.168.1.10",
    location: "Administración",
    device: "Windows Server",
    browser: "Edge 118.0",
    loginTime: "2024-10-01 06:00:00",
    lastActivity: "2024-10-01 13:45:08",
    duration: "7h 45m",
    status: "active"
  },
  {
    id: "SESS-45681-JKL",
    userId: "USR-0067",
    userName: "Dr. José Torres",
    ipAddress: "192.168.1.56",
    location: "Consultorio 5A",
    device: "MacBook Pro",
    browser: "Safari 17.0",
    loginTime: "2024-10-01 09:00:45",
    lastActivity: "2024-10-01 13:12:45",
    duration: "4h 12m",
    status: "active"
  },
  {
    id: "SESS-45682-MNO",
    userId: "USR-0089",
    userName: "Dra. Laura Ramírez",
    ipAddress: "192.168.1.67",
    location: "Consultorio Principal",
    device: "Windows PC",
    browser: "Chrome 118.0",
    loginTime: "2024-10-01 07:00:30",
    lastActivity: "2024-10-01 12:45:12",
    duration: "5h 44m",
    status: "active"
  }
];

// PÁGINA 1: USUARIOS
export function UsuariosPage() {
  // Cargar usuarios desde el store dinámico
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const usersFromStore = getAllUsers();
    // Convertir UserProfile a formato de la UI
    const formattedUsers = usersFromStore.map(user => ({
      id: user.userId,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.primaryRole,
      assignedRoles: user.assignedRoles,
      specialty: user.specialty,
      status: user.status,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount,
      failedAttempts: user.failedAttempts,
      createdDate: user.createdDate,
      department: user.department,
      certifiedId: user.certifiedId,
      twoFactorEnabled: user.twoFactorEnabled,
    }));
    setUsers(formattedUsers);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      normalizedIncludes(user.fullName, searchTerm) ||
      normalizedIncludes(user.username, searchTerm) ||
      normalizedIncludes(user.email, searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length,
    with2FA: users.filter(u => u.twoFactorEnabled).length
  };

  const handleUpdateUser = (updatedUser: any) => {
    // Recargar usuarios desde el store (ya actualizado por UserEditDialog)
    loadUsers();
    
    // El toast ya se muestra desde UserEditDialog, no duplicar
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Gestión de Usuarios</h1>
                <p className="text-red-100 text-sm">Control de acceso y credenciales del sistema • HIPAA/FDA/FHIR Compliant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                onClick={() => toast.info('Información', {
                  description: 'Los usuarios se crean únicamente desde Registro de Usuarios o proceso de Onboarding',
                  duration: 5000,
                })}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                ¿Crear usuario?
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total usuarios</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-semibold">{stats.active}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bloqueados</p>
                <p className="text-2xl font-semibold">{stats.blocked}</p>
              </div>
              <Lock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Con 2FA</p>
                <p className="text-2xl font-semibold">{stats.with2FA}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, usuario o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Médico">Médico</SelectItem>
                <SelectItem value="Farmacéutico">Farmacéutico</SelectItem>
                <SelectItem value="Médico Jefe">Médico Jefe</SelectItem>
                <SelectItem value="Administrativo">Administrativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email/Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50" onDoubleClick={() => {
                  setSelectedUser(user);
                  setIsDetailsPanelOpen(true);
                }}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{user.email}</p>
                      <p className="text-gray-600">{user.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{user.lastLogin.split(' ')[0]}</p>
                      <p className="text-gray-600">{user.lastLogin.split(' ')[1]}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.twoFactorEnabled ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      user.status === 'active' ? "bg-green-100 text-green-700 border-green-300" :
                      user.status === 'blocked' ? "bg-red-100 text-red-700 border-red-300" :
                      "bg-gray-100 text-gray-700 border-gray-300"
                    }>
                      {user.status === 'active' ? 'Activo' : user.status === 'blocked' ? 'Bloqueado' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedUser(user);
                      setIsDetailsPanelOpen(true);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Panel de edición de usuario */}
      {selectedUser && (
        <UserEditDialog
          user={selectedUser}
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
}

// PÁGINA 2: ROLES Y PERMISOS (SISTEMA HÍBRIDO)
export function RolesPage() {
  const [baseRoles, setBaseRoles] = useState<BaseRoleDefinition[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRoleDefinition[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [isCreateCustomDialogOpen, setIsCreateCustomDialogOpen] = useState(false);
  const [selectedBaseRoleForCustom, setSelectedBaseRoleForCustom] = useState<BaseRoleDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<'base' | 'custom' | 'pending'>('base');

  // Cargar roles desde el store
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    setBaseRoles(getAllBaseRoles());
    setCustomRoles(getAllCustomRoles());
  };

  const handleRoleUpdated = () => {
    loadRoles();
    toast.success('Rol actualizado', {
      description: 'Los cambios han sido guardados correctamente',
      duration: 3000
    });
  };

  const handleCreateCustomRole = (baseRole: BaseRoleDefinition) => {
    setSelectedBaseRoleForCustom(baseRole);
    setIsCreateCustomDialogOpen(true);
  };

  const handleCustomRoleCreated = () => {
    loadRoles();
    setIsCreateCustomDialogOpen(false);
    setSelectedBaseRoleForCustom(null);
    toast.success('Rol personalizado creado', {
      description: 'El rol ha sido creado exitosamente',
      duration: 4000
    });
  };

  // Estadísticas
  const totalRoles = baseRoles.length + customRoles.length;
  const activeRoles = [...baseRoles, ...customRoles].filter(r => r.status === 'active').length;
  const totalUsers = baseRoles.reduce((sum, r) => sum + r.usersCount, 0);
  const pendingApprovals = customRoles.filter(r => r.approvalStatus === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Roles y Permisos</h1>
                <p className="text-blue-100 text-sm">Sistema Híbrido RBAC • Roles Base + Personalizados • HIPAA/FDA/FHIR Compliant</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              Sistema profesional de seguridad
            </Badge>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total roles</p>
                <p className="text-2xl font-semibold">{totalRoles}</p>
                <p className="text-xs text-gray-500">{baseRoles.length} base + {customRoles.length} personalizados</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Roles activos</p>
                <p className="text-2xl font-semibold">{activeRoles}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total usuarios</p>
                <p className="text-2xl font-semibold">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold">{pendingApprovals}</p>
                <p className="text-xs text-gray-500">Aprobación requerida</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para Roles Base vs Personalizados */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="base">
                <Shield className="w-4 h-4 mr-2" />
                Roles Base ({baseRoles.length})
              </TabsTrigger>
              <TabsTrigger value="custom">
                <Star className="w-4 h-4 mr-2" />
                Roles Personalizados ({customRoles.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Pendientes ({pendingApprovals})
              </TabsTrigger>
            </TabsList>

            {/* TAB: Roles Base */}
            <TabsContent value="base">
              <BaseRolesTable
                baseRoles={baseRoles}
                onViewDetails={(role) => {
                  setSelectedRole(role);
                  setIsDetailsPanelOpen(true);
                }}
                onCreateCustom={handleCreateCustomRole}
              />
            </TabsContent>

            {/* TAB: Roles Personalizados */}
            <TabsContent value="custom">
              <CustomRolesTable
                customRoles={customRoles.filter(r => r.approvalStatus !== 'pending')}
                onViewDetails={(role) => {
                  setSelectedRole(role);
                  setIsDetailsPanelOpen(true);
                }}
                onReload={loadRoles}
              />
            </TabsContent>

            {/* TAB: Pendientes de Aprobación */}
            <TabsContent value="pending">
              <PendingApprovalsTable
                pendingRoles={customRoles.filter(r => r.approvalStatus === 'pending')}
                onReload={loadRoles}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog de detalles de rol */}
      {selectedRole && (
        <RolePermissionsDialog
          role={selectedRole}
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
          onRoleUpdated={handleRoleUpdated}
        />
      )}

      {/* Dialog para crear rol personalizado */}
      {selectedBaseRoleForCustom && (
        <CreateCustomRoleDialog
          baseRole={selectedBaseRoleForCustom}
          open={isCreateCustomDialogOpen}
          onOpenChange={setIsCreateCustomDialogOpen}
          onSuccess={handleCustomRoleCreated}
        />
      )}
    </div>
  );
}

// PÁGINA 3: PARÁMETROS DE SEGURIDAD
export function ParametrosSeguridadPage() {
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [passwordExpireDays, setPasswordExpireDays] = useState("90");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxFailedAttempts, setMaxFailedAttempts] = useState("3");
  const [lockoutDuration, setLockoutDuration] = useState("30");
  
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [require2FA, setRequire2FA] = useState(false);
  const [allowRememberMe, setAllowRememberMe] = useState(true);
  const [logAllAccess, setLogAllAccess] = useState(true);

  const handleSave = () => {
    toast.success('Configuración guardada', {
      description: 'Los parámetros de seguridad han sido actualizados',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-teal-500 to-cyan-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Parámetros de Seguridad</h1>
              <p className="text-green-100 text-sm">Políticas de contraseñas y sesiones según HIPAA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Políticas de Contraseñas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Longitud mínima de contraseña</Label>
              <Input
                type="number"
                value={passwordMinLength}
                onChange={(e) => setPasswordMinLength(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-1">Mínimo 8 caracteres recomendado</p>
            </div>

            <div>
              <Label>Expiración de contraseña (días)</Label>
              <Input
                type="number"
                value={passwordExpireDays}
                onChange={(e) => setPasswordExpireDays(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-1">Recomendado: 90 días</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Requiere mayúsculas</Label>
                  <p className="text-xs text-gray-600">Al menos una letra mayúscula</p>
                </div>
                <Switch checked={requireUppercase} onCheckedChange={setRequireUppercase} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Requiere minúsculas</Label>
                  <p className="text-xs text-gray-600">Al menos una letra minúscula</p>
                </div>
                <Switch checked={requireLowercase} onCheckedChange={setRequireLowercase} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Requiere números</Label>
                  <p className="text-xs text-gray-600">Al menos un dígito</p>
                </div>
                <Switch checked={requireNumbers} onCheckedChange={setRequireNumbers} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Requiere caracteres especiales</Label>
                  <p className="text-xs text-gray-600">Al menos un símbolo (!@#$%)</p>
                </div>
                <Switch checked={requireSpecialChars} onCheckedChange={setRequireSpecialChars} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Control de Sesiones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Tiempo de inactividad (minutos)</Label>
              <Input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-1">Cierre de sesión automático</p>
            </div>

            <div>
              <Label>Máximo de intentos fallidos</Label>
              <Input
                type="number"
                value={maxFailedAttempts}
                onChange={(e) => setMaxFailedAttempts(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-1">Antes de bloquear la cuenta</p>
            </div>

            <div>
              <Label>Duración de bloqueo (minutos)</Label>
              <Input
                type="number"
                value={lockoutDuration}
                onChange={(e) => setLockoutDuration(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-1">Tiempo de bloqueo temporal</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configuración de Seguridad Avanzada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Requerir autenticación de dos factores (2FA)</Label>
                <p className="text-sm text-gray-600">Obligatorio para todos los usuarios</p>
              </div>
              <Switch checked={require2FA} onCheckedChange={setRequire2FA} />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Permitir "Recordar sesión"</Label>
                <p className="text-sm text-gray-600">Los usuarios pueden mantener sesión activa por 30 días</p>
              </div>
              <Switch checked={allowRememberMe} onCheckedChange={setAllowRememberMe} />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Registrar todos los accesos</Label>
                <p className="text-sm text-gray-600">Log completo de auditoría (cumplimiento HIPAA)</p>
              </div>
              <Switch checked={logAllAccess} onCheckedChange={setLogAllAccess} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar configuración
        </Button>
      </div>
    </div>
  );
}

// PÁGINA 4: BLOQUEOS/DESBLOQUEOS
export function BloqueosPage() {
  const blockedUsers = mockUsers.filter(u => u.status === 'blocked');

  const handleUnblock = (userId: string) => {
    toast.success('Usuario desbloqueado', {
      description: 'El usuario puede acceder nuevamente al sistema',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Ban className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Bloqueos y Desbloqueos</h1>
              <p className="text-orange-100 text-sm">Gestión de usuarios bloqueados por seguridad</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios bloqueados</p>
                <p className="text-2xl font-semibold">{blockedUsers.length}</p>
              </div>
              <Lock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bloqueos hoy</p>
                <p className="text-2xl font-semibold">1</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Desbloqueos hoy</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
              <Unlock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Bloqueados</CardTitle>
        </CardHeader>
        <CardContent>
          {blockedUsers.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-medium mb-2">No hay usuarios bloqueados</h3>
              <p className="text-sm text-gray-600">Todos los usuarios tienen acceso normal al sistema</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Intentos fallidos</TableHead>
                  <TableHead>Último intento</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blockedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                        {user.failedAttempts} intentos
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleUnblock(user.id)}>
                        <Unlock className="w-4 h-4 mr-2" />
                        Desbloquear
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// PÁGINA 5: SESIONES DE USUARIO
export function SesionesPage() {
  const [sessions, setSessions] = useState(mockActiveSessions);

  const handleTerminateSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast.success('Sesión terminada', {
      description: 'La sesión del usuario ha sido cerrada',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Sesiones Activas</h1>
              <p className="text-cyan-100 text-sm">Monitoreo en tiempo real de accesos al sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sesiones activas</p>
                <p className="text-2xl font-semibold">{sessions.length}</p>
              </div>
              <Activity className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios únicos</p>
                <p className="text-2xl font-semibold">{new Set(sessions.map(s => s.userId)).size}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Promedio duración</p>
                <p className="text-2xl font-semibold">6.3h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sesiones Activas en el Sistema</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Ubicación/IP</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Inicio de sesión</TableHead>
                <TableHead>Última actividad</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium">{session.userName}</p>
                        <p className="text-sm text-gray-600">{session.userId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Monitor className="w-3 h-3" />
                        <span>{session.ipAddress}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{session.device}</p>
                      <p className="text-gray-600">{session.browser}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{session.loginTime.split(' ')[0]}</p>
                      <p className="text-gray-600">{session.loginTime.split(' ')[1]}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{session.lastActivity.split(' ')[0]}</p>
                      <p className="text-gray-600">{session.lastActivity.split(' ')[1]}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {session.duration}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activa
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cerrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente auxiliar: Diálogo de permisos de rol (Sistema profesional de configuración)
function RolePermissionsDialog({ 
  role, 
  open, 
  onOpenChange,
  onRoleUpdated 
}: { 
  role: RoleDefinition; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onRoleUpdated?: () => void;
}) {
  // Helper: Obtener permisos del rol (base o personalizado)
  const getRolePermissions = (r: RoleDefinition) => {
    if (r.type === 'base') {
      return (r as BaseRoleDefinition).permissions;
    } else {
      return (r as CustomRoleDefinition).effectivePermissions;
    }
  };

  // Permisos vacíos por defecto
  const emptyPermissions = {
    prescriptions: [],
    patients: [],
    users: [],
    inventory: [],
    reports: [],
    security: [],
    system: [],
    audit: [],
    interoperability: [],
    clinical_alerts: []
  };

  const [editedPermissions, setEditedPermissions] = useState(getRolePermissions(role) || emptyPermissions);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [changeReason, setChangeReason] = useState('');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [activeTab, setActiveTab] = useState<'permissions' | 'security' | 'audit'>('permissions');

  // Cargar permisos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      const perms = getRolePermissions(role) || emptyPermissions;
      setEditedPermissions(perms);
      setValidationErrors([]);
      setValidationWarnings([]);
      setChangeReason('');
      setActiveTab('permissions');
    }
  }, [open, role]);

  // Módulos disponibles con iconos y descripciones
  const moduleInfo: Record<string, { icon: any; label: string; description: string; critical: boolean }> = {
    prescriptions: {
      icon: Edit,
      label: 'Prescripciones',
      description: 'Control de recetas médicas y prescripciones',
      critical: true
    },
    patients: {
      icon: User,
      label: 'Pacientes',
      description: 'Acceso a datos protegidos de salud (PHI/HIPAA)',
      critical: true
    },
    users: {
      icon: Users,
      label: 'Usuarios',
      description: 'Gestión de cuentas y accesos al sistema',
      critical: true
    },
    inventory: {
      icon: Activity,
      label: 'Inventario',
      description: 'Control de stock y medicamentos',
      critical: false
    },
    reports: {
      icon: TrendingUp,
      label: 'Reportes',
      description: 'Generación y exportación de reportes',
      critical: false
    },
    security: {
      icon: Shield,
      label: 'Seguridad',
      description: 'Configuración y políticas de seguridad',
      critical: true
    },
    system: {
      icon: Settings,
      label: 'Sistema',
      description: 'Configuración general y mantenimiento',
      critical: true
    },
    audit: {
      icon: Activity,
      label: 'Auditoría',
      description: 'Logs y trazabilidad de acciones',
      critical: true
    },
    interoperability: {
      icon: Globe,
      label: 'Interoperabilidad',
      description: 'Integración HL7 FHIR y sistemas externos',
      critical: false
    },
    clinical_alerts: {
      icon: AlertTriangle,
      label: 'Alertas Clínicas',
      description: 'Alertas médicas e interacciones',
      critical: true
    }
  };

  // Definición de permisos disponibles por módulo (simplificado)
  const availablePermissions: Record<string, Array<{ code: string; name: string; description: string; level: 'read' | 'write' | 'delete' | 'special' | 'admin' }>> = {
    prescriptions: [
      { code: 'read', name: 'Ver', description: 'Visualizar prescripciones', level: 'read' },
      { code: 'create', name: 'Crear', description: 'Crear nuevas recetas', level: 'write' },
      { code: 'update', name: 'Editar', description: 'Modificar recetas no firmadas', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Eliminar borradores', level: 'delete' },
      { code: 'sign', name: 'Firmar', description: 'Firma digital de recetas', level: 'special' },
      { code: 'approve', name: 'Aprobar', description: 'Aprobar prescripciones especiales', level: 'special' },
      { code: 'verify', name: 'Verificar', description: 'Verificar autenticidad', level: 'read' },
      { code: 'dispense', name: 'Dispensar', description: 'Registrar dispensación (SoD)', level: 'special' },
      { code: 'review_all', name: 'Revisar todas', description: 'Acceso a todas las recetas', level: 'admin' }
    ],
    patients: [
      { code: 'read', name: 'Ver', description: 'Visualizar datos PHI (HIPAA)', level: 'read' },
      { code: 'create', name: 'Registrar', description: 'Crear registros de pacientes', level: 'write' },
      { code: 'update', name: 'Actualizar', description: 'Modificar datos de pacientes', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Eliminar registros (soft delete)', level: 'delete' },
      { code: 'export', name: 'Exportar PHI', description: 'Exportar datos protegidos', level: 'special' },
      { code: 'merge', name: 'Fusionar', description: 'Fusionar registros duplicados', level: 'admin' }
    ],
    users: [
      { code: 'read_self', name: 'Ver propio', description: 'Ver solo perfil propio', level: 'read' },
      { code: 'read', name: 'Ver usuarios', description: 'Visualizar usuarios del sistema', level: 'read' },
      { code: 'create', name: 'Crear', description: 'Crear nuevas cuentas', level: 'write' },
      { code: 'update', name: 'Modificar', description: 'Editar usuarios', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Desactivar cuentas', level: 'delete' },
      { code: 'manage_roles', name: 'Gestionar roles', description: 'Asignar y modificar roles', level: 'admin' },
      { code: 'reset_password', name: 'Reset password', description: 'Restablecer contraseñas', level: 'admin' },
      { code: 'manage_2fa', name: 'Gestionar 2FA', description: 'Configurar autenticación 2FA', level: 'admin' }
    ],
    inventory: [
      { code: 'read', name: 'Consultar', description: 'Ver stock de medicamentos', level: 'read' },
      { code: 'create', name: 'Registrar', description: 'Agregar medicamentos', level: 'write' },
      { code: 'update', name: 'Actualizar', description: 'Modificar cantidades', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Eliminar del catálogo', level: 'delete' },
      { code: 'adjust', name: 'Ajustes', description: 'Ajustes manuales de stock', level: 'special' },
      { code: 'transfer', name: 'Transferir', description: 'Transferir entre farmacias', level: 'special' }
    ],
    reports: [
      { code: 'read', name: 'Ver', description: 'Visualizar reportes', level: 'read' },
      { code: 'create', name: 'Generar', description: 'Crear nuevos reportes', level: 'write' },
      { code: 'export', name: 'Exportar', description: 'Exportar (PDF/CSV/Excel)', level: 'special' },
      { code: 'export_own', name: 'Exportar propios', description: 'Solo reportes personales', level: 'read' },
      { code: 'configure', name: 'Configurar', description: 'Crear plantillas', level: 'admin' }
    ],
    security: [
      { code: 'read_self', name: 'Ver propio', description: 'Solo configuración propia', level: 'read' },
      { code: 'read', name: 'Ver seguridad', description: 'Ver parámetros de seguridad', level: 'read' },
      { code: 'update', name: 'Modificar', description: 'Cambiar políticas de seguridad', level: 'admin' },
      { code: 'audit', name: 'Auditoría', description: 'Revisar logs de auditoría', level: 'special' },
      { code: 'manage', name: 'Gestión total', description: 'Control total de seguridad', level: 'admin' }
    ],
    system: [
      { code: 'configure', name: 'Configurar', description: 'Modificar configuraciones', level: 'admin' },
      { code: 'backup', name: 'Respaldar', description: 'Crear copias de seguridad', level: 'admin' },
      { code: 'restore', name: 'Restaurar', description: 'Restaurar desde respaldos', level: 'admin' },
      { code: 'maintenance', name: 'Mantenimiento', description: 'Modo mantenimiento', level: 'admin' }
    ],
    audit: [
      { code: 'read', name: 'Ver', description: 'Visualizar logs de auditoría', level: 'read' },
      { code: 'export', name: 'Exportar', description: 'Exportar registros', level: 'special' },
      { code: 'configure', name: 'Configurar', description: 'Políticas de auditoría', level: 'admin' }
    ],
    interoperability: [
      { code: 'read', name: 'Ver FHIR', description: 'Visualizar recursos HL7 FHIR', level: 'read' },
      { code: 'export', name: 'Exportar', description: 'Exportar en formato FHIR', level: 'special' },
      { code: 'import', name: 'Importar', description: 'Importar datos externos', level: 'write' },
      { code: 'configure', name: 'Configurar', description: 'Configurar integraciones', level: 'admin' }
    ],
    clinical_alerts: [
      { code: 'read', name: 'Ver', description: 'Visualizar alertas', level: 'read' },
      { code: 'create', name: 'Crear', description: 'Registrar alertas', level: 'write' },
      { code: 'configure', name: 'Configurar', description: 'Configurar reglas', level: 'admin' },
      { code: 'override', name: 'Anular', description: 'Anular alertas críticas', level: 'special' }
    ]
  };

  const handleTogglePermission = (module: string, permCode: string) => {
    setEditedPermissions(prev => {
      const currentPerms = prev[module as keyof typeof prev] || [];
      const hasPermission = currentPerms.includes(permCode);
      
      const newPerms = hasPermission
        ? currentPerms.filter(p => p !== permCode)
        : [...currentPerms, permCode];
      
      return {
        ...prev,
        [module]: newPerms
      };
    });
  };

  const validatePermissions = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validación: Dispensar y Firmar no pueden coexistir (Separación de funciones - SoD)
    const hasDispense = editedPermissions.prescriptions?.includes('dispense');
    const hasSign = editedPermissions.prescriptions?.includes('sign');
    if (hasDispense && hasSign) {
      errors.push('VIOLACIÓN SoD: Un rol no puede tener permisos de prescribir (firmar) Y dispensar. Esto viola las normas de Separación de Funciones (FDA 21 CFR Part 11).');
    }

    // Validación: Ciertos permisos requieren otros
    if (editedPermissions.prescriptions?.includes('update') && !editedPermissions.prescriptions?.includes('read')) {
      errors.push('El permiso "Editar recetas" requiere el permiso "Ver recetas".');
    }
    if (editedPermissions.prescriptions?.includes('delete') && !editedPermissions.prescriptions?.includes('read')) {
      errors.push('El permiso "Eliminar recetas" requiere el permiso "Ver recetas".');
    }
    if (editedPermissions.prescriptions?.includes('sign') && !editedPermissions.prescriptions?.includes('create')) {
      errors.push('El permiso "Firmar recetas" requiere el permiso "Crear recetas".');
    }
    if (editedPermissions.patients?.includes('update') && !editedPermissions.patients?.includes('read')) {
      errors.push('El permiso "Actualizar pacientes" requiere el permiso "Ver pacientes".');
    }
    if (editedPermissions.patients?.includes('export') && !editedPermissions.patients?.includes('read')) {
      errors.push('El permiso "Exportar PHI" requiere el permiso "Ver pacientes".');
    }

    // Advertencias para permisos críticos
    if (editedPermissions.patients?.includes('export')) {
      warnings.push('ADVERTENCIA HIPAA: El permiso "Exportar PHI" permite exportar datos protegidos de salud. Requiere auditoría completa.');
    }
    if (editedPermissions.security?.includes('manage')) {
      warnings.push('ADVERTENCIA: "Gestión total de seguridad" es un permiso crítico que permite control total del sistema.');
    }
    if (editedPermissions.system?.includes('restore')) {
      warnings.push('ADVERTENCIA: El permiso "Restaurar sistema" puede sobrescribir datos. Requiere aprobación especial.');
    }

    setValidationErrors(errors);
    setValidationWarnings(warnings);

    return errors.length === 0;
  };

  useEffect(() => {
    validatePermissions();
  }, [editedPermissions]);

  const handleSaveChanges = () => {
    if (!validatePermissions()) {
      toast.error('Errores de validación', {
        description: 'Corrija los errores antes de guardar',
        duration: 5000
      });
      return;
    }

    if (!changeReason.trim() && validationWarnings.length > 0) {
      toast.error('Justificación requerida', {
        description: 'Debe proporcionar una razón para cambios en permisos críticos',
        duration: 5000
      });
      return;
    }

    // Guardar cambios en el store con el usuario actual
    const currentUser = {
      id: 'USR-0001', // En producción, esto vendría de la sesión activa
      name: 'Administrador del Sistema'
    };

    const result = updateRole(
      role.id,
      { permissions: editedPermissions },
      currentUser.id,
      currentUser.name,
      changeReason || undefined
    );

    if (result.success) {
      toast.success('Rol actualizado correctamente', {
        description: `Los permisos del rol "${role.name}" han sido actualizados. ${result.warnings && result.warnings.length > 0 ? 'Revise las advertencias de seguridad.' : ''}`,
        duration: 4000
      });

      // Llamar callback para recargar la lista
      if (onRoleUpdated) {
        onRoleUpdated();
      }

      onOpenChange(false);
    } else {
      toast.error('Error al actualizar rol', {
        description: result.error || 'No se pudieron guardar los cambios',
        duration: 5000
      });
    }
  };

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'read': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'write': return 'bg-green-100 text-green-700 border-green-300';
      case 'delete': return 'bg-red-100 text-red-700 border-red-300';
      case 'special': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'admin': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Configuración de Rol: {role.name}</DialogTitle>
              <DialogDescription>
                {role.description} • Código: {role.code} • {role.usersCount} usuario{role.usersCount !== 1 ? 's' : ''}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs de navegación */}
        <div className="flex gap-2 border-b pb-2">
          <Button
            variant={activeTab === 'permissions' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('permissions')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Permisos
          </Button>
          <Button
            variant={activeTab === 'security' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('security')}
          >
            <Lock className="w-4 h-4 mr-2" />
            Seguridad
          </Button>
          <Button
            variant={activeTab === 'audit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('audit')}
          >
            <Activity className="w-4 h-4 mr-2" />
            Auditoría
          </Button>
        </div>

        {/* Contenido según tab activa */}
        <div className="space-y-6 py-4">
          {activeTab === 'permissions' && (
            <>
              {/* Alertas de validación */}
              {validationErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900">Errores de validación</p>
                      <ul className="mt-2 space-y-1">
                        {validationErrors.map((error, idx) => (
                          <li key={idx} className="text-sm text-red-700">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {validationWarnings.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900">Advertencias de seguridad</p>
                      <ul className="mt-2 space-y-1">
                        {validationWarnings.map((warning, idx) => (
                          <li key={idx} className="text-sm text-yellow-700">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Matriz de permisos editable */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Matriz de Permisos (RBAC Profesional)
                  </h4>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">Lectura</Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">Escritura</Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-700">Eliminación</Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">Especial</Badge>
                    <Badge variant="outline" className="bg-orange-100 text-orange-700">Admin</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(moduleInfo).map(([moduleKey, info]) => {
                    const perms = availablePermissions[moduleKey] || [];
                    const currentPerms = editedPermissions[moduleKey as keyof typeof editedPermissions] || [];
                    
                    return (
                      <div key={moduleKey} className={`border rounded-lg p-4 ${info.critical ? 'border-red-300 bg-red-50/30' : ''}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <info.icon className={`w-5 h-5 ${info.critical ? 'text-red-600' : 'text-gray-600'}`} />
                            <div>
                              <Label className="flex items-center gap-2">
                                {info.label}
                                {info.critical && (
                                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                                    CRÍTICO
                                  </Badge>
                                )}
                              </Label>
                              <p className="text-xs text-gray-600 mt-0.5">{info.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-gray-100">
                            {currentPerms.length} de {perms.length}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {perms.map(perm => {
                            const isActive = currentPerms.includes(perm.code);
                            return (
                              <div
                                key={perm.code}
                                className={`flex items-start gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                                  isActive 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => handleTogglePermission(moduleKey, perm.code)}
                              >
                                <Checkbox
                                  checked={isActive}
                                  onCheckedChange={() => handleTogglePermission(moduleKey, perm.code)}
                                  className="mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Label className="cursor-pointer text-sm">{perm.name}</Label>
                                    <Badge variant="outline" className={`text-xs ${getPermissionColor(perm.level)}`}>
                                      {perm.level}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{perm.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Justificación para cambios críticos */}
              {validationWarnings.length > 0 && (
                <div>
                  <Label htmlFor="reason">Justificación del cambio (requerido para permisos críticos)</Label>
                  <textarea
                    id="reason"
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    placeholder="Describa la razón de estos cambios en los permisos..."
                    className="w-full mt-2 p-3 border rounded-lg min-h-[80px] text-sm"
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Configuración de Seguridad del Rol
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Nivel de seguridad</Label>
                      <Badge variant="outline" className="mt-2 bg-red-100 text-red-700 border-red-300">
                        ALTO (HIPAA Compliant)
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Requiere aprobación</Label>
                      <p className="mt-2">{role.requiresApproval ? 'Sí' : 'No'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Puede delegar</Label>
                      <p className="mt-2">{role.canDelegate ? 'Sí' : 'No'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Duración máxima de sesión</Label>
                      <p className="mt-2">480 minutos (8 horas)</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div>
                    <Label className="font-medium mb-2 block">Cumplimiento normativo</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">HIPAA - Health Insurance Portability and Accountability Act</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">HL7 FHIR R4 - Fast Healthcare Interoperability Resources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">FDA 21 CFR Part 11 - Electronic Records and Signatures</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">OMS - Organización Mundial de la Salud</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Historial de cambios</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Última modificación: {role.lastModified} por {role.modifiedBy || 'Sistema'}
                    </p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Registro de auditoría
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Rol actualizado</span>
                        </div>
                        <span className="text-xs text-gray-600">{role.lastModified}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Modificación de permisos por {role.modifiedBy || 'Admin Sistema'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">Rol creado</span>
                        </div>
                        <span className="text-xs text-gray-600">{role.createdDate}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Creación inicial del rol en el sistema</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveChanges}
            disabled={validationErrors.length > 0}
            className={validationErrors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// COMPONENTES AUXILIARES: SISTEMA HÍBRIDO
// ============================================

// Componente: Tabla de Roles Base
function BaseRolesTable({ 
  baseRoles, 
  onViewDetails, 
  onCreateCustom 
}: { 
  baseRoles: BaseRoleDefinition[]; 
  onViewDetails: (role: BaseRoleDefinition) => void;
  onCreateCustom: (role: BaseRoleDefinition) => void;
}) {
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rol Base</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Asignaciones</TableHead>
            <TableHead>Derivados</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {baseRoles.map((role) => (
            <TableRow key={role.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-gray-600 font-mono">{role.code}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm max-w-md truncate">{role.description}</p>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  {role.directAssignments} directos
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                  {role.customRolesCount} personalizados
                </Badge>
              </TableCell>
              <TableCell>{role.lastModified}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(role)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver permisos
                  </Button>
                  {role.canBeCustomized && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onCreateCustom(role)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Crear personalizado
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Componente: Tabla de Roles Personalizados
function CustomRolesTable({ 
  customRoles, 
  onViewDetails,
  onReload
}: { 
  customRoles: CustomRoleDefinition[]; 
  onViewDetails: (role: CustomRoleDefinition) => void;
  onReload: () => void;
}) {
  const handleRevoke = (roleId: string, roleName: string) => {
    const reason = prompt(`Razón para revocar el rol "${roleName}":`);
    if (!reason) return;

    const result = revokeCustomRole(
      roleId,
      'USR-0001', // En producción: usuario actual
      'Administrador del Sistema',
      reason
    );

    if (result.success) {
      toast.success('Rol revocado', {
        description: 'El rol personalizado ha sido desactivado',
        duration: 3000
      });
      onReload();
    } else {
      toast.error('Error', { description: result.error });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'suspended': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'expired': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'revoked': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="mt-4">
      {customRoles.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay roles personalizados activos</p>
          <p className="text-sm text-gray-500 mt-2">
            Los roles personalizados aparecerán aquí una vez creados y aprobados
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rol Personalizado</TableHead>
              <TableHead>Rol Base</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Ajustes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customRoles.map((role) => (
              <TableRow key={role.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-gray-600 font-mono">{role.code}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{role.baseRoleName}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{role.userName}</p>
                    <p className="text-xs text-gray-600">{role.userEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {role.permissionAdjustments.added.length > 0 && (
                      <p className="text-green-700">+{role.permissionAdjustments.added.length} agregados</p>
                    )}
                    {role.permissionAdjustments.removed.length > 0 && (
                      <p className="text-red-700">-{role.permissionAdjustments.removed.length} quitados</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(role.status)}>
                    {role.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {role.validUntil ? (
                      <span className="text-orange-600">Hasta {role.validUntil}</span>
                    ) : (
                      <span className="text-gray-600">Permanente</span>
                    )}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(role)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </Button>
                    {role.status !== 'revoked' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevoke(role.id, role.name)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Revocar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// Componente: Tabla de Aprobaciones Pendientes
function PendingApprovalsTable({ 
  pendingRoles,
  onReload
}: { 
  pendingRoles: CustomRoleDefinition[];
  onReload: () => void;
}) {
  const handleApprove = (roleId: string, roleName: string) => {
    const result = approveCustomRole(
      roleId,
      'USR-0001', // En producción: usuario actual
      'Administrador del Sistema'
    );

    if (result.success) {
      toast.success('Rol aprobado', {
        description: `El rol "${roleName}" ha sido activado`,
        duration: 3000
      });
      onReload();
    } else {
      toast.error('Error', { description: result.error });
    }
  };

  const handleReject = (roleId: string, roleName: string) => {
    const reason = prompt(`Razón para rechazar el rol "${roleName}":`);
    if (!reason) return;

    const result = rejectCustomRole(
      roleId,
      'USR-0001', // En producción: usuario actual
      'Administrador del Sistema',
      reason
    );

    if (result.success) {
      toast.success('Rol rechazado', {
        description: 'El usuario ha sido notificado',
        duration: 3000
      });
      onReload();
    } else {
      toast.error('Error', { description: result.error });
    }
  };

  return (
    <div className="mt-4">
      {pendingRoles.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">No hay roles pendientes de aprobación</p>
          <p className="text-sm text-gray-500 mt-2">
            Los roles personalizados con permisos críticos aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRoles.map((role) => (
            <Card key={role.id} className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Base: {role.baseRoleName} • Usuario: {role.userName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                    Pendiente de Aprobación
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Ajustes de Permisos:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {role.permissionAdjustments.added.length > 0 && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-sm font-medium text-green-700 mb-2">➕ Permisos Agregados:</p>
                        <ul className="text-sm space-y-1">
                          {role.permissionAdjustments.added.map(perm => (
                            <li key={perm} className="text-green-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                              {perm}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {role.permissionAdjustments.removed.length > 0 && (
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <p className="text-sm font-medium text-red-700 mb-2">➖ Permisos Quitados:</p>
                        <ul className="text-sm space-y-1">
                          {role.permissionAdjustments.removed.map(perm => (
                            <li key={perm} className="text-red-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                              {perm}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Justificación:</h4>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{role.justification}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Creado por:</p>
                    <p className="font-medium">{role.createdByName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fecha de solicitud:</p>
                    <p className="font-medium">{role.createdDate}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(role.id, role.name)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprobar Rol
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => handleReject(role.id, role.name)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente: Selector de Permisos para Roles Personalizados
function PermissionSelector({
  baseRole,
  selectedPermissions,
  onPermissionToggle,
  mode
}: {
  baseRole: BaseRoleDefinition;
  selectedPermissions: string[];
  onPermissionToggle: (permission: string) => void;
  mode: 'add' | 'remove';
}) {
  // Definición de módulos y permisos (igual que en RolePermissionsDialog)
  const moduleInfo: Record<string, { icon: any; label: string; description: string; critical: boolean }> = {
    prescriptions: {
      icon: Edit,
      label: 'Prescripciones',
      description: 'Control de recetas médicas y prescripciones',
      critical: true
    },
    patients: {
      icon: User,
      label: 'Pacientes',
      description: 'Acceso a datos protegidos de salud (PHI/HIPAA)',
      critical: true
    },
    users: {
      icon: Users,
      label: 'Usuarios',
      description: 'Gestión de cuentas y accesos al sistema',
      critical: true
    },
    inventory: {
      icon: Activity,
      label: 'Inventario',
      description: 'Control de stock y medicamentos',
      critical: false
    },
    reports: {
      icon: TrendingUp,
      label: 'Reportes',
      description: 'Generación y exportación de reportes',
      critical: false
    },
    security: {
      icon: Shield,
      label: 'Seguridad',
      description: 'Configuración y políticas de seguridad',
      critical: true
    },
    system: {
      icon: Settings,
      label: 'Sistema',
      description: 'Configuración general y mantenimiento',
      critical: true
    },
    audit: {
      icon: Activity,
      label: 'Auditoría',
      description: 'Logs y trazabilidad de acciones',
      critical: true
    },
    interoperability: {
      icon: Globe,
      label: 'Interoperabilidad',
      description: 'Integración HL7 FHIR y sistemas externos',
      critical: false
    },
    clinical_alerts: {
      icon: AlertTriangle,
      label: 'Alertas Clínicas',
      description: 'Alertas médicas e interacciones',
      critical: true
    }
  };

  const availablePermissions: Record<string, Array<{ code: string; name: string; description: string; level: 'read' | 'write' | 'delete' | 'special' | 'admin' }>> = {
    prescriptions: [
      { code: 'read', name: 'Ver', description: 'Visualizar prescripciones', level: 'read' },
      { code: 'create', name: 'Crear', description: 'Crear nuevas recetas', level: 'write' },
      { code: 'update', name: 'Editar', description: 'Modificar recetas no firmadas', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Eliminar borradores', level: 'delete' },
      { code: 'sign', name: 'Firmar', description: 'Firma digital de recetas', level: 'special' },
      { code: 'approve', name: 'Aprobar', description: 'Aprobar prescripciones especiales', level: 'special' },
      { code: 'verify', name: 'Verificar', description: 'Verificar autenticidad', level: 'read' },
      { code: 'dispense', name: 'Dispensar', description: 'Registrar dispensación (SoD)', level: 'special' },
      { code: 'review_all', name: 'Revisar todas', description: 'Acceso a todas las recetas', level: 'admin' }
    ],
    patients: [
      { code: 'read', name: 'Ver', description: 'Visualizar datos PHI (HIPAA)', level: 'read' },
      { code: 'create', name: 'Registrar', description: 'Crear registros de pacientes', level: 'write' },
      { code: 'update', name: 'Actualizar', description: 'Modificar datos de pacientes', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Eliminar registros (soft delete)', level: 'delete' },
      { code: 'export', name: 'Exportar PHI', description: 'Exportar datos protegidos', level: 'special' },
      { code: 'merge', name: 'Fusionar', description: 'Fusionar registros duplicados', level: 'admin' }
    ],
    users: [
      { code: 'read_self', name: 'Ver propio', description: 'Ver solo perfil propio', level: 'read' },
      { code: 'read', name: 'Ver usuarios', description: 'Visualizar usuarios del sistema', level: 'read' },
      { code: 'create', name: 'Crear', description: 'Crear nuevas cuentas', level: 'write' },
      { code: 'update', name: 'Modificar', description: 'Editar usuarios', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Desactivar cuentas', level: 'delete' },
      { code: 'manage_roles', name: 'Gestionar roles', description: 'Asignar y modificar roles', level: 'admin' },
      { code: 'reset_password', name: 'Reset password', description: 'Restablecer contraseñas', level: 'admin' },
      { code: 'manage_2fa', name: 'Gestionar 2FA', description: 'Configurar autenticación 2FA', level: 'admin' }
    ],
    inventory: [
      { code: 'read', name: 'Consultar', description: 'Ver stock de medicamentos', level: 'read' },
      { code: 'create', name: 'Registrar', description: 'Agregar medicamentos', level: 'write' },
      { code: 'update', name: 'Actualizar', description: 'Modificar cantidades', level: 'write' },
      { code: 'delete', name: 'Eliminar', description: 'Eliminar del catálogo', level: 'delete' },
      { code: 'adjust', name: 'Ajustes', description: 'Ajustes manuales de stock', level: 'special' },
      { code: 'transfer', name: 'Transferir', description: 'Transferir entre farmacias', level: 'special' }
    ],
    reports: [
      { code: 'read', name: 'Ver', description: 'Visualizar reportes', level: 'read' },
      { code: 'create', name: 'Generar', description: 'Crear nuevos reportes', level: 'write' },
      { code: 'export', name: 'Exportar', description: 'Exportar (PDF/CSV/Excel)', level: 'special' },
      { code: 'export_own', name: 'Exportar propios', description: 'Solo reportes personales', level: 'read' },
      { code: 'configure', name: 'Configurar', description: 'Crear plantillas', level: 'admin' }
    ],
    security: [
      { code: 'read_self', name: 'Ver propio', description: 'Solo configuración propia', level: 'read' },
      { code: 'read', name: 'Ver seguridad', description: 'Ver parámetros de seguridad', level: 'read' },
      { code: 'update', name: 'Modificar', description: 'Cambiar políticas de seguridad', level: 'admin' },
      { code: 'audit', name: 'Auditoría', description: 'Revisar logs de auditoría', level: 'special' },
      { code: 'manage', name: 'Gestión total', description: 'Control total de seguridad', level: 'admin' }
    ],
    system: [
      { code: 'configure', name: 'Configurar', description: 'Modificar configuraciones', level: 'admin' },
      { code: 'backup', name: 'Respaldar', description: 'Crear copias de seguridad', level: 'admin' },
      { code: 'restore', name: 'Restaurar', description: 'Restaurar desde respaldos', level: 'admin' },
      { code: 'maintenance', name: 'Mantenimiento', description: 'Modo mantenimiento', level: 'admin' }
    ],
    audit: [
      { code: 'read', name: 'Ver', description: 'Visualizar logs de auditoría', level: 'read' },
      { code: 'export', name: 'Exportar', description: 'Exportar registros', level: 'special' },
      { code: 'configure', name: 'Configurar', description: 'Políticas de auditoría', level: 'admin' }
    ],
    interoperability: [
      { code: 'read', name: 'Ver FHIR', description: 'Visualizar recursos HL7 FHIR', level: 'read' },
      { code: 'export', name: 'Exportar', description: 'Exportar en formato FHIR', level: 'special' },
      { code: 'import', name: 'Importar', description: 'Importar datos externos', level: 'write' },
      { code: 'configure', name: 'Configurar', description: 'Configurar integraciones', level: 'admin' }
    ],
    clinical_alerts: [
      { code: 'read', name: 'Ver', description: 'Visualizar alertas', level: 'read' },
      { code: 'create', name: 'Crear', description: 'Registrar alertas', level: 'write' },
      { code: 'configure', name: 'Configurar', description: 'Configurar reglas', level: 'admin' },
      { code: 'override', name: 'Anular', description: 'Anular alertas críticas', level: 'special' }
    ]
  };

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'read': return 'bg-blue-100 text-blue-700';
      case 'write': return 'bg-green-100 text-green-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'special': return 'bg-orange-100 text-orange-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Obtener permisos del rol base
  const basePermissions = baseRole.permissions;

  // Filtrar según el modo
  const getRelevantPermissions = (moduleKey: string, perms: any[]) => {
    const basePermsForModule = basePermissions[moduleKey as keyof typeof basePermissions] || [];
    
    if (mode === 'add') {
      // Modo agregar: mostrar permisos que NO están en el rol base
      return perms.filter(p => !basePermsForModule.includes(p.code));
    } else {
      // Modo quitar: mostrar solo permisos que SÍ están en el rol base
      return perms.filter(p => basePermsForModule.includes(p.code));
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(moduleInfo).map(([moduleKey, info]) => {
        const allPerms = availablePermissions[moduleKey] || [];
        const relevantPerms = getRelevantPermissions(moduleKey, allPerms);
        
        if (relevantPerms.length === 0) return null;

        return (
          <Card key={moduleKey} className={`${info.critical && mode === 'add' ? 'border-orange-300 bg-orange-50/30' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <info.icon className={`w-5 h-5 ${info.critical ? 'text-orange-600' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {info.label}
                    {info.critical && mode === 'add' && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                        CRÍTICO
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-xs text-gray-600 mt-0.5">{info.description}</p>
                </div>
                <Badge variant="outline" className="bg-gray-100">
                  {relevantPerms.length} disponible{relevantPerms.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {relevantPerms.map((perm) => {
                  const permissionId = `${moduleKey}.${perm.code}`;
                  const isSelected = selectedPermissions.includes(permissionId);
                  
                  return (
                    <div
                      key={perm.code}
                      className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => onPermissionToggle(permissionId)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onPermissionToggle(permissionId)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Label className="cursor-pointer text-sm font-medium">{perm.name}</Label>
                          <Badge variant="outline" className={`text-xs ${getPermissionColor(perm.level)}`}>
                            {perm.level}
                          </Badge>
                          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600">
                            {permissionId}
                          </code>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{perm.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Componente: Dialog para Crear Rol Personalizado
function CreateCustomRoleDialog({ 
  baseRole, 
  open, 
  onOpenChange,
  onSuccess
}: { 
  baseRole: BaseRoleDefinition; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [customName, setCustomName] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [permissionsToAdd, setPermissionsToAdd] = useState<string[]>([]);
  const [permissionsToRemove, setPermissionsToRemove] = useState<string[]>([]);
  const [justification, setJustification] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Resetear al abrir
  useEffect(() => {
    if (open) {
      setStep(1);
      setCustomName(`${baseRole.name} Personalizado`);
      setDescription('');
      setUserId('');
      setUserName('');
      setUserEmail('');
      setPermissionsToAdd([]);
      setPermissionsToRemove([]);
      setJustification('');
      setValidUntil('');
    }
  }, [open, baseRole.name]);

  const handleCreate = () => {
    // Validaciones
    if (!customName.trim()) {
      toast.error('Error', { description: 'Debe proporcionar un nombre para el rol' });
      return;
    }
    if (!userId.trim() || !userName.trim() || !userEmail.trim()) {
      toast.error('Error', { description: 'Debe seleccionar un usuario' });
      return;
    }
    if (permissionsToAdd.length === 0 && permissionsToRemove.length === 0) {
      toast.error('Error', { description: 'Debe agregar o quitar al menos un permiso' });
      return;
    }
    if (!justification.trim() || justification.length < 20) {
      toast.error('Error', { description: 'Debe proporcionar una justificación detallada (mínimo 20 caracteres)' });
      return;
    }

    const result = createCustomRole(
      baseRole.id,
      {
        name: customName,
        description: description || `Rol personalizado derivado de ${baseRole.name}`,
        userId,
        userName,
        userEmail,
        permissionAdjustments: {
          added: permissionsToAdd,
          removed: permissionsToRemove
        },
        justification,
        validUntil: validUntil || undefined
      },
      'USR-0001', // En producción: usuario actual
      'Administrador del Sistema'
    );

    if (result.success) {
      if (result.warnings && result.warnings.length > 0) {
        toast.warning('Rol creado - Requiere aprobación', {
          description: 'El rol incluye permisos críticos y requiere aprobación antes de activarse',
          duration: 5000
        });
      }
      onSuccess();
    } else {
      toast.error('Error al crear rol', {
        description: result.error,
        duration: 5000
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            Crear Rol Personalizado
          </DialogTitle>
          <DialogDescription>
            Crear un rol derivado de "{baseRole.name}" con permisos ajustados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Indicador de pasos */}
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded ${step >= 4 ? 'bg-blue-500' : 'bg-gray-200'}`} />
          </div>

          {/* Paso 1: Información básica */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium">Paso 1: Información Básica</h3>
              
              <div>
                <Label>Nombre del rol personalizado*</Label>
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ej: Médico Jefe ER"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción opcional del rol personalizado..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertTitle>Rol Base: {baseRole.name}</AlertTitle>
                <AlertDescription>
                  Este rol personalizado heredará todos los permisos del rol base "{baseRole.name}" y podrá agregar o quitar permisos específicos.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Paso 2: Selección de usuario */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium">Paso 2: Seleccionar Usuario</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID de Usuario*</Label>
                  <Input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="USR-0089"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Nombre Completo*</Label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Dra. Ana Vargas"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Email del Usuario*</Label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="ana.vargas@hospital.com"
                  className="mt-2"
                />
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Usuario objetivo</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Este rol personalizado se creará específicamente para el usuario indicado y heredará los permisos del rol base "{baseRole.name}". En el siguiente paso podrás ajustar los permisos.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Paso 3: Ajustar permisos */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium">Paso 3: Ajustar Permisos</h3>
              <p className="text-sm text-gray-600">
                Selecciona los permisos que deseas agregar o quitar del rol base "{baseRole.name}"
              </p>

              <Tabs defaultValue="add" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="add">
                    ➕ Agregar Permisos ({permissionsToAdd.length})
                  </TabsTrigger>
                  <TabsTrigger value="remove">
                    ➖ Quitar Permisos ({permissionsToRemove.length})
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Agregar Permisos */}
                <TabsContent value="add" className="space-y-4 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-600">
                    Selecciona permisos adicionales que este usuario necesita más allá del rol base
                  </p>
                  <PermissionSelector
                    baseRole={baseRole}
                    selectedPermissions={permissionsToAdd}
                    onPermissionToggle={(permission) => {
                      if (permissionsToAdd.includes(permission)) {
                        setPermissionsToAdd(permissionsToAdd.filter(p => p !== permission));
                      } else {
                        setPermissionsToAdd([...permissionsToAdd, permission]);
                      }
                    }}
                    mode="add"
                  />
                </TabsContent>

                {/* Tab: Quitar Permisos */}
                <TabsContent value="remove" className="space-y-4 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-600">
                    Selecciona permisos del rol base que este usuario NO debe tener
                  </p>
                  <PermissionSelector
                    baseRole={baseRole}
                    selectedPermissions={permissionsToRemove}
                    onPermissionToggle={(permission) => {
                      if (permissionsToRemove.includes(permission)) {
                        setPermissionsToRemove(permissionsToRemove.filter(p => p !== permission));
                      } else {
                        setPermissionsToRemove([...permissionsToRemove, permission]);
                      }
                    }}
                    mode="remove"
                  />
                </TabsContent>
              </Tabs>

              {permissionsToAdd.length === 0 && permissionsToRemove.length === 0 && (
                <Alert variant="default" className="bg-orange-50 border-orange-200">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <AlertTitle className="text-orange-800">Sin cambios de permisos</AlertTitle>
                  <AlertDescription className="text-orange-700">
                    Debes agregar o quitar al menos un permiso para crear un rol personalizado. Si no necesitas cambios, asigna directamente el rol base al usuario.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Paso 4: Justificación y vigencia */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium">Paso 3: Justificación y Vigencia</h3>
              
              <div>
                <Label>Justificación* (mínimo 20 caracteres)</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Descripción detallada de por qué este usuario necesita este rol personalizado...&#10;&#10;Ejemplo: Médico jefe de sala de emergencias requiere capacidad de anular alertas clínicas en situaciones críticas de vida o muerte donde el juicio clínico prevalece sobre alertas automatizadas del sistema."
                  className="mt-2"
                  rows={6}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Caracteres: {justification.length} / 20 mínimo
                </p>
              </div>

              <div>
                <Label>Vigencia</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="validity"
                      checked={!validUntil}
                      onChange={() => setValidUntil('')}
                    />
                    <span className="text-sm">Permanente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="validity"
                      checked={!!validUntil}
                      onChange={() => setValidUntil(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
                    />
                    <span className="text-sm">Temporal hasta:</span>
                  </div>
                </div>
                {validUntil && (
                  <Input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Información importante</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {permissionsToAdd.length > 0 ? (
                    <p>⚠️ Este rol agrega permisos. Si incluye permisos críticos, requerirá aprobación antes de activarse.</p>
                  ) : (
                    <p>✓ Este rol solo quita permisos. Se activará inmediatamente sin requerir aprobación.</p>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((step - 1) as any)}>
              Anterior
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep((step + 1) as any)}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Rol Personalizado
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
