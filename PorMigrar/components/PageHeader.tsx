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
    <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between">
      {/* Quick Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar paciente, receta, medicamento..."
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* Role Selector - Multi-Role System */}
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
            <Button variant="ghost" className="flex items-center gap-3 h-auto py-2 px-3 hover:bg-muted">
              <div className="text-right">
                <p className="text-sm text-foreground font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  Cédula: {displayCedula} | Código: {displayCode}
                </p>
                <p className="text-xs text-primary">{displaySpecialty}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
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
                  <p className="text-xs text-muted-foreground">{displaySpecialty}</p>
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
    </header>
  );
}