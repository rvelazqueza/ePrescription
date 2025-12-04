import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100]
}: TablePaginationProps) {
  // Asegurar valores válidos
  const safeCurrentPage = Math.max(1, currentPage || 1);
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safePageSize = Math.max(1, pageSize || 10);
  const safeTotalItems = Math.max(0, totalItems || 0);
  
  const startItem = safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(safeCurrentPage * safePageSize, safeTotalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-gray-200 bg-white">
      {/* Información de registros */}
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600">
          Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{" "}
          <span className="font-medium text-gray-900">{endItem}</span> de{" "}
          <span className="font-medium text-gray-900">{safeTotalItems}</span> registros
        </div>

        {/* Selector de tamaño de página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Registros por página:</span>
          <Select
            value={safePageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600 mr-4">
          Página <span className="font-medium text-gray-900">{safeCurrentPage}</span> de{" "}
          <span className="font-medium text-gray-900">{safeTotalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Números de página */}
        <div className="flex gap-1">
          {getPageNumbers(safeCurrentPage, safeTotalPages).map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              );
            }
            
            const page = Number(pageNum);
            return (
              <Button
                key={page}
                variant={safeCurrentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={safeCurrentPage === safeTotalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Genera array de números de página con elipsis cuando es necesario
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const delta = 2; // Páginas a mostrar antes y después de la actual
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i as number;
  }

  return rangeWithDots;
}
