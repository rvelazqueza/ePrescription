import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

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
}

export function MedicineTable({ medicines, onMedicineDoubleClick }: MedicineTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicamento</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Dosis</TableHead>
            <TableHead>Frecuencia</TableHead>
            <TableHead>Vía de Administración</TableHead>
            <TableHead>Duración</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((medicine) => (
            <TableRow 
              key={medicine.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onDoubleClick={() => onMedicineDoubleClick(medicine)}
              title="Doble clic para ver detalles"
            >
              <TableCell className="font-medium">{medicine.name}</TableCell>
              <TableCell>{medicine.quantity}</TableCell>
              <TableCell>{medicine.dose}</TableCell>
              <TableCell>{medicine.frequency}</TableCell>
              <TableCell>{medicine.administration}</TableCell>
              <TableCell>{medicine.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}