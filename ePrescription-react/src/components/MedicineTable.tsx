import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { MedicineClassificationAPI } from "../utils/medicineClassificationStore";

export interface Medicine {
  id: string;
  name: string;
  quantity: string;
  dose: string;
  frequency: string;
  administration: string;
  duration: string;
  observations?: string;
}

interface MedicineTableProps {
  medicines: Medicine[];
  onMedicineDoubleClick: (medicine: Medicine) => void;
  onMedicineDelete?: (medicineId: string, medicineName: string) => void;
}

export function MedicineTable({ medicines, onMedicineDoubleClick, onMedicineDelete }: MedicineTableProps) {
  const getCategoryBadge = (medicineName: string) => {
    const info = MedicineClassificationAPI.getMedicineInfo(medicineName);
    if (!info) return null;

    const colorMap: Record<string, string> = {
      narcotics: "bg-red-100 text-red-800 border-red-300",
      psychotropics: "bg-orange-100 text-orange-800 border-orange-300",
      antimicrobials: "bg-purple-100 text-purple-800 border-purple-300",
      controlled: "bg-blue-100 text-blue-800 border-blue-300",
      free: "bg-green-100 text-green-800 border-green-300"
    };

    return (
      <Badge variant="outline" className={`${colorMap[info.category]} text-xs`}>
        {info.categoryLabel}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicamento</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Dosis</TableHead>
            <TableHead>Frecuencia</TableHead>
            <TableHead>Vía de Administración</TableHead>
            <TableHead>Duración</TableHead>
            {onMedicineDelete && <TableHead className="text-center w-24">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={onMedicineDelete ? 8 : 7} className="text-center text-muted-foreground py-8">
                No hay medicamentos agregados. Haz clic en "Agregar Medicamento" para comenzar.
              </TableCell>
            </TableRow>
          ) : (
            medicines.map((medicine) => (
              <TableRow 
                key={medicine.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onDoubleClick={() => onMedicineDoubleClick(medicine)}
                title="Doble clic para ver detalles"
              >
                <TableCell className="font-medium">{medicine.name}</TableCell>
                <TableCell>{getCategoryBadge(medicine.name)}</TableCell>
                <TableCell>{medicine.quantity}</TableCell>
                <TableCell>{medicine.dose}</TableCell>
                <TableCell>{medicine.frequency}</TableCell>
                <TableCell>{medicine.administration}</TableCell>
                <TableCell>{medicine.duration}</TableCell>
                {onMedicineDelete && (
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMedicineDelete(medicine.id, medicine.name);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Eliminar medicamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}