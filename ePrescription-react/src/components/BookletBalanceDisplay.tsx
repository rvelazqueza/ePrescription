import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { PrescriptionBookletsAPI, BookletUtils, type BookletType, type PrescriptionBooklet } from "../utils/prescriptionBookletsStore";
import { Receipt, ShoppingCart, AlertTriangle, Package, Eye } from "lucide-react";
import { BookletDetailPanel } from "./BookletDetailPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface BookletBalanceDisplayProps {
  doctorId: string;
  onPurchaseClick?: () => void;
  compact?: boolean;
}

export function BookletBalanceDisplay({
  doctorId,
  onPurchaseClick,
  compact = false
}: BookletBalanceDisplayProps) {
  const availableSlips = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId);
  const slipsByType = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
  const stats = PrescriptionBookletsAPI.getDoctorStatistics(doctorId);

  const hasLowBalance = availableSlips > 0 && availableSlips <= 10;
  const hasZeroBalance = availableSlips === 0;

  const [selectedBooklet, setSelectedBooklet] = useState<PrescriptionBooklet | null>(null);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Receipt className={`size-4 ${hasZeroBalance ? 'text-red-600' : hasLowBalance ? 'text-amber-600' : 'text-green-600'}`} />
        <span className="text-sm">
          <strong>{availableSlips}</strong> boleta{availableSlips !== 1 ? 's' : ''} disponible{availableSlips !== 1 ? 's' : ''}
        </span>
        {hasZeroBalance && onPurchaseClick && (
          <Button
            size="sm"
            variant="outline"
            onClick={onPurchaseClick}
            className="ml-2"
          >
            <ShoppingCart className="size-3 mr-1" />
            Comprar
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={`${
      hasZeroBalance ? 'border-red-200 bg-red-50' : 
      hasLowBalance ? 'border-amber-200 bg-amber-50' : 
      'border-green-200 bg-green-50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
              hasZeroBalance ? 'bg-red-100' : 
              hasLowBalance ? 'bg-amber-100' : 
              'bg-green-100'
            }`}>
              <Receipt className={`size-5 ${
                hasZeroBalance ? 'text-red-600' : 
                hasLowBalance ? 'text-amber-600' : 
                'text-green-600'
              }`} />
            </div>
            
            <div className="space-y-2">
              <div>
                <h3 className={`font-medium ${
                  hasZeroBalance ? 'text-red-900' : 
                  hasLowBalance ? 'text-amber-900' : 
                  'text-green-900'
                }`}>
                  Saldo de Boletas
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-bold ${
                    hasZeroBalance ? 'text-red-600' : 
                    hasLowBalance ? 'text-amber-600' : 
                    'text-green-600'
                  }`}>
                    {availableSlips}
                  </span>
                  <span className={`text-sm ${
                    hasZeroBalance ? 'text-red-700' : 
                    hasLowBalance ? 'text-amber-700' : 
                    'text-green-700'
                  }`}>
                    boleta{availableSlips !== 1 ? 's' : ''} disponible{availableSlips !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <Badge variant="secondary" className="bg-white/50">
                  {stats.activeBooklets} talonario{stats.activeBooklets !== 1 ? 's' : ''} activo{stats.activeBooklets !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="secondary" className="bg-white/50">
                  {stats.usedSlips} usadas
                </Badge>
              </div>

              {/* Desglose por tipo de talonario - SIEMPRE VISIBLE */}
              <div className="space-y-1.5 mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700">Boletas por tipo:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["estupefaciente", "psicotropico", "antimicrobiano", "libre"] as BookletType[]).map(type => {
                    const count = slipsByType[type] || 0;
                    return (
                      <Badge 
                        key={type}
                        variant="outline" 
                        className={`text-xs ${BookletUtils.getBookletTypeColor(type)}`}
                      >
                        {BookletUtils.getBookletTypeLabel(type)}: {count}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {hasZeroBalance && (
                <div className="flex items-start gap-2 mt-2">
                  <AlertTriangle className="size-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">
                    <strong>No tienes boletas disponibles.</strong> Necesitas comprar talonarios para poder emitir recetas.
                  </p>
                </div>
              )}

              {hasLowBalance && (
                <div className="flex items-start gap-2 mt-2">
                  <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-700">
                    Saldo bajo. Considera comprar más talonarios pronto.
                  </p>
                </div>
              )}
            </div>
          </div>

          {onPurchaseClick && (
            <Button
              size="sm"
              onClick={onPurchaseClick}
              className={hasZeroBalance ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              <ShoppingCart className="size-4 mr-2" />
              Comprar Talonarios
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}