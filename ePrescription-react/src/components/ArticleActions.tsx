import { useState } from "react";
import { Download, Printer, Share2, Heart, Copy, Check, MessageCircle, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { helpStore } from "../utils/helpStore";

interface ArticleActionsProps {
  article: {
    id: string;
    title: string;
    summary: string;
    content: string;
  };
  type: "article" | "faq";
  isFavorite: boolean;
  onFavoriteChange: () => void;
}

export function ArticleActions({ article, type, isFavorite, onFavoriteChange }: ArticleActionsProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handlePrint = () => {
    window.print();
    toast.success("Listo para imprimir", {
      description: "Se abrió el diálogo de impresión"
    });
  };

  const handleExportPDF = () => {
    // En producción, usar librería de PDF
    const blob = new Blob([article.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Artículo exportado", {
      description: "El archivo se ha descargado correctamente"
    });
  };

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await helpStore.removeFavorite(article.id, type);
      toast.success("Eliminado de favoritos");
    } else {
      await helpStore.addFavorite(article.id, type);
      toast.success("Agregado a favoritos", {
        description: "Ahora puedes acceder rápidamente desde la sección Favoritos"
      });
    }
    onFavoriteChange();
  };

  const shareViaWhatsApp = () => {
    const text = `*${article.title}*\n\n${article.summary}\n\nMás información en: https://help.eprescription.cr/articles/${article.id}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    toast.success("WhatsApp abierto", {
      description: "Ya puedes compartir el artículo con tus contactos",
      icon: "✅"
    });
    setShowShareDialog(false);
  };

  const shareViaEmail = () => {
    const subject = `ePrescription - ${article.title}`;
    const body = `${article.summary}\n\nPuedes leer el artículo completo en:\nhttps://help.eprescription.cr/articles/${article.id}\n\n---\nePrescription - Sistema Hospitalario de Recetas Electrónicas`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    toast.success("Cliente de correo abierto", {
      description: "El email está listo para enviar",
      icon: "✅"
    });
    setShowShareDialog(false);
  };

  // Función robusta para copiar texto con fallback
  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Método 1: Clipboard API (moderno, requiere HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("Clipboard API falló, usando fallback:", err);
      }
    }

    // Método 2: Fallback usando textarea temporal (funciona siempre)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        return true;
      }
    } catch (err) {
      console.error("Fallback de copia también falló:", err);
    }

    return false;
  };

  const copyWhatsAppText = async () => {
    const text = `*${article.title}*\n\n${article.summary}\n\nMás información en: https://help.eprescription.cr/articles/${article.id}`;
    
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2000);
      toast.success("Texto copiado para WhatsApp");
    } else {
      toast.error("No se pudo copiar el texto", {
        description: "Por favor, copia manualmente el texto"
      });
    }
  };

  const copyEmailText = async () => {
    const text = `${article.title}\n\n${article.summary}\n\nPuedes leer el artículo completo en:\nhttps://help.eprescription.cr/articles/${article.id}`;
    
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      toast.success("Texto copiado para Email");
    } else {
      toast.error("No se pudo copiar el texto", {
        description: "Por favor, copia manualmente el texto"
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleFavorite}
          className={isFavorite ? "border-pink-300 bg-pink-50 text-pink-700" : ""}
        >
          <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-pink-500" : ""}`} />
          {isFavorite ? "En favoritos" : "Agregar a favoritos"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        
        {/* Dropdown de compartir con acciones directas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={shareViaWhatsApp} className="cursor-pointer">
              <MessageCircle className="w-4 h-4 mr-2 text-success" />
              <div className="flex flex-col">
                <span className="font-medium">Enviar por WhatsApp</span>
                <span className="text-xs text-muted-foreground">Abre WhatsApp con el texto</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareViaEmail} className="cursor-pointer">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              <div className="flex flex-col">
                <span className="font-medium">Enviar por Email</span>
                <span className="text-xs text-muted-foreground">Abre tu cliente de correo</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowShareDialog(true)} className="cursor-pointer">
              <Copy className="w-4 h-4 mr-2" />
              <span>Copiar texto para compartir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de compartir - Opción alternativa para copiar texto */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Copiar texto para compartir
            </DialogTitle>
            <DialogDescription>
              Copia el texto formateado para compartir manualmente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Acciones rápidas */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={shareViaWhatsApp} 
                className="h-auto py-4 bg-success hover:bg-success/90 flex-col gap-2"
              >
                <MessageCircle className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Abrir WhatsApp</div>
                  <div className="text-xs opacity-90">Compartir directamente</div>
                </div>
              </Button>
              
              <Button 
                onClick={shareViaEmail} 
                className="h-auto py-4 bg-blue-600 hover:bg-blue-700 flex-col gap-2"
              >
                <Mail className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Abrir Email</div>
                  <div className="text-xs opacity-90">Enviar por correo</div>
                </div>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O copiar manualmente
                </span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="border border-success/30 rounded-lg p-4 bg-success/5">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-success" />
                  Para WhatsApp
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyWhatsAppText}
                  className="gap-2"
                >
                  {copiedWhatsApp ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-white border border-border rounded p-3 text-sm">
                <div className="font-medium mb-1">*{article.title}*</div>
                <div className="text-muted-foreground line-clamp-2">{article.summary}</div>
                <div className="text-xs text-blue-600 mt-2">
                  https://help.eprescription.cr/articles/{article.id}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Para Email
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEmailText}
                  className="gap-2"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-white border border-border rounded p-3 text-sm">
                <div className="font-medium mb-1">{article.title}</div>
                <div className="text-muted-foreground line-clamp-2">{article.summary}</div>
                <div className="text-xs text-blue-600 mt-2">
                  https://help.eprescription.cr/articles/{article.id}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
