import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Copy,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Send,
  History,
  UserCircle,
  Home,
  Building2,
  Globe,
  Shield
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PatientContactInfo {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface ContactPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientContactInfo;
}

interface ContactRecord {
  id: string;
  date: string;
  time: string;
  type: "call" | "email" | "sms" | "in-person";
  reason: string;
  notes: string;
  status: "completed" | "pending" | "failed";
  createdBy: string;
}

export function ContactPatientDialog({
  open,
  onOpenChange,
  patient,
}: ContactPatientDialogProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [contactType, setContactType] = useState<"call" | "email" | "sms" | "in-person">("call");
  const [contactReason, setContactReason] = useState("");
  const [contactNotes, setContactNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data de historial de contactos
  const [contactHistory, setContactHistory] = useState<ContactRecord[]>([
    {
      id: "1",
      date: "27/09/2025",
      time: "10:30 AM",
      type: "call",
      reason: "Recordatorio de cita médica",
      notes: "Paciente confirmó asistencia para control de diabetes el 30/09/2025",
      status: "completed",
      createdBy: "Dr. Carlos Mendoza"
    },
    {
      id: "2",
      date: "20/09/2025",
      time: "03:15 PM",
      type: "email",
      reason: "Envío de resultados de laboratorio",
      notes: "Enviados resultados de HbA1c. Paciente notificada.",
      status: "completed",
      createdBy: "Dra. Ana Martínez"
    },
    {
      id: "3",
      date: "15/09/2025",
      time: "09:00 AM",
      type: "in-person",
      reason: "Consulta de seguimiento",
      notes: "Control de presión arterial y ajuste de medicación.",
      status: "completed",
      createdBy: "Dr. Carlos Mendoza"
    },
    {
      id: "4",
      date: "10/09/2025",
      time: "11:45 AM",
      type: "sms",
      reason: "Recordatorio de medicación",
      notes: "Enviado recordatorio para tomar Levotiroxina en ayunas",
      status: "completed",
      createdBy: "Sistema Automático"
    }
  ]);

  const handleCall = () => {
    toast.success("Iniciando llamada", {
      description: `Llamando a ${patient.fullName} al ${patient.phone}`,
      duration: 3000,
    });
  };

  const handleEmail = () => {
    // Simular apertura de cliente de correo
    window.location.href = `mailto:${patient.email}`;
    toast.success("Abriendo cliente de correo", {
      description: `Enviando email a ${patient.email}`,
      duration: 3000,
    });
  };

  const handleSMS = () => {
    toast.success("Preparando SMS", {
      description: `SMS para ${patient.phone}`,
      duration: 3000,
    });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(patient.phone);
    toast.success("Teléfono copiado", {
      description: patient.phone,
      duration: 2000,
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(patient.email);
    toast.success("Email copiado", {
      description: patient.email,
      duration: 2000,
    });
  };

  const handleCopyAddress = () => {
    const fullAddress = `${patient.address}, ${patient.city}, ${patient.country}`;
    navigator.clipboard.writeText(fullAddress);
    toast.success("Dirección copiada", {
      description: fullAddress,
      duration: 2000,
    });
  };

  const handleCallEmergency = () => {
    if (patient.emergencyContact) {
      toast.success("Llamando a contacto de emergencia", {
        description: `${patient.emergencyContact.name} (${patient.emergencyContact.relationship}) al ${patient.emergencyContact.phone}`,
        duration: 3000,
      });
    }
  };

  const handleSubmitContact = async () => {
    if (!contactReason.trim()) {
      toast.error("Motivo requerido", {
        description: "Por favor ingrese el motivo del contacto",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    // Simular registro de contacto
    setTimeout(() => {
      const newContact: ContactRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        type: contactType,
        reason: contactReason,
        notes: contactNotes,
        status: "completed",
        createdBy: "Dr. Carlos Alberto Mendoza Herrera"
      };

      setContactHistory([newContact, ...contactHistory]);
      
      toast.success("Contacto registrado", {
        description: `Registro de ${getContactTypeLabel(contactType)} guardado exitosamente`,
        duration: 3000,
      });

      // Limpiar formulario
      setContactReason("");
      setContactNotes("");
      setContactType("call");
      setIsSubmitting(false);
      setActiveTab("history");
    }, 1000);
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case "call": return "Llamada";
      case "email": return "Email";
      case "sms": return "SMS";
      case "in-person": return "Presencial";
      default: return type;
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "sms": return <MessageSquare className="w-4 h-4" />;
      case "in-person": return <UserCircle className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case "call": return "bg-blue-100 text-blue-800 border-blue-300";
      case "email": return "bg-purple-100 text-purple-800 border-purple-300";
      case "sms": return "bg-green-100 text-green-800 border-green-300";
      case "in-person": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "pending": return <Clock className="w-4 h-4 text-orange-600" />;
      case "failed": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Gestión de Contacto del Paciente
          </DialogTitle>
          <DialogDescription>
            Información de contacto, comunicaciones y registro de interacciones
          </DialogDescription>
        </DialogHeader>

        {/* Header del paciente */}
        <Card className="border-l-4 border-l-primary bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{patient.fullName}</h3>
                <p className="text-sm text-gray-600">ID: {patient.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Información
            </TabsTrigger>
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              Contacto Rápido
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Registrar
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historial ({contactHistory.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Información de Contacto */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Datos de Contacto Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Teléfono
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={patient.phone}
                        readOnly
                        className="bg-gray-50"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyPhone}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={patient.email}
                        readOnly
                        className="bg-gray-50"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyEmail}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Dirección Completa
                  </Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={patient.address}
                        readOnly
                        className="bg-gray-50"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyAddress}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{patient.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{patient.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto de Emergencia */}
            {patient.emergencyContact && (
              <Card className="border-red-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <Shield className="w-5 h-5" />
                    Contacto de Emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-red-900">{patient.emergencyContact.name}</p>
                        <p className="text-sm text-red-700">{patient.emergencyContact.relationship}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        Contacto de emergencia
                      </Badge>
                    </div>
                    <Separator className="bg-red-200" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-red-700" />
                        <span className="text-sm font-medium text-red-900">
                          {patient.emergencyContact.phone}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(patient.emergencyContact.phone);
                            toast.success("Teléfono de emergencia copiado");
                          }}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleCallEmergency}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Llamar
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 italic">
                    ⚠️ Usar solo en caso de emergencia médica o cuando no sea posible contactar al paciente directamente
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Contacto Rápido */}
          <TabsContent value="quick" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Acciones de Contacto Rápido</CardTitle>
                <DialogDescription>
                  Inicie comunicación directa con el paciente
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleCall}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">Llamar al paciente</p>
                    <p className="text-xs opacity-90">{patient.phone}</p>
                  </div>
                </Button>

                <Button
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full justify-start border-purple-300 hover:bg-purple-50"
                >
                  <Mail className="w-5 h-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold">Enviar email</p>
                    <p className="text-xs text-gray-600">{patient.email}</p>
                  </div>
                </Button>

                <Button
                  onClick={handleSMS}
                  variant="outline"
                  className="w-full justify-start border-green-300 hover:bg-green-50"
                >
                  <MessageSquare className="w-5 h-5 mr-3 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold">Enviar SMS</p>
                    <p className="text-xs text-gray-600">{patient.phone}</p>
                  </div>
                </Button>

                <Button
                  onClick={() => {
                    const fullAddress = `${patient.address}, ${patient.city}, ${patient.country}`;
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`, '_blank');
                    toast.success("Abriendo ubicación", {
                      description: "Mostrando dirección en Google Maps",
                    });
                  }}
                  variant="outline"
                  className="w-full justify-start border-orange-300 hover:bg-orange-50"
                >
                  <MapPin className="w-5 h-5 mr-3 text-orange-600" />
                  <div className="text-left">
                    <p className="font-semibold">Ver ubicación</p>
                    <p className="text-xs text-gray-600">{patient.address}</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Recordatorio importante</p>
                    <p>
                      Todas las comunicaciones con pacientes deben registrarse en el historial
                      para mantener la trazabilidad y cumplir con normativas de protección de datos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Registrar Contacto */}
          <TabsContent value="register" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Nueva Comunicación</CardTitle>
                <DialogDescription>
                  Complete el formulario para documentar la interacción con el paciente
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-type">Tipo de contacto *</Label>
                  <Select value={contactType} onValueChange={(value: any) => setContactType(value)}>
                    <SelectTrigger id="contact-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Llamada telefónica
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Correo electrónico
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Mensaje SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="in-person">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4" />
                          Presencial
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-reason">Motivo del contacto *</Label>
                  <Input
                    id="contact-reason"
                    placeholder="Ej: Recordatorio de cita, consulta telefónica, seguimiento..."
                    value={contactReason}
                    onChange={(e) => setContactReason(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-notes">Notas y observaciones</Label>
                  <Textarea
                    id="contact-notes"
                    placeholder="Describa los detalles de la comunicación, temas tratados, acuerdos realizados..."
                    value={contactNotes}
                    onChange={(e) => setContactNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmitContact}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Registrar Contacto
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setContactReason("");
                      setContactNotes("");
                      setContactType("call");
                    }}
                    disabled={isSubmitting}
                  >
                    Limpiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Historial */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Historial de Comunicaciones
                </CardTitle>
                <DialogDescription>
                  Registro completo de todas las interacciones con el paciente
                </DialogDescription>
              </CardHeader>
              <CardContent>
                {contactHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No hay registros de contacto</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactHistory.map((contact) => (
                      <Card key={contact.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`${getContactTypeColor(contact.type)} border`}>
                                {getContactTypeIcon(contact.type)}
                                <span className="ml-1">{getContactTypeLabel(contact.type)}</span>
                              </Badge>
                              {getStatusIcon(contact.status)}
                            </div>
                            <div className="text-xs text-gray-600 text-right">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {contact.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {contact.time}
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{contact.reason}</h4>
                          {contact.notes && (
                            <p className="text-sm text-gray-700 mb-2">{contact.notes}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>Registrado por: {contact.createdBy}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}