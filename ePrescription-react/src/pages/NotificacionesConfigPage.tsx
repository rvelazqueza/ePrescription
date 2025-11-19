import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { PageBanner } from "../components/PageBanner";
import { MultiEmailInput } from "../components/MultiEmailInput";
import { toast } from "sonner@2.0.3";
import { getNotificationById, addNotification, updateNotification } from "../utils/notificationsStore";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  FileText,
  Upload,
  Clock,
  Users,
  Settings,
  History,
  CheckCircle2,
  XCircle,
  TestTube2,
  Save,
  X,
  AlertCircle
} from "lucide-react";

interface NotificacionesConfigPageProps {
  notificationId?: string;
  onBack?: () => void;
}

export function NotificacionesConfigPage({ notificationId, onBack }: NotificacionesConfigPageProps) {
  const isEditing = !!notificationId;
  
  // Estados del formulario - VALORES POR DEFECTO para nueva notificación
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    tipoDestinatario: "interno" as "interno" | "externo" | "ambos",
    categoria: "Prescripciones",
    estado: "activa" as "activa" | "inactiva" | "programada" | "pausada",
    prioridad: "media" as "alta" | "media" | "baja",
    asunto: "",
    cuerpoMensaje: "",
    usuarioModificacion: "Administrador Sistema"
  });
  
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["Correo", "Interna"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cargar datos si es modo edición
  useEffect(() => {
    if (isEditing && notificationId) {
      const notification = getNotificationById(notificationId);
      if (notification) {
        setFormData({
          codigo: notification.codigo,
          nombre: notification.nombre,
          descripcion: notification.descripcion,
          tipoDestinatario: notification.tipoDestinatario,
          categoria: notification.categoria,
          estado: notification.estado,
          prioridad: notification.prioridad,
          asunto: notification.asunto || "",
          cuerpoMensaje: notification.cuerpoMensaje || "",
          usuarioModificacion: notification.usuarioModificacion
        });
        setSelectedChannels(notification.canales || ["Correo", "Interna"]);
      }
    } else {
      // Modo nueva: limpiar todo y poner valores por defecto
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        tipoDestinatario: "interno",
        categoria: "Prescripciones",
        estado: "activa",
        prioridad: "media",
        asunto: "",
        cuerpoMensaje: "",
        usuarioModificacion: "Administrador Sistema"
      });
      setSelectedChannels(["Correo", "Interna"]);
      setSelectedFile(null);
    }
  }, [isEditing, notificationId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success(`Archivo "${e.target.files[0].name}" cargado`);
    }
  };

  const handleSave = () => {
    // Validaciones
    if (!formData.codigo.trim()) {
      toast.error("Código requerido", {
        description: "Debe ingresar un código para la notificación"
      });
      return;
    }

    if (!formData.nombre.trim()) {
      toast.error("Nombre requerido", {
        description: "Debe ingresar un nombre para la notificación"
      });
      return;
    }

    if (selectedChannels.length === 0) {
      toast.error("Canal requerido", {
        description: "Debe seleccionar al menos un canal de envío"
      });
      return;
    }

    try {
      if (isEditing && notificationId) {
        // Actualizar notificación existente
        updateNotification(notificationId, {
          codigo: formData.codigo.toUpperCase(),
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipoDestinatario: formData.tipoDestinatario,
          categoria: formData.categoria,
          estado: formData.estado,
          prioridad: formData.prioridad,
          canales: selectedChannels,
          canalPrincipal: selectedChannels[0],
          asunto: formData.asunto,
          cuerpoMensaje: formData.cuerpoMensaje,
          usuarioModificacion: formData.usuarioModificacion
        });
        
        toast.success("Notificación actualizada", {
          description: `${formData.nombre} ha sido actualizada exitosamente`
        });
      } else {
        // Crear nueva notificación
        const newNotification = addNotification({
          codigo: formData.codigo.toUpperCase(),
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipoDestinatario: formData.tipoDestinatario,
          categoria: formData.categoria,
          estado: formData.estado,
          prioridad: formData.prioridad,
          canales: selectedChannels,
          canalPrincipal: selectedChannels[0],
          asunto: formData.asunto,
          cuerpoMensaje: formData.cuerpoMensaje,
          usuarioModificacion: formData.usuarioModificacion,
          ultimaModificacion: new Date().toISOString()
        });
        
        toast.success("Notificación creada", {
          description: `${formData.nombre} ha sido agregada al sistema`
        });
        
        // Limpiar formulario después de crear
        setFormData({
          codigo: "",
          nombre: "",
          descripcion: "",
          tipoDestinatario: "interno",
          categoria: "Prescripciones",
          estado: "activa",
          prioridad: "media",
          asunto: "",
          cuerpoMensaje: "",
          usuarioModificacion: "Administrador Sistema"
        });
        setSelectedChannels(["Correo", "Interna"]);
        setSelectedFile(null);
      }

      // Navegar de vuelta después de 1 segundo
      if (onBack) {
        setTimeout(() => onBack(), 1000);
      }
    } catch (error) {
      toast.error("Error al guardar", {
        description: "No se pudo guardar la notificación"
      });
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleTest = () => {
    toast.info("Enviando notificación de prueba...");
    setTimeout(() => {
      toast.success("Notificación de prueba enviada correctamente");
    }, 1500);
  };

  const availableVariables = [
    "{nombre_usuario}",
    "{email}",
    "{fecha_actual}",
    "{hora_actual}",
    "{nombre_sistema}",
    "{url_acceso}",
    "{codigo_verificacion}",
    "{nombre_medico}",
    "{numero_receta}"
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageBanner
        title={isEditing ? "Editar Notificación" : "Nueva Notificación"}
        description="Configure y administre las notificaciones automáticas del sistema"
        icon={Bell}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-6 mt-6">
        {/* Sección 1: Datos Generales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Datos Generales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código / ID <span className="text-red-500">*</span></Label>
                <Input
                  id="codigo"
                  placeholder="Ej: NOTIF-001"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value.toUpperCase())}
                />
                <p className="text-xs text-muted-foreground">
                  Código único de identificación
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre o título de notificación <span className="text-red-500">*</span></Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Confirmación de receta emitida"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción detallada de la notificación..."
                rows={3}
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="destinatario">Tipo de destinatario</Label>
                <Select 
                  value={formData.tipoDestinatario} 
                  onValueChange={(value) => handleInputChange('tipoDestinatario', value)}
                >
                  <SelectTrigger id="destinatario">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interno">Interno</SelectItem>
                    <SelectItem value="externo">Externo</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría o módulo</Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => handleInputChange('categoria', value)}
                >
                  <SelectTrigger id="categoria">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Usuarios">Usuarios</SelectItem>
                    <SelectItem value="Prescripciones">Prescripciones</SelectItem>
                    <SelectItem value="Dispensación">Dispensación</SelectItem>
                    <SelectItem value="Inventario">Inventario</SelectItem>
                    <SelectItem value="Reportes">Reportes</SelectItem>
                    <SelectItem value="Seguridad">Seguridad</SelectItem>
                    <SelectItem value="Sistema">Sistema</SelectItem>
                    <SelectItem value="Alertas">Alertas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(value) => handleInputChange('estado', value)}
                >
                  <SelectTrigger id="estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Activa</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactiva">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-gray-400" />
                        <span>Inactiva</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="programada">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Programada</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pausada">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span>Pausada</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 2: Canales de Envío */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Canales de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Canales habilitados <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-email"
                    checked={selectedChannels.includes("Correo")}
                    onCheckedChange={() => handleChannelToggle("Correo")}
                  />
                  <label
                    htmlFor="channel-email"
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    Correo
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-internal"
                    checked={selectedChannels.includes("Interna")}
                    onCheckedChange={() => handleChannelToggle("Interna")}
                  />
                  <label
                    htmlFor="channel-internal"
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Bell className="h-4 w-4 text-primary" />
                    Interna
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-sms"
                    checked={selectedChannels.includes("SMS")}
                    onCheckedChange={() => handleChannelToggle("SMS")}
                  />
                  <label
                    htmlFor="channel-sms"
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-primary" />
                    SMS
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-whatsapp"
                    checked={selectedChannels.includes("WhatsApp")}
                    onCheckedChange={() => handleChannelToggle("WhatsApp")}
                  />
                  <label
                    htmlFor="channel-whatsapp"
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-success" />
                    WhatsApp
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channel-push"
                    checked={selectedChannels.includes("Push")}
                    onCheckedChange={() => handleChannelToggle("Push")}
                  />
                  <label
                    htmlFor="channel-push"
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="h-4 w-4 text-primary" />
                    Push
                  </label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Debe seleccionar al menos un canal de envío
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  placeholder="Asunto de la notificación"
                  value={formData.asunto}
                  onChange={(e) => handleInputChange('asunto', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select 
                  value={formData.prioridad} 
                  onValueChange={(value) => handleInputChange('prioridad', value)}
                >
                  <SelectTrigger id="prioridad">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">
                      <span className="flex items-center gap-2">
                        <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                        Alta
                      </span>
                    </SelectItem>
                    <SelectItem value="media">
                      <span className="flex items-center gap-2">
                        <Badge className="h-2 w-2 rounded-full p-0 bg-warning" />
                        Media
                      </span>
                    </SelectItem>
                    <SelectItem value="baja">
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                        Baja
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="cuerpoMensaje">Cuerpo del mensaje</Label>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <Textarea
                id="cuerpoMensaje"
                placeholder="Contenido del mensaje..."
                rows={5}
                value={formData.cuerpoMensaje}
                onChange={(e) => handleInputChange('cuerpoMensaje', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sección 3: Personalización del Contenido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Personalización del Contenido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Variables dinámicas disponibles</Label>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex flex-wrap gap-2">
                  {availableVariables.map((variable) => (
                    <Badge
                      key={variable}
                      variant="secondary"
                      className="font-mono cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(variable);
                        toast.success(`Variable ${variable} copiada`);
                      }}
                    >
                      {variable}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Haga clic en una variable para copiarla al portapapeles
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="adjuntos">Adjuntos permitidos</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full md:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Seleccionar archivo
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (máx. 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-3 justify-end pt-4 pb-8">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            {onBack ? "Cancelar" : "Volver"}
          </Button>

          <Button variant="outline" onClick={handleTest}>
            <TestTube2 className="h-4 w-4 mr-2" />
            Probar envío
          </Button>

          <Button onClick={handleSave} className="bg-primary">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Actualizar configuración" : "Guardar configuración"}
          </Button>
        </div>
      </div>
    </div>
  );
}
