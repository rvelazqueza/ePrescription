/**
 * Booklet Management Accordion
 * Componente consolidado para gestión de talonarios y boletas
 * 
 * Optimizado para UX médico: información esencial colapsada, detalle expandible
 * Jerarquía visual: prescripción es core, talonarios son soporte
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Package,
  FileText,
  Info,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { PrescriptionBookletsAPI, BookletUtils, type PrescriptionBooklet, type BookletType } from '../utils/prescriptionBookletsStore';
import { BookletDetailPanel } from './BookletDetailPanel';

interface BookletManagementAccordionProps {
  doctorId: string;
  onPurchaseClick: () => void;
  onUpdate?: () => void; // Callback para recargar después de cambios
}

export function BookletManagementAccordion({ 
  doctorId, 
  onPurchaseClick,
  onUpdate 
}: BookletManagementAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [booklets, setBooklets] = useState<PrescriptionBooklet[]>([]);
  const [selectedBooklet, setSelectedBooklet] = useState<PrescriptionBooklet | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // CRÍTICO: Recargar cuando el componente se monta o doctorId cambia
  useEffect(() => {
    console.log(`[BookletManagement] Montando/Actualizando componente para doctor ${doctorId}`);
    loadBooklets();
  }, [doctorId]);

  const loadBooklets = () => {
    const doctorBooklets = PrescriptionBookletsAPI.getDoctorBooklets(doctorId);
    console.log(`[BookletManagement] Talonarios cargados:`, {
      doctorId,
      count: doctorBooklets.length,
      booklets: doctorBooklets.map(b => ({
        id: b.id,
        type: b.bookletType,
        available: b.availableSlips,
        total: b.totalSlips
      }))
    });
    setBooklets(doctorBooklets);
  };

  // Calcular estadísticas consolidadas por tipo de talonario
  const calculateCategoryStats = (type: BookletType) => {
    const typeBooklets = booklets.filter(b => b.bookletType === type);
    return {
      booklets: typeBooklets.length,
      slips: typeBooklets.reduce((sum, b) => sum + b.availableSlips, 0),
      used: typeBooklets.reduce((sum, b) => sum + b.usedSlips, 0),
      total: typeBooklets.reduce((sum, b) => sum + b.totalSlips, 0)
    };
  };

  const stats = {
    totalBooklets: booklets.length,
    totalSlips: booklets.reduce((sum, b) => sum + b.totalSlips, 0),
    usedSlips: booklets.reduce((sum, b) => sum + b.usedSlips, 0),
    availableSlips: booklets.reduce((sum, b) => sum + b.availableSlips, 0),
    
    // Por categoría (usando BookletType correcto)
    byType: {
      'estupefaciente': calculateCategoryStats('estupefaciente'),
      'psicotropico': calculateCategoryStats('psicotropico'),
      'antimicrobiano': calculateCategoryStats('antimicrobiano'),
      'libre': calculateCategoryStats('libre')
    }
  };

  // Estado crítico
  const isCritical = stats.availableSlips === 0;
  const isLowStock = stats.availableSlips > 0 && stats.availableSlips < 10;

  const handleRowDoubleClick = (booklet: PrescriptionBooklet) => {
    setSelectedBooklet(booklet);
    setShowDetailPanel(true);
  };

  const getCategoryBadgeColor = (type: BookletType) => {
    switch (type) {
      case 'estupefaciente':
        return 'bg-red-600 hover:bg-red-700';
      case 'psicotropico':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'antimicrobiano':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'libre':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getUsageColor = (used: number, total: number) => {
    if (total === 0) return 'text-gray-500';
    const percentage = (used / total) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <>
      <Card className={`border-l-4 ${
        isCritical ? 'border-l-red-500 bg-red-50/30' : 
        isLowStock ? 'border-l-yellow-500 bg-yellow-50/30' : 
        'border-l-blue-500 bg-blue-50/30'
      }`}>
        <CardContent className="p-4">
          {/* Cabecera colapsable */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className={`p-2 rounded-lg ${
                isCritical ? 'bg-red-100' :
                isLowStock ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                <Package className={`w-5 h-5 ${
                  isCritical ? 'text-red-600' :
                  isLowStock ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
              </div>
              
              <div className="flex items-center gap-3 flex-1">
                <h3 className="font-semibold text-gray-900">
                  Gestión de Talonarios
                </h3>
                
                {/* Badges por categoría - CRÍTICO para prescripción médica */}
                <div className="flex items-center gap-2">
                  {(['estupefaciente', 'psicotropico', 'antimicrobiano', 'libre'] as BookletType[]).map(type => {
                    const typeStats = stats.byType[type];
                    const hasZero = typeStats.slips === 0;
                    
                    // Colores por tipo con estado de disponibilidad
                    let colorClass = '';
                    if (type === 'estupefaciente') {
                      colorClass = hasZero ? 'bg-red-50 text-red-700 border-red-300' : 'bg-red-100 text-red-800 border-red-400';
                    } else if (type === 'psicotropico') {
                      colorClass = hasZero ? 'bg-orange-50 text-orange-700 border-orange-300' : 'bg-orange-100 text-orange-800 border-orange-400';
                    } else if (type === 'antimicrobiano') {
                      colorClass = hasZero ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-blue-100 text-blue-800 border-blue-400';
                    } else {
                      colorClass = hasZero ? 'bg-green-50 text-green-700 border-green-300' : 'bg-green-100 text-green-800 border-green-400';
                    }
                    
                    // Etiqueta corta
                    const shortLabel = type === 'estupefaciente' ? 'Estup' :
                                      type === 'psicotropico' ? 'Psico' :
                                      type === 'antimicrobiano' ? 'Antim' : 'Libre';
                    
                    return (
                      <Badge 
                        key={type}
                        variant="outline" 
                        className={`text-xs ${colorClass}`}
                      >
                        {hasZero && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {shortLabel}: {typeStats.slips}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <div className="ml-2">
              <Button 
                size="sm"
                onClick={onPurchaseClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar
              </Button>
            </div>
          </div>

          {/* Alerta crítica visible incluso colapsado */}
          {isCritical && !isExpanded && (
            <Alert className="mt-3 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900 text-sm">
                <strong>⚠️ Sin boletas disponibles en todas las categorías.</strong> Compre talonarios para poder emitir prescripciones.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Alerta de categorías sin stock (cuando no todas están en cero) */}
          {!isCritical && !isExpanded && (
            (() => {
              const typesWithZero = (['estupefaciente', 'psicotropico', 'antimicrobiano', 'libre'] as BookletType[])
                .filter(type => stats.byType[type].slips === 0)
                .map(type => BookletUtils.getBookletTypeLabel(type));
              
              if (typesWithZero.length > 0) {
                return (
                  <Alert className="mt-3 bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-900 text-sm">
                      <strong>Sin boletas en:</strong> {typesWithZero.join(', ')}. 
                      <span className="ml-1">Compre talonarios si necesita prescribir estos medicamentos.</span>
                    </AlertDescription>
                  </Alert>
                );
              }
              return null;
            })()
          )}

          {/* Contenido expandible */}
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Resumen de saldo */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-xs text-gray-600 mb-1">Total Boletas</div>
                  <div className="text-2xl font-semibold text-gray-900">{stats.totalSlips}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-xs text-gray-600 mb-1">Disponibles</div>
                  <div className={`text-2xl font-semibold ${
                    isCritical ? 'text-red-600' :
                    isLowStock ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {stats.availableSlips}
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-xs text-gray-600 mb-1">Usadas</div>
                  <div className="text-2xl font-semibold text-gray-900">{stats.usedSlips}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-xs text-gray-600 mb-1">Uso Total</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalSlips > 0 ? Math.round((stats.usedSlips / stats.totalSlips) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Alerta crítica expandida */}
              {isCritical && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <strong>⚠️ Sin boletas disponibles.</strong> No puede emitir prescripciones hasta que compre nuevos talonarios.
                  </AlertDescription>
                </Alert>
              )}

              {isLowStock && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-900">
                    <strong>Stock bajo.</strong> Considere comprar nuevos talonarios pronto.
                  </AlertDescription>
                </Alert>
              )}

              {/* Tabla de inventario por categoría */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Inventario por Categoría
                  </h4>
                  <span className="text-xs text-gray-500">
                    Doble clic en una fila para ver detalles
                  </span>
                </div>
                
                <div className="border rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">Categoría</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Talonarios</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Boletas Disponibles</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Boletas Usadas</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Uso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(['estupefaciente', 'psicotropico', 'antimicrobiano', 'libre'] as BookletType[]).map(type => {
                        const data = stats.byType[type];
                        const usagePercent = data.total > 0 ? Math.round((data.used / data.total) * 100) : 0;
                        const typeBooklets = booklets.filter(b => b.bookletType === type);
                        const label = BookletUtils.getBookletTypeLabel(type);
                        
                        return (
                          <tr 
                            key={type}
                            className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                            onDoubleClick={() => {
                              if (typeBooklets.length > 0) {
                                handleRowDoubleClick(typeBooklets[0]);
                              }
                            }}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Badge className={getCategoryBadgeColor(type)}>
                                  {label}
                                </Badge>
                              </div>
                            </td>
                            <td className="text-center p-3">
                              <span className="font-semibold">{data.booklets}</span>
                            </td>
                            <td className="text-center p-3">
                              <span className={`font-semibold ${
                                data.slips === 0 ? 'text-red-600' :
                                data.slips < 5 ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {data.slips}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className="text-gray-700">{data.used}</span>
                            </td>
                            <td className="text-center p-3">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${getUsageColor(data.used, data.total)} bg-current transition-all`}
                                    style={{ width: `${usagePercent}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-semibold ${getUsageColor(data.used, data.total)}`}>
                                  {usagePercent}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Info adicional */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900">
                  <strong>Tip:</strong> Haga doble clic en cualquier categoría para ver el detalle completo de talonarios, 
                  incluyendo números de serie, progreso de uso y lista de boletas emitidas.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      {showDetailPanel && selectedBooklet && (
        <BookletDetailPanel
          booklet={selectedBooklet}
          onClose={() => {
            setShowDetailPanel(false);
            setSelectedBooklet(null);
          }}
          onUpdate={() => {
            loadBooklets();
            if (onUpdate) onUpdate(); // Notificar al padre para actualizar todo
          }}
        />
      )}
    </>
  );
}
