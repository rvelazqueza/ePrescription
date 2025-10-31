import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Pill,
  Users,
  Stethoscope,
  Package,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  Network,
  Shield,
  FileCheck,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Receipt,
  UserCog,
  HelpCircle
} from 'lucide-react';
import { Logo } from './Logo';
import { cn } from './ui/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  route: string;
  visible?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  route: string;
  visible?: boolean;
}

const menuStructure: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: LayoutDashboard,
    route: '/dashboard',
    visible: true
  },
  {
    id: 'prescripciones',
    label: 'Prescripciones',
    icon: FileText,
    route: '/prescripciones',
    visible: true,
    subItems: [
      { id: 'nueva', label: 'Nueva receta', route: '/prescripciones/nueva', visible: true },
      { id: 'borradores', label: 'Mis borradores', route: '/prescripciones/borradores', visible: true },
      { id: 'emitidas', label: 'Recetas emitidas', route: '/prescripciones/emitidas', visible: true },
      { id: 'buscar', label: 'Buscar receta', route: '/prescripciones/buscar', visible: true },
      { id: 'duplicar', label: 'Duplicar receta', route: '/prescripciones/duplicar', visible: true },
      { id: 'centros', label: 'Centros médicos', route: '/prescripciones/centros', visible: true }
    ]
  },
  {
    id: 'dispensacion',
    label: 'Dispensación',
    icon: Pill,
    route: '/dispensacion',
    visible: true,
    subItems: [
      { id: 'verificar', label: 'Verificar receta (QR/Token)', route: '/dispensacion/verificar', visible: true },
      { id: 'registrar', label: 'Registrar dispensación', route: '/dispensacion/registrar', visible: true },
      { id: 'rechazos', label: 'Rechazos y motivos', route: '/dispensacion/rechazos', visible: true }
    ]
  },
  {
    id: 'pacientes',
    label: 'Pacientes',
    icon: Users,
    route: '/pacientes',
    visible: true,
    subItems: [
      { id: 'lista', label: 'Listado de pacientes', route: '/pacientes/lista', visible: true },
      { id: 'perfil', label: 'Perfil del paciente', route: '/pacientes/perfil', visible: true },
      { id: 'recetas', label: 'Recetas del paciente', route: '/pacientes/recetas', visible: true }
    ]
  },
  {
    id: 'medicos',
    label: 'Médicos',
    icon: Stethoscope,
    route: '/medicos',
    visible: true,
    subItems: [
      { id: 'lista', label: 'Listado de médicos', route: '/medicos/lista', visible: true },
      { id: 'editar', label: 'Alta/Edición de médico', route: '/medicos/editar', visible: true }
    ]
  },
  {
    id: 'inventario',
    label: 'Farmacia e Inventario',
    icon: Package,
    route: '/inventario',
    visible: true,
    subItems: [
      { id: 'stock', label: 'Stock de medicamentos', route: '/inventario/stock', visible: true },
      { id: 'farmacias', label: 'Farmacias registradas', route: '/inventario/farmacias', visible: true },
      { id: 'consulta', label: 'Consulta de inventario', route: '/inventario/consulta', visible: true },
      { id: 'alertas', label: 'Alertas de stock bajo', route: '/inventario/alertas', visible: true },
      { id: 'ajustes', label: 'Ajustes de stock', route: '/inventario/ajustes', visible: true },
      { id: 'lotes', label: 'Lotes y vencimientos', route: '/inventario/lotes', visible: true }
    ]
  },
  {
    id: 'talonarios',
    label: 'Talonarios',
    icon: Receipt,
    route: '/talonarios',
    visible: true,
    subItems: [
      { id: 'comprar', label: 'Comprar talonarios', route: '/talonarios/comprar', visible: true },
      { id: 'listado', label: 'Mis talonarios', route: '/talonarios/listado', visible: true }
    ]
  },
  {
    id: 'alertas',
    label: 'Alertas clínicas (CDS)',
    icon: AlertTriangle,
    route: '/alertas',
    visible: true,
    subItems: [
      { id: 'bandeja', label: 'Bandeja de alertas', route: '/alertas/bandeja', visible: true },
      { id: 'reglas', label: 'Reglas e interacciones', route: '/alertas/reglas', visible: true },
      { id: 'tipos', label: 'Tipos de alertas', route: '/alertas/tipos', visible: true }
    ]
  },
  {
    id: 'firma',
    label: 'Firma y verificación',
    icon: ShieldCheck,
    route: '/firma',
    visible: true,
    subItems: [
      { id: 'firmar', label: 'Firmar receta', route: '/firma/firmar', visible: true },
      { id: 'qr', label: 'Generar/Ver QR', route: '/firma/qr', visible: true },
      { id: 'verificar', label: 'Verificación de QR/Token', route: '/firma/verificar', visible: true },
      { id: 'trazabilidad', label: 'Trazabilidad de firmas', route: '/firma/trazabilidad', visible: true }
    ]
  },
  {
    id: 'reportes',
    label: 'Reportes y analítica',
    icon: BarChart3,
    route: '/reportes',
    visible: true,
    subItems: [
      { id: 'actividad-medico', label: 'Actividad por médico', route: '/reportes/actividad-medico', visible: true },
      { id: 'actividad-farmacia', label: 'Actividad de farmacia', route: '/reportes/actividad-farmacia', visible: true },
      { id: 'exportar', label: 'Exportaciones (CSV/Excel)', route: '/reportes/exportar', visible: true }
    ]
  },
  {
    id: 'interop',
    label: 'Interoperabilidad',
    icon: Network,
    route: '/interop',
    visible: true,
    subItems: [
      { id: 'fhir-ids', label: 'IDs FHIR', route: '/interop/fhir-ids', visible: true },
      { id: 'exportar', label: 'Exportar receta (FHIR)', route: '/interop/exportar', visible: true },
      { id: 'importar', label: 'Importar datos externos', route: '/interop/importar', visible: true },
      { id: 'eventos', label: 'Registro HL7 eventos', route: '/interop/eventos', visible: true }
    ]
  },
  {
    id: 'seguridad',
    label: 'Seguridad y usuarios',
    icon: Shield,
    route: '/seguridad',
    visible: true,
    subItems: [
      { id: 'usuarios', label: 'Usuarios', route: '/seguridad/usuarios', visible: true },
      { id: 'registro', label: 'Registro de usuarios', route: '/seguridad/registro', visible: true },
      { id: 'aprobaciones', label: 'Aprobación de usuarios', route: '/seguridad/aprobaciones', visible: true },
      { id: 'roles', label: 'Roles y permisos', route: '/seguridad/roles', visible: true },
      { id: 'parametros', label: 'Parámetros de seguridad', route: '/seguridad/parametros', visible: true },
      { id: 'bloqueos', label: 'Bloqueos/Desbloqueos', route: '/seguridad/bloqueos', visible: true },
      { id: 'sesiones', label: 'Sesiones de usuario', route: '/seguridad/sesiones', visible: true },
      { id: 'mis-sesiones', label: 'Mis sesiones activas', route: '/seguridad/mis-sesiones', visible: true }
    ]
  },
  {
    id: 'auditoria',
    label: 'Auditoría y cumplimiento',
    icon: FileCheck,
    route: '/auditoria',
    visible: true,
    subItems: [
      { id: 'log', label: 'Log auditoría', route: '/auditoria/log', visible: true }
    ]
  },
  {
    id: 'catalogos',
    label: 'Catálogos clínicos',
    icon: BookOpen,
    route: '/catalogos',
    visible: true,
    subItems: [
      { id: 'medicamentos', label: 'Medicamentos', route: '/catalogos/medicamentos', visible: true },
      { id: 'vias', label: 'Vías de administración', route: '/catalogos/vias', visible: true },
      { id: 'especialidades', label: 'Especialidades', route: '/catalogos/especialidades', visible: true },
      { id: 'unidades', label: 'Unidades médicas', route: '/catalogos/unidades', visible: true },
      { id: 'interacciones', label: 'Interacciones', route: '/catalogos/interacciones', visible: true },
      { id: 'tipos-alertas', label: 'Tipos de alertas', route: '/catalogos/tipos-alertas', visible: true },
      { id: 'paises', label: 'Países', route: '/catalogos/paises', visible: true }
    ]
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    icon: Bell,
    route: '/notificaciones',
    visible: true,
    subItems: [
      { id: 'lista-notificaciones', label: 'Listado de notificaciones', route: '/notificaciones/lista', visible: true },
      { id: 'nueva-notificacion', label: 'Nueva notificación', route: '/notificaciones/nueva', visible: true }
    ]
  },
  {
    id: 'config',
    label: 'Configuración',
    icon: Settings,
    route: '/config',
    visible: true,
    subItems: [
      { id: 'politicas', label: 'Políticas de recetas', route: '/config/politicas', visible: true },
      { id: 'auxiliares', label: 'Catálogos auxiliares', route: '/config/auxiliares', visible: true },
      { id: 'numeracion', label: 'Numeración de recetas', route: '/config/numeracion', visible: true }
    ]
  },
  {
    id: 'ayuda',
    label: 'Centro de Ayuda',
    icon: HelpCircle,
    route: '/ayuda',
    visible: true
  },
  {
    id: 'autoservicio',
    label: 'Autoservicio',
    icon: UserCog,
    route: '/autoservicio',
    visible: true
  },
  {
    id: 'documentacion',
    label: 'Documentación',
    icon: BookOpen,
    route: '/documentacion',
    visible: true
  }
];

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ currentRoute, onNavigate, collapsed = false, onToggleCollapse }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['prescripciones', 'dispensacion']);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isActive = (route: string) => currentRoute === route;
  const isParentActive = (item: MenuItem) => {
    if (item.route === currentRoute) return true;
    return item.subItems?.some(sub => sub.route === currentRoute) ?? false;
  };

  return (
    <aside
      className={cn(
        'bg-white border-r border-border h-screen flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && <Logo size="sm" />}
        {collapsed && <Logo size="sm" variant="icon" className="mx-auto" />}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-accent rounded-md transition-colors"
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuStructure.map(item => {
            if (!item.visible) return null;

            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItems.includes(item.id);
            const parentActive = isParentActive(item);

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpanded(item.id);
                      if (collapsed && onToggleCollapse) {
                        onToggleCollapse();
                      }
                    } else {
                      onNavigate(item.route);
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                    parentActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {hasSubItems && (
                        isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {hasSubItems && isExpanded && !collapsed && (
                  <ul className="mt-1 ml-4 pl-4 border-l-2 border-border space-y-1">
                    {item.subItems!.map(subItem => {
                      if (!subItem.visible) return null;
                      return (
                        <li key={subItem.id}>
                          <button
                            onClick={() => onNavigate(subItem.route)}
                            className={cn(
                              'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                              isActive(subItem.route)
                                ? 'bg-secondary text-secondary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            {subItem.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Cumplimiento normativo:</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-accent rounded text-accent-foreground">HL7</span>
              <span className="px-2 py-1 bg-accent rounded text-accent-foreground">FDA</span>
              <span className="px-2 py-1 bg-accent rounded text-accent-foreground">OMS</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <ShieldCheck className="w-5 h-5 text-success" />
          </div>
        )}
      </div>
    </aside>
  );
}