import { Logo } from './Logo';
import { Bell, User, Search, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { RoleSelector } from './RoleSelector';
import { NotificationsPanel } from './NotificationsPanel';
import { getCurrentSession } from '../utils/multiRoleSession';
import { getUserById } from '../utils/usersStore';
import { getUnreadCount } from '../utils/userNotificationsStore';

interface PageHeaderProps {
  userName?: string;
  userCedula?: string;
  userCode?: string;
  userSpecialty?: string;
  profilePhoto?: string | null;
  notifications?: number;
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
  currentRoute?: string;
}

export function PageHeader({ 
  userName,
  userCedula,
  userCode,
  userSpecialty,
  profilePhoto,
  notifications,
  onLogout,
  onNavigate,
  currentRoute = '/dashboard'
}: PageHeaderProps) {
  // Obtener datos de la sesión actual
  const session = getCurrentSession();
  const user = session ? getUserById(session.userId) : null;
  
  // Usar datos de la sesión si están disponibles, sino usar props
  const displayName = userName || user?.fullName || 'Usuario';
  const displayCedula = userCedula || user?.certifiedId || 'N/A';
  const displayCode = userCode || user?.userId || 'N/A';
  const displaySpecialty = userSpecialty || user?.specialty || 'N/A';
  const unreadNotifications = notifications ?? getUnreadCount();
  return (
    <>
      {/* Banner Superior Moderno - Todo en Uno */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
        {/* Sección Izquierda - Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">ePrescription</h1>
            <p className="text-xs text-blue-100">Sistema Hospitalario de Prescripción Médica</p>
          </div>
        </div>
        
        {/* Sección Central - Búsqueda */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              type="text"
              placeholder="Buscar paciente, receta, medicamento..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
            />
          </div>
        </div>

        {/* Sección Derecha - Certificaciones, Notificaciones y Usuario */}
        <div className="flex items-center gap-4">
          {/* Certificaciones Compactas */}
          <div className="flex items-center gap-4 text-xs border-r border-white/20 pr-4">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Activo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">HL7 | FDA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">SSL</span>
            </div>
          </div>

          {/* Role Selector */}
          <RoleSelector 
            currentRoute={currentRoute}
            onRoleChange={(newRole) => {
              console.log('Rol cambiado a:', newRole);
            }}
          />

          {/* Notifications */}
          <NotificationsPanel onNavigate={onNavigate} />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto py-2 px-3 hover:bg-white/10 text-white border-0">
                <div className="text-right">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-blue-100">
                    {displaySpecialty}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">Cédula: {displayCedula} | Código: {displayCode}</p>
                    <p className="text-xs text-primary">{displaySpecialty}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate?.('/mi-perfil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mi perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('/notificaciones/lista')}>
                <Bell className="mr-2 h-4 w-4" />
                <div className="flex items-center justify-between flex-1">
                  <span>Notificaciones</span>
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('/autoservicio')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onLogout && (
                <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}