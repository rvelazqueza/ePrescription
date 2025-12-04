import { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  X,
  AlertTriangle,
  Pill,
  FileText,
  Settings,
  UserCheck,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  getAllUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllReadNotifications,
  type UserNotification
} from '../utils/userNotificationsStore';
import { toast } from 'sonner@2.0.3';

interface NotificationsPanelProps {
  onNavigate?: (route: string) => void;
}

export function NotificationsPanel({ onNavigate }: NotificationsPanelProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones
  const loadNotifications = () => {
    const allNotifications = getAllUserNotifications();
    setNotifications(allNotifications);
    setUnreadCount(getUnreadCount());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Recargar cuando se abre el panel
  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = markAsRead(id);
    if (updated) {
      loadNotifications();
      toast.success('Notificación marcada como leída');
    }
  };

  const handleMarkAllAsRead = () => {
    const count = markAllAsRead();
    loadNotifications();
    toast.success(`${count} notificaciones marcadas como leídas`);
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const deleted = deleteNotification(id);
    if (deleted) {
      loadNotifications();
      toast.success('Notificación eliminada');
    }
  };

  const handleDeleteAllRead = () => {
    const count = deleteAllReadNotifications();
    loadNotifications();
    toast.success(`${count} notificaciones leídas eliminadas`);
  };

  const handleNotificationClick = (notification: UserNotification) => {
    // Marcar como leída
    if (!notification.isRead) {
      markAsRead(notification.id);
      loadNotifications();
    }

    // Navegar si hay URL de acción
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
      setOpen(false);
    }
  };

  const getNotificationIcon = (type: UserNotification['type']) => {
    switch (type) {
      case 'prescription':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'dispensation':
        return <Pill className="w-4 h-4 text-green-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-600" />;
      case 'approval':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'rejection':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'expiration':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[420px] p-0" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-7"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[480px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No hay notificaciones</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Todas tus notificaciones aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 transition-colors cursor-pointer hover:bg-muted/50
                    ${!notification.isRead ? 'bg-blue-50/50' : ''}
                  `}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-1.5 py-0 ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority === 'high' && 'Alta'}
                            {notification.priority === 'medium' && 'Media'}
                            {notification.priority === 'low' && 'Baja'}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              title="Marcar como leída"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            title="Eliminar"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3 flex justify-between items-center bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAllRead}
                className="text-xs text-muted-foreground hover:text-destructive h-8"
                disabled={notifications.filter(n => n.isRead).length === 0}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Eliminar leídas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('/notificaciones/lista');
                    setOpen(false);
                  }
                }}
                className="text-xs text-primary h-8"
              >
                Ver todas
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
