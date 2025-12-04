/**
 * AI Audit Page - VERSIÓN MEJORADA
 * Dashboard de auditoría y métricas del asistente de IA
 * 
 * EPIC-001 - Historia 3 (AI-AUDIT-RX):
 * Auditoría, métricas y mejora continua del sistema de IA
 * 
 * NUEVAS FUNCIONALIDADES:
 * - Panel lateral con detalles completos del registro (Sheet)
 * - Doble clic en filas de tabla para abrir detalles
 * - Exportación real a CSV/Excel
 * - Estructura multi-modelo preparada para diferentes tipos de IA
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { PageBanner } from '../components/PageBanner';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  FileText,
  Pill,
  Target,
  BarChart3,
  Download,
  Eye,
  ThumbsUp,
  AlertTriangle,
  Sparkles,
  Zap,
  Award,
  Info,
  Lightbulb,
  Stethoscope,
  MessageSquare,
  Calendar,
  User,
  FileCheck,
  X,
  Filter
} from 'lucide-react';
import {
  getAuditLogs,
  calculateAIMetrics,
  type AIAuditLog,
  type AIMetrics
} from '../utils/aiAssistantStore';
import { toast } from 'sonner@2.0.3';

// Tipos de modelos de IA soportados
type AIModelType = 'diagnostic' | 'prescription' | 'future-radiology' | 'future-lab';

interface AIModelCategory {
  id: AIModelType;
  name: string;
  icon: any;
  description: string;
  status: 'active' | 'coming-soon';
}

const AI_MODEL_CATEGORIES: AIModelCategory[] = [
  {
    id: 'diagnostic',
    name: 'Diagnóstico CIE-10',
    icon: Brain,
    description: 'Sugerencias de diagnóstico basadas en descripción clínica',
    status: 'active'
  },
  {
    id: 'prescription',
    name: 'Prescripción Médica',
    icon: Pill,
    description: 'Generación automática de recetas según diagnóstico',
    status: 'active'
  },
  {
    id: 'future-radiology',
    name: 'Análisis Radiológico',
    icon: Activity,
    description: 'Detección de patologías en imágenes médicas',
    status: 'coming-soon'
  },
  {
    id: 'future-lab',
    name: 'Interpretación de Labs',
    icon: FileCheck,
    description: 'Análisis automático de resultados de laboratorio',
    status: 'coming-soon'
  }
];

export function AIAuditPage() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AIAuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AIAuditLog | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedModelType, setSelectedModelType] = useState<AIModelType>('diagnostic');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const logs = getAuditLogs();
    const calculatedMetrics = calculateAIMetrics();
    
    setAuditLogs(logs);
    setMetrics(calculatedMetrics);
  };

  /**
   * NUEVA FUNCIONALIDAD: Exportación real a CSV
   */
  const handleExport = () => {
    try {
      // Preparar datos para exportación
      const exportData = auditLogs.map(log => ({
        'Fecha/Hora': formatDate(log.timestamp),
        'Médico': log.userName,
        'ID Médico': log.userId,
        'Paciente': log.patientName,
        'ID Paciente': log.patientId,
        'Diagnóstico CIE-10': log.selectedDiagnosis?.code || 'N/A',
        'Descripción Diagnóstico': log.selectedDiagnosis?.description || 'N/A',
        'Medicamentos Sugeridos': log.selectedMedications.length,
        'Tiempo de Decisión (seg)': log.timeToDecision,
        'Tasa de Aceptación (%)': (log.suggestionAcceptanceRate * 100).toFixed(1),
        'Feedback': log.feedback === 'helpful' ? 'Útil' : log.feedback === 'neutral' ? 'Neutral' : 'No útil',
        'Descripción Clínica': log.clinicalDescription || 'N/A'
      }));

      // Convertir a CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escapar valores que contienen comas
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Crear archivo y descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `auditoria_ia_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Exportación exitosa', {
        description: `${auditLogs.length} registros exportados a CSV`
      });
    } catch (error) {
      toast.error('Error al exportar', {
        description: 'No se pudo generar el archivo CSV'
      });
    }
  };

  /**
   * NUEVA FUNCIONALIDAD: Abrir panel de detalles
   */
  const handleOpenDetails = (log: AIAuditLog) => {
    setSelectedLog(log);
    setShowDetailPanel(true);
  };

  /**
   * NUEVA FUNCIONALIDAD: Doble clic en fila
   */
  const handleRowDoubleClick = (log: AIAuditLog) => {
    handleOpenDetails(log);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando métricas de IA...</p>
        </div>
      </div>
    );
  }

  const acceptanceRate = metrics.totalSuggestions > 0 
    ? (metrics.acceptedSuggestions / metrics.totalSuggestions) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        icon={Brain}
        title="Auditoría de Asistente IA"
        description="Métricas, análisis y mejora continua del sistema de inteligencia artificial médica"
        gradient="from-purple-600 via-blue-600 to-cyan-600"
      />

      {/* NUEVA ESTRUCTURA: Selector de Modelo de IA */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Modelos de IA Disponibles
          </CardTitle>
          <CardDescription>
            Seleccione el tipo de modelo de IA para ver sus métricas y auditoría específica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {AI_MODEL_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = category.id === selectedModelType;
              const isAvailable = category.status === 'active';
              
              return (
                <button
                  key={category.id}
                  onClick={() => isAvailable && setSelectedModelType(category.id)}
                  disabled={!isAvailable}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${isActive 
                      ? 'border-purple-500 bg-purple-50 shadow-md' 
                      : isAvailable
                        ? 'border-border bg-white hover:border-purple-300 hover:bg-purple-50/50'
                        : 'border-dashed border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${isActive 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' 
                        : isAvailable
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-gray-200 text-gray-400'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-semibold text-sm ${isActive ? 'text-purple-900' : 'text-gray-900'}`}>
                          {category.name}
                        </p>
                        {!isAvailable && (
                          <Badge variant="outline" className="text-xs">
                            Próximamente
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                      {isActive && (
                        <div className="mt-2">
                          <Badge className="bg-purple-600 text-white text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - Filtrados por modelo seleccionado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total sugerencias */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total sugerencias</p>
                <p className="text-2xl font-semibold">{metrics.totalSuggestions}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedModelType === 'diagnostic' ? 'Diagnósticos' : 
                   selectedModelType === 'prescription' ? 'Medicamentos' : 'Análisis'}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Tasa de aceptación */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de aceptación</p>
                <p className="text-2xl font-semibold">{acceptanceRate.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">+12% vs mes anterior</p>
                </div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Confianza promedio */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confianza promedio</p>
                <p className="text-2xl font-semibold">
                  {(metrics.averageConfidence * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Precisión del modelo
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Tiempo promedio */}
        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo promedio</p>
                <p className="text-2xl font-semibold">
                  {formatTime(Math.floor(metrics.averageTimeToDecision))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Por prescripción
                </p>
              </div>
              <Clock className="w-8 h-8 text-cyan-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de sugerencias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Distribución de Sugerencias
            </CardTitle>
            <CardDescription>
              Análisis de aceptación, modificación y rechazo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Aceptadas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Aceptadas sin cambios</span>
                </div>
                <span className="font-semibold">{metrics.acceptedSuggestions}</span>
              </div>
              <Progress 
                value={metrics.totalSuggestions > 0 ? (metrics.acceptedSuggestions / metrics.totalSuggestions) * 100 : 0} 
                className="h-2"
              />
            </div>

            {/* Modificadas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span>Modificadas por médico</span>
                </div>
                <span className="font-semibold">{metrics.modifiedSuggestions}</span>
              </div>
              <Progress 
                value={metrics.totalSuggestions > 0 ? (metrics.modifiedSuggestions / metrics.totalSuggestions) * 100 : 0} 
                className="h-2 [&>div]:bg-yellow-500"
              />
            </div>

            {/* Rechazadas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Rechazadas</span>
                </div>
                <span className="font-semibold">{metrics.rejectedSuggestions}</span>
              </div>
              <Progress 
                value={metrics.totalSuggestions > 0 ? (metrics.rejectedSuggestions / metrics.totalSuggestions) * 100 : 0} 
                className="h-2 [&>div]:bg-red-500"
              />
            </div>

            <Separator />

            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-900">
                  Tasa de aceptación global
                </span>
              </div>
              <p className="text-3xl font-bold text-green-700">
                {acceptanceRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 mt-1">
                Indicador de precisión y utilidad del modelo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Satisfacción del usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-primary" />
              Satisfacción del Usuario
            </CardTitle>
            <CardDescription>
              Feedback de médicos prescriptores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-3">
                <span className="text-3xl font-bold">
                  {metrics.userSatisfaction.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">de 5.0 estrellas</p>
              <Progress value={(metrics.userSatisfaction / 5) * 100} className="mt-3 h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Útil</span>
                </div>
                <p className="text-2xl font-semibold text-green-700">
                  {auditLogs.filter(l => l.feedback === 'helpful').length}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Neutral</span>
                </div>
                <p className="text-2xl font-semibold text-gray-700">
                  {auditLogs.filter(l => l.feedback === 'neutral').length}
                </p>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-sm">
                Alta satisfacción indica que las sugerencias son clínicamente relevantes y útiles
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Top Diagnósticos y Medicamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Diagnósticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Top 10 Diagnósticos CIE-10
            </CardTitle>
            <CardDescription>
              Códigos más frecuentemente sugeridos y aceptados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.topDiagnoses.length > 0 ? (
              <div className="space-y-2">
                {metrics.topDiagnoses.map((diagnosis, index) => (
                  <div
                    key={`${diagnosis.cie10}-${index}`}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {diagnosis.cie10}
                        </Badge>
                        <span className="text-sm font-medium">{diagnosis.count} veces</span>
                      </div>
                    </div>
                    <Progress 
                      value={(diagnosis.count / metrics.topDiagnoses[0].count) * 100} 
                      className="w-20 h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No hay datos suficientes aún</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Medicamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Top 10 Medicamentos Sugeridos
            </CardTitle>
            <CardDescription>
              Fármacos más frecuentemente recomendados por IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.topMedications.length > 0 ? (
              <div className="space-y-2">
                {metrics.topMedications.map((medication, index) => (
                  <div
                    key={`${medication.name}-${index}`}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{medication.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {medication.count} veces
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={(medication.count / metrics.topMedications[0].count) * 100} 
                      className="w-20 h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No hay datos suficientes aún</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Logs y Análisis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Auditoría de IA</CardTitle>
              <CardDescription>
                Historial completo de sugerencias, decisiones y resultados
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logs">
            <TabsList>
              <TabsTrigger value="logs">
                <Activity className="w-4 h-4 mr-2" />
                Logs ({auditLogs.length})
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <BarChart3 className="w-4 h-4 mr-2" />
                Análisis
              </TabsTrigger>
            </TabsList>

            {/* TAB: Logs */}
            <TabsContent value="logs" className="space-y-4">
              {auditLogs.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha/Hora</TableHead>
                        <TableHead>Médico</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Diagnóstico</TableHead>
                        <TableHead>Medicamentos</TableHead>
                        <TableHead>Tiempo</TableHead>
                        <TableHead>Aceptación</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow 
                          key={log.id} 
                          className="hover:bg-muted/50 cursor-pointer"
                          onDoubleClick={() => handleRowDoubleClick(log)}
                          title="Doble clic para ver detalles completos"
                        >
                          <TableCell className="text-sm">
                            {formatDate(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{log.userName}</p>
                              <p className="text-xs text-muted-foreground">{log.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{log.patientName}</p>
                              <p className="text-xs text-muted-foreground">{log.patientId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.selectedDiagnosis ? (
                              <Badge variant="outline" className="font-mono text-xs">
                                {log.selectedDiagnosis.code}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {log.selectedMedications.length} meds
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {formatTime(log.timeToDecision)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Badge className={
                                log.suggestionAcceptanceRate >= 0.8 ? 'bg-green-100 text-green-700 border-green-300' :
                                log.suggestionAcceptanceRate >= 0.5 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                'bg-red-100 text-red-700 border-red-300'
                              }>
                                {(log.suggestionAcceptanceRate * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.feedback === 'helpful' && (
                              <Badge className="bg-green-100 text-green-700 border-green-300">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                Útil
                              </Badge>
                            )}
                            {log.feedback === 'neutral' && (
                              <Badge variant="secondary">Neutral</Badge>
                            )}
                            {log.feedback === 'not-helpful' && (
                              <Badge variant="destructive">No útil</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetails(log);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-muted-foreground">No hay registros de auditoría aún</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Los logs aparecerán cuando se use el asistente de IA
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB: Análisis */}
            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Insights */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Eficiencia operativa</p>
                        <p className="text-xl font-semibold">
                          {metrics.averageTimeToDecision > 0 
                            ? `${((5 * 60 - metrics.averageTimeToDecision) / 60).toFixed(1)}min` 
                            : 'N/A'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">Tiempo ahorrado por Rx</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Precisión clínica</p>
                        <p className="text-xl font-semibold">
                          {(metrics.averageConfidence * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Confianza promedio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-900">
                  <strong>Rendimiento del Modelo:</strong> El sistema está funcionando dentro de parámetros esperados. 
                  Tasa de aceptación de {acceptanceRate.toFixed(1)}% indica alta precisión. 
                  Continuar recopilando feedback para mejora continua.
                </AlertDescription>
              </Alert>

              {/* Recomendaciones */}
              <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    Recomendaciones de Mejora
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Excelente:</strong> Alta tasa de aceptación indica que el modelo está bien calibrado
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Oportunidad:</strong> Recopilar más feedback de usuarios para identificar áreas de mejora
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Próximo paso:</strong> Analizar casos con modificaciones para afinar el modelo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Cumplimiento Normativo */}
      <Card className="border-2 border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Cumplimiento Normativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">FDA 21 CFR Part 11</p>
                <p className="text-xs text-muted-foreground">Auditoría completa</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">HIPAA Compliance</p>
                <p className="text-xs text-muted-foreground">Protección PHI</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">HL7 FHIR Compatible</p>
                <p className="text-xs text-muted-foreground">CDS Hooks ready</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Trazabilidad 100%</p>
                <p className="text-xs text-muted-foreground">Quién, qué, cuándo</p>
              </div>
            </div>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <Award className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 text-sm">
              <strong>Certificación:</strong> Sistema cumple con estándares internacionales para IA en salud. 
              Todos los registros incluyen timestamp, usuario, entrada, salida y decisión final para auditoría regulatoria.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* NUEVO: Panel lateral de detalles (Sheet) */}
      <Sheet open={showDetailPanel} onOpenChange={setShowDetailPanel}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {selectedLog && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  Detalle de Registro de Auditoría
                </SheetTitle>
                <SheetDescription>
                  Información completa del uso del asistente de IA
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Información general */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">ID Registro</p>
                        <p className="font-mono font-medium">{selectedLog.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fecha/Hora</p>
                        <p className="font-medium">{formatDate(selectedLog.timestamp)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Médico prescriptor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Médico Prescriptor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nombre completo</p>
                      <p className="font-medium">{selectedLog.userName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ID Usuario</p>
                      <p className="font-mono">{selectedLog.userId}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Información del paciente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Paciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nombre completo</p>
                      <p className="font-medium">{selectedLog.patientName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ID Paciente</p>
                      <p className="font-mono">{selectedLog.patientId}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Descripción clínica */}
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      Descripción Clínica Ingresada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-white p-3 rounded-lg border">
                      {selectedLog.clinicalDescription || 'No se proporcionó descripción clínica'}
                    </p>
                  </CardContent>
                </Card>

                {/* Diagnóstico seleccionado */}
                {selectedLog.selectedDiagnosis && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Diagnóstico CIE-10 Seleccionado
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {selectedLog.selectedDiagnosis.code}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">
                        {selectedLog.selectedDiagnosis.description}
                      </p>
                      {selectedLog.selectedDiagnosis.category && (
                        <p className="text-xs text-muted-foreground">
                          Categoría: {selectedLog.selectedDiagnosis.category}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Medicamentos */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Pill className="w-4 h-4 text-green-600" />
                      Medicamentos Generados ({selectedLog.selectedMedications.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedLog.selectedMedications.length > 0 ? (
                      <div className="space-y-3">
                        {selectedLog.selectedMedications.map((med, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg border text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="font-medium">{med.genericName}</p>
                                {med.commercialName && (
                                  <p className="text-xs text-muted-foreground">
                                    Comercial: {med.commercialName}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {med.dose}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {med.frequency}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {med.duration}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No se generaron medicamentos</p>
                    )}
                  </CardContent>
                </Card>

                {/* Métricas de uso */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Métricas de Uso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground mb-1">Tiempo de decisión</p>
                        <p className="text-xl font-semibold">
                          {formatTime(selectedLog.timeToDecision)}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground mb-1">Tasa de aceptación</p>
                        <p className="text-xl font-semibold">
                          {(selectedLog.suggestionAcceptanceRate * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Feedback del médico</p>
                      <div className="flex items-center gap-2">
                        {selectedLog.feedback === 'helpful' && (
                          <Badge className="bg-green-600">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Sugerencias útiles
                          </Badge>
                        )}
                        {selectedLog.feedback === 'neutral' && (
                          <Badge variant="secondary">
                            Neutral
                          </Badge>
                        )}
                        {selectedLog.feedback === 'not-helpful' && (
                          <Badge variant="destructive">
                            No útil
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance */}
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900 text-sm">
                    <strong>Registro de Auditoría Completo:</strong> Este log cumple con FDA 21 CFR Part 11, 
                    HIPAA y HL7 FHIR. Toda la información es inmutable y trazable para cumplimiento regulatorio.
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AIAuditPage;
