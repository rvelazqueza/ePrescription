import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Package, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Pill,
  Calendar,
  Hash,
  FileText,
  Box,
  ShieldAlert
} from "lucide-react";
import { PrescribedMedicine, DispensationRecord } from "./DispensationTable";
import { toast } from "sonner@2.0.3";

interface DispensationPanelProps {
  medicine: PrescribedMedicine | null;
  currentRecord: DispensationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicineId: string, record: DispensationRecord) => void;
}

// Motivos de rechazo estandarizados
const rejectionReasons = [
  { value: "stock_out", label: "Medicamento fuera de stock" },
  { value: "discontinued", label: "Medicamento descontinuado" },
  { value: "unavailable_presentation", label: "Presentación no disponible" },
  { value: "quarantine", label: "Lote en cuarentena" },
  { value: "patient_rejection", label: "Paciente rechaza el medicamento" },
  { value: "requires_refrigeration", label: "Requiere refrigeración no disponible" },
  { value: "other", label: "Otro motivo (especificar en observaciones)" }
];

export function DispensationPanel({
  medicine,
  currentRecord,
  isOpen,
  onClose,
  onSave
}: DispensationPanelProps) {
  const [dispensationStatus, setDispensationStatus] = useState<DispensationRecord["status"]>("pending");
  const [dispensedQuantity, setDispensedQuantity] = useState<string>("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [dispensationNotes, setDispensationNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [availableStock, setAvailableStock] = useState<number>(100); // Mock stock

  // Reiniciar formulario cuando cambia el medicamento
  useEffect(() => {
    if (medicine && currentRecord) {
      setDispensationStatus(currentRecord.status);
      setDispensedQuantity(currentRecord.dispensedQuantity > 0 ? currentRecord.dispensedQuantity.toString() : "");
      setBatchNumber(currentRecord.batchNumber || "");
      setExpirationDate(currentRecord.expirationDate || "");
      setDispensationNotes(currentRecord.dispensationNotes || "");
      setRejectionReason(currentRecord.rejectionReason || "");
      setAvailableStock(currentRecord.availableStock || 100);
    } else if (medicine) {
      // Nuevo registro de dispensación
      setDispensationStatus("pending");
      setDispensedQuantity("");
      setBatchNumber("");
      setExpirationDate("");
      setDispensationNotes("");
      setRejectionReason("");
      setAvailableStock(100); // Mock: consultar inventario real
    }
  }, [medicine, currentRecord]);

  const handleSave = () => {
    if (!medicine) return;

    // Validaciones
    if (dispensationStatus === "fully_dispensed" || dispensationStatus === "partially_dispensed") {
      if (!dispensedQuantity || parseInt(dispensedQuantity) <= 0) {
        toast.error("Error de validación", {
          description: "Debe ingresar una cantidad dispensada válida"
        });
        return;
      }

      if (!batchNumber.trim()) {
        toast.error("Error de validación", {
          description: "El número de lote es obligatorio para registrar dispensación"
        });
        return;
      }

      if (!expirationDate) {
        toast.error("Error de validación", {
          description: "La fecha de vencimiento es obligatoria"
        });
        return;
      }

      // Validar fecha de vencimiento no esté en el pasado
      const expDate = new Date(expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expDate < today) {
        toast.error("Error de validación", {
          description: "La fecha de vencimiento no puede estar en el pasado"
        });
        return;
      }

      // Validar que no se dispense más de lo prescrito
      const prescribedNum = parseInt(medicine.prescribedQuantity.split(' ')[0]);
      const dispensedNum = parseInt(dispensedQuantity);
      
      if (dispensedNum > prescribedNum) {
        toast.error("Error de validación", {
          description: `No puede dispensar más de lo prescrito (${prescribedNum} ${medicine.prescribedQuantity.split(' ')[1]})`
        });
        return;
      }
    }

    if (dispensationStatus === "not_available" || dispensationStatus === "rejected") {
      if (!rejectionReason) {
        toast.error("Error de validación", {
          description: "Debe seleccionar un motivo de rechazo o no disponibilidad"
        });
        return;
      }
    }

    // Determinar estado automáticamente según cantidad
    let finalStatus = dispensationStatus;
    if (dispensationStatus === "fully_dispensed" || dispensationStatus === "partially_dispensed") {
      const prescribedNum = parseInt(medicine.prescribedQuantity.split(' ')[0]);
      const dispensedNum = parseInt(dispensedQuantity);
      
      if (dispensedNum >= prescribedNum) {
        finalStatus = "fully_dispensed";
      } else {
        finalStatus = "partially_dispensed";
      }
    }

    const record: DispensationRecord = {
      medicineId: medicine.id,
      dispensedQuantity: parseInt(dispensedQuantity) || 0,
      dispensedQuantityUnit: medicine.prescribedQuantity.split(' ')[1] || 'unidades',
      status: finalStatus,
      batchNumber: batchNumber.trim() || undefined,
      expirationDate: expirationDate || undefined,
      dispensationNotes: dispensationNotes.trim() || undefined,
      rejectionReason: rejectionReason || undefined,
      availableStock
    };

    onSave(medicine.id, record);
    
    const statusLabels = {
      fully_dispensed: "completamente dispensado",
      partially_dispensed: "parcialmente dispensado",
      not_available: "marcado como no disponible",
      rejected: "rechazado",
      pending: "actualizado"
    };

    toast.success("Dispensación registrada", {
      description: `${medicine.name} fue ${statusLabels[finalStatus]} correctamente`
    });

    onClose();
  };

  if (!medicine) return null;

  const prescribedNum = parseInt(medicine.prescribedQuantity.split(' ')[0]);
  const prescribedUnit = medicine.prescribedQuantity.split(' ')[1] || 'unidades';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <SheetTitle>Registrar Dispensación</SheetTitle>
              <p className="text-sm text-gray-600 mt-1">
                Complete la información de dispensación farmacéutica
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Información del medicamento prescrito (solo lectura) */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicamento Prescrito
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-blue-700 font-medium">Nombre:</p>
                <p className="text-blue-900">{medicine.name}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Cantidad prescrita:</p>
                <p className="text-blue-900 font-semibold">{medicine.prescribedQuantity}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Dosis:</p>
                <p className="text-blue-900">{medicine.dose}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Frecuencia:</p>
                <p className="text-blue-900">{medicine.frequency}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Vía:</p>
                <p className="text-blue-900">{medicine.administration}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Duración:</p>
                <p className="text-blue-900">{medicine.duration}</p>
              </div>
            </div>
            {medicine.observations && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-blue-700 font-medium text-sm">Observaciones del prescriptor:</p>
                <p className="text-blue-900 text-sm mt-1">{medicine.observations}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Estado de dispensación */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gray-600" />
              Estado de Dispensación *
            </Label>
            <Select value={dispensationStatus} onValueChange={(value: any) => setDispensationStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fully_dispensed">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Dispensar completamente</span>
                  </div>
                </SelectItem>
                <SelectItem value="partially_dispensed">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span>Dispensación parcial</span>
                  </div>
                </SelectItem>
                <SelectItem value="not_available">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>No disponible</span>
                  </div>
                </SelectItem>
                <SelectItem value="rejected">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-gray-600" />
                    <span>Rechazado (otro motivo)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campos de dispensación (solo si se dispensa) */}
          {(dispensationStatus === "fully_dispensed" || dispensationStatus === "partially_dispensed") && (
            <>
              <Alert className="bg-blue-50 border-blue-200">
                <Box className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  <strong>Stock disponible:</strong> {availableStock} {prescribedUnit} en inventario
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    Cantidad a Dispensar *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max={prescribedNum}
                      value={dispensedQuantity}
                      onChange={(e) => setDispensedQuantity(e.target.value)}
                      placeholder="0"
                      className="flex-1"
                    />
                    <Input
                      value={prescribedUnit}
                      disabled
                      className="w-24 bg-gray-100"
                    />
                  </div>
                  {dispensedQuantity && parseInt(dispensedQuantity) < prescribedNum && (
                    <p className="text-xs text-orange-600">
                      ⚠️ Dispensación parcial: {dispensedQuantity} de {prescribedNum} {prescribedUnit}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-600" />
                    Número de Lote *
                  </Label>
                  <Input
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="Ej: LOT-2025-A123"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  Fecha de Vencimiento *
                </Label>
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </>
          )}

          {/* Motivo de rechazo (solo si no se dispensa) */}
          {(dispensationStatus === "not_available" || dispensationStatus === "rejected") && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                Motivo de No Dispensación *
              </Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {rejectionReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Observaciones del farmacéutico */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              Observaciones del Farmacéutico
              {(dispensationStatus === "not_available" || dispensationStatus === "rejected") && (
                <span className="text-red-600">*</span>
              )}
            </Label>
            <Textarea
              value={dispensationNotes}
              onChange={(e) => setDispensationNotes(e.target.value)}
              placeholder="Ingrese observaciones relevantes sobre la dispensación..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Registre cualquier información relevante sobre la dispensación, recomendaciones al paciente, o detalles del proceso.
            </p>
          </div>

          {/* Alertas de seguridad */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Importante:</strong> La prescripción original NO puede ser modificada. 
              Este registro documenta la dispensación realizada por la farmacia.
            </AlertDescription>
          </Alert>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Registrar Dispensación
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
