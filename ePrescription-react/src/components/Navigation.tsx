import { 
  Home, 
  FileText, 
  Users, 
  Package, 
  Pill, 
  Shield, 
  Settings,
  Activity,
  Stethoscope
} from "lucide-react";
import { cn } from "./ui/utils";

interface NavigationProps {
  currentPage?: 'inicio' | 'recetas' | 'pacientes' | 'inventario' | 'farmacia' | 'autorizacion' | 'configuracion';
  onPageChange?: (page: 'inicio' | 'recetas' | 'pacientes' | 'inventario' | 'farmacia' | 'autorizacion' | 'configuracion') => void;
}

const getNavigationItems = (currentPage: string) => [
  {
    title: "Inicio",
    icon: Home,
    href: "/",
    active: currentPage === 'inicio'
  },
  {
    title: "Recetas", 
    icon: FileText,
    href: "/recetas",
    active: currentPage === 'recetas'
  },
  {
    title: "Pacientes",
    icon: Users,
    href: "/pacientes",
    active: currentPage === 'pacientes'
  },
  {
    title: "Inventario",
    icon: Package,
    href: "/inventario", 
    active: currentPage === 'inventario'
  },
  {
    title: "Farmacia",
    icon: Pill,
    href: "/farmacia",
    active: currentPage === 'farmacia'
  },
  {
    title: "Autorización",
    icon: Shield,
    href: "/autorizacion",
    active: currentPage === 'autorizacion'
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/configuracion",
    active: currentPage === 'configuracion'
  }
];

export function Navigation({ currentPage = 'recetas', onPageChange }: NavigationProps) {
  const navigationItems = getNavigationItems(currentPage);
  
  const handlePageClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onPageChange && (page === 'inicio' || page === 'recetas')) {
      onPageChange(page as 'inicio' | 'recetas');
    }
  };
  
  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-primary to-primary/90 text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/20">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Stethoscope className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold">MedFlow Pro</h1>
          <p className="text-xs text-white/80">Sistema Médico</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isClickable = item.title === 'Inicio' || item.title === 'Recetas';
          const pageKey = item.title === 'Inicio' ? 'inicio' : item.title === 'Recetas' ? 'recetas' : item.title.toLowerCase();
          
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={isClickable ? (e) => handlePageClick(pageKey, e) : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 group",
                item.active 
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30" 
                  : "text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md",
                !isClickable && "opacity-60 cursor-not-allowed"
              )}
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.title}</span>
              {item.active && (
                <div className="ml-auto">
                  <Activity className="h-4 w-4 text-white/60" />
                </div>
              )}
              {!isClickable && (
                <div className="ml-auto text-xs text-white/40">
                  Próximamente
                </div>
              )}
            </a>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/20">
        <div className="text-xs text-white/60 text-center">
          <p>Certificado HL7 • FDA</p>
          <p className="mt-1">Versión 2.1.0</p>
        </div>
      </div>
    </div>
  );
}