import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import {
  PackageCheck,
  Building2,
  Calendar,
  DollarSign,
  AlertTriangle,
  Info,
  Calculator,
  Truck,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Package,
  Loader2
} from "lucide-react";

interface StockAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  presentation: string;
  currentStock: number;
  minStock: number;
  status: string;
  priority: string;
  daysWithoutStock: number;
  affectedPrescriptions: number;
  estimatedDemand: number;
  suggestedOrder: number;
  lastRestockDate: string;
  supplier: string;
  location: string;
  category: string;
}

interface NewInventoryOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: StockAlert | null;
  onOrderCreated?: (order: any) => void;
  onStockUpdated?: (medicineId: string, quantity: number) => void;
}

export function NewInventoryOrderDialog({
  open,
  onOpenChange,
  alert,
  onOrderCreated,
  onStockUpdated
}: NewInventoryOrderDialogProps) {
  // Estados del formulario
  const [orderQuantity, setOrderQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "emergency">("normal");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [purchaseJustification, setPurchaseJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Catálogo de proveedores
  const suppliers = [
    "Distribuidora MedPharma",
    "Farmacéutica Nacional S.A.",
    "Laboratorios Andinos",
    "Droguería La Salud",
    "Comercial Farmacéutica Internacional",
    "Otro (Especificar en notas)"
  ];

  // Inicializar valores cuando se abre el diálogo
  useState(() => {
    if (alert && open) {
      setOrderQuantity(alert.suggestedOrder.toString());
      setSupplier(alert.supplier || "");
      
      // Generar justificación automática
      let justification = "";
      if (alert.priority === "critical") {
        justification = `URGENTE: Medicamento agotado. ${alert.affectedPrescriptions} recetas afectadas. Demanda estimada: ${alert.estimatedDemand} unidades/día.`;
      } else if (alert.priority === "high") {
        justification = `Stock crítico (${alert.currentStock} unidades). Por debajo del mínimo requerido (${alert.minStock} unidades). Demanda estimada: ${alert.estimatedDemand} unidades/día.`;
      } else {
        justification = `Reposición preventiva. Stock actual: ${alert.currentStock} unidades. Stock mínimo: ${alert.minStock} unidades.`;
      }
      setPurchaseJustification(justification);
      
      // Establecer urgencia basada en prioridad
      if (alert.priority === "critical") {
        setUrgency("emergency");
      } else if (alert.priority === "high") {
        setUrgency("urgent");
      } else {
        setUrgency("normal");
      }
    }
  });

  const resetForm = () => {
    setOrderQuantity("");
    setSupplier("");
    setEstimatedCost("");
    setUrgency("normal");
    setDeliveryDate("");
    setContactPerson("");
    setContactPhone("");
    setContactEmail("");
    setNotes("");
    setPurchaseJustification("");
    setIsSubmitting(false);
  };

  const validateForm = () => {
    if (!orderQuantity || parseFloat(orderQuantity) <= 0) {
      toast.error("Error de validación", {
        description: "La cantidad a ordenar debe ser mayor a 0"
      });
      return false;
    }

    if (!supplier) {
      toast.error("Error de validación", {
        description: "Debe seleccionar un proveedor"
      });
      return false;
    }

    if (estimatedCost && parseFloat(estimatedCost) < 0) {
      toast.error("Error de validación", {
        description: "El costo estimado no puede ser negativo"
      });
      return false;
    }

    if (!deliveryDate) {
      toast.error("Error de validación", {
        description: "Debe especificar una fecha estimada de entrega"
      });
      return false;
    }

    // Validar que la fecha de entrega sea futura
    const selectedDate = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error("Error de validación", {
        description: "La fecha de entrega debe ser igual o posterior a hoy"
      });
      return false;
    }

    return true;
  };

  const calculateTotalCost = () => {
    if (orderQuantity && estimatedCost) {
      return (parseFloat(orderQuantity) * parseFloat(estimatedCost)).toFixed(2);
    }
    return "0.00";
  };

  const handleSubmit = async () => {
    if (!alert) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simular procesamiento asíncrono (en producción, aquí iría la llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generar ID único para la orden
      const orderId = `ORD-${Date.now()}`;
      const currentDate = new Date().toLocaleDateString('es-ES');

      // Crear orden de compra
      const newOrder = {
        id: orderId,
        medicineId: alert.medicineId,
        medicineName: alert.medicineName,
        presentation: alert.presentation,
        category: alert.category,
        quantity: parseFloat(orderQuantity),
        supplier,
        estimatedUnitCost: estimatedCost ? parseFloat(estimatedCost) : 0,
        estimatedTotalCost: estimatedCost ? parseFloat(calculateTotalCost()) : 0,
        urgency,
        deliveryDate,
        contactPerson,
        contactPhone,
        contactEmail,
        notes,
        purchaseJustification,
        alertId: alert.id,
        currentStock: alert.currentStock,
        minStock: alert.minStock,
        affectedPrescriptions: alert.affectedPrescriptions,
        status: "pending", // pending, approved, ordered, received, cancelled
        createdDate: currentDate,
        createdBy: "Usuario actual", // En producción vendría del contexto de sesión
        approvalStatus: urgency === "emergency" ? "auto-approved" : "pending-approval",
        location: alert.location
      };

      console.log("Nueva orden de inventario:", newOrder);

      // Mostrar mensaje de éxito con detalles
      const urgencyLabels = {
        normal: "Normal",
        urgent: "Urgente",
        emergency: "Emergencia"
      };

      toast.success("¡Orden de compra generada exitosamente!", {
        description: (
          <div className="space-y-1">
            <p>Orden: {orderId}</p>
            <p>{orderQuantity} unidades de {alert.medicineName}</p>
            <p>Urgencia: {urgencyLabels[urgency]}</p>
            {urgency === "emergency" && <p className="text-red-600 font-semibold">⚡ Auto-aprobada por emergencia</p>}
          </div>
        ),
        duration: 5000,
      });

      // Callback para actualizar la lista de órdenes si se proporciona
      if (onOrderCreated) {
        onOrderCreated(newOrder);
      }

      // Callback para actualizar el stock si se proporciona
      if (onStockUpdated) {
        onStockUpdated(alert.medicineId, parseFloat(orderQuantity));
      }

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al generar orden de compra:", error);
      toast.error("Error al generar la orden", {
        description: "Ocurrió un problema al procesar la orden de compra. Por favor, intente nuevamente.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return; // Prevenir cancelación durante el proceso
    resetForm();
    onOpenChange(false);
  };

  if (!alert) return null;

  const urgencyConfig = {
    normal: {
      label: "Normal",
      description: "Entrega estándar (15-30 días)",
      className: "bg-blue-100 text-blue-700 border-blue-300"
    },
    urgent: {
      label: "Urgente",
      description: "Entrega prioritaria (5-10 días)",
      className: "bg-orange-100 text-orange-700 border-orange-300"
    },
    emergency: {
      label: "Emergencia",
      description: "Entrega inmediata (1-3 días) - Auto-aprobación",
      className: "bg-red-100 text-red-700 border-red-300"
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Prevenir cerrar el diálogo durante el proceso de envío
      if (isSubmitting) return;
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-primary" />
            Nueva Orden de Compra
          </DialogTitle>
          <DialogDescription>
            Generar orden de compra para reposición de stock. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del medicamento */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="w-4 h-4" />
                Información del medicamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Medicamento</Label>
                  <p className="font-semibold text-blue-900">{alert.medicineName}</p>
                  <p className="text-sm text-blue-700">{alert.presentation}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Categoría</Label>
                  <p className="mt-1">{alert.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Stock actual</Label>
                  <p className={`text-xl font-semibold ${
                    alert.currentStock === 0 ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {alert.currentStock}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Stock mínimo</Label>
                  <p className="text-xl font-semibold text-blue-600">{alert.minStock}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Demanda/día</Label>
                  <p className="text-xl font-semibold">{alert.estimatedDemand}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Ubicación</Label>
                  <p className="text-xl font-semibold font-mono">{alert.location}</p>
                </div>
              </div>

              {alert.affectedPrescriptions > 0 && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-800">
                      <span className="font-semibold">{alert.affectedPrescriptions} recetas pendientes</span> afectadas por falta de stock
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detalles de la orden */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detalles de la orden
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad a ordenar *</Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    placeholder="Ej: 1000"
                    className="pr-20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    unidades
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Sugerido: {alert.suggestedOrder} unidades
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Nivel de urgencia *</Label>
                <Select value={urgency} onValueChange={(v) => setUrgency(v as any)}>
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">
                      <div className="flex items-center gap-2">
                        <span>Normal</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <span>Urgente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="emergency">
                      <div className="flex items-center gap-2">
                        <span>Emergencia</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="outline" className={urgencyConfig[urgency].className}>
                  {urgencyConfig[urgency].description}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor *</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Seleccione un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup} value={sup}>
                      {sup}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitCost">Costo unitario estimado</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="unitCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Costo total estimado</Label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={`$${calculateTotalCost()}`}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Fecha estimada de entrega *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto del proveedor */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Contacto del proveedor
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Persona de contacto</Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Teléfono</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ej: +57 310 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Ej: ventas@proveedor.com"
                />
              </div>
            </div>
          </div>

          {/* Justificación */}
          <div className="space-y-2">
            <Label htmlFor="justification">Justificación de la compra</Label>
            <Textarea
              id="justification"
              value={purchaseJustification}
              onChange={(e) => setPurchaseJustification(e.target.value)}
              rows={3}
              className="resize-none"
              placeholder="Explique la necesidad de esta compra..."
            />
            <p className="text-xs text-gray-600">
              Esta información será incluida en la orden de compra para aprobación
            </p>
          </div>

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
              placeholder="Información adicional, instrucciones especiales, etc."
            />
          </div>

          {/* Resumen de la orden */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Resumen de la orden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Medicamento:</p>
                  <p className="font-semibold">{alert.medicineName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Cantidad:</p>
                  <p className="font-semibold">{orderQuantity || "0"} unidades</p>
                </div>
                <div>
                  <p className="text-gray-600">Proveedor:</p>
                  <p className="font-semibold">{supplier || "No seleccionado"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Costo total estimado:</p>
                  <p className="font-semibold text-green-700">${calculateTotalCost()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Nivel de urgencia:</p>
                  <Badge variant="outline" className={urgencyConfig[urgency].className}>
                    {urgencyConfig[urgency].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600">Entrega estimada:</p>
                  <p className="font-semibold">{deliveryDate || "No especificada"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando orden...
              </>
            ) : (
              <>
                <PackageCheck className="w-4 h-4 mr-2" />
                Generar orden de compra
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}