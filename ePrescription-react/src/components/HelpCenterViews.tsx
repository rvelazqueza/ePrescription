import { useState, useRef, useEffect } from "react";
import {
  Heart,
  History,
  MessageSquare,
  ArrowLeft,
  FileText,
  HelpCircle,
  ChevronRight,
  Trash2,
  Send,
  Mail,
  Phone,
  Bot,
  User,
  SendHorizontal,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { helpStore, type FavoriteItem, type RecentItem } from "../utils/helpStore";
import { messagesStore } from "../utils/messagesStore";

// ============================================
// FAVORITES VIEW
// ============================================
export function FavoritesView({
  items,
  onSelectArticle,
  onSelectFAQ,
  onBack,
  onRemove
}: {
  items: FavoriteItem[];
  onSelectArticle: (id: string) => void;
  onSelectFAQ: (id: string) => void;
  onBack: () => void;
  onRemove: () => void;
}) {
  const handleRemove = async (id: string, type: "faq" | "article") => {
    await helpStore.removeFavorite(id, type);
    toast.success("Eliminado de favoritos");
    onRemove();
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-pink-600 text-white p-2 rounded-lg">
                <Heart className="w-5 h-5" />
              </div>
              Mis Favoritos
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Artículos y FAQs que has marcado como favoritos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="font-medium mb-2">No tienes favoritos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Marca artículos y FAQs como favoritos para acceder rápidamente
            </p>
            <Button onClick={onBack} variant="outline">
              Explorar contenido
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="border border-border rounded-lg p-4 hover:border-pink-300 hover:bg-pink-50 transition-all group relative"
              >
                <div className="flex items-start gap-3">
                  <div
                    onClick={() =>
                      item.type === "article"
                        ? onSelectArticle(item.id)
                        : onSelectFAQ(item.id)
                    }
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`p-2 rounded-full ${
                          item.type === "article"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {item.type === "article" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <HelpCircle className="w-4 h-4" />
                        )}
                      </div>
                      <h4 className="font-medium group-hover:text-pink-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-10">
                      <Badge variant="outline" className="text-xs">
                        {helpStore
                          .getCategories()
                          .find((c) => c.value === item.category)?.label}
                      </Badge>
                      <span>
                        Agregado: {new Date(item.addedAt).toLocaleDateString("es-CR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id, item.type)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        item.type === "article"
                          ? onSelectArticle(item.id)
                          : onSelectFAQ(item.id)
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// RECENTS VIEW
// ============================================
export function RecentsView({
  items,
  onSelectArticle,
  onSelectFAQ,
  onBack,
  onClear
}: {
  items: RecentItem[];
  onSelectArticle: (id: string) => void;
  onSelectFAQ: (id: string) => void;
  onBack: () => void;
  onClear: () => void;
}) {
  const handleClear = () => {
    helpStore.clearRecents();
    toast.success("Historial borrado");
    onClear();
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <History className="w-5 h-5" />
                </div>
                Recientes
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Artículos y FAQs que has visitado recientemente
              </CardDescription>
            </div>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Borrar historial
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="font-medium mb-2">Sin historial</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Los artículos que visites aparecerán aquí
            </p>
            <Button onClick={onBack} variant="outline">
              Explorar contenido
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() =>
                  item.type === "article"
                    ? onSelectArticle(item.id)
                    : onSelectFAQ(item.id)
                }
                className="border border-border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      item.type === "article"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {item.type === "article" ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <HelpCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {helpStore
                          .getCategories()
                          .find((c) => c.value === item.category)?.label}
                      </Badge>
                      <span>
                        Visto: {new Date(item.viewedAt).toLocaleString("es-CR")}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// CONTACT SUPPORT VIEW - CON CHATBOT Y WHATSAPP
// ============================================

interface ChatMessage {
  id: string;
  role: "user" | "bot" | "agent";
  content: string;
  timestamp: Date;
  options?: string[];
}

export function ContactSupportView({ onBack }: { onBack: () => void }) {
  // Estados del formulario tradicional
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"normal" | "high">("normal");
  const [loading, setLoading] = useState(false);

  // Estados del chatbot
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      content: "👋 Hola, soy el Asistente Virtual de ePrescription. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
      options: [
        "Problemas técnicos",
        "Cómo usar una función",
        "Consulta sobre recetas",
        "Problema con impresión/PDF",
        "Hablar con un agente"
      ]
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatState, setChatState] = useState<"bot" | "escalated">("bot");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll al final del chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatMessages]);

  // Base de conocimiento del bot
  const botKnowledgeBase: Record<string, { response: string; options?: string[] }> = {
    "problemas tecnicos": {
      response: "Entiendo que tienes un problema técnico. ¿Podrías ser más específico?\n\n• ¿El sistema no carga?\n• ¿Hay un error específico?\n• ¿No puedes acceder a alguna función?",
      options: ["El sistema no carga", "Veo un mensaje de error", "No puedo acceder a una función", "Otro problema"]
    },
    "como usar una funcion": {
      response: "¿Qué función necesitas aprender a usar?\n\n• Crear y emitir recetas\n• Gestionar pacientes\n• Exportar a PDF/Excel\n• Firmar recetas digitalmente\n• Consultar inventario",
      options: ["Crear recetas", "Gestionar pacientes", "Exportar documentos", "Firmar digitalmente", "Ver tutoriales completos"]
    },
    "consulta sobre recetas": {
      response: "¿Qué necesitas saber sobre las recetas?\n\n• Cómo crear una receta nueva\n• Editar o duplicar recetas\n• Buscar recetas emitidas\n• Imprimir o exportar recetas\n• Firmar recetas electrónicamente",
      options: ["Crear nueva receta", "Editar receta existente", "Buscar recetas", "Imprimir/Exportar", "Firmar receta"]
    },
    "problema con impresion": {
      response: "Para problemas con impresión o generación de PDF:\n\n1. Verifica que tengas una impresora configurada\n2. Asegúrate de tener permisos de exportación\n3. Intenta con otro navegador (Chrome o Edge recomendados)\n4. Revisa que el bloqueador de ventanas emergentes esté desactivado\n\n¿El problema persiste?",
      options: ["Sí, sigue el problema", "Ya se solucionó", "Necesito más ayuda", "Hablar con un agente"]
    },
    "sistema no carga": {
      response: "Si el sistema no carga correctamente:\n\n1. Limpia caché y cookies del navegador\n2. Intenta en modo incógnito\n3. Verifica tu conexión a internet\n4. Prueba con otro navegador\n5. Reinicia tu dispositivo\n\n¿Alguno de estos pasos funcionó?",
      options: ["Sí, ya funciona", "No, sigue sin cargar", "Hablar con un agente"]
    },
    "mensaje de error": {
      response: "Para ayudarte mejor con el error:\n\n1. ¿Podrías copiar el mensaje de error exacto?\n2. ¿En qué pantalla o función ocurre?\n3. ¿Qué estabas haciendo cuando apareció?\n\nEsto me ayudará a darte una solución más precisa.",
      options: ["Enviar captura de pantalla", "Describir el error", "Hablar con un agente"]
    },
    "crear recetas": {
      response: "Para crear una receta nueva:\n\n1. Ve a Prescripciones → Nueva receta\n2. Selecciona o busca el paciente\n3. Añade medicamentos haciendo doble clic en la tabla\n4. Configura dosis, frecuencia y duración\n5. Guarda como borrador o emite directamente\n\n¿Necesitas ayuda con algún paso específico?",
      options: ["Buscar paciente", "Agregar medicamentos", "Configurar dosis", "Emitir receta", "Ver video tutorial"]
    }
  };

  const getBotResponse = (userMessage: string): { response: string; options?: string[] } => {
    const normalizedMessage = userMessage.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Búsqueda por palabras clave
    for (const [key, value] of Object.entries(botKnowledgeBase)) {
      if (normalizedMessage.includes(key.replace(/ /g, "")) || 
          normalizedMessage.includes(key)) {
        return value;
      }
    }

    // Respuestas específicas a opciones comunes
    if (normalizedMessage.includes("hablar con un agente") || 
        normalizedMessage.includes("hablar con agente") ||
        normalizedMessage.includes("agente real")) {
      return {
        response: "Perfecto, te conectaré con un agente humano. Un miembro de nuestro equipo de soporte te atenderá en breve.\n\nMientras tanto, puedes compartir más detalles de tu consulta.",
        options: []
      };
    }

    if (normalizedMessage.includes("video") || normalizedMessage.includes("tutorial")) {
      return {
        response: "Tenemos tutoriales en video disponibles:\n\n• Introducción a ePrescription\n• Crear tu primera receta\n• Gestión de pacientes\n• Firmas digitales\n• Reportes y estadísticas\n\nPuedes acceder a todos desde el menú principal → Vídeos tutoriales",
        options: ["Ver videos ahora", "Necesito ayuda específica", "Hablar con un agente"]
      };
    }

    // Respuesta por defecto
    return {
      response: "Gracias por tu mensaje. Permíteme ayudarte mejor:\n\n¿Tu consulta es sobre...?",
      options: [
        "Problemas técnicos",
        "Cómo usar una función",
        "Consulta sobre recetas",
        "Problema con impresión/PDF",
        "Hablar con un agente"
      ]
    };
  };

  const handleChatSubmit = async (optionText?: string) => {
    const messageText = optionText || userInput.trim();
    if (!messageText) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput("");

    // Verificar si solicita agente
    const normalizedMessage = messageText.toLowerCase();
    if (normalizedMessage.includes("hablar con un agente") || 
        normalizedMessage.includes("agente real")) {
      setChatState("escalated");
    }

    // Simular typing
    setIsChatTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Obtener respuesta del bot
    const { response, options } = getBotResponse(messageText);

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: chatState === "escalated" ? "agent" : "bot",
      content: response,
      timestamp: new Date(),
      options: options
    };

    setChatMessages(prev => [...prev, botMessage]);
    setIsChatTyping(false);
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: "welcome-reset",
        role: "bot",
        content: "👋 Chat reiniciado. ¿En qué puedo ayudarte?",
        timestamp: new Date(),
        options: [
          "Problemas técnicos",
          "Cómo usar una función",
          "Consulta sobre recetas",
          "Problema con impresión/PDF",
          "Hablar con un agente"
        ]
      }
    ]);
    setChatState("bot");
  };

  const handleWhatsAppContact = () => {
    const message = "Hola, necesito soporte con ePrescription";
    const whatsappUrl = `https://wa.me/50622223333?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("WhatsApp abierto", {
      description: "Ahora puedes chatear directamente con soporte",
      icon: "✅"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      await messagesStore.sendSupportMessage({
        fromUserId: "user-001",
        fromUserName: "Usuario del sistema",
        subject,
        message,
        priority
      });

      toast.success("Mensaje enviado al equipo de soporte", {
        description: "Te responderemos en las próximas 24 horas"
      });

      setSubject("");
      setMessage("");
      setPriority("normal");

      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      toast.error("Error al enviar mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-emerald-600 text-white p-2 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              Contactar al equipo de soporte
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Chatea con nuestro asistente virtual o contacta directamente con soporte
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chatbot" className="gap-2">
              <Bot className="w-4 h-4" />
              Asistente Virtual
            </TabsTrigger>
            <TabsTrigger value="form" className="gap-2">
              <Send className="w-4 h-4" />
              Enviar mensaje
            </TabsTrigger>
            <TabsTrigger value="direct" className="gap-2">
              <Phone className="w-4 h-4" />
              Contacto directo
            </TabsTrigger>
          </TabsList>

          {/* TAB: CHATBOT */}
          <TabsContent value="chatbot" className="space-y-4 mt-4">
            <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900">
                <strong>Asistente Virtual IA</strong> - Obtén respuestas instantáneas o conecta con un agente real si lo necesitas
              </AlertDescription>
            </Alert>

            {/* Chat Area */}
            <div className="border border-border rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-white">
              <ScrollArea className="h-[450px] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.role === "user" 
                          ? "bg-blue-600" 
                          : msg.role === "agent"
                          ? "bg-emerald-600"
                          : "bg-purple-600"
                      }`}>
                        {msg.role === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : msg.role === "agent" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                        <div className={`rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : msg.role === "agent"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                            : "bg-white border border-border text-foreground"
                        }`}>
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        </div>

                        {/* Options */}
                        {msg.options && msg.options.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.options.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleChatSubmit(option)}
                                className="text-xs h-auto py-1.5 px-3 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}

                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isChatTyping && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-border rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t border-border p-3 bg-white">
                <div className="flex gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                    placeholder={chatState === "escalated" ? "Un agente te responderá pronto..." : "Escribe tu consulta aquí..."}
                    className="flex-1"
                    disabled={isChatTyping}
                  />
                  <Button
                    onClick={() => handleChatSubmit()}
                    disabled={!userInput.trim() || isChatTyping}
                    size="icon"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleResetChat}
                    variant="outline"
                    size="icon"
                    title="Reiniciar chat"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </Button>
                </div>
                {chatState === "escalated" && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Conectado con un agente. Te responderá en breve.</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB: FORMULARIO */}
          <TabsContent value="form" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as "normal" | "high")}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta (respuesta prioritaria)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej: Problema al exportar recetas a PDF"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe tu consulta o problema con el mayor detalle posible..."
                  rows={8}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Incluye detalles como: pasos para reproducir el problema, número de receta (si aplica), mensajes de error, etc.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando mensaje...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar al equipo de soporte
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB: CONTACTO DIRECTO */}
          <TabsContent value="direct" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* WhatsApp */}
              <Card className="border-success/30 bg-gradient-to-r from-success/5 to-emerald-50 hover:shadow-md transition-shadow cursor-pointer" onClick={handleWhatsAppContact}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-success p-3 rounded-full">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1 text-success">WhatsApp - Soporte Instantáneo</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chatea directamente con nuestro equipo por WhatsApp
                      </p>
                      <Button className="bg-success hover:bg-success/90 gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Abrir WhatsApp (+506 2222-3333)
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Disponible: Lun-Vie 7:00 AM - 8:00 PM | Sáb 8:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teléfono */}
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1 text-blue-900">Teléfono - Atención Personalizada</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Llámanos para soporte técnico inmediato
                      </p>
                      <a href="tel:+50622223333">
                        <Button variant="outline" className="border-blue-300 hover:bg-blue-100 gap-2">
                          <Phone className="w-4 h-4" />
                          Llamar al +506 2222-3333
                        </Button>
                      </a>
                      <p className="text-xs text-muted-foreground mt-2">
                        Lunes a Viernes: 8:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-600 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1 text-purple-900">Email - Consultas Detalladas</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Envía consultas complejas con capturas y archivos
                      </p>
                      <a href="mailto:soporte@eprescription.cr?subject=Solicitud de soporte - ePrescription">
                        <Button variant="outline" className="border-purple-300 hover:bg-purple-100 gap-2">
                          <Mail className="w-4 h-4" />
                          soporte@eprescription.cr
                        </Button>
                      </a>
                      <p className="text-xs text-muted-foreground mt-2">
                        Respuesta en menos de 24 horas hábiles
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Horarios de atención */}
              <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  <strong>Horarios de atención:</strong>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Lunes a Viernes: 8:00 AM - 6:00 PM</li>
                    <li>• Sábados: 8:00 AM - 4:00 PM (solo WhatsApp y teléfono)</li>
                    <li>• Domingos y feriados: Email únicamente</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
