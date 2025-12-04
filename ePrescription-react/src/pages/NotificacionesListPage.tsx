import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { PageBanner } from "../components/PageBanner";
import { ExportButtons } from "../components/ExportButtons";
import { TablePagination } from "../components/TablePagination";
import { usePagination } from "../utils/usePagination";
import { normalizeSearchText } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";
import { 
  getAllNotifications, 
  deleteNotification, 
  toggleNotificationStatus, 
  duplicateNotification,
  type Notification 
} from "../utils/notificationsStore";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Bell,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Mail,
  MessageSquare,
  Smartphone,
  AlertCircle,
  MoreVertical,
  Save,
  Clock,
  Pause
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

// Ya no necesitamos mockNotifications porque usamos el store
const oldMockNotifications = [
  {
    id: "1",
    codigo: "NOTIF-RX-001",
    nombre: "Nueva Receta Emitida",
    descripcion: "Notificación enviada al paciente cuando el médico emite una nueva receta electrónica",
    tipoDestinatario: "externo",
    canalPrincipal: "Correo",
    canales: ["Correo", "SMS", "Interna"],
    categoria: "Prescripciones",
    activa: true,
    prioridad: "alta",
    ultimaModificacion: "2024-10-05 14:23",
    usuarioModificacion: "Dr. Carlos Méndez",
    totalEnvios: 1245,
    exitosos: 1230,
    fallidos: 15
  },
  {
    id: "2",
    codigo: "NOTIF-DISP-001",
    nombre: "Dispensación Registrada",
    descripcion: "Notificación cuando se registra la dispensación de una receta en farmacia",
    tipoDestinatario: "ambos",
    canalPrincipal: "Interna",
    canales: ["Interna", "Correo"],
    categoria: "Dispensación",
    activa: true,
    prioridad: "media",
    ultimaModificacion: "2024-10-04 10:15",
    usuarioModificacion: "Adm. Sistema",
    totalEnvios: 892,
    exitosos: 890,
    fallidos: 2
  },
  {
    id: "3",
    codigo: "NOTIF-STOCK-001",
    nombre: "Alerta de Stock Bajo",
    descripcion: "Notificación crítica cuando un medicamento alcanza el nivel mínimo de stock",
    tipoDestinatario: "interno",
    canalPrincipal: "Interna",
    canales: ["Interna", "Correo", "WhatsApp"],
    categoria: "Inventario",
    activa: true,
    prioridad: "alta",
    ultimaModificacion: "2024-10-03 16:45",
    usuarioModificacion: "Lic. Ana Torres",
    totalEnvios: 156,
    exitosos: 156,
    fallidos: 0
  },
  {
    id: "4",
    codigo: "NOTIF-USER-001",
    nombre: "Bienvenida Nuevo Usuario",
    descripcion: "Mensaje de bienvenida enviado a usuarios recién registrados en el sistema",
    tipoDestinatario: "interno",
    canalPrincipal: "Correo",
    canales: ["Correo"],
    categoria: "Usuarios",
    activa: true,
    prioridad: "baja",
    ultimaModificacion: "2024-10-02 09:30",
    usuarioModificacion: "Adm. Sistema",
    totalEnvios: 43,
    exitosos: 43,
    fallidos: 0
  },
  {
    id: "5",
    codigo: "NOTIF-ALERT-001",
    nombre: "Alerta de Interacción Medicamentosa",
    descripcion: "Alerta crítica sobre posibles interacciones entre medicamentos prescritos",
    tipoDestinatario: "interno",
    canalPrincipal: "Interna",
    canales: ["Interna", "SMS"],
    categoria: "Alertas",
    activa: true,
    prioridad: "alta",
    ultimaModificacion: "2024-10-01 11:20",
    usuarioModificacion: "Dr. Luis Ramírez",
    totalEnvios: 78,
    exitosos: 75,
    fallidos: 3
  },
  {
    id: "6",
    codigo: "NOTIF-RX-002",
    nombre: "Receta por Vencer",
    descripcion: "Recordatorio enviado 72 horas antes del vencimiento de una receta",
    tipoDestinatario: "externo",
    canalPrincipal: "SMS",
    canales: ["SMS", "Correo", "WhatsApp"],
    categoria: "Prescripciones",
    activa: false,
    prioridad: "media",
    ultimaModificacion: "2024-09-28 15:10",
    usuarioModificacion: "Adm. Sistema",
    totalEnvios: 234,
    exitosos: 220,
    fallidos: 14
  },
  {
    id: "7",
    codigo: "NOTIF-SIGN-001",
    nombre: "Firma Electrónica Pendiente",
    descripcion: "Notificación al médico sobre recetas pendientes de firma electrónica",
    tipoDestinatario: "interno",
    canalPrincipal: "Interna",
    canales: ["Interna", "Correo"],
    categoria: "Firma",
    activa: true,
    prioridad: "alta",
    ultimaModificacion: "2024-10-05 08:45",
    usuarioModificacion: "Dr. Patricia Vega",
    totalEnvios: 567,
    exitosos: 567,
    fallidos: 0
  },
  {
    id: "8",
    codigo: "NOTIF-RPT-001",
    nombre: "Reporte Mensual Disponible",
    descripcion: "Notificación sobre disponibilidad de reportes estadísticos mensuales",
    tipoDestinatario: "interno",
    canalPrincipal: "Correo",
    canales: ["Correo", "Interna"],
    categoria: "Reportes",
    activa: true,
    prioridad: "baja",
    ultimaModificacion: "2024-10-01 07:00",
    usuarioModificacion: "Sistema Automático",
    totalEnvios: 12,
    exitosos: 12,
    fallidos: 0
  }
];

