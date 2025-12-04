import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Printer, Download, FileStack, FileText } from "lucide-react";

interface PrintOptionsDialogProps {
  open: boolean;
  onClose: () => void;
  prescriptionCount: number;
  onPrintAll: () => void;
  onDownloadAll: () => void;
  onPrintIndividual: () => void;
  onDownloadIndividual: () => void;
}

export function PrintOptionsDialog({
  open,
  onClose,
  prescriptionCount,
  onPrintAll,
  onDownloadAll,
  onPrintIndividual,
  onDownloadIndividual,
}: PrintOptionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-blue-600" />
            Opciones de Impresión y Descarga
          </DialogTitle>
          <DialogDescription>
            Se detectaron <strong>{prescriptionCount} recetas</strong> emitidas. Seleccione cómo desea procesar las recetas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Opción 1: Imprimir todas juntas */}
          <div className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <div className="flex items-start gap-3">
              <FileStack className="w-10 h-10 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Imprimir Todas Juntas</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Genera un único documento PDF con todas las recetas, con saltos de página entre cada una.
                  Ideal para enviar a una impresora física o guardar un archivo consolidado.
                </p>
                <div className="flex gap-2">
                  <Button onClick={onPrintAll} className="flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Imprimir Todas ({prescriptionCount} recetas)
                  </Button>
                  <Button onClick={onDownloadAll} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar Todas (PDF único)
                  </Button>
                </div>
                <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                  ✓ Cada receta en su propia página (emula boletas físicas)
                </div>
              </div>
            </div>
          </div>

          {/* Opción 2: Imprimir una por una */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <FileText className="w-10 h-10 text-gray-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Imprimir Una por Una</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Abre ventanas separadas para cada receta. Le permite revisar e imprimir/guardar cada receta individualmente.
                  Útil cuando necesita control granular sobre cada documento.
                </p>
                <div className="flex gap-2">
                  <Button onClick={onPrintIndividual} variant="outline" className="flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Imprimir Separadas
                  </Button>
                  <Button onClick={onDownloadIndividual} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar Separadas
                  </Button>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                    ℹ️ Se abrirán {prescriptionCount} ventanas, una por cada receta
                  </div>
                  <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                    ⚠️ Si no se abren todas las ventanas, permita ventanas emergentes en su navegador
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
