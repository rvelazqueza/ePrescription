import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  Activity, 
  Users, 
  FileText, 
  Pill, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Database, 
  Zap, 
  LayoutDashboard,
  Calendar,
  ArrowRight,
  XCircle,
  Stethoscope,
  Building2,
  Bell,
  UserCheck,
  PackageCheck,
  ClipboardList,
  BarChart3,
  PieChart,
  AlertCircle,
  FileCheck,
  Loader2,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  Eye,
  Settings
} from "lucide-react";
import { PageBanner } from "../components/PageBanner";
import { getCurrentSession, changeActiveRole } from "../utils/multiRoleSession";
import { getUnreadCount } from "../utils/userNotificationsStore";
import { toast } from "sonner@2.0.3";

interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [session, setSession] = useState(getCurrentSession());
  const [currentRole, setCurrentRole] = useState(session?.activeRole || 'Doctor');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Cargar notificaciones no leídas
  useEffect(() => {
    setUnreadNotifications(getUnreadCount());
  }, []);

  // Inicializar sesión solo una vez al montar
  useEffect(() => {
    const currentSession = getCurrentSession();
    if (currentSession) {
      setSession(currentSession);
      setCurrentRole(currentSession.activeRole);
      console.log('✅ Sesión inicializada con rol:', currentSession.activeRole);
    } else {
      // Si no hay sesión, intentar cargarla después de un breve delay
      const timeout = setTimeout(() => {
        const delayedSession = getCurrentSession();
        if (delayedSession) {
          setSession(delayedSession);
          setCurrentRole(delayedSession.activeRole);
          console.log('✅ Sesión inicializada (con delay) con rol:', delayedSession.activeRole);
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, []);

  // Handler para cambiar rol (modo demostración)
  const handleRoleChange = (newRole: string) => {
    // Prevenir cambios mientras se está procesando uno
    if (isChangingRole) return;
    
    setIsChangingRole(true);
    
    try {
      const currentSession = getCurrentSession();
      
      console.log('🔄 Cambiando rol a:', newRole);
      console.log('📋 Sesión actual:', currentSession);
      
      if (!currentSession) {
        // Modo fallback: solo actualizar el estado local
        console.warn('⚠️ No hay sesión activa, usando modo fallback');
        setCurrentRole(newRole);
        setIsDemoMode(true);
        toast.success(`Vista cambiada a: ${newRole}`, {
          description: 'Mostrando datos de demostración',
          duration: 3000,
        });
        setIsChangingRole(false);
        return;
      }

      // Verificar si el rol está asignado
      if (!currentSession.assignedRoles.includes(newRole)) {
        // Intentar cambiar de todas formas en modo demo
        console.warn(`⚠️ El rol "${newRole}" no está asignado, pero continuando en modo demo`);
        setCurrentRole(newRole);
        setIsDemoMode(true);
        toast.info(`Vista cambiada a: ${newRole}`, {
          description: 'Mostrando datos de demostración (rol no asignado)',
          duration: 3000,
        });
        setIsChangingRole(false);
        return;
      }

      // Cambiar el rol oficialmente
      console.log('✅ Cambiando rol oficialmente con changeActiveRole()');
      changeActiveRole(newRole, 'Demostración de dashboard', 'user', '/dashboard');
      
      // Actualizar estados inmediatamente
      setCurrentRole(newRole);
      const updatedSession = getCurrentSession();
      setSession(updatedSession);
      setIsDemoMode(true);
      
      console.log('✅ Rol cambiado exitosamente a:', newRole);
      console.log('📋 Nueva sesión:', updatedSession);
      
      toast.success(`Rol cambiado a: ${newRole}`, {
        description: 'El dashboard se ha actualizado con la información correspondiente',
        duration: 3000,
      });
    } catch (error) {
      console.error('❌ Error al cambiar rol:', error);
      
      // Fallback: cambiar solo visualmente
      setCurrentRole(newRole);
      setIsDemoMode(true);
      
      toast.warning(`Vista cambiada a: ${newRole}`, {
        description: 'Cambio visual únicamente (error en cambio de sesión)',
        duration: 3000,
      });
    } finally {
      // Liberar el bloqueo después de un breve delay
      setTimeout(() => setIsChangingRole(false), 300);
    }
  };

  // KPIs dinámicos según rol
  const getRoleSpecificKPIs = () => {
    switch (currentRole) {
      case 'Doctor':
        return {
          primary: { label: 'Recetas hoy', value: 24, change: '+12%', trend: 'up', icon: FileText, route: '/prescripciones/emitidas' },
          secondary: { label: 'Pacientes atendidos', value: 18, change: '+8%', trend: 'up', icon: Users, route: '/pacientes/lista' },
          tertiary: { label: 'Borradores pendientes', value: 3, change: '0', trend: 'neutral', icon: Clock, route: '/prescripciones/borradores' },
          quaternary: { label: 'Alertas clínicas', value: 2, change: '-50%', trend: 'down', icon: AlertTriangle, route: '/alertas/bandeja' }
        };
      case 'Farmacéutico':
        return {
          primary: { label: 'Dispensaciones hoy', value: 67, change: '+15%', trend: 'up', icon: PackageCheck, route: '/dispensacion/registrar' },
          secondary: { label: 'Recetas verificadas', value: 89, change: '+10%', trend: 'up', icon: FileCheck, route: '/dispensacion/verificar' },
          tertiary: { label: 'Stock bajo', value: 12, change: '+3', trend: 'up', icon: AlertCircle, route: '/inventario/alertas' },
          quaternary: { label: 'Rechazos', value: 3, change: '-2', trend: 'down', icon: XCircle, route: '/dispensacion/rechazos' }
        };
      case 'Enfermera':
        return {
          primary: { label: 'Pacientes registrados', value: 31, change: '+5%', trend: 'up', icon: UserCheck, route: '/pacientes/lista' },
          secondary: { label: 'Medicamentos administrados', value: 156, change: '+7%', trend: 'up', icon: Pill, route: '/dispensacion/registrar' },
          tertiary: { label: 'Signos vitales tomados', value: 89, change: '+12%', trend: 'up', icon: Activity, route: '/pacientes/lista' },
          quaternary: { label: 'Alertas pendientes', value: 4, change: '0', trend: 'neutral', icon: Bell, route: '/alertas/bandeja' }
        };
      case 'Administrador':
        return {
          primary: { label: 'Usuarios activos', value: 245, change: '+3%', trend: 'up', icon: Users, route: '/seguridad/usuarios' },
          secondary: { label: 'Recetas totales (hoy)', value: 487, change: '+18%', trend: 'up', icon: FileText, route: '/reportes/actividad-medico' },
          tertiary: { label: 'Aprobaciones pendientes', value: 7, change: '+2', trend: 'up', icon: ClipboardList, route: '/seguridad/aprobaciones' },
          quaternary: { label: 'Incidencias', value: 1, change: '-3', trend: 'down', icon: AlertTriangle, route: '/auditoria/log' }
        };
      default:
        return {
          primary: { label: 'Recetas hoy', value: 24, change: '+12%', trend: 'up', icon: FileText, route: '/prescripciones/emitidas' },
          secondary: { label: 'Pacientes', value: 18, change: '+8%', trend: 'up', icon: Users, route: '/pacientes/lista' },
          tertiary: { label: 'Pendientes', value: 3, change: '0', trend: 'neutral', icon: Clock, route: '/prescripciones/borradores' },
          quaternary: { label: 'Alertas', value: 2, change: '-50%', trend: 'down', icon: AlertTriangle, route: '/alertas/bandeja' }
        };
    }
  };

  const kpis = getRoleSpecificKPIs();

  // Acciones rápidas según rol
  const getRoleQuickActions = () => {
    switch (currentRole) {
      case 'Doctor':
        return [
          { 
            title: 'Nueva Prescripción', 
            description: 'Crear receta médica', 
            icon: FileText, 
            color: 'primary', 
            route: '/prescripciones/nueva',
            gradient: 'from-blue-600 to-blue-700'
          },
          { 
            title: 'Buscar Paciente', 
            description: 'Historial clínico', 
            icon: Users, 
            color: 'success', 
            route: '/pacientes/lista',
            gradient: 'from-green-600 to-green-700'
          },
          { 
            title: 'Mis Borradores', 
            description: `${kpis.tertiary.value} pendientes`, 
            icon: Clock, 
            color: 'warning', 
            route: '/prescripciones/borradores',
            gradient: 'from-amber-600 to-amber-700'
          },
          { 
            title: 'Ver Alertas', 
            description: 'Interacciones detectadas', 
            icon: AlertTriangle, 
            color: 'destructive', 
            route: '/alertas/bandeja',
            gradient: 'from-red-600 to-red-700'
          }
        ];
      case 'Farmacéutico':
        return [
          { 
            title: 'Verificar Receta', 
            description: 'Validar prescripción', 
            icon: FileCheck, 
            color: 'primary', 
            route: '/dispensacion/verificar',
            gradient: 'from-blue-600 to-blue-700'
          },
          { 
            title: 'Dispensar', 
            description: 'Registrar entrega', 
            icon: PackageCheck, 
            color: 'success', 
            route: '/dispensacion/registrar',
            gradient: 'from-green-600 to-green-700'
          },
          { 
            title: 'Inventario', 
            description: 'Stock de medicamentos', 
            icon: Pill, 
            color: 'purple', 
            route: '/inventario/stock',
            gradient: 'from-purple-600 to-purple-700'
          },
          { 
            title: 'Alertas Stock', 
            description: `${kpis.tertiary.value} productos bajos`, 
            icon: AlertCircle, 
            color: 'warning', 
            route: '/inventario/alertas',
            gradient: 'from-amber-600 to-amber-700'
          }
        ];
      case 'Enfermera':
        return [
          { 
            title: 'Registrar Paciente', 
            description: 'Nuevo ingreso', 
            icon: UserCheck, 
            color: 'primary', 
            route: '/pacientes/lista',
            gradient: 'from-blue-600 to-blue-700'
          },
          { 
            title: 'Administrar Medicamentos', 
            description: 'Registro de dosis', 
            icon: Pill, 
            color: 'success', 
            route: '/dispensacion/registrar',
            gradient: 'from-green-600 to-green-700'
          },
          { 
            title: 'Ver Pacientes', 
            description: 'Historial y signos', 
            icon: Users, 
            color: 'purple', 
            route: '/pacientes/lista',
            gradient: 'from-purple-600 to-purple-700'
          },
          { 
            title: 'Alertas', 
            description: 'Notificaciones clínicas', 
            icon: Bell, 
            color: 'warning', 
            route: '/alertas/bandeja',
            gradient: 'from-amber-600 to-amber-700'
          }
        ];
      case 'Administrador':
        return [
          { 
            title: 'Gestión Usuarios', 
            description: 'Administrar accesos', 
            icon: Users, 
            color: 'primary', 
            route: '/seguridad/usuarios',
            gradient: 'from-blue-600 to-blue-700'
          },
          { 
            title: 'Aprobaciones', 
            description: `${kpis.tertiary.value} pendientes`, 
            icon: ClipboardList, 
            color: 'success', 
            route: '/seguridad/aprobaciones',
            gradient: 'from-green-600 to-green-700'
          },
          { 
            title: 'Reportes', 
            description: 'Analytics y estadísticas', 
            icon: BarChart3, 
            color: 'purple', 
            route: '/reportes/actividad-medico',
            gradient: 'from-purple-600 to-purple-700'
          },
          { 
            title: 'Auditoría', 
            description: 'Log de actividades', 
            icon: ShieldCheck, 
            color: 'warning', 
            route: '/auditoria/log',
            gradient: 'from-amber-600 to-amber-700'
          }
        ];
      default:
        return [
          { 
            title: 'Nueva Prescripción', 
            description: 'Crear receta', 
            icon: FileText, 
            color: 'primary', 
            route: '/prescripciones/nueva',
            gradient: 'from-blue-600 to-blue-700'
          },
          { 
            title: 'Buscar Paciente', 
            description: 'Historial', 
            icon: Users, 
            color: 'success', 
            route: '/pacientes/lista',
            gradient: 'from-green-600 to-green-700'
          },
          { 
            title: 'Inventario', 
            description: 'Medicamentos', 
            icon: Pill, 
            color: 'purple', 
            route: '/inventario/stock',
            gradient: 'from-purple-600 to-purple-700'
          },
          { 
            title: 'Reportes', 
            description: 'Estadísticas', 
            icon: BarChart3, 
            color: 'warning', 
            route: '/reportes/actividad-medico',
            gradient: 'from-amber-600 to-amber-700'
          }
        ];
    }
  };

  const quickActions = getRoleQuickActions();

  // Actividad reciente según rol
  const getRecentActivity = () => {
    const now = new Date();
    switch (currentRole) {
      case 'Doctor':
        return [
          { id: 'RX-2024-0245', title: 'Receta emitida', subtitle: 'María González - Paracetamol 500mg', time: '10:32 AM', status: 'success', icon: FileCheck, route: '/prescripciones/emitidas' },
          { id: 'DRAFT-089', title: 'Borrador guardado', subtitle: 'Carlos Ramírez - Múltiples medicamentos', time: '09:15 AM', status: 'warning', icon: Clock, route: '/prescripciones/borradores' },
          { id: 'RX-2024-0243', title: 'Receta emitida', subtitle: 'Ana Martínez - Amoxicilina 500mg', time: '08:45 AM', status: 'success', icon: FileCheck, route: '/prescripciones/emitidas' },
          { id: 'ALERT-012', title: 'Alerta clínica', subtitle: 'Interacción: Warfarina + Aspirina', time: '08:30 AM', status: 'alert', icon: AlertTriangle, route: '/alertas/bandeja' }
        ];
      case 'Farmacéutico':
        return [
          { id: 'DISP-456', title: 'Dispensación registrada', subtitle: 'RX-2024-0245 - Paracetamol 500mg', time: '11:20 AM', status: 'success', icon: PackageCheck, route: '/dispensacion/registrar' },
          { id: 'VER-789', title: 'Receta verificada', subtitle: 'RX-2024-0244 - Omeprazol 20mg', time: '10:45 AM', status: 'success', icon: FileCheck, route: '/dispensacion/verificar' },
          { id: 'STOCK-034', title: 'Alerta de stock bajo', subtitle: 'Ibuprofeno 400mg - 25 unidades', time: '09:30 AM', status: 'warning', icon: AlertCircle, route: '/inventario/alertas' },
          { id: 'REJ-012', title: 'Receta rechazada', subtitle: 'RX-2024-0230 - Medicamento no disponible', time: '08:15 AM', status: 'alert', icon: XCircle, route: '/dispensacion/rechazos' }
        ];
      case 'Enfermera':
        return [
          { id: 'PAT-567', title: 'Paciente registrado', subtitle: 'José Luis Fernández - Consulta externa', time: '11:00 AM', status: 'success', icon: UserCheck, route: '/pacientes/lista' },
          { id: 'MED-890', title: 'Medicamento administrado', subtitle: 'RX-2024-0245 - Paracetamol IV', time: '10:30 AM', status: 'success', icon: Pill, route: '/dispensacion/registrar' },
          { id: 'VITAL-234', title: 'Signos vitales tomados', subtitle: 'María González - PA: 120/80 mmHg', time: '09:45 AM', status: 'info', icon: Activity, route: '/pacientes/lista' },
          { id: 'ALERT-045', title: 'Alerta de medicación', subtitle: 'Paciente requiere dosis pendiente', time: '08:50 AM', status: 'warning', icon: Bell, route: '/alertas/bandeja' }
        ];
      case 'Administrador':
        return [
          { id: 'USER-234', title: 'Usuario aprobado', subtitle: 'Dr. Luis Hernández - Cardiología', time: '10:50 AM', status: 'success', icon: UserCheck, route: '/seguridad/aprobaciones' },
          { id: 'REP-456', title: 'Reporte generado', subtitle: 'Actividad médica - Octubre 2024', time: '09:30 AM', status: 'info', icon: BarChart3, route: '/reportes/exportar' },
          { id: 'AUDIT-789', title: 'Acceso no autorizado', subtitle: 'Intento de login fallido - usuario123', time: '08:45 AM', status: 'alert', icon: ShieldCheck, route: '/auditoria/log' },
          { id: 'CONFIG-012', title: 'Configuración actualizada', subtitle: 'Políticas de recetas modificadas', time: '08:00 AM', status: 'info', icon: Settings, route: '/config/politicas' }
        ];
      default:
        return [
          { id: 'ACT-001', title: 'Actividad registrada', subtitle: 'Sistema operando normalmente', time: '10:00 AM', status: 'success', icon: CheckCircle, route: '/dashboard' }
        ];
    }
  };

  const recentActivity = getRecentActivity();

  // Insights clínicos
  const getClinicalInsights = () => {
    switch (currentRole) {
      case 'Doctor':
        return [
          { 
            title: 'Patrón de prescripción',
            description: 'Tus recetas más comunes esta semana son analgésicos (35%) y antibióticos (28%)',
            type: 'info',
            action: 'Ver detalles',
            route: '/reportes/actividad-medico'
          },
          { 
            title: 'Alertas de interacciones',
            description: '2 interacciones detectadas requieren revisión. Warfarina + Aspirina en paciente García',
            type: 'warning',
            action: 'Revisar ahora',
            route: '/alertas/bandeja'
          },
          { 
            title: 'Eficiencia clínica',
            description: 'Tiempo promedio por receta: 3.2 min (12% mejor que el promedio)',
            type: 'success',
            action: 'Ver métricas',
            route: '/reportes/actividad-medico'
          }
        ];
      case 'Farmacéutico':
        return [
          { 
            title: 'Stock crítico',
            description: '12 medicamentos requieren reabastecimiento urgente. Ibuprofeno y Amoxicilina prioritarios',
            type: 'warning',
            action: 'Ver inventario',
            route: '/inventario/alertas'
          },
          { 
            title: 'Eficiencia de dispensación',
            description: 'Tiempo promedio de verificación: 2.1 min (15% mejor que meta)',
            type: 'success',
            action: 'Ver estadísticas',
            route: '/reportes/actividad-farmacia'
          },
          { 
            title: 'Vencimientos próximos',
            description: '8 lotes vencen en los próximos 30 días. Total: $12,500',
            type: 'info',
            action: 'Ver lotes',
            route: '/inventario/lotes'
          }
        ];
      case 'Enfermera':
        return [
          { 
            title: 'Carga de trabajo',
            description: '31 pacientes registrados hoy. 8% más que promedio semanal',
            type: 'info',
            action: 'Ver pacientes',
            route: '/pacientes/lista'
          },
          { 
            title: 'Medicaciones pendientes',
            description: '4 pacientes tienen dosis programadas en las próximas 2 horas',
            type: 'warning',
            action: 'Ver agenda',
            route: '/dispensacion/registrar'
          },
          { 
            title: 'Cumplimiento protocolos',
            description: 'Signos vitales registrados: 98% de pacientes (Excelente)',
            type: 'success',
            action: 'Ver detalles',
            route: '/pacientes/lista'
          }
        ];
      case 'Administrador':
        return [
          { 
            title: 'Crecimiento del sistema',
            description: 'Incremento de 18% en recetas vs mes anterior. Considerar escalabilidad',
            type: 'info',
            action: 'Ver métricas',
            route: '/reportes/actividad-medico'
          },
          { 
            title: 'Seguridad',
            description: '7 usuarios pendientes de aprobación. 1 intento de acceso no autorizado detectado',
            type: 'warning',
            action: 'Revisar seguridad',
            route: '/seguridad/aprobaciones'
          },
          { 
            title: 'Cumplimiento normativo',
            description: 'Sistema 100% conforme con HL7 FHIR, FDA y OMS. Última auditoría: Aprobada',
            type: 'success',
            action: 'Ver auditoría',
            route: '/auditoria/log'
          }
        ];
      default:
        return [];
    }
  };

  const clinicalInsights = getClinicalInsights();

  // Métricas de rendimiento del sistema
  const systemMetrics = [
    { label: 'Base de datos', status: 'Operativa', health: 100, icon: Database, color: 'success' },
    { label: 'Sincronización HL7', status: 'Activa', health: 99.9, icon: ShieldCheck, color: 'success' },
    { label: 'API Interoperabilidad', status: 'En línea', health: 100, icon: Zap, color: 'success' },
    { label: 'Tiempo de respuesta', status: '< 100ms', health: 98, icon: TrendingUp, color: 'success' }
  ];

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner con rol dinámico */}
      <PageBanner
        icon={LayoutDashboard}
        title={`Dashboard - ${currentRole}`}
        description={`Bienvenido ${session?.fullName || 'Usuario'} - Sistema Hospitalario de Prescripción Electrónica`}
        gradient="from-blue-600 via-indigo-600 to-purple-600"
        action={
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-white/20 text-white border-white/30">
              <ShieldCheck className="w-3 h-3 mr-1" />
              HL7 FHIR
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              FDA Compliant
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <Stethoscope className="w-3 h-3 mr-1" />
              OMS Standards
            </Badge>
            {unreadNotifications > 0 && (
              <Badge className="bg-red-500 text-white border-red-400 cursor-pointer hover:bg-red-600" onClick={() => handleNavigate('/notificaciones/lista')}>
                <Bell className="w-3 h-3 mr-1" />
                {unreadNotifications} notificaciones
              </Badge>
            )}
          </div>
        }
      />

      {/* Selector de Rol para Demostraciones */}
      <Card className="shadow-lg border-l-4 border-primary bg-gradient-to-r from-blue-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm">Modo Demostración</h3>
                <p className="text-xs text-muted-foreground">
                  Cambia de rol para ver el dashboard desde diferentes perspectivas
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isDemoMode && (
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Vista dinámica activa
                </Badge>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ver como:</span>
                <Select value={currentRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[180px] border-primary/30">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {(session?.assignedRoles && session.assignedRoles.length > 0) ? (
                      session.assignedRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Farmacéutico">Farmacéutico</SelectItem>
                        <SelectItem value="Enfermera">Enfermera</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principales según rol */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(kpis).map(([key, kpi]) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Activity;
          
          return (
            <Card 
              key={key}
              className="shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 group"
              style={{ 
                borderLeftColor: kpi.trend === 'up' ? 'var(--color-success)' : 
                                 kpi.trend === 'down' ? 'var(--color-destructive)' : 
                                 'var(--color-muted)' 
              }}
              onClick={() => handleNavigate(kpi.route)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-3xl">{kpi.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendIcon className={`w-3 h-3 ${
                        kpi.trend === 'up' ? 'text-success' : 
                        kpi.trend === 'down' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`} />
                      <span className={
                        kpi.trend === 'up' ? 'text-success' : 
                        kpi.trend === 'down' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }>
                        {kpi.change}
                      </span>
                      <span className="text-muted-foreground ml-1">vs ayer</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Acciones Rápidas según rol */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index}
                  className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all border-0"
                  onClick={() => handleNavigate(action.route)}
                >
                  <div className={`h-2 bg-gradient-to-r ${action.gradient}`} />
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gradient-to-br ${action.gradient} rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm group-hover:text-primary transition-colors">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente e Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Actividad Reciente
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigate(currentRole === 'Doctor' ? '/prescripciones/emitidas' : 
                                            currentRole === 'Farmacéutico' ? '/dispensacion/registrar' :
                                            currentRole === 'Enfermera' ? '/pacientes/lista' :
                                            '/auditoria/log')}
            >
              Ver todo
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => handleNavigate(activity.route)}
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'success' ? 'bg-success/10' :
                      activity.status === 'warning' ? 'bg-warning/10' :
                      activity.status === 'alert' ? 'bg-destructive/10' :
                      'bg-blue-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        activity.status === 'success' ? 'text-success' :
                        activity.status === 'warning' ? 'text-warning' :
                        activity.status === 'alert' ? 'text-destructive' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm group-hover:text-primary transition-colors truncate">
                          {activity.title}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.subtitle}
                      </p>
                      <p className="text-xs text-muted-foreground/70 font-mono mt-0.5">
                        {activity.id}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights Clínicos / Operacionales */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Insights y Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clinicalInsights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'success' ? 'bg-success/5 border-success' :
                    insight.type === 'warning' ? 'bg-warning/5 border-warning' :
                    insight.type === 'alert' ? 'bg-destructive/5 border-destructive' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Info className={`w-5 h-5 mt-0.5 ${
                      insight.type === 'success' ? 'text-success' :
                      insight.type === 'warning' ? 'text-warning' :
                      insight.type === 'alert' ? 'text-destructive' :
                      'text-blue-600'
                    }`} />
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-xs"
                        onClick={() => handleNavigate(insight.route)}
                      >
                        {insight.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-success" />
            Estado del Sistema
            <Badge variant="outline" className="ml-auto bg-success/10 text-success border-success/30">
              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
              Operativo
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 text-${metric.color}`} />
                      <span className="text-sm">{metric.label}</span>
                    </div>
                    <Badge variant="outline" className={`bg-${metric.color}/10 text-${metric.color} border-${metric.color}/30 text-xs`}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Salud del servicio</span>
                      <span>{metric.health}%</span>
                    </div>
                    <Progress value={metric.health} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
