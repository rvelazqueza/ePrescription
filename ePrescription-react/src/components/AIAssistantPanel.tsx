/**
 * AI Assistant Panel
 * Panel lateral inteligente que sugiere diagnósticos CIE-10 y genera recetas automáticas
 * 
 * EPIC-001: Asistente IA para apoyo en diagnóstico y prescripción
 * Historia 1 (AI-SUGGEST-CIE10): Sugerencia inteligente de diagnósticos
 * Historia 2 (AI-AUTO-RX): Generación automática de receta preliminar
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Pill,
  FileText,
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Eye,
  ChevronRight,
  ShieldCheck,
  Package,
  AlertCircle,
  BookOpen,
  Loader2
} from 'lucide-react';
import { 
  getSuggestedDiagnoses,
  getSuggestedMedications,
  getPrescriptionTemplate,
  logAIUsage,
  type DiagnosticSuggestion,
  type MedicationSuggestion,
  type PrescriptionTemplate,
  type CIE10Code
} from '../utils/aiAssistantStore';
import { toast } from 'sonner@2.0.3';

interface AIAssistantPanelProps {
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientAllergies?: string[];
  currentMedications?: string[];
  onDiagnosisSelected?: (diagnosis: CIE10Code) => void;
  onMedicationsSelected?: (medications: MedicationSuggestion[]) => void;
  onClose?: () => void;
}

export function AIAssistantPanel({
  patientId,
  patientName,
  patientAge,
  patientAllergies = [],
  currentMedications = [],
  onDiagnosisSelected,
  onMedicationsSelected,
  onClose
}: AIAssistantPanelProps) {
  // Estados principales
  const [clinicalDescription, setClinicalDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticSuggestions, setDiagnosticSuggestions] = useState<DiagnosticSuggestion[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<CIE10Code | null>(null);
  const [medicationSuggestions, setMedicationSuggestions] = useState<MedicationSuggestion[]>([]);
  const [prescriptionTemplate, setPrescriptionTemplate] = useState<PrescriptionTemplate | null>(null);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [sessionStartTime] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'prescription'>('diagnosis');

  // Analizar texto clínico con IA
  const handleAnalyze = () => {
    if (!clinicalDescription.trim()) {
      toast.error('Ingrese una descripción clínica para analizar');
      return;
    }

    setIsAnalyzing(true);

    // Simular latencia de API de IA
    setTimeout(() => {
      const suggestions = getSuggestedDiagnoses(clinicalDescription);
      setDiagnosticSuggestions(suggestions);
      setIsAnalyzing(false);

      if (suggestions.length > 0) {
        toast.success('Análisis completado', {
          description: `${suggestions.length} diagnósticos sugeridos con IA`
        });
      } else {
        toast.info('No se encontraron sugerencias', {
          description: 'Intente con términos más específicos'
        });
      }
    }, 1500);
  };

  // Seleccionar diagnóstico
  const handleSelectDiagnosis = (suggestion: DiagnosticSuggestion) => {
    setSelectedDiagnosis(suggestion.cie10);
    setActiveTab('prescription');

    // Obtener sugerencias de medicamentos
    const medications = getSuggestedMedications(suggestion.cie10.code);
    setMedicationSuggestions(medications);

    // Obtener template completo
    const template = getPrescriptionTemplate(suggestion.cie10.code);
    setPrescriptionTemplate(template);

    // Notificar selección
    if (onDiagnosisSelected) {
      onDiagnosisSelected(suggestion.cie10);
    }

    toast.success('Diagnóstico seleccionado', {
      description: `${suggestion.cie10.code} - Generando receta sugerida...`
    });
  };

  // Toggle selección de medicamento
  const handleToggleMedication = (medicationId: string) => {
    setSelectedMedications(prev => {
      if (prev.includes(medicationId)) {
        return prev.filter(id => id !== medicationId);
      } else {
        return [...prev, medicationId];
      }
    });
  };

  // Seleccionar todos los medicamentos sugeridos
  const handleSelectAllMedications = () => {
    const allIds = medicationSuggestions.map(m => m.id);
    setSelectedMedications(allIds);
    toast.success('Todos los medicamentos seleccionados');
  };

  // Aplicar receta sugerida al formulario principal
  const handleApplyPrescription = () => {
    const selectedMeds = medicationSuggestions.filter(m => 
      selectedMedications.includes(m.id)
    );

    if (selectedMeds.length === 0) {
      toast.error('Seleccione al menos un medicamento');
      return;
    }

    // Registrar en auditoría
    const timeToDecision = Math.floor((Date.now() - sessionStartTime) / 1000);
    
    logAIUsage({
      userId: 'USR-0023',
      userName: 'Dr. Carlos Martínez',
      patientId: patientId || 'PAT-UNKNOWN',
      patientName: patientName || 'Paciente',
      clinicalDescription,
      suggestedDiagnoses: diagnosticSuggestions,
      suggestedMedications: medicationSuggestions,
      selectedDiagnosis,
      selectedMedications,
      modifiedMedications: [],
      rejectedSuggestions: medicationSuggestions
        .filter(m => !selectedMedications.includes(m.id))
        .map(m => m.id),
      timeToDecision,
      suggestionAcceptanceRate: selectedMedications.length / medicationSuggestions.length,
      manualChanges: 0
    });

    // Notificar al componente padre
    if (onMedicationsSelected) {
      onMedicationsSelected(selectedMeds);
    }

    toast.success('Receta aplicada', {
      description: `${selectedMeds.length} medicamento(s) agregado(s) a la prescripción`
    });
  };

  // Reset para nuevo análisis
  const handleReset = () => {
    setClinicalDescription('');
    setDiagnosticSuggestions([]);
    setSelectedDiagnosis(null);
    setMedicationSuggestions([]);
    setPrescriptionTemplate(null);
    setSelectedMedications([]);
    setActiveTab('diagnosis');
  };

  // Obtener color según confianza
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100 border-green-300';
    if (confidence >= 0.7) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (confidence >= 0.5) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-orange-600 bg-orange-100 border-orange-300';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Muy alta';
    if (confidence >= 0.7) return 'Alta';
    if (confidence >= 0.5) return 'Media';
    return 'Baja';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Asistente IA Médico</h2>
              <p className="text-sm text-purple-100">
                Diagnóstico inteligente + Prescripción automática
              </p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            <Brain className="w-3 h-3 mr-1" />
            BERT Clínico
          </Badge>
        </div>

        {patientName && (
          <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            <p className="text-sm text-white/90">
              <strong>Paciente:</strong> {patientName}
              {patientAge && <span> • {patientAge} años</span>}
            </p>
            {patientAllergies.length > 0 && (
              <p className="text-xs text-white/80 mt-1">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                Alergias: {patientAllergies.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Paso 1: Descripción Clínica */}
          <Card className="border-2 border-purple-200 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Paso 1: Descripción Clínica</CardTitle>
                  <CardDescription>
                    Describa el cuadro clínico del paciente en lenguaje natural
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinical-desc">Motivo de consulta / Cuadro clínico</Label>
                <Textarea
                  id="clinical-desc"
                  placeholder="Ej: Paciente con tos seca, fiebre de 38.5°C, dolor de garganta y malestar general de 3 días de evolución..."
                  value={clinicalDescription}
                  onChange={(e) => setClinicalDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Incluya síntomas, duración, severidad y hallazgos relevantes
                </p>
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !clinicalDescription.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analizar con IA
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <Alert className="bg-purple-50 border-purple-200">
                  <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
                  <AlertDescription className="text-purple-900">
                    <strong>Procesando...</strong> Analizando descripción clínica con modelo NLP
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Tabs: Diagnóstico y Prescripción */}
          {diagnosticSuggestions.length > 0 && (
            <Card className="border-2 border-blue-200 shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Sugerencias de IA</CardTitle>
                    <CardDescription>
                      Basado en análisis de lenguaje natural (NLP)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="diagnosis">
                      <FileText className="w-4 h-4 mr-2" />
                      Diagnósticos CIE-10
                    </TabsTrigger>
                    <TabsTrigger value="prescription" disabled={!selectedDiagnosis}>
                      <Pill className="w-4 h-4 mr-2" />
                      Receta Sugerida
                      {selectedDiagnosis && (
                        <Badge className="ml-2 bg-green-600">
                          <CheckCircle2 className="w-3 h-3" />
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* TAB 1: Diagnósticos CIE-10 */}
                  <TabsContent value="diagnosis" className="space-y-4 mt-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-900 text-sm">
                        La IA ha analizado el texto y sugiere los siguientes diagnósticos ordenados por confianza
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      {diagnosticSuggestions.map((suggestion, index) => (
                        <Card
                          key={suggestion.cie10.code}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedDiagnosis?.code === suggestion.cie10.code
                              ? 'border-2 border-green-500 bg-green-50'
                              : 'hover:border-blue-300'
                          }`}
                          onClick={() => handleSelectDiagnosis(suggestion)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {/* Ranking */}
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-semibold">
                                {index + 1}
                              </div>

                              {/* Content */}
                              <div className="flex-1 space-y-2">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="font-mono text-xs">
                                        {suggestion.cie10.code}
                                      </Badge>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                                      >
                                        {(suggestion.confidence * 100).toFixed(0)}% confianza
                                      </Badge>
                                    </div>
                                    <h4 className="font-semibold text-sm">
                                      {suggestion.cie10.description}
                                    </h4>
                                  </div>

                                  {selectedDiagnosis?.code === suggestion.cie10.code && (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                  )}
                                </div>

                                {/* Category */}
                                <p className="text-xs text-muted-foreground">
                                  {suggestion.cie10.category}
                                </p>

                                {/* Progress bar */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Nivel de confianza</span>
                                    <span className="font-medium">{getConfidenceLabel(suggestion.confidence)}</span>
                                  </div>
                                  <Progress 
                                    value={suggestion.confidence * 100} 
                                    className="h-2"
                                  />
                                </div>

                                {/* Reasoning */}
                                <div className="p-2 bg-muted/50 rounded text-xs">
                                  <div className="flex items-start gap-2">
                                    <Lightbulb className="w-3 h-3 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-muted-foreground">{suggestion.reasoning}</p>
                                  </div>
                                </div>

                                {/* Clinical notes */}
                                {suggestion.clinicalNotes && (
                                  <div className="p-2 bg-blue-50 rounded text-xs border border-blue-200">
                                    <div className="flex items-start gap-2">
                                      <Info className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                                      <p className="text-blue-900">{suggestion.clinicalNotes}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Prevalence */}
                                {suggestion.prevalence && (
                                  <Badge variant="secondary" className="text-xs">
                                    Prevalencia {suggestion.prevalence}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Action */}
                            {selectedDiagnosis?.code !== suggestion.cie10.code && (
                              <div className="mt-3 pt-3 border-t">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectDiagnosis(suggestion);
                                  }}
                                >
                                  Seleccionar y generar receta
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Feedback */}
                    <Alert className="bg-amber-50 border-amber-200">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-900 text-sm">
                        <strong>Tip:</strong> Puede seleccionar una sugerencia o ingresar un código CIE-10 manualmente si conoce el diagnóstico exacto
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  {/* TAB 2: Receta Sugerida */}
                  <TabsContent value="prescription" className="space-y-4 mt-4">
                    {selectedDiagnosis && (
                      <>
                        {/* Diagnóstico seleccionado */}
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-900">
                            <strong>Diagnóstico:</strong> {selectedDiagnosis.code} - {selectedDiagnosis.description}
                          </AlertDescription>
                        </Alert>

                        {/* Guía clínica */}
                        {prescriptionTemplate?.clinicalGuideline && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-blue-900">Guía clínica:</p>
                                <p className="text-xs text-blue-700 mt-1">
                                  {prescriptionTemplate.clinicalGuideline}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lista de medicamentos sugeridos */}
                        {medicationSuggestions.length > 0 ? (
                          <>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">
                                Medicamentos sugeridos ({medicationSuggestions.length})
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSelectAllMedications}
                              >
                                Seleccionar todos
                              </Button>
                            </div>

                            <div className="space-y-3">
                              {medicationSuggestions.map((med) => (
                                <Card
                                  key={med.id}
                                  className={`cursor-pointer transition-all ${
                                    selectedMedications.includes(med.id)
                                      ? 'border-2 border-blue-500 bg-blue-50'
                                      : 'hover:border-blue-300 hover:shadow-md'
                                  }`}
                                  onClick={() => handleToggleMedication(med.id)}
                                >
                                  <CardContent className="p-4">
                                    <div className="space-y-3">
                                      {/* Header con checkbox visual */}
                                      <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                          selectedMedications.includes(med.id)
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-300'
                                        }`}>
                                          {selectedMedications.includes(med.id) && (
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                          )}
                                        </div>

                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">
                                              {med.genericName}
                                            </h4>
                                            {med.commercialName && (
                                              <Badge variant="outline" className="text-xs">
                                                {med.commercialName}
                                              </Badge>
                                            )}
                                          </div>

                                          {/* Prescripción */}
                                          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                            <div>
                                              <span className="text-muted-foreground">Dosis:</span>{' '}
                                              <span className="font-medium">{med.dose}</span>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Vía:</span>{' '}
                                              <span className="font-medium">{med.via}</span>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Frecuencia:</span>{' '}
                                              <span className="font-medium">{med.frequency}</span>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Duración:</span>{' '}
                                              <span className="font-medium">{med.duration}</span>
                                            </div>
                                          </div>

                                          {/* Instrucciones */}
                                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                            <p className="text-muted-foreground">
                                              <strong>Instrucciones:</strong> {med.instructions}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Confianza y stock */}
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Badge className={getConfidenceColor(med.confidence)}>
                                          <TrendingUp className="w-3 h-3 mr-1" />
                                          {(med.confidence * 100).toFixed(0)}% confianza
                                        </Badge>

                                        <Badge className={
                                          med.stockStatus === 'disponible' ? 'bg-green-100 text-green-700 border-green-300' :
                                          med.stockStatus === 'bajo' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                          'bg-red-100 text-red-700 border-red-300'
                                        }>
                                          <Package className="w-3 h-3 mr-1" />
                                          {med.stockStatus === 'disponible' ? 'En stock' :
                                           med.stockStatus === 'bajo' ? 'Stock bajo' :
                                           'No disponible'}
                                        </Badge>

                                        {med.clinicalGuideline && (
                                          <Badge variant="secondary" className="text-xs">
                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                            Evidencia A
                                          </Badge>
                                        )}
                                      </div>

                                      {/* Reasoning */}
                                      <div className="p-2 bg-purple-50 rounded border border-purple-200">
                                        <div className="flex items-start gap-2">
                                          <Brain className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                                          <p className="text-xs text-purple-900">
                                            <strong>Razonamiento IA:</strong> {med.reasoning}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Alternativas */}
                                      {med.alternatives && med.alternatives.length > 0 && (
                                        <details className="text-xs">
                                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                            Ver alternativas ({med.alternatives.length})
                                          </summary>
                                          <div className="mt-2 pl-4 space-y-1">
                                            {med.alternatives.map((alt, idx) => (
                                              <p key={idx} className="text-muted-foreground">
                                                • {alt}
                                              </p>
                                            ))}
                                          </div>
                                        </details>
                                      )}

                                      {/* Contraindicaciones */}
                                      {med.contraindications && med.contraindications.length > 0 && (
                                        <div className="p-2 bg-red-50 rounded border border-red-200">
                                          <div className="flex items-start gap-2">
                                            <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-xs">
                                              <p className="font-medium text-red-900">Contraindicaciones:</p>
                                              <ul className="mt-1 space-y-0.5 text-red-700">
                                                {med.contraindications.map((contra, idx) => (
                                                  <li key={idx}>• {contra}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>

                            {/* Instrucciones adicionales */}
                            {prescriptionTemplate?.additionalInstructions && (
                              <Alert className="bg-cyan-50 border-cyan-200">
                                <Info className="h-4 w-4 text-cyan-600" />
                                <AlertDescription className="text-cyan-900 text-sm">
                                  <strong>Instrucciones generales:</strong><br />
                                  {prescriptionTemplate.additionalInstructions}
                                </AlertDescription>
                              </Alert>
                            )}

                            {/* Seguimiento */}
                            {prescriptionTemplate?.followUpRecommendation && (
                              <Alert className="bg-purple-50 border-purple-200">
                                <Clock className="h-4 w-4 text-purple-600" />
                                <AlertDescription className="text-purple-900 text-sm">
                                  <strong>Seguimiento:</strong><br />
                                  {prescriptionTemplate.followUpRecommendation}
                                </AlertDescription>
                              </Alert>
                            )}

                            {/* Botones de acción */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                onClick={handleApplyPrescription}
                                disabled={selectedMedications.length === 0}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Aplicar receta ({selectedMedications.length})
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              No hay template de prescripción disponible para este diagnóstico.
                              Puede agregar medicamentos manualmente.
                            </AlertDescription>
                          </Alert>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Reset button */}
              {diagnosticSuggestions.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nuevo análisis
                </Button>
              )}

              {/* Info panel */}
              <Card className="border-dashed border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Info className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <h4 className="font-semibold text-purple-900">
                        Sobre el Asistente de IA
                      </h4>
                      <ul className="space-y-1 text-purple-700 text-xs">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Usa procesamiento de lenguaje natural (NLP) con modelo BERT clínico</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Entrenado con guías OMS, FDA y protocolos institucionales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Compatible con estándar HL7 FHIR (Condition + MedicationRequest)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Aprende continuamente de las decisiones del médico</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-600" />
                          <span className="text-amber-700">
                            <strong>Importante:</strong> Las sugerencias son apoyo, no reemplazan el juicio clínico
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      );
    }
