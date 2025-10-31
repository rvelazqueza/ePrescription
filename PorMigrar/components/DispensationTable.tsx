import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { CheckCircle2, Clock, XCircle, AlertCircle, Package } from "lucide-react";

export interface PrescribedMedicine {
  id: string;
  name: string;
  prescribedQuantity: string;
  dose: string;
  frequency: string;
  administration: string;
  duration: string;
  observations?: string;
}

export interface DispensationRecord {
  medicineId: string;
  dispensedQuantity: number;
  dispensedQuantityUnit: string;
  status: "pending" | "fully_dispensed" | "partially_dispensed" | "not_available" | "rejected";
  batchNumber?: string;
  expirationDate?: string;
  dispensationNotes?: string;
  rejectionReason?: string;
  availableStock?: number;
}

interface DispensationTableProps {
  medicines: PrescribedMedicine[];
  dispensationRecords: Record<string, DispensationRecord>;
  onMedicineDoubleClick: (medicine: PrescribedMedicine, record: DispensationRecord) => void;
}

const getStatusConfig = (status: DispensationRecord["status"]) => {
  switch (status) {
    case "fully_dispensed":
      return {
        label: "Dispensado",
        icon: CheckCircle2,
        className: "bg-green-50 text-green-700 border-green-200",
        iconColor: "text-green-600"
      };
    case "partially_dispensed":
      return {
        label: "Parcial",
        icon: AlertCircle,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        iconColor: "text-yellow-600"
      };
    case "not_available":
      return {
        label: "No disponible",
        icon: XCircle,
        className: "bg-red-50 text-red-700 border-red-200",
        iconColor: "text-red-600"
      };
    case "rejected":
      return {
        label: "Rechazado",
        icon: XCircle,
        className: "bg-gray-50 text-gray-700 border-gray-200",
        iconColor: "text-gray-600"
      };
    default:
      return {
        label: "Pendiente",
        icon: Clock,
        className: "bg-blue-50 text-blue-700 border-blue-200",
        iconColor: "text-blue-600"
      };
  }
};

export function DispensationTable({ 
  medicines, 
  dispensationRecords,
  onMedicineDoubleClick 
}: DispensationTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Medicamento Prescrito</TableHead>
            <TableHead className="font-semibold">Cantidad Prescrita</TableHead>
            <TableHead className="font-semibold">Dosis</TableHead>
            <TableHead className="font-semibold">Frecuencia</TableHead>
            <TableHead className="font-semibold">Vía</TableHead>
            <TableHead className="font-semibold text-center">Cantidad a Dispensar</TableHead>
            <TableHead className="font-semibold text-center">Estado</TableHead>
            <TableHead className="font-semibold">Lote / Vencimiento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((medicine) => {
            const record = dispensationRecords[medicine.id] || {
              medicineId: medicine.id,
              dispensedQuantity: 0,
              dispensedQuantityUnit: medicine.prescribedQuantity.split(' ')[1] || 'unidades',
              status: "pending" as const
            };
            
            const statusConfig = getStatusConfig(record.status);
            const StatusIcon = statusConfig.icon;
            
            // Extraer número de cantidad prescrita
            const prescribedNum = medicine.prescribedQuantity.split(' ')[0];
            
            return (
              <TableRow 
                key={medicine.id}
                className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                onDoubleClick={() => onMedicineDoubleClick(medicine, record)}
                title="Doble clic para registrar dispensación"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      {medicine.observations && (
                        <p className="text-xs text-gray-500 mt-0.5">{medicine.observations}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-gray-900">{medicine.prescribedQuantity}</span>
                </TableCell>
                <TableCell className="text-gray-700">{medicine.dose}</TableCell>
                <TableCell className="text-gray-700">{medicine.frequency}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {medicine.administration}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {record.status === "pending" ? (
                    <span className="text-gray-400 text-sm">-</span>
                  ) : record.status === "not_available" || record.status === "rejected" ? (
                    <span className="text-gray-400 text-sm">N/A</span>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-gray-900">
                        {record.dispensedQuantity} {record.dispensedQuantityUnit}
                      </span>
                      {record.dispensedQuantity < parseInt(prescribedNum) && (
                        <span className="text-xs text-orange-600">
                          de {prescribedNum}
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={statusConfig.className}>
                    <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {record.batchNumber ? (
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Lote: {record.batchNumber}</p>
                      {record.expirationDate && (
                        <p className="text-xs text-gray-600">Venc: {record.expirationDate}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {medicines.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay medicamentos prescritos</p>
        </div>
      )}
    </div>
  );
}
