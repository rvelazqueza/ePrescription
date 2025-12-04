import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { PageBanner } from "../components/PageBanner";
import { toast } from "sonner@2.0.3";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  User,
  Users,
  Clock,
  FileText,
  Settings,
  Save,
  X,
  Play,
  Upload,
  Eye,
  AlertCircle,
  CheckCircle2,
  Zap,
  Globe,
  Code,
  History,
  Copy
} from "lucide-react";

export function NotificacionesConfigPage() {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    // Sección 1: Datos Generales
    codigo: "",
    nombre: "",
    descripcion: "",
    tipoDestinatario: "interno",
    categoria: "usuarios",
    activa: true,

    // Sección 2: Canales de Envío
    canales: {
      correo: true,
      notificacionInterna: true,
      sms: false,
      whatsapp: false,
      push: false
    },
    asunto: "",
    remitente: "sistema@eprescription.com",
    prioridad: "media",
    plantillaMensaje: "",

    // Sección 3: Condiciones y Disparadores
    eventoTrigger: "manual",
    condicionesAdicionales: "",
    momentoEnvio: "inmediato",
    reintentos: "3",

    // Sección 4: Destinatarios
    origenDestinatario: "usuario_interno",
    listaDestinatarios: "",
    copiasCC: "",
    copiasBCC: "",

    // Sección 5: Personalización
    adjuntosPermitidos: "",
    idioma: "es",

    // Sección 6: Auditoría
    ultimaModificacion: new Date().toISOString(),
    resultadoUltimoEnvio: "Sin envíos registrados"
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCanalChange = (canal: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      canales: { ...prev.canales, [canal]: checked }
    }));
  };

  const handleSave = () => {
    toast.success("Configuración guardada exitosamente", {
      description: `Notificación "${formData.nombre}" actualizada`,
      duration: 3000
    });
  };

  const handleTest = () => {
    const canalesActivos = Object.entries(formData.canales)
      .filter(([_, activo]) => activo)
      .map(([canal]) => canal);

    if (canalesActivos.length === 0) {
      toast.error("Selecciona al menos un canal de envío");
      return;
    }

    toast.info("Enviando notificación de prueba...", {
      description: `Canales: ${canalesActivos.join(", ")}`,
      duration: 3000
    });
  };

  const handleCancel = () => {
    toast.info("Cambios descartados");
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <PageBanner
        icon={Bell}
        title="Parametrización de Notificaciones"
        subtitle="Configuración de canales y plantillas de notificaciones del sistema"
        gradientFrom="from-indigo-600"
        gradientVia="via-purple-500"
        gradientTo="to-indigo-700"
      />

      {/* Banner informativo */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Bell className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-indigo-900 mb-2">Sistema de notificaciones multicanal</h4>
              <div className="text-sm text-indigo-800 space-y-2">
                <p>
                  Configura notificaciones automáticas del sistema con soporte para múltiples canales: correo electrónico, SMS, WhatsApp, push notifications y notificaciones internas.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Personalización de plantillas con variables dinámicas</li>
                  <li>Configuración de disparadores y condiciones de envío</li>
                  <li>Gestión de destinatarios por rol o usuario específico</li>
                  <li>Trazabilidad completa de envíos</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de configuración */}
      <div className="space-y-6">
        {/* Sección 1: Datos Generales */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <CardTitle>Datos Generales</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código / ID</Label>
                <Input
                  id="codigo"
                  placeholder="Ej: NOTIF-001"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange("codigo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre o título de notificación</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Nueva prescripción emitida"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el propósito de esta notificación..."
                rows={3}
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tipoDestinatario">Tipo de destinatario</Label>
                <Select
                  value={formData.tipoDestinatario}
                  onValueChange={(value) => handleInputChange("tipoDestinatario", value)}
                >
                  <SelectTrigger id="tipoDestinatario">
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
                  onValueChange={(value) => handleInputChange("categoria", value)}
                >
                  <SelectTrigger id="categoria">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuarios">Usuarios</SelectItem>
                    <SelectItem value="prescripciones">Prescripciones</SelectItem>
                    <SelectItem value="dispensacion">Dispensación</SelectItem>
                    <SelectItem value="inventario">Inventario</SelectItem>
                    <SelectItem value="alertas">Alertas</SelectItem>
                    <SelectItem value="reportes">Reportes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activa">Estado</Label>
                <div className="flex items-center space-x-3 h-10">
                  <Switch
                    id="activa"
                    checked={formData.activa}
                    onCheckedChange={(checked) => handleInputChange("activa", checked)}
                  />
                  <Label htmlFor="activa" className="cursor-pointer">
                    {formData.activa ? (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Activa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                        Inactiva
                      </Badge>
                    )}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 2: Canales de Envío */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-indigo-600" />
              <CardTitle>Canales de Envío</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Canales habilitados</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="canal-correo"
                    checked={formData.canales.correo}
                    onCheckedChange={(checked) => handleCanalChange("correo", checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <Label htmlFor="canal-correo" className="cursor-pointer">Correo</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="canal-interna"
                    checked={formData.canales.notificacionInterna}
                    onCheckedChange={(checked) => handleCanalChange("notificacionInterna", checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <Label htmlFor="canal-interna" className="cursor-pointer">Interna</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="canal-sms"
                    checked={formData.canales.sms}
                    onCheckedChange={(checked) => handleCanalChange("sms", checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <Label htmlFor="canal-sms" className="cursor-pointer">SMS</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="canal-whatsapp"
                    checked={formData.canales.whatsapp}
                    onCheckedChange={(checked) => handleCanalChange("whatsapp", checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <Label htmlFor="canal-whatsapp" className="cursor-pointer">WhatsApp</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="canal-push"
                    checked={formData.canales.push}
                    onCheckedChange={(checked) => handleCanalChange("push", checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <Label htmlFor="canal-push" className="cursor-pointer">Push</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  placeholder="Asunto de la notificación"
                  value={formData.asunto}
                  onChange={(e) => handleInputChange("asunto", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remitente">Remitente</Label>
                <Input
                  id="remitente"
                  placeholder="correo@eprescription.com"
                  value={formData.remitente}
                  onChange={(e) => handleInputChange("remitente", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select
                  value={formData.prioridad}
                  onValueChange={(value) => handleInputChange("prioridad", value)}
                >
                  <SelectTrigger id="prioridad">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span>Alta</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="media">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                        <span>Media</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="baja">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-3 h-3 text-blue-600" />
                        <span>Baja</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="plantillaMensaje">Plantilla de mensaje</Label>
                <Button variant="ghost" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver plantillas
                </Button>
              </div>
              <Textarea
                id="plantillaMensaje"
                placeholder="Escribe el contenido de la plantilla aquí. Usa {{variable}} para campos dinámicos."
                rows={5}
                value={formData.plantillaMensaje}
                onChange={(e) => handleInputChange("plantillaMensaje", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sección 3: Condiciones y Disparadores */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <CardTitle>Condiciones y Disparadores</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eventoTrigger">Evento / Trigger</Label>
                <Select
                  value={formData.eventoTrigger}
                  onValueChange={(value) => handleInputChange("eventoTrigger", value)}
                >
                  <SelectTrigger id="eventoTrigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="prescripcion_creada">Prescripción creada</SelectItem>
                    <SelectItem value="prescripcion_firmada">Prescripción firmada</SelectItem>
                    <SelectItem value="dispensacion_registrada">Dispensación registrada</SelectItem>
                    <SelectItem value="alerta_generada">Alerta generada</SelectItem>
                    <SelectItem value="stock_bajo">Stock bajo</SelectItem>
                    <SelectItem value="usuario_creado">Usuario creado</SelectItem>
                    <SelectItem value="sesion_iniciada">Sesión iniciada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="momentoEnvio">Momento de envío</Label>
                <Select
                  value={formData.momentoEnvio}
                  onValueChange={(value) => handleInputChange("momentoEnvio", value)}
                >
                  <SelectTrigger id="momentoEnvio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inmediato">Inmediato</SelectItem>
                    <SelectItem value="programado">Programado</SelectItem>
                    <SelectItem value="1h_antes">1 hora antes</SelectItem>
                    <SelectItem value="24h_antes">24 horas antes</SelectItem>
                    <SelectItem value="48h_antes">48 horas antes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="condicionesAdicionales">Condiciones adicionales (JSON)</Label>
                <Input
                  id="condicionesAdicionales"
                  placeholder='{"campo": "valor", "operador": "=="}'
                  value={formData.condicionesAdicionales}
                  onChange={(e) => handleInputChange("condicionesAdicionales", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reintentos">Reintentos automáticos</Label>
                <Input
                  id="reintentos"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="3"
                  value={formData.reintentos}
                  onChange={(e) => handleInputChange("reintentos", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 4: Destinatarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <CardTitle>Destinatarios</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="origenDestinatario">Origen del destinatario</Label>
                <Select
                  value={formData.origenDestinatario}
                  onValueChange={(value) => handleInputChange("origenDestinatario", value)}
                >
                  <SelectTrigger id="origenDestinatario">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario_interno">Usuario interno</SelectItem>
                    <SelectItem value="rol">Rol</SelectItem>
                    <SelectItem value="paciente">Paciente</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="farmaceutico">Farmacéutico</SelectItem>
                    <SelectItem value="correo_especifico">Correo específico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listaDestinatarios">Lista de destinatarios</Label>
                <Input
                  id="listaDestinatarios"
                  placeholder="Separados por comas"
                  value={formData.listaDestinatarios}
                  onChange={(e) => handleInputChange("listaDestinatarios", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="copiasCC">Copias CC</Label>
                <Input
                  id="copiasCC"
                  placeholder="correos@example.com, separados por comas"
                  value={formData.copiasCC}
                  onChange={(e) => handleInputChange("copiasCC", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copiasBCC">Copias BCC</Label>
                <Input
                  id="copiasBCC"
                  placeholder="correos@example.com, separados por comas"
                  value={formData.copiasBCC}
                  onChange={(e) => handleInputChange("copiasBCC", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 5: Personalización del Contenido */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-indigo-600" />
              <CardTitle>Personalización del Contenido</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Variables dinámicas disponibles</Label>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{nombre_paciente}}"}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{nombre_medico}}"}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{fecha}}"}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{hora}}"}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{numero_receta}}"}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{medicamento}}"}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{link_sistema}}"}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-3 h-3 text-indigo-600" />
                    <code className="text-indigo-600">{"{{usuario}}"}</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adjuntos">Adjuntos permitidos</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="adjuntos"
                    placeholder="Ninguno"
                    value={formData.adjuntosPermitidos}
                    onChange={(e) => handleInputChange("adjuntosPermitidos", e.target.value)}
                    readOnly
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idioma">Idioma / versión</Label>
                <Select
                  value={formData.idioma}
                  onValueChange={(value) => handleInputChange("idioma", value)}
                >
                  <SelectTrigger id="idioma">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3 h-3" />
                        <span>Español</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3 h-3" />
                        <span>English</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pt">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3 h-3" />
                        <span>Português</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 6: Auditoría y Control */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-600" />
              <CardTitle>Auditoría y Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Última modificación</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {new Date(formData.ultimaModificacion).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resultado último envío</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {formData.resultadoUltimoEnvio}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Historial de envíos</Label>
              <Button variant="outline" className="w-full md:w-auto">
                <Eye className="w-4 h-4 mr-2" />
                Ver historial completo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Acciones finales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <AlertCircle className="w-4 h-4" />
                <span>Recuerda probar la configuración antes de activarla</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar / Volver
                </Button>

                <Button
                  variant="outline"
                  onClick={handleTest}
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Probar envío
                </Button>

                <Button
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar configuración
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
