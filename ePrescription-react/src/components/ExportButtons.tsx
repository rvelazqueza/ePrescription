import { Button } from "./ui/button";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF, formatDataForExport } from "../utils/exportUtils";
import { toast } from "sonner@2.0.3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ExportButtonsProps {
  data: any[];
  filename: string;
  title?: string;
  headers?: string[];
  columnsMap?: Record<string, string>;
  disabled?: boolean;
}

export function ExportButtons({
  data,
  filename,
  title,
  headers,
  columnsMap,
  disabled = false
}: ExportButtonsProps) {
  
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    try {
      if (data.length === 0) {
        toast.error('No hay datos para exportar');
        return;
      }

      // Formatear datos para exportación
      const formattedData = formatDataForExport(data, columnsMap);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const finalFilename = `${filename}_${timestamp}`;

      switch (format) {
        case 'csv':
          exportToCSV(formattedData, finalFilename, headers);
          toast.success('Exportado a CSV exitosamente');
          break;
        case 'excel':
          exportToExcel(formattedData, finalFilename, headers);
          toast.success('Exportado a Excel exitosamente');
          break;
        case 'pdf':
          exportToPDF(formattedData, finalFilename, title || filename, headers);
          toast.success('Generando PDF...');
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar los datos');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={disabled || data.length === 0}
        >
          <FileDown className="w-4 h-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Exportar datos a:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2 text-red-600" />
          <span>PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
          <span>CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-blue-600" />
          <span>Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Versión compacta con botones individuales
 */
export function ExportButtonsCompact({
  data,
  filename,
  title,
  headers,
  columnsMap,
  disabled = false
}: ExportButtonsProps) {
  
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    try {
      if (data.length === 0) {
        toast.error('No hay datos para exportar');
        return;
      }

      const formattedData = formatDataForExport(data, columnsMap);
      const timestamp = new Date().toISOString().split('T')[0];
      const finalFilename = `${filename}_${timestamp}`;

      switch (format) {
        case 'csv':
          exportToCSV(formattedData, finalFilename, headers);
          toast.success('Exportado a CSV');
          break;
        case 'excel':
          exportToExcel(formattedData, finalFilename, headers);
          toast.success('Exportado a Excel');
          break;
        case 'pdf':
          exportToPDF(formattedData, finalFilename, title || filename, headers);
          toast.success('Generando PDF...');
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf')}
        disabled={disabled || data.length === 0}
        className="flex items-center gap-1"
      >
        <FileText className="w-3 h-3 text-red-600" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={disabled || data.length === 0}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="w-3 h-3 text-green-600" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        disabled={disabled || data.length === 0}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="w-3 h-3 text-blue-600" />
        Excel
      </Button>
    </div>
  );
}
