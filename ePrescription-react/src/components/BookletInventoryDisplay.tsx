import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { PrescriptionBookletsAPI, BookletUtils, type BookletType, type PrescriptionBooklet } from "../utils/prescriptionBookletsStore";
import { Receipt, ShoppingCart, AlertTriangle, Package, Eye, TrendingUp } from "lucide-react";
import { BookletDetailPanel } from "./BookletDetailPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Progress } from "./ui/progress";

interface BookletInventoryDisplayProps {
  doctorId: string;
  onPurchaseClick?: () => void;
}

export function BookletInventoryDisplay({
  doctorId,
  onPurchaseClick
}: BookletInventoryDisplayProps) {
  const [selectedBooklet, setSelectedBooklet] = useState<PrescriptionBooklet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const booklets = PrescriptionBookletsAPI.getDoctorBooklets(doctorId);
  const activeBooklets = booklets.filter(b => b.status === "active");
  const availableSlips = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId);
  const slipsByType = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
  const stats = PrescriptionBookletsAPI.getDoctorStatistics(doctorId);

  const hasZeroBalance = availableSlips === 0;

  // Agrupar talonarios por tipo
  const groupedBooklets = (["estupefaciente", "psicotropico", "antimicrobiano", "libre"] as BookletType[]).map(type => {
    const typeBooklets = activeBooklets.filter(b => b.bookletType === type);
    const totalSlips = typeBooklets.reduce((sum, b) => sum + b.totalSlips, 0);
    const usedSlips = typeBooklets.reduce((sum, b) => sum + b.usedSlips, 0);
    const availableSlips = typeBooklets.reduce((sum, b) => sum + b.availableSlips, 0);
    
    return {
      type,
      label: BookletUtils.getBookletTypeLabel(type),
      color: BookletUtils.getBookletTypeColor(type),
      booklets: typeBooklets,
      count: typeBooklets.length,
      totalSlips,
      usedSlips,
      availableSlips,
      usagePercentage: totalSlips > 0 ? (usedSlips / totalSlips) * 100 : 0
    };
  }).filter(group => group.count > 0);

  const handleDoubleClick = (booklet: PrescriptionBooklet) => {
    setSelectedBooklet(booklet);
    setIsDetailOpen(true);
  };

  return (
    <>
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Inventario de Talonarios
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Doble clic en cualquier fila para ver detalles
              </p>
            </div>
            {onPurchaseClick && (
              <Button
                size="sm"
                onClick={onPurchaseClick}
                className={hasZeroBalance ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
              >
                <ShoppingCart className="size-4 mr-2" />
                Comprar
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Resumen rápido */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-600 mb-1">Total Talonarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBooklets}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-600 mb-1">Total Boletas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSlips}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200 text-center">
              <p className="text-xs text-gray-600 mb-1">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{stats.availableSlips}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-600 mb-1">Usadas</p>
              <p className="text-2xl font-bold text-gray-600">{stats.usedSlips}</p>
            </div>
          </div>

          {/* Resumen por tipo */}
          {groupedBooklets.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Talonarios por Categoría</h4>
              {groupedBooklets.map((group) => (
                <div key={group.type} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={group.color}>
                        {group.label}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {group.count} talonario{group.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-green-600">{group.availableSlips}</span>
                      <span className="text-gray-500"> / {group.totalSlips} boletas</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progreso de uso</span>
                      <span>{group.usagePercentage.toFixed(1)}% usado</span>
                    </div>
                    <Progress value={group.usagePercentage} className="h-1.5" />
                  </div>

                  {/* Tabla de talonarios del tipo */}
                  <div className="mt-3 rounded-md border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs py-2">Número</TableHead>
                          <TableHead className="text-xs py-2">Total</TableHead>
                          <TableHead className="text-xs py-2">Disponibles</TableHead>
                          <TableHead className="text-xs py-2">Usadas</TableHead>
                          <TableHead className="text-xs py-2">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.booklets.map((booklet) => (
                          <TableRow
                            key={booklet.id}
                            onDoubleClick={() => handleDoubleClick(booklet)}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            title="Doble clic para ver detalles"
                          >
                            <TableCell className="text-xs py-2 font-medium">
                              {booklet.bookletNumber}
                            </TableCell>
                            <TableCell className="text-xs py-2">
                              {booklet.totalSlips}
                            </TableCell>
                            <TableCell className="text-xs py-2">
                              <span className="font-medium text-green-600">
                                {booklet.availableSlips}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs py-2 text-gray-600">
                              {booklet.usedSlips}
                            </TableCell>
                            <TableCell className="text-xs py-2">
                              <Badge
                                variant="outline"
                                className={
                                  booklet.status === "active"
                                    ? "bg-green-100 text-green-700 border-green-300 text-xs"
                                    : booklet.status === "completed"
                                    ? "bg-blue-100 text-blue-700 border-blue-300 text-xs"
                                    : "bg-gray-100 text-gray-700 border-gray-300 text-xs"
                                }
                              >
                                {booklet.status === "active" ? "Activo" : 
                                 booklet.status === "completed" ? "Completo" : "Cancelado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
              <h3 className="font-medium text-gray-900 mb-2">Sin talonarios disponibles</h3>
              <p className="text-sm text-gray-600 mb-4">
                No tiene talonarios activos. Debe comprar talonarios para poder emitir recetas.
              </p>
              {onPurchaseClick && (
                <Button onClick={onPurchaseClick} className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar Talonarios
                </Button>
              )}
            </div>
          )}

          {/* Estadísticas de uso */}
          {stats.totalSlips > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-gray-900 text-sm">Estadísticas de Uso</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Talonarios completados</p>
                  <p className="text-lg font-bold text-gray-900">{stats.completedBooklets}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Porcentaje de uso</p>
                  <p className="text-lg font-bold text-gray-900">{stats.usagePercentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      <BookletDetailPanel
        booklet={selectedBooklet}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBooklet(null);
        }}
      />
    </>
  );
}
