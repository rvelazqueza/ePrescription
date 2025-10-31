import { useState } from "react";
import { 
  UserCheck, Search, Filter, Clock, CheckCircle2, XCircle, 
  AlertCircle, Mail, Phone, Shield, FileText, Eye 
} from "lucide-react";
import { PageBanner } from "../components/PageBanner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../components/ui/dialog";
import { authStore, RegistrationRequest } from "../utils/authStore";
import { toast } from "sonner@2.0.3";

export function UserApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener solicitudes
  const allRequests = authStore.getRegistrationRequests();
  const filteredRequests = allRequests.filter(req => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesSearch = 
      req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.idNumber.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = allRequests.filter(r => r.status === "pending").length;

  // Aprobar solicitud
  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      await authStore.approveRequest(selectedRequest.id, "admin-001");
      toast.success("Solicitud aprobada", {
        description: `Se ha enviado un correo de notificación a ${selectedRequest.email}`
      });
      setShowApproveDialog(false);
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Error al aprobar solicitud");
    } finally {
      setLoading(false);
    }
  };

  // Rechazar solicitud
  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;
    
    setLoading(true);
    try {
      await authStore.rejectRequest(selectedRequest.id, "admin-001", rejectionReason);
      toast.success("Solicitud rechazada", {
        description: `Se ha enviado un correo de notificación a ${selectedRequest.email}`
      });
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      toast.error("Error al rechazar solicitud");
    } finally {
      setLoading(false);
    }
  };

  // Calcular nivel de riesgo
  const getRiskBadge = (score: number) => {
    if (score < 0.3) return <Badge className="bg-success">Bajo riesgo</Badge>;
    if (score < 0.6) return <Badge variant="secondary">Riesgo medio</Badge>;
    return <Badge variant="destructive">Alto riesgo</Badge>;
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

  return (
    <div className="space-y-6">
      <PageBanner
        icon={UserCheck}
        title="Aprobación de usuarios"
        description="Revisa y gestiona las solicitudes de registro al sistema"
        variant="default"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Solicitudes pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-primary">{pendingCount}</p>
              <Clock className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Aprobadas (últimos 7 días)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-success">{allRequests.filter(r => r.status === "approved").length}</p>
              <CheckCircle2 className="w-8 h-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rechazadas (últimos 7 días)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-destructive">{allRequests.filter(r => r.status === "rejected").length}</p>
              <XCircle className="w-8 h-8 text-destructive opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de registro</CardTitle>
          <CardDescription>
            {filteredRequests.length} solicitud{filteredRequests.length !== 1 ? "es" : ""} encontrada{filteredRequests.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, correo o identificación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las solicitudes</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="approved">Aprobadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes {pendingCount > 0 && <Badge className="ml-2" variant="secondary">{pendingCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="approved">Aprobadas</TabsTrigger>
              <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="space-y-3 mt-4">
              {filteredRequests.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay solicitudes {statusFilter !== "all" ? statusFilter === "pending" ? "pendientes" : statusFilter === "approved" ? "aprobadas" : "rechazadas" : ""} en este momento.
                  </AlertDescription>
                </Alert>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h4>{request.fullName}</h4>
                            {request.status === "pending" && <Badge variant="secondary">Pendiente</Badge>}
                            {request.status === "approved" && <Badge className="bg-success">Aprobada</Badge>}
                            {request.status === "rejected" && <Badge variant="destructive">Rechazada</Badge>}
                            {getRiskBadge(request.riskScore)}
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              {request.idType} {request.idNumber}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              {request.email}
                              {request.emailVerified && <CheckCircle2 className="w-4 h-4 text-success" />}
                            </div>
                            {request.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                {request.phone}
                                {request.phoneVerified && <CheckCircle2 className="w-4 h-4 text-success" />}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Shield className="w-4 h-4" />
                              {request.preferredAuthMethod === "password" ? "Usuario + Contraseña" : "Firma Digital BCCR"}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                              <Clock className="w-4 h-4" />
                              Enviada: {formatDate(request.submittedAt)}
                            </div>
                            {request.reviewedAt && (
                              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                {request.status === "approved" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {request.status === "approved" ? "Aprobada" : "Rechazada"}: {formatDate(request.reviewedAt)}
                              </div>
                            )}
                            {request.rejectionReason && (
                              <div className="col-span-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm"><strong>Motivo de rechazo:</strong> {request.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalles
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-success hover:bg-success/90"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowApproveDialog(true);
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowRejectDialog(true);
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rechazar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog: Ver detalles */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la solicitud</DialogTitle>
            <DialogDescription>
              Información completa del solicitante
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Nombre completo</Label>
                  <p className="mt-1">{selectedRequest.fullName}</p>
                </div>
                <div>
                  <Label>Identificación</Label>
                  <p className="mt-1">{selectedRequest.idType} {selectedRequest.idNumber}</p>
                </div>
                <div>
                  <Label>Correo electrónico</Label>
                  <p className="mt-1 flex items-center gap-2">
                    {selectedRequest.email}
                    {selectedRequest.emailVerified && <CheckCircle2 className="w-4 h-4 text-success" />}
                  </p>
                </div>
                {selectedRequest.phone && (
                  <div>
                    <Label>Teléfono</Label>
                    <p className="mt-1 flex items-center gap-2">
                      {selectedRequest.phone}
                      {selectedRequest.phoneVerified && <CheckCircle2 className="w-4 h-4 text-success" />}
                    </p>
                  </div>
                )}
                <div>
                  <Label>Método de autenticación</Label>
                  <p className="mt-1">{selectedRequest.preferredAuthMethod === "password" ? "Usuario y Contraseña" : "Firma Digital BCCR"}</p>
                </div>
                <div>
                  <Label>Puntuación de riesgo</Label>
                  <p className="mt-1">{getRiskBadge(selectedRequest.riskScore)}</p>
                </div>
                <div>
                  <Label>Fecha de solicitud</Label>
                  <p className="mt-1">{formatDate(selectedRequest.submittedAt)}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <p className="mt-1">
                    {selectedRequest.status === "pending" && <Badge variant="secondary">Pendiente</Badge>}
                    {selectedRequest.status === "approved" && <Badge className="bg-success">Aprobada</Badge>}
                    {selectedRequest.status === "rejected" && <Badge variant="destructive">Rechazada</Badge>}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Verificaciones</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={selectedRequest.emailVerified ? "default" : "secondary"}>
                    {selectedRequest.emailVerified ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    Email {selectedRequest.emailVerified ? "verificado" : "no verificado"}
                  </Badge>
                  <Badge variant={selectedRequest.phoneVerified ? "default" : "secondary"}>
                    {selectedRequest.phoneVerified ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    Teléfono {selectedRequest.phoneVerified ? "verificado" : "no verificado"}
                  </Badge>
                  <Badge variant={selectedRequest.termsAccepted ? "default" : "secondary"}>
                    {selectedRequest.termsAccepted ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    Términos aceptados
                  </Badge>
                  <Badge variant={selectedRequest.privacyAccepted ? "default" : "secondary"}>
                    {selectedRequest.privacyAccepted ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    Privacidad aceptada
                  </Badge>
                </div>
              </div>

              {selectedRequest.reviewedAt && (
                <Alert className={selectedRequest.status === "approved" ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Revisada por <strong>Administrador</strong> el {formatDate(selectedRequest.reviewedAt)}
                    {selectedRequest.rejectionReason && (
                      <p className="mt-2"><strong>Motivo:</strong> {selectedRequest.rejectionReason}</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Cerrar
            </Button>
            {selectedRequest?.status === "pending" && (
              <>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-success hover:bg-success/90 text-white px-4 py-2 transition-colors"
                  onClick={() => {
                    setShowDetailDialog(false);
                    setShowApproveDialog(true);
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar</span>
                </button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetailDialog(false);
                    setShowRejectDialog(true);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Aprobar */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar solicitud</DialogTitle>
            <DialogDescription>
              ¿Confirmas que deseas aprobar esta solicitud de registro?
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <Alert className="bg-success/5 border-success/20">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription>
                Se enviará un correo a <strong>{selectedRequest.email}</strong> notificando que su cuenta ha sido aprobada y puede acceder al sistema.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button className="bg-success hover:bg-success/90" onClick={handleApprove} disabled={loading}>
              {loading ? "Aprobando..." : "Confirmar aprobación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Rechazar */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar solicitud</DialogTitle>
            <DialogDescription>
              Proporciona un motivo claro del rechazo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Motivo del rechazo *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Ejemplo: Documentación incompleta - No se pudo verificar número de colegiado"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Este mensaje será enviado al solicitante
              </p>
            </div>

            {selectedRequest && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Se enviará un correo a <strong>{selectedRequest.email}</strong> con el motivo del rechazo.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={loading || !rejectionReason.trim()}
            >
              {loading ? "Rechazando..." : "Confirmar rechazo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
