import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { TopBar } from "./TopBar";

interface LayoutProps {
  children: ReactNode;
  currentPage?: 'inicio' | 'recetas' | 'pacientes' | 'inventario' | 'farmacia' | 'autorizacion' | 'configuracion';
  onPageChange?: (page: 'inicio' | 'recetas' | 'pacientes' | 'inventario' | 'farmacia' | 'autorizacion' | 'configuracion') => void;
}

const mockDoctor = {
  name: "Dr. Ana María López Ruiz",
  specialty: "Medicina Interna",
  license: "12345-COL",
  department: "Unidad de Hospitalización 3A",
  avatar: undefined
};

const currentDate = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

export function Layout({ children, currentPage = 'recetas', onPageChange }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Sidebar */}
      <Navigation currentPage={currentPage} onPageChange={onPageChange} />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar - Simplificado */}
        <TopBar doctor={mockDoctor} currentDate={currentDate} />
        
        {/* Page Content - Más espacio disponible */}
        <main className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm">
          <div className={currentPage === 'inicio' ? '' : 'p-6'}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}