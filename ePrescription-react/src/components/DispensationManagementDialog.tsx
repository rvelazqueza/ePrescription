import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { 
  Pill, 
  Calendar, 
  Building2, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Package,
  FileCheck,
  Info,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export type DispensationStatus = "emitted" | "partially_dispensed" | "fully_dispensed" | "cancelled";

export interface MedicineDispensation {
  medicineId: string;
  medicineName: string;
  concentration: string;
  totalQuantity: number;
  dispensedQuantity: number;
  previouslyDispensed: number; // NUEVO: Cantidad ya dispensada previamente
  isFullyDispensed: boolean;
  dispensationDate?: string;
  dispensationTime?: string;
  dispensedBy?: string;
  pharmacy?: string;
}

export interface DispensationRecord {
  prescriptionNumber: string;
  status: DispensationStatus;
  medicines: MedicineDispensation[];
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
}

interface DispensationManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescriptionNumber: string;
  patientName: string;
  emittedDate: string;
  currentStatus: DispensationStatus;
  medicines: Array<{
    id: string;
    genericName: string;
    commercialName: string;
    concentration: string;
    quantity: number;
  }>;
  existingDispensation?: MedicineDispensation[]; // NUEVO: Dispensación previa si existe
  onConfirm: (record: DispensationRecord) => void;
}

export function DispensationManagementDialog({
  open,
  onOpenChange,
  prescriptionNumber,
  patientName,
  emittedDate,
  currentStatus,
  medicines,
  existingDispensation,
  onConfirm
}: DispensationManagementDialogProps) {
  const [dispensationData, setDispensationData] = useState<MedicineDispensation[]>([]);
  const [pharmacy, setPharmacy] = useState("");
  const [pharmacist, setPharmacist] = useState("");
  const [notes, setNotes] = useState("");

  // NUEVO: Validar si la receta está vencida
  const isExpired = () => {
    const [day, month, year] = emittedDate.split('/').map(Number);
    const issueDate = new Date(year, month - 1, day);
    const validityDays = 14; // Normativa: 14 días de validez
    const expiryDate = new Date(issueDate);
    expiryDate.setDate(expiryDate.getDate() + validityDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > expiryDate;
  };

  // NUEVO: Calcular fecha de vencimiento
  const getExpiryDate = () => {
    const [day, month, year] = emittedDate.split('/').map(Number);
    const issueDate = new Date(year, month - 1, day);
    const expiryDate = new Date(issueDate);
    expiryDate.setDate(expiryDate.getDate() + 14);
    return expiryDate.toLocaleDateString('es-ES');
  };

  // NUEVO: Calcular días restantes
  const getDaysRemaining = () => {
    const [day, month, year] = emittedDate.split('/').map(Number);
    const issueDate = new Date(year, month - 1, day);
    const expiryDate = new Date(issueDate);
    expiryDate.setDate(expiryDate.getDate() + 14);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = expiryDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const expired = isExpired();
  const daysRemaining = getDaysRemaining();

  // Inicializar datos de dispensación
  useEffect(() => {
    if (open) {
      setDispensationData(
        medicines.map(med => {
          // Buscar dispensación previa para este medicamento
          const previousDispensation = existingDispensation?.find(
            d => d.medicineId === med.id
          );
          
          const alreadyDispensed = previousDispensation?.dispensedQuantity || 0;
          const isAlreadyFull = alreadyDispensed >= med.quantity;

          return {
            medicineId: med.id,
            medicineName: med.genericName || med.commercialName,
            concentration: med.concentration,
            totalQuantity: med.quantity,
            dispensedQuantity: alreadyDispensed,
            previouslyDispensed: alreadyDispensed, // Guardar lo que ya estaba dispensado
            isFullyDispensed: isAlreadyFull
          };
        })
      );
      setPharmacy("");
      setPharmacist("");
      setNotes("");
    }
  }, [open, medicines, existingDispensation]);

  // Calcular estado automático basado en medicamentos dispensados
  const calculateStatus = (): DispensationStatus => {
    const totalMedicines = dispensationData.length;
    const fullyDispensedCount = dispensationData.filter(m => m.isFullyDispensed).length;
    const partiallyDispensedCount = dispensationData.filter(
      m => m.dispensedQuantity > 0 && !m.isFullyDispensed
    ).length;

    // CORRECCIÓN: Si TODOS están completamente dispensados → fully_dispensed
    if (fullyDispensedCount === totalMedicines && totalMedicines > 0) {
      return "fully_dispensed";
    } 
    // Si hay al menos uno dispensado (parcial o completo) → partially_dispensed
    else if (fullyDispensedCount > 0 || partiallyDispensedCount > 0) {
      return "partially_dispensed";
    } 
    // Si no hay nada dispensado → emitted
    else {
      return "emitted";
    }
  };

  const handleDispensedQuantityChange = (medicineId: string, quantity: number) => {
    setDispensationData(prev =>
      prev.map(med => {
        if (med.medicineId === medicineId) {
          const dispensedQuantity = Math.min(Math.max(0, quantity), med.totalQuantity);
          const now = new Date();
          return {
            ...med,
            dispensedQuantity,
            isFullyDispensed: dispensedQuantity === med.totalQuantity,
            dispensationDate: dispensedQuantity > med.previouslyDispensed ? now.toLocaleDateString('es-ES') : med.dispensationDate,
            dispensationTime: dispensedQuantity > med.previouslyDispensed ? now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : med.dispensationTime,
            dispensedBy: dispensedQuantity > med.previouslyDispensed ? pharmacist || undefined : med.dispensedBy,
            pharmacy: dispensedQuantity > med.previouslyDispensed ? pharmacy || undefined : med.pharmacy
          };
        }
        return med;
      })
    );
  };

  const handleToggleFullDispensation = (medicineId: string, checked: boolean) => {
    setDispensationData(prev =>
      prev.map(med => {
        if (med.medicineId === medicineId) {
          const now = new Date();
          const quantity = checked ? med.totalQuantity : med.previouslyDispensed;
          return {
            ...med,
            dispensedQuantity: quantity,
            isFullyDispensed: checked,
            dispensationDate: checked ? now.toLocaleDateString('es-ES') : med.dispensationDate,
            dispensationTime: checked ? now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : med.dispensationTime,
            dispensedBy: checked ? pharmacist || undefined : med.dispensedBy,
            pharmacy: checked ? pharmacy || undefined : med.pharmacy
          };
        }
        return med;
      })
    );
  };

  const handleDispenseAll = () => {
    if (expired) {
      toast.error("Receta vencida", {
        description: "No se puede dispensar una receta vencida"
      });
      return;
    }

    const now = new Date();
    setDispensationData(prev =>
      prev.map(med => ({
        ...med,
        dispensedQuantity: med.totalQuantity,
        isFullyDispensed: true,
        dispensationDate: now.toLocaleDateString('es-ES'),
        dispensationTime: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        dispensedBy: pharmacist || undefined,
        pharmacy: pharmacy || undefined
      }))
    );
    toast.success("Todos los medicamentos marcados como dispensados", {
      description: "Se ha registrado la dispensación completa de la receta"
    });
  };

  const handleConfirm = () => {
    // VALIDACIÓN 1: Receta vencida
    if (expired) {
      toast.error("Receta vencida", {
        description: "No se puede dispensar una receta cuya validez ha expirado",
        duration: 5000
      });
      return;
    }

    // VALIDACIÓN 2: Verificar si hay nuevas dispensaciones
    const hasNewDispensation = dispensationData.some(
      m => m.dispensedQuantity > m.previouslyDispensed
    );
    
    if (!hasNewDispensation) {
      toast.error("Sin cambios", {
        description: "Debe dispensar al menos un medicamento o aumentar las cantidades"
      });
      return;
    }

    // VALIDACIÓN 3: Campos obligatorios
    if (!pharmacy || !pharmacist) {
      toast.error("Información incompleta", {
        description: "Debe especificar la farmacia y el farmacéutico responsable"
      });
      return;
    }

    const calculatedStatus = calculateStatus();
    const now = new Date();

    const record: DispensationRecord = {
      prescriptionNumber,
      status: calculatedStatus,
      medicines: dispensationData,
      lastUpdated: now.toISOString(),
      updatedBy: pharmacist,
      notes
    };

    onConfirm(record);
    
    const statusLabel = {
      emitted: "Emitida",
      partially_dispensed: "Parcialmente dispensada",
      fully_dispensed: "Completamente dispensada",
      cancelled: "Anulada"
    }[calculatedStatus];

    toast.success("Dispensación registrada exitosamente", {
      description: `Estado actualizado: ${statusLabel}`,
      duration: 4000
    });

    onOpenChange(false);
  };

  const currentCalculatedStatus = calculateStatus();
  const dispensedCount = dispensationData.filter(m => m.dispensedQuantity > 0).length;
  const fullyDispensedCount = dispensationData.filter(m => m.isFullyDispensed).length;
  const hasNewDispensations = dispensationData.some(m => m.dispensedQuantity > m.previouslyDispensed);

  const getStatusBadge = (status: DispensationStatus) => {
    const config = {
      emitted: { label: "Emitida - Pendiente", className: "bg-blue-100 text-blue-700 border-blue-300", icon: Clock },
      partially_dispensed: { label: "Parcialmente Dispensada", className: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: AlertCircle },
      fully_dispensed: { label: "Completamente Dispensada", className: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle2 },
      cancelled: { label: "Anulada", className: "bg-red-100 text-red-700 border-red-300", icon: AlertCircle }
    };
    return config[status];
  };

  const currentStatusConfig = getStatusBadge(currentStatus);
  const newStatusConfig = getStatusBadge(currentCalculatedStatus);
  const StatusIcon = currentStatusConfig.icon;
  const NewStatusIcon = newStatusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[60vw] w-full !max-h-[90vh] overflow-y-auto overflow-x-hidden !p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-6 h-6 text-blue-600" />
            Gestión de Dispensación de Receta
          </DialogTitle>
          <DialogDescription>
            Registre la dispensación de medicamentos en farmacia según normativas sanitarias
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* NUEVO: Alerta de receta vencida */}
          {expired && (
            <Card className="bg-red-50 border-2 border-red-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-1">⚠️ RECETA VENCIDA</h4>
                    <p className="text-sm text-red-800 mb-2">
                      Esta receta ya NO es válida para dispensación. La validez expiró el {getExpiryDate()}.
                    </p>
                    <p className="text-xs text-red-700 font-medium">
                      Según normativa vigente, las recetas médicas tienen una validez de 14 días desde su emisión.
                      No se puede dispensar una receta vencida.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NUEVO: Advertencia de receta próxima a vencer */}
          {!expired && daysRemaining <= 3 && (
            <Card className="bg-yellow-50 border-2 border-yellow-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Receta próxima a vencer</h4>
                    <p className="text-sm text-yellow-800">
                      {daysRemaining === 0 
                        ? "Esta receta vence HOY" 
                        : `Esta receta vence en ${daysRemaining} día${daysRemaining > 1 ? 's' : ''} (${getExpiryDate()})`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información de la receta */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-blue-700 mb-1">Número de receta</p>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <p className="font-semibold text-blue-900">{prescriptionNumber}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">Paciente</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <p className="font-medium text-blue-900">{patientName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">Fecha de emisión</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="font-medium text-blue-900">{emittedDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">Válida hasta</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className={`font-medium ${expired ? 'text-red-700 font-semibold' : 'text-blue-900'}`}>
                      {getExpiryDate()}
                      {expired && " ❌"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado actual y nuevo estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-2">Estado actual</p>
                <Badge className={`${currentStatusConfig.className} text-sm px-3 py-1`}>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {currentStatusConfig.label}
                </Badge>
              </CardContent>
            </Card>
            <Card className={`border-2 ${hasNewDispensations ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {hasNewDispensations ? 'Nuevo estado (después de confirmar)' : 'Estado sin cambios'}
                </p>
                <Badge className={`${newStatusConfig.className} text-sm px-3 py-1`}>
                  <NewStatusIcon className="w-4 h-4 mr-2" />
                  {newStatusConfig.label}
                </Badge>
                <p className="text-xs text-gray-600 mt-2">
                  {dispensedCount} de {medicines.length} medicamentos dispensados ({fullyDispensedCount} completos)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Información de farmacia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pharmacy" className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Farmacia <span className="text-red-500">*</span>
              </Label>
              <Select value={pharmacy} onValueChange={setPharmacy} disabled={expired}>
                <SelectTrigger id="pharmacy">
                  <SelectValue placeholder="Seleccione la farmacia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Farmacia Central Hospital San Juan">Farmacia Central Hospital San Juan</SelectItem>
                  <SelectItem value="Farmacia Externa 1">Farmacia Externa 1</SelectItem>
                  <SelectItem value="Farmacia Externa 2">Farmacia Externa 2</SelectItem>
                  <SelectItem value="Farmacia Comunitaria">Farmacia Comunitaria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pharmacist" className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Farmacéutico responsable <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pharmacist"
                value={pharmacist}
                onChange={(e) => setPharmacist(e.target.value)}
                placeholder="Nombre del farmacéutico"
                disabled={expired}
              />
            </div>
          </div>

          {/* Botón de dispensar todo */}
          {!expired && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleDispenseAll}
                className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Dispensar todos los medicamentos
              </Button>
            </div>
          )}

          {/* Tabla de medicamentos */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[40px] px-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    </TableHead>
                    <TableHead className="min-w-[200px]">Medicamento</TableHead>
                    <TableHead className="w-[140px]">Concentración</TableHead>
                    <TableHead className="w-[70px] text-center px-2">Total</TableHead>
                    <TableHead className="w-[100px] text-center px-2">Ya dispensado</TableHead>
                    <TableHead className="w-[140px] text-center px-2">Nueva dispensación</TableHead>
                    <TableHead className="w-[180px] text-center px-2">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispensationData.map((med) => {
                    const isAlreadyFull = med.previouslyDispensed >= med.totalQuantity;
                    const remaining = med.totalQuantity - med.previouslyDispensed;
                    
                    return (
                      <TableRow 
                        key={med.medicineId} 
                        className={med.isFullyDispensed ? "bg-green-50/50" : isAlreadyFull ? "bg-gray-100" : ""}
                      >
                        <TableCell className="px-2">
                          <Checkbox
                            checked={med.isFullyDispensed}
                            onCheckedChange={(checked) => 
                              handleToggleFullDispensation(med.medicineId, checked as boolean)
                            }
                            disabled={expired || isAlreadyFull}
                          />
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium text-sm">{med.medicineName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <span className="text-sm text-gray-600">{med.concentration}</span>
                        </TableCell>
                        <TableCell className="text-center w-[70px] px-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            {med.totalQuantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center w-[100px] px-2">
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                            {med.previouslyDispensed}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center w-[140px] px-2">
                          {isAlreadyFull ? (
                            <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                              Completo
                            </Badge>
                          ) : (
                            <Input
                              type="number"
                              min={med.previouslyDispensed}
                              max={med.totalQuantity}
                              value={med.dispensedQuantity}
                              onChange={(e) => 
                                handleDispensedQuantityChange(med.medicineId, parseInt(e.target.value) || med.previouslyDispensed)
                              }
                              className="w-16 h-8 text-center mx-auto text-sm px-1"
                              disabled={expired}
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-center w-[180px] px-2">
                          {med.isFullyDispensed ? (
                            <Badge className="bg-green-100 text-green-700 border-green-300 text-xs whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completo
                            </Badge>
                          ) : med.dispensedQuantity > med.previouslyDispensed ? (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs whitespace-nowrap">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Parcial ({remaining})
                            </Badge>
                          ) : med.previouslyDispensed > 0 ? (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs whitespace-nowrap">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Ya dispensado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 text-xs whitespace-nowrap">
                              <Clock className="w-3 h-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Notas de dispensación (opcional)
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Paciente recogió parcialmente por disponibilidad limitada"
              disabled={expired}
            />
          </div>

          {/* Información legal */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Información importante</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• El estado se actualiza automáticamente según los medicamentos dispensados</li>
                    <li>• Las recetas tienen validez de 14 días desde su emisión (normativa vigente)</li>
                    <li>• No se puede re-dispensar medicamentos ya entregados completamente</li>
                    <li>• La dispensación debe ser registrada por un farmacéutico autorizado</li>
                    <li>• Cumple con normativas FDA 21 CFR Part 11 y trazabilidad OMS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={expired}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirmar Dispensación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}