import { useState } from "react";
import { 
  Shield, Smartphone, Monitor, AlertCircle, LogOut, 
  MapPin, Clock, CheckCircle2, XCircle 
} from "lucide-react";
import { PageBanner } from "../components/PageBanner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../components/ui/dialog";
import { authStore } from "../utils/authStore";
import { toast } from "sonner@2.0.3";

export function SessionManagementPage() {
  const [sessions, setSessions] = useState(authStore.getSessions("user-001"));
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [showTerminateAllDialog, setShowTerminateAllDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Determinar icono del dispositivo
  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes("iphone") || deviceName.toLowerCase().includes("android")) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  // Formatear fecha
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("es-CR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Calcular tiempo desde última actividad
  const getTimeSinceActivity = (date: string) => {
    const now = new Date();
    const activity = new Date(date);
    const diffMs = now.getTime() - activity.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Activa ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`;
  };

  // Cerrar sesión específica
  const handleTerminateSession = async () => {
    if (!selectedSessionId) return;
    
    setLoading(true);
    try {
      await authStore.terminateSession(selectedSessionId);
      
      // Actualizar lista
      setSessions(sessions.filter(s => s.id !== selectedSessionId));
      
      toast.success("Sesión cerrada", {
        description: "La sesión ha sido terminada exitosamente"
      });
      
      setShowTerminateDialog(false);
      setSelectedSessionId(null);
    } catch (error) {
      toast.error("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar todas las sesiones
  const handleTerminateAllSessions = async () => {
    setLoading(true);
    try {
      await authStore.terminateAllSessions("user-001");
      
      // Actualizar lista
      setSessions([]);
      
      toast.success("Todas las sesiones cerradas", {
        description: "Has cerrado sesión en todos los dispositivos"
      });
      
      setShowTerminateAllDialog(false);
    } catch (error) {
      toast.error("Error al cerrar sesiones");
    } finally {
      setLoading(false);
    }
  };

  // Sesión actual (mock - primera sesión)
  const currentSessionId = sessions[0]?.id;
  const activeSessions = sessions.filter(s => s.id !== currentSessionId);

  return (
    <div className="space-y-6">
      <PageBanner
        icon={Shield}
        title="Gestión de sesiones"
        description="Administra tus sesiones activas y dispositivos de confianza"
        variant="default"
      />

      {/* Alert de seguridad */}
      <Alert className="bg-primary/5 border-primary/20">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>Seguridad de tu cuenta:</strong> Si detectas actividad sospechosa o un dispositivo que no reconoces, cierra esa sesión inmediatamente y cambia tu contraseña.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sesiones activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-primary">{sessions.length}</p>
              <Shield className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Dispositivos de confianza</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-success">{sessions.filter(s => s.trusted).length}</p>
              <CheckCircle2 className="w-8 h-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Nuevos dispositivos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-warning">{sessions.filter(s => !s.trusted).length}</p>
              <AlertCircle className="w-8 h-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sesión actual */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sesión actual</CardTitle>
              <CardDescription>Este dispositivo</CardDescription>
            </div>
            <Badge className="bg-success">Activa</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sessions[0] && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary rounded-lg text-white">
                  {getDeviceIcon(sessions[0].deviceName)}
                </div>
                <div className="flex-1 space-y-2">
                  <h4>{sessions[0].deviceName}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {sessions[0].location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {getTimeSinceActivity(sessions[0].lastActivity)}
                    </div>
                    <div className="col-span-2">
                      IP: {sessions[0].ipAddress}
                    </div>
                    <div className="col-span-2 text-xs">
                      {sessions[0].userAgent}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm">Dispositivo de confianza</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  <p>Iniciada: {formatDate(sessions[0].createdAt)}</p>
                  <p>Expira: {formatDate(sessions[0].expiresAt)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Otras sesiones activas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Otras sesiones activas</CardTitle>
              <CardDescription>
                {activeSessions.length} sesión{activeSessions.length !== 1 ? "es" : ""} en otro{activeSessions.length !== 1 ? "s" : ""} dispositivo{activeSessions.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            {activeSessions.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setShowTerminateAllDialog(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar todas
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.length === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                No tienes otras sesiones activas en otros dispositivos.
              </AlertDescription>
            </Alert>
          ) : (
            activeSessions.map((session) => (
              <div key={session.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${session.trusted ? "bg-muted text-foreground" : "bg-warning/20 text-warning"}`}>
                    {getDeviceIcon(session.deviceName)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4>{session.deviceName}</h4>
                      {session.trusted ? (
                        <Badge variant="secondary">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Confiable
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Nuevo
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {session.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {getTimeSinceActivity(session.lastActivity)}
                      </div>
                      <div className="col-span-2">
                        IP: {session.ipAddress}
                      </div>
                      <div className="col-span-2 text-xs">
                        {session.userAgent}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
                      <div>
                        <p>Iniciada: {formatDate(session.createdAt)}</p>
                        <p>Expira: {formatDate(session.expiresAt)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSessionId(session.id);
                          setShowTerminateDialog(true);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                      </Button>
                    </div>
                  </div>
                </div>

                {!session.trusted && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Dispositivo nuevo detectado.</strong> Si no reconoces esta actividad, cierra esta sesión inmediatamente y cambia tu contraseña.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información de seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4>Dispositivos de confianza</h4>
              <p className="text-sm text-muted-foreground">
                Los dispositivos marcados como confiables no requieren MFA durante 30 días. Puedes revocar esta confianza en cualquier momento cerrando la sesión.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4>Actividad sospechosa</h4>
              <p className="text-sm text-muted-foreground">
                Siempre que detectes una sesión desde una ubicación o dispositivo que no reconoces, ciérrala inmediatamente y actualiza tu contraseña desde Configuración de Seguridad.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4>Expiración de sesiones</h4>
              <p className="text-sm text-muted-foreground">
                Las sesiones inactivas expiran automáticamente después de 7 días. Las sesiones activas se renuevan automáticamente mientras uses el sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Cerrar sesión específica */}
      <Dialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar sesión</DialogTitle>
            <DialogDescription>
              ¿Confirmas que deseas cerrar esta sesión?
            </DialogDescription>
          </DialogHeader>
          
          <Alert variant="destructive">
            <LogOut className="h-4 w-4" />
            <AlertDescription>
              Esta acción cerrará inmediatamente la sesión en el dispositivo seleccionado. El usuario deberá iniciar sesión nuevamente.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTerminateDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleTerminateSession} disabled={loading}>
              {loading ? "Cerrando..." : "Cerrar sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Cerrar todas las sesiones */}
      <Dialog open={showTerminateAllDialog} onOpenChange={setShowTerminateAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar todas las sesiones</DialogTitle>
            <DialogDescription>
              ¿Confirmas que deseas cerrar todas las sesiones activas excepto la actual?
            </DialogDescription>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Precaución:</strong> Esta acción cerrará inmediatamente {activeSessions.length} sesión{activeSessions.length !== 1 ? "es" : ""} activa{activeSessions.length !== 1 ? "s" : ""} en otros dispositivos. Deberás iniciar sesión nuevamente en cada uno.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTerminateAllDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleTerminateAllSessions} disabled={loading}>
              {loading ? "Cerrando..." : "Cerrar todas las sesiones"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
