/**
 * ePrescription - Demo Completa
 * Sistema de Prescripción Electrónica
 * 
 * Esta demo incluye:
 * - Menú lateral (Sidebar) completo
 * - Dashboard con estadísticas
 * - Nueva Receta funcional
 * 
 * Tecnologías: React + Tailwind CSS + Lucide Icons + shadcn/ui
 */

import { useState } from "react";
import {
  Home,
  FileText,
  Pill,
  User,
  Users,
  Building2,
  Package,
  BookOpen,
  Bell,
  Shield,
  FileCheck,
  BarChart3,
  Globe,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
} from "lucide-react";

// ==================== TYPES ====================

interface Medicine {
  id: number;
  name: string;
  dose: string;
  quantity: string;
  frequency: string;
  administration: string;
  duration: string;
  observations: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route?: string;
  submenu?: SidebarItem[];
  badge?: number;
}

// ==================== MOCK DATA ====================

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Inicio",
    icon: Home,
    route: "/dashboard",
  },
  {
    id: "prescripciones",
    label: "Prescripciones",
    icon: FileText,
    submenu: [
      { id: "nueva", label: "Nueva receta", icon: Plus, route: "/prescripciones/nueva" },
      { id: "borradores", label: "Mis borradores", icon: FileText, route: "/prescripciones/borradores", badge: 3 },
      { id: "emitidas", label: "Recetas emitidas", icon: FileCheck, route: "/prescripciones/emitidas" },
      { id: "buscar", label: "Buscar receta", icon: Search, route: "/prescripciones/buscar" },
    ],
  },
  {
    id: "pacientes",
    label: "Pacientes",
    icon: Users,
    submenu: [
      { id: "lista", label: "Listado de pacientes", icon: Users, route: "/pacientes/lista" },
      { id: "perfil", label: "Perfil del paciente", icon: User, route: "/pacientes/perfil" },
    ],
  },
  {
    id: "medicos",
    label: "Médicos",
    icon: User,
    route: "/medicos/lista",
  },
  {
    id: "inventario",
    label: "Farmacia e Inventario",
    icon: Package,
    submenu: [
      { id: "stock", label: "Stock de medicamentos", icon: Package, route: "/inventario/stock" },
      { id: "alertas", label: "Alertas de stock", icon: Bell, route: "/inventario/alertas", badge: 5 },
      { id: "farmacias", label: "Farmacias registradas", icon: Building2, route: "/inventario/farmacias" },
    ],
  },
  {
    id: "alertas",
    label: "Alertas clínicas",
    icon: Bell,
    submenu: [
      { id: "bandeja", label: "Bandeja de alertas", icon: Bell, route: "/alertas/bandeja", badge: 12 },
      { id: "reglas", label: "Reglas e interacciones", icon: Shield, route: "/alertas/reglas" },
    ],
  },
  {
    id: "reportes",
    label: "Reportes y analítica",
    icon: BarChart3,
    submenu: [
      { id: "actividad", label: "Actividad por médico", icon: BarChart3, route: "/reportes/actividad" },
      { id: "exportar", label: "Exportaciones", icon: Download, route: "/reportes/exportar" },
    ],
  },
  {
    id: "catalogos",
    label: "Catálogos clínicos",
    icon: BookOpen,
    submenu: [
      { id: "medicamentos", label: "Medicamentos", icon: Pill, route: "/catalogos/medicamentos" },
      { id: "interacciones", label: "Interacciones", icon: AlertCircle, route: "/catalogos/interacciones" },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    route: "/config/general",
  },
];

const dashboardStats = [
  { label: "Recetas Emitidas Hoy", value: "47", change: "+12%", icon: FileText, color: "text-primary" },
  { label: "Pacientes Atendidos", value: "132", change: "+8%", icon: Users, color: "text-success" },
  { label: "Alertas Pendientes", value: "12", change: "-3%", icon: Bell, color: "text-warning" },
  { label: "Stock Crítico", value: "5", change: "0%", icon: Package, color: "text-destructive" },
];

const recentPrescriptions = [
  { id: "RX-2025-009847", patient: "María González", date: "27/09/2025 10:32", status: "Emitida" },
  { id: "RX-2025-009846", patient: "Carlos Rodríguez", date: "27/09/2025 09:15", status: "Emitida" },
  { id: "RX-2025-009845", patient: "Ana Martínez", date: "26/09/2025 16:45", status: "Emitida" },
  { id: "RX-2025-009844", patient: "Pedro Sánchez", date: "26/09/2025 14:20", status: "Dispensada" },
];

// ==================== COMPONENTS ====================

// Button Component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg transition-all font-medium";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent hover:bg-muted",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
    success: "bg-success text-white hover:opacity-90",
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

// Card Component
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-card border border-border rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};

// Input Component
const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    />
  );
};