interface NotificacionesListPageProps {
  onNavigate?: (route: string, notificationId?: string) => void;
}

export function NotificacionesListPage({ onNavigate }: NotificacionesListPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [filterCanal, setFilterCanal] = useState<string>("todos");
  const [filterCategoria, setFilterCategoria] = useState<string>("todos");
  const [filterPrioridad, setFilterPrioridad] = useState<string>("todos");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Notification>("ultimaModificacion");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Cargar notificaciones del store al montar el componente
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = getAllNotifications();
    setNotifications(allNotifications);
  };

  // Filtrar y buscar notificaciones
  const filteredNotifications = notifications.filter((notif) => {
    const searchNormalized = normalizeSearchText(searchTerm);
    const matchesSearch =
      searchTerm === "" ||
      normalizeSearchText(notif.codigo).includes(searchNormalized) ||
      normalizeSearchText(notif.nombre).includes(searchNormalized) ||
      normalizeSearchText(notif.descripcion).includes(searchNormalized);

    const matchesEstado =
      filterEstado === "todos" ||
      normalizeSearchText(notif.estado) === normalizeSearchText(filterEstado);

    const matchesTipo =
      filterTipo === "todos" || notif.tipoDestinatario === filterTipo;

    const matchesCanal =
      filterCanal === "todos" ||
      notif.canales.some(c => normalizeSearchText(c) === normalizeSearchText(filterCanal));

    const matchesCategoria =
      filterCategoria === "todos" ||
      normalizeSearchText(notif.categoria) === normalizeSearchText(filterCategoria);

    const matchesPrioridad =
      filterPrioridad === "todos" || notif.prioridad === filterPrioridad;

    return matchesSearch && matchesEstado && matchesTipo && matchesCanal && matchesCategoria && matchesPrioridad;
  });

  // Ordenar notificaciones
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedNotifications,
    goToPage: setPage,
    changePageSize: setItemsPerPage,
    pageSize: itemsPerPage,
    goToNextPage,
    goToPreviousPage
  } = usePagination(sortedNotifications, 10);

  const handleSort = (column: keyof Notification) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(paginatedNotifications.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications([...selectedNotifications, id]);
    } else {
      setSelectedNotifications(selectedNotifications.filter((nId) => nId !== id));
    }
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (notificationToDelete) {
      const success = deleteNotification(notificationToDelete);
      if (success) {
        loadNotifications(); // Recargar desde el store
        toast.success("Notificación eliminada correctamente");
      } else {
        toast.error("No se pudo eliminar la notificación");
      }
      setDeleteDialogOpen(false);
      setNotificationToDelete(null);
    }
  };

  const handleDuplicate = (notif: Notification) => {
    const duplicated = duplicateNotification(notif.id);
    if (duplicated) {
      loadNotifications(); // Recargar desde el store
      toast.success("Notificación duplicada correctamente", {
        description: `Código: ${duplicated.codigo}`,
      });
    } else {
      toast.error("No se pudo duplicar la notificación");
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = toggleNotificationStatus(id);
    if (updated) {
      loadNotifications(); // Recargar desde el store
      toast.success(
        updated.estado === 'activa' ? "Notificación activada" : "Notificación desactivada"
      );
    } else {
      toast.error("No se pudo cambiar el estado");
    }
  };

  const handleBulkActivate = () => {
    if (selectedNotifications.length === 0) {
      toast.error("Selecciona al menos una notificación");
      return;
    }
    // Activar cada notificación seleccionada
    selectedNotifications.forEach(id => {
      const notif = notifications.find(n => n.id === id);
      if (notif && notif.estado !== 'activa') {
        toggleNotificationStatus(id);
      }
    });
    loadNotifications(); // Recargar desde el store
    toast.success(`${selectedNotifications.length} notificaciones activadas`);
    setSelectedNotifications([]);
  };

  const handleBulkDeactivate = () => {
    if (selectedNotifications.length === 0) {
      toast.error("Selecciona al menos una notificación");
      return;
    }
    // Desactivar cada notificación seleccionada
    selectedNotifications.forEach(id => {
      const notif = notifications.find(n => n.id === id);
      if (notif && notif.estado === 'activa') {
        toggleNotificationStatus(id);
      }
    });
    loadNotifications(); // Recargar desde el store
    toast.success(`${selectedNotifications.length} notificaciones desactivadas`);
    setSelectedNotifications([]);
  };

  const getChannelIcon = (channel: string) => {
    const normalized = normalizeSearchText(channel);
    if (normalized.includes("correo") || normalized.includes("email")) {
      return <Mail className="h-3.5 w-3.5" />;
    }
    if (normalized.includes("sms") || normalized.includes("whatsapp")) {
      return <MessageSquare className="h-3.5 w-3.5" />;
    }
    if (normalized.includes("push") || normalized.includes("movil")) {
      return <Smartphone className="h-3.5 w-3.5" />;
    }
    return <Bell className="h-3.5 w-3.5" />;
  };

  const getEstadoBadge = (estado: Notification['estado']) => {
    switch (estado) {
      case "activa":
        return (
          <Badge variant="default" className="gap-1 bg-success">
            <CheckCircle2 className="h-3 w-3" />
            Activa
          </Badge>
        );
      case "inactiva":
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" />
            Inactiva
          </Badge>
        );
      case "programada":
        return (
          <Badge className="gap-1 bg-blue-600 text-white">
            <Clock className="h-3 w-3" />
            Programada
          </Badge>
        );
      case "pausada":
        return (
          <Badge className="gap-1 bg-amber-600 text-white">
            <Pause className="h-3 w-3" />
            Pausada
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getPriorityBadge = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Alta
          </Badge>
        );
      case "media":
        return (
          <Badge className="gap-1 bg-warning text-warning-foreground">
            <AlertCircle className="h-3 w-3" />
            Media
          </Badge>
        );
      case "baja":
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Baja
          </Badge>
        );
      default:
        return <Badge variant="outline">{prioridad}</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterEstado("todos");
    setFilterTipo("todos");
    setFilterCanal("todos");
    setFilterCategoria("todos");
    setFilterPrioridad("todos");
  };

  const activeFiltersCount = [
    searchTerm,
    filterEstado !== "todos" ? filterEstado : null,
    filterTipo !== "todos" ? filterTipo : null,
    filterCanal !== "todos" ? filterCanal : null,
    filterCategoria !== "todos" ? filterCategoria : null,
    filterPrioridad !== "todos" ? filterPrioridad : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageBanner
        title="Administración de Notificaciones"
        description="Gestione las notificaciones automáticas del sistema con configuración multicanal"
        icon={Bell}
      />

      <div className="max-w-[1600px] mx-auto px-6 space-y-6 mt-6">
        {/* Barra de herramientas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 flex-wrap">
                {selectedNotifications.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkActivate}
                      className="gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Activar ({selectedNotifications.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDeactivate}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Desactivar ({selectedNotifications.length})
                    </Button>
                  </>
                )}
                <ExportButtons 
                  data={filteredNotifications}
                  filename="notificaciones"
                  title="Listado de Notificaciones - ePrescription"
                  columnsMap={{
                    codigo: "Código",
                    nombre: "Nombre",
                    descripcion: "Descripción",
                    tipoDestinatario: "Tipo Destinatario",
                    canalPrincipal: "Canal Principal",
                    categoria: "Categoría",
                    estado: "Estado",
                    prioridad: "Prioridad",
                    ultimaModificacion: "Última Modificación",
                    usuarioModificacion: "Usuario",
                    totalEnvios: "Total Envíos",
                    exitosos: "Exitosos",
                    fallidos: "Fallidos"
                  }}
                />
                <Button
                  onClick={() => onNavigate?.("/notificaciones/nueva")}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Notificación
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Filtros:</span>
              </div>

              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activa">Activas</SelectItem>
                  <SelectItem value="inactiva">Inactivas</SelectItem>
                  <SelectItem value="programada">Programadas</SelectItem>
                  <SelectItem value="pausada">Pausadas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCanal} onValueChange={setFilterCanal}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="correo">Correo</SelectItem>
                  <SelectItem value="interna">Interna</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="prescripciones">Prescripciones</SelectItem>
                  <SelectItem value="dispensacion">Dispensación</SelectItem>
                  <SelectItem value="inventario">Inventario</SelectItem>
                  <SelectItem value="usuarios">Usuarios</SelectItem>
                  <SelectItem value="alertas">Alertas</SelectItem>
                  <SelectItem value="firma">Firma</SelectItem>
                  <SelectItem value="reportes">Reportes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9"
                >
                  Limpiar filtros ({activeFiltersCount})
                </Button>
              )}
            </div>

            {/* Resultados */}
            <div className="mt-3 text-sm text-muted-foreground">
              Mostrando {paginatedNotifications.length} de {filteredNotifications.length} notificaciones
            </div>
          </CardContent>
        </Card>

        {/* Tabla de notificaciones */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <Checkbox
                        checked={
                          paginatedNotifications.length > 0 &&
                          selectedNotifications.length === paginatedNotifications.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-left cursor-pointer hover:bg-muted/80"
                      onClick={() => handleSort("codigo")}
                    >
                      <div className="flex items-center gap-2">
                        Código
                        {sortColumn === "codigo" && (
                          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left cursor-pointer hover:bg-muted/80"
                      onClick={() => handleSort("nombre")}
                    >
                      <div className="flex items-center gap-2">
                        Nombre de la Notificación
                        {sortColumn === "nombre" && (
                          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">Tipo Destinatario</th>
                    <th className="px-4 py-3 text-left">Canales</th>
                    <th className="px-4 py-3 text-left">Prioridad</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th
                      className="px-4 py-3 text-left cursor-pointer hover:bg-muted/80"
                      onClick={() => handleSort("ultimaModificacion")}
                    >
                      <div className="flex items-center gap-2">
                        Última Modificación
                        {sortColumn === "ultimaModificacion" && (
                          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">Estadísticas</th>
                    <th className="w-24 px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedNotifications.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No se encontraron notificaciones</p>
                        <p className="text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedNotifications.map((notif) => (
                      <tr
                        key={notif.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <Checkbox
                            checked={selectedNotifications.includes(notif.id)}
                            onCheckedChange={(checked) =>
                              handleSelectNotification(notif.id, checked as boolean)
                            }
                          />
                        </td>
                        <td className="px-4 py-4">
                          <code className="text-sm px-2 py-1 bg-muted rounded">
                            {notif.codigo}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium">{notif.nombre}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {notif.descripcion}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className="capitalize">
                            {notif.tipoDestinatario}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {notif.canales.map((canal, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="gap-1 text-xs"
                              >
                                {getChannelIcon(canal)}
                                {canal}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getPriorityBadge(notif.prioridad)}
                        </td>
                        <td className="px-4 py-4">
                          {getEstadoBadge(notif.estado)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div>{notif.ultimaModificacion}</div>
                            <div className="text-muted-foreground text-xs">
                              {notif.usuarioModificacion}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Total:</span>
                              <span>{notif.totalEnvios}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs mt-1">
                              <span className="text-success">✓ {notif.exitosos}</span>
                              {notif.fallidos > 0 && (
                                <span className="text-destructive">✗ {notif.fallidos}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  onNavigate?.(`/notificaciones/editar`, notif.id)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(notif)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleActive(notif.id)}>
                                {notif.estado === 'activa' ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(notif.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredNotifications.length > 0 && (
              <div className="border-t p-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  pageSize={itemsPerPage}
                  onPageSizeChange={setItemsPerPage}
                  totalItems={filteredNotifications.length}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar notificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La configuración de notificación será
              eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}