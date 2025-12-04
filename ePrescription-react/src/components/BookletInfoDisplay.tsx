import React from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Package } from "lucide-react";
import { BookletType, BookletUtils } from "../utils/prescriptionBookletsStore";

interface BookletInfoDisplayProps {
  bookletNumber?: string;
  slipNumber?: string;
  fullSlipNumber?: string;
  bookletType?: BookletType; // NUEVO: Tipo de talonario
  variant?: "inline" | "card" | "compact";
  className?: string;
}

/**
 * Componente reutilizable para mostrar información de talonarios y boletas
 * en todo el sistema de recetas médicas
 * 
 * @param bookletNumber - Número del talonario (ej: "TAL-2025-000001")
 * @param slipNumber - Número de boleta (ej: "0001")
 * @param fullSlipNumber - Código completo (ej: "TAL-2025-000001-0001")
 * @param bookletType - Tipo de talonario (estupefaciente, psicotropico, antimicrobiano, libre)
 * @param variant - Estilo de presentación: "card" | "inline" | "compact"
 * @param className - Clases CSS adicionales
 */
export function BookletInfoDisplay({
  bookletNumber,
  slipNumber,
  fullSlipNumber,
  bookletType,
  variant = "card",
  className = ""
}: BookletInfoDisplayProps) {
  // Si no hay datos, no mostrar nada
  if (!bookletNumber && !fullSlipNumber) {
    return null;
  }

  // ============================================
  // VARIANTE COMPACTA: Solo badge
  // ============================================
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <Badge 
          variant="outline" 
          className="font-mono text-xs bg-purple-100 text-purple-800 border-purple-300"
        >
          {fullSlipNumber || `${bookletNumber}-${slipNumber}`}
        </Badge>
        {bookletType && (
          <Badge 
            variant="outline" 
            className={`text-xs border ${BookletUtils.getBookletTypeColor(bookletType)}`}
          >
            {BookletUtils.getBookletTypeLabel(bookletType)}
          </Badge>
        )}
      </div>
    );
  }

  // ============================================
  // VARIANTE INLINE: Texto simple sin bordes
  // ============================================
  if (variant === "inline") {
    return (
      <div className={`space-y-1 ${className}`}>
        {bookletType && (
          <p className="text-sm">
            <span className="text-muted-foreground">Tipo de Talonario:</span>{" "}
            <Badge 
              variant="outline" 
              className={`text-xs border ${BookletUtils.getBookletTypeColor(bookletType)}`}
            >
              {BookletUtils.getBookletTypeLabel(bookletType)}
            </Badge>
          </p>
        )}
        {bookletNumber && (
          <p className="text-sm">
            <span className="text-muted-foreground">Talonario:</span>{" "}
            <span className="font-mono font-medium text-gray-900">{bookletNumber}</span>
          </p>
        )}
        {slipNumber && (
          <p className="text-sm">
            <span className="text-muted-foreground">Boleta:</span>{" "}
            <span className="font-mono font-medium text-gray-900">{slipNumber}</span>
          </p>
        )}
        {fullSlipNumber && (
          <p className="text-sm">
            <span className="text-muted-foreground">Código Completo:</span>{" "}
            <Badge variant="outline" className="font-mono text-xs ml-1">
              {fullSlipNumber}
            </Badge>
          </p>
        )}
      </div>
    );
  }

  // ============================================
  // VARIANTE CARD: Con fondo, borde e ícono
  // ============================================
  return (
    <Card className={`border-purple-200 bg-purple-50 ${className}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="size-4 text-purple-600 flex-shrink-0" />
          <span className="font-medium text-purple-900 text-sm">
            Control de Talonarios
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {bookletType && (
            <div className="col-span-full space-y-1">
              <span className="text-gray-700 font-medium">Tipo de Talonario:</span>
              <div>
                <Badge 
                  variant="outline" 
                  className={`text-xs border ${BookletUtils.getBookletTypeColor(bookletType)}`}
                >
                  {BookletUtils.getBookletTypeLabel(bookletType)}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  (Límite: {BookletUtils.getMedicationLimit(bookletType)} medicamento{BookletUtils.getMedicationLimit(bookletType) === 1 ? '' : 's'} por receta)
                </span>
              </div>
            </div>
          )}

          {bookletNumber && (
            <div className="space-y-1">
              <span className="text-gray-700 font-medium">Número de Talonario:</span>
              <p className="font-mono font-medium text-gray-900 break-all">
                {bookletNumber}
              </p>
            </div>
          )}
          
          {slipNumber && (
            <div className="space-y-1">
              <span className="text-gray-700 font-medium">Número de Boleta:</span>
              <p className="font-mono font-medium text-gray-900">
                {slipNumber}
              </p>
            </div>
          )}
          
          {fullSlipNumber && (
            <div className="col-span-full space-y-1">
              <span className="text-gray-700 font-medium">Código Completo:</span>
              <div className="break-all">
                <Badge 
                  variant="outline" 
                  className="font-mono text-xs bg-purple-100 text-purple-800 border-purple-300 inline-block"
                >
                  {fullSlipNumber}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}