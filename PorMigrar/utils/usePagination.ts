import { useState, useMemo, useEffect } from 'react';

interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  paginatedData: T[];
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

/**
 * Hook personalizado para manejar paginación de datos
 * @param data Array de datos a paginar
 * @param initialPageSize Tamaño inicial de página (default: 10)
 */
export function usePagination<T>(
  data: T[],
  initialPageSize: number = 10
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(1, Math.ceil(data.length / pageSize));
  }, [data, pageSize]);

  // Obtener datos paginados
  const paginatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Asegurar que la página actual sea válida cuando cambia el pageSize o los datos
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  const handleChangePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Resetear a la primera página
  };

  const handleGoToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage: handleGoToPage,
    changePageSize: handleChangePageSize,
    goToFirstPage: () => handleGoToPage(1),
    goToLastPage: () => handleGoToPage(totalPages),
    goToNextPage: () => handleGoToPage(currentPage + 1),
    goToPreviousPage: () => handleGoToPage(currentPage - 1)
  };
}