// Select Component
const Select = ({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

// Textarea Component
const Textarea = ({
  placeholder = "",
  value,
  onChange,
  rows = 4,
  className = "",
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-3 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring resize-y ${className}`}
    />
  );
};

// Badge Component
const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
}) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Alert Component
const Alert = ({
  children,
  variant = "info",
  icon: Icon,
}: {
  children: React.ReactNode;
  variant?: "info" | "warning" | "success" | "error";
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
  };
  
  return (
    <div className={`flex gap-3 p-4 border rounded-lg ${variants[variant]}`}>
      {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-medium">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 p-6 border-t border-border">{footer}</div>
        )}
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({
  currentRoute,
  onNavigate,
}: {
  currentRoute: string;
  onNavigate: (route: string) => void;
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["prescripciones"]);
  
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  
  const renderMenuItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = item.route === currentRoute;
    
    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleExpand(item.id);
            } else if (item.route) {
              onNavigate(item.route);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
            level > 0 ? "pl-10" : ""
          } ${
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="destructive">{item.badge}</Badge>
            )}
          </div>
          {hasSubmenu && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {hasSubmenu && isExpanded && (
          <div className="border-l-2 border-sidebar-border ml-4">
            {item.submenu!.map((subitem) => renderMenuItem(subitem, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto flex-shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">ePrescription</h1>
            <p className="text-xs text-muted-foreground">Sistema Médico</p>
          </div>
        </div>
      </div>
      
      <nav className="py-4">
        {sidebarItems.map((item) => renderMenuItem(item))}
      </nav>
      
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
            CM
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Dr. Carlos Mendoza</p>
            <p className="text-xs text-muted-foreground truncate">RM-12345-COL</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Dashboard Page
const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Home className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-medium">Panel de Control</h1>
            <p className="text-sm opacity-90">Bienvenido al sistema ePrescription</p>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith("+") ? "text-success" : stat.change.startsWith("-") ? "text-destructive" : "text-muted-foreground"}`}>
                  {stat.change} vs. ayer
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recetas por Día (��ltimos 7 días)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[42, 38, 45, 52, 48, 51, 47].map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                  style={{ height: `${(value / 52) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["L", "M", "X", "J", "V", "S", "D"][idx]}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-success" />
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[
              { action: "Receta emitida", patient: "María González", time: "Hace 5 min" },
              { action: "Nueva alerta", patient: "Interacción detectada", time: "Hace 12 min" },
              { action: "Receta dispensada", patient: "Carlos Rodríguez", time: "Hace 28 min" },
              { action: "Paciente registrado", patient: "Ana Martínez", time: "Hace 1 hora" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.patient}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Recent Prescriptions Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Recetas Recientes
          </h3>
          <Button variant="outline" size="sm">
            Ver todas
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Número de Receta
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Paciente
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Fecha y Hora
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPrescriptions.map((rx) => (
                <tr key={rx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{rx.id}</td>
                  <td className="py-3 px-4">{rx.patient}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{rx.date}</td>
                  <td className="py-3 px-4">
                    <Badge variant={rx.status === "Dispensada" ? "success" : "default"}>
                      {rx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Nueva Receta Page
const NuevaRecetaPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [observations, setObservations] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    dose: "",
    quantity: "",
    frequency: "",
    administration: "",
    duration: "",
    observations: "",
  });
  
  const resetForm = () => {
    setFormData({
      name: "",
      dose: "",
      quantity: "",
      frequency: "",
      administration: "",
      duration: "",
      observations: "",
    });
    setEditingId(null);
  };
  
  const handleAddMedicine = () => {
    if (!formData.name || !formData.dose || !formData.quantity || !formData.frequency || !formData.administration || !formData.duration) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }
    
    if (editingId !== null) {
      // Edit existing
      setMedicines(medicines.map((m) =>
        m.id === editingId ? { ...formData, id: editingId } : m
      ));
    } else {
      // Add new
      setMedicines([...medicines, { ...formData, id: nextId }]);
      setNextId(nextId + 1);
    }
    
    setIsModalOpen(false);
    resetForm();
  };
  
  const handleEdit = (medicine: Medicine) => {
    setFormData(medicine);
    setEditingId(medicine.id);
    setIsModalOpen(true);
  };
  
  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este medicamento?")) {
      setMedicines(medicines.filter((m) => m.id !== id));
    }
  };
  
  const handleSaveDraft = () => {
    if (medicines.length === 0) {
      alert("Debe agregar al menos un medicamento");
      return;
    }
    alert("Borrador guardado exitosamente");
  };
  
  const handleEmit = () => {
    if (medicines.length === 0) {
      alert("Debe agregar al menos un medicamento");
      return;
    }
    if (confirm("¿Está seguro de emitir esta receta? Esta acción no se puede deshacer.")) {
      alert("Receta emitida exitosamente");
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-medium">Nueva Receta Médica</h1>
            <p className="text-sm opacity-90">Sistema de Prescripción Electrónica</p>
          </div>
        </div>
      </div>
      
      {/* System Alert */}
      <Alert variant="info" icon={AlertCircle}>
        <strong>Sistema de detección de interacciones activo:</strong> El sistema validará
        automáticamente interacciones medicamentosas al agregar cada medicamento.
      </Alert>
      
      {/* Prescription Info Card */}
      <Card className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Información de la Receta
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Número de Receta</p>
            <p className="font-medium">RX-2025-009847</p>
            <p className="text-xs text-muted-foreground">Generado automáticamente</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Estado</p>
            <Badge variant="warning">Borrador</Badge>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Paciente</p>
            <p className="font-medium">María Elena González Rodríguez</p>
            <p className="text-xs text-muted-foreground">CC-52.841.963 • 45 años • Femenino</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Médico Prescriptor</p>
            <p className="font-medium">Dr. Carlos Alberto Mendoza Herrera</p>
            <p className="text-xs text-muted-foreground">RM-12345-COL</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Fecha de Emisión</p>
            <p className="font-medium">27/09/2025</p>
            <p className="text-xs text-muted-foreground">10:32 a.m.</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Centro Médico</p>
            <p className="font-medium">Hospital San Juan de Dios</p>
            <p className="text-xs text-muted-foreground">San José, Costa Rica</p>
          </div>
        </div>
        
        <Alert variant="warning" icon={AlertCircle}>
          <strong>Alergias del paciente:</strong> Penicilina, Aspirina
        </Alert>
      </Card>
      
      {/* Medicines Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            Medicamentos Prescritos
            <Badge variant="default">{medicines.length} medicamentos</Badge>
          </h3>
          
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Agregar Medicamento
          </Button>
        </div>
        
        {medicines.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Pill className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No hay medicamentos agregados</p>
            <p className="text-sm mt-2">Haz clic en "Agregar Medicamento" para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Medicamento
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Dosis
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Frecuencia
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Vía
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Duración
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {medicine.quantity}</p>
                      {medicine.observations && (
                        <p className="text-sm text-muted-foreground italic mt-1">
                          {medicine.observations}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">{medicine.dose}</td>
                    <td className="py-3 px-4">{medicine.frequency}</td>
                    <td className="py-3 px-4">{medicine.administration}</td>
                    <td className="py-3 px-4">{medicine.duration}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(medicine)}
                          className="p-2 hover:bg-muted rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(medicine.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Observations Card */}
      <Card className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Observaciones Generales
        </h3>
        
        <Textarea
          placeholder="Ingrese observaciones, recomendaciones o instrucciones especiales..."
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          rows={4}
        />
      </Card>
      
      {/* Action Buttons */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button variant="secondary" onClick={handleSaveDraft}>
            <Save className="w-4 h-4" />
            Guardar Borrador
          </Button>
          <Button variant="success" onClick={handleEmit} className="ml-auto">
            <Send className="w-4 h-4" />
            Emitir Receta
          </Button>
        </div>
      </Card>
      
      {/* Footer Info */}
      <Alert variant="info" icon={Shield}>
        <strong>Sistema seguro y cumplimiento normativo:</strong> Esta receta electrónica cumple
        con las normativas HL7 FHIR, FDA 21 CFR Part 11 y directrices de la OMS para prescripción
        electrónica.
      </Alert>
      
      {/* Add/Edit Medicine Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingId ? "Editar Medicamento" : "Agregar Medicamento"}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddMedicine}>
              <Plus className="w-4 h-4" />
              {editingId ? "Guardar Cambios" : "Agregar"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre del medicamento *</label>
            <Input
              placeholder="Ej: Ibuprofeno"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dosis *</label>
              <Input
                placeholder="Ej: 400 mg"
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cantidad *</label>
              <Input
                placeholder="Ej: 15 tabletas"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Frecuencia *</label>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                options={[
                  { value: "1 vez al día", label: "1 vez al día" },
                  { value: "2 veces al día", label: "2 veces al día" },
                  { value: "3 veces al día", label: "3 veces al día" },
                  { value: "Cada 6 horas", label: "Cada 6 horas" },
                  { value: "Cada 8 horas", label: "Cada 8 horas" },
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Vía de administración *</label>
              <Select
                value={formData.administration}
                onChange={(e) => setFormData({ ...formData, administration: e.target.value })}
                options={[
                  { value: "Oral", label: "Oral" },
                  { value: "Intravenosa", label: "Intravenosa" },
                  { value: "Intramuscular", label: "Intramuscular" },
                  { value: "Subcutánea", label: "Subcutánea" },
                  { value: "Tópica", label: "Tópica" },
                ]}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Duración del tratamiento *</label>
            <Select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              options={[
                { value: "3 días", label: "3 días" },
                { value: "7 días", label: "7 días" },
                { value: "14 días", label: "14 días" },
                { value: "30 días", label: "30 días" },
                { value: "Continuo", label: "Continuo" },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Observaciones</label>
            <Textarea
              placeholder="Instrucciones especiales, advertencias, etc."
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ==================== MAIN APP ====================

export default function EPrescriptionDemo() {
  const [currentRoute, setCurrentRoute] = useState("/dashboard");
  
  const renderPage = () => {
    if (currentRoute === "/prescripciones/nueva") {
      return <NuevaRecetaPage />;
    }
    return <DashboardPage />;
  };
  
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
