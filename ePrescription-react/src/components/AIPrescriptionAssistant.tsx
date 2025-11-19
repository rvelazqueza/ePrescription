/**
 * AI Prescription Assistant
 * Componente compacto del asistente de IA para integrar en el flujo de prescripción
 * 
 * Se usa dentro del formulario de nueva prescripción para sugerir diagnósticos y medicamentos
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  Lightbulb,
  Loader2,
  ChevronRight,
  Search,
  Info,
  AlertTriangle,
  Package,
  TrendingUp,
  BookOpen,
  FileText
} from 'lucide-react';
import {
  getSuggestedDiagnoses,
  getSuggestedMedications,
  searchCIE10,
  type DiagnosticSuggestion,
  type MedicationSuggestion,
  type CIE10Code
} from '../utils/aiAssistantStore';
import { toast } from 'sonner@2.0.3';

interface AIPrescriptionAssistantProps {
  onDiagnosisSelected?: (diagnosis: CIE10Code) => void;
  onMedicationsGenerated?: (medications: MedicationSuggestion[]) => void;
}

export function AIPrescriptionAssistant({
  onDiagnosisSelected,
  onMedicationsGenerated
}: AIPrescriptionAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clinicalDescription, setClinicalDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<DiagnosticSuggestion[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<CIE10Code | null>(null);
  const [generatedMedications, setGeneratedMedications] = useState<MedicationSuggestion[]>([]);
  const [showMedications, setShowMedications] = useState(false);

  // Manual CIE-10 search
  const [manualSearch, setManualSearch] = useState('');
  const [searchResults, setSearchResults] = useState<CIE10Code[]>([]);

  const handleAnalyze = () => {
    if (!clinicalDescription.trim()) {
      toast.error('Ingrese una descripción clínica');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const results = getSuggestedDiagnoses(clinicalDescription);
      setSuggestions(results);
      setIsAnalyzing(false);

      if (results.length > 0) {
        toast.success(`${results.length} diagnósticos sugeridos`);
      } else {
        toast.info('No se encontraron sugerencias');
      }
    }, 1200);
  };

  const handleSelectDiagnosis = (suggestion: DiagnosticSuggestion) => {
    const diagnosis = suggestion.cie10;
    console.log('🔵 Diagnóstico seleccionado:', diagnosis);
    
    setSelectedDiagnosis(diagnosis);

    // Generar medicamentos
    const medications = getSuggestedMedications(diagnosis.code);
    console.log('🔵 Medicamentos generados:', medications);
    
    setGeneratedMedications(medications);
    setShowMedications(true);

    toast.success('Diagnóstico seleccionado', {
      description: `Generando receta automática... (${medications.length} medicamentos)`
    });
  };

  const handleApply = () => {
    if (!selectedDiagnosis) {
      toast.error('Seleccione un diagnóstico primero');
      return;
    }

    console.log('🔵 Aplicando prescripción...', {
      diagnosis: selectedDiagnosis,
      medications: generatedMedications,
      hasCallback: !!onMedicationsGenerated
    });

    // Notificar selección de diagnóstico
    if (onDiagnosisSelected) {
      onDiagnosisSelected(selectedDiagnosis);
    }

    // Notificar medicamentos generados
    if (onMedicationsGenerated && generatedMedications.length > 0) {
      console.log('🟢 Ejecutando callback con medicamentos:', generatedMedications);
      onMedicationsGenerated(generatedMedications);
    } else {
      console.log('🔴 No se ejecutó callback:', {
        hasCallback: !!onMedicationsGenerated,
        medicationsCount: generatedMedications.length
      });
    }

    toast.success('Receta aplicada', {
      description: `Diagnóstico y ${generatedMedications.length} medicamentos agregados`
    });

    // Cerrar dialog
    setIsOpen(false);

    // Reset (con delay para que se ejecute el callback primero)
    setTimeout(() => {
      setClinicalDescription('');
      setSuggestions([]);
      setSelectedDiagnosis(null);
      setGeneratedMedications([]);
      setShowMedications(false);
    }, 100);
  };

  const handleManualSearch = () => {
    if (!manualSearch.trim()) return;

    const results = searchCIE10(manualSearch);
    setSearchResults(results);

    if (results.length > 0) {
      toast.success(`${results.length} códigos encontrados`);
    } else {
      toast.info('No se encontraron resultados');
    }
  };

  const handleSelectManual = (code: CIE10Code) => {
    setSelectedDiagnosis(code);
    
    // Generar medicamentos
    const medications = getSuggestedMedications(code.code);
    setGeneratedMedications(medications);
    setShowMedications(true);
    setSearchResults([]);

    toast.success('Diagnóstico seleccionado manualmente');
  };

  return (
    <>
      {/* Botón para abrir asistente */}
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Asistente IA
        <Badge className="ml-2 bg-white/20 text-white border-white/30 text-xs">
          Nuevo
        </Badge>
      </Button>

      {/* Dialog del asistente */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle>Asistente de IA para Prescripción</DialogTitle>
                <DialogDescription>
                  Análisis inteligente de síntomas → Sugerencia CIE-10 → Receta automática
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {!showMedications ? (
              <>
                {/* Paso 1: Descripción clínica */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Análisis de Síntomas con IA</CardTitle>
                    <CardDescription>
                      Describa el cuadro clínico y la IA sugerirá diagnósticos probables
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Descripción clínica del paciente</Label>
                      <textarea
                        placeholder="Ej: Paciente masculino de 45 años con tos seca, fiebre de 38.5°C, dolor de garganta y malestar general de 3 días de evolución..."
                        value={clinicalDescription}
                        onChange={(e) => setClinicalDescription(e.target.value)}
                        rows={4}
                        className="w-full p-3 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <Button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !clinicalDescription.trim()}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analizar con IA (NLP)
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Sugerencias */}
                {suggestions.length > 0 && (
                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-base">Diagnósticos Sugeridos</CardTitle>
                      <CardDescription>
                        Seleccione el diagnóstico más apropiado
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.cie10.code}-${index}`}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedDiagnosis?.code === suggestion.cie10.code
                              ? 'border-green-500 bg-green-50'
                              : 'border-border hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                          onClick={() => handleSelectDiagnosis(suggestion)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="font-mono">
                                  {suggestion.cie10.code}
                                </Badge>
                                <Badge className={
                                  suggestion.confidence >= 0.9 ? 'bg-green-100 text-green-700 border-green-300' :
                                  suggestion.confidence >= 0.7 ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                  'bg-yellow-100 text-yellow-700 border-yellow-300'
                                }>
                                  {(suggestion.confidence * 100).toFixed(0)}% confianza
                                </Badge>
                              </div>
                              
                              <h4 className="font-semibold text-sm">
                                {suggestion.cie10.description}
                              </h4>
                              
                              <p className="text-xs text-muted-foreground">
                                {suggestion.cie10.category}
                              </p>

                              <div className="p-2 bg-muted/50 rounded text-xs">
                                <Lightbulb className="w-3 h-3 inline mr-1 text-yellow-600" />
                                {suggestion.reasoning}
                              </div>
                            </div>

                            {selectedDiagnosis?.code === suggestion.cie10.code && (
                              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Separator />

                {/* Búsqueda manual */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Búsqueda Manual CIE-10</CardTitle>
                    <CardDescription>
                      Si conoce el diagnóstico, búsquelo directamente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar por código o descripción..."
                        value={manualSearch}
                        onChange={(e) => setManualSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      />
                      <Button onClick={handleManualSearch} variant="outline">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {searchResults.map((code, idx) => (
                          <div
                            key={`${code.code}-${idx}`}
                            className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handleSelectManual(code)}
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {code.code}
                              </Badge>
                              <span className="text-sm">{code.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Diagnóstico confirmado */}
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    <strong>Diagnóstico seleccionado:</strong><br />
                    {selectedDiagnosis?.code} - {selectedDiagnosis?.description}
                  </AlertDescription>
                </Alert>

                {/* Medicamentos generados */}
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base">Receta Generada Automáticamente</CardTitle>
                    <CardDescription>
                      {generatedMedications.length} medicamento(s) sugerido(s) según guías clínicas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedMedications.map((med, index) => (
                      <div
                        key={med.id}
                        className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {index + 1}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{med.genericName}</h4>
                              {med.commercialName && (
                                <Badge variant="outline" className="text-xs">
                                  {med.commercialName}
                                </Badge>
                              )}
                              <Badge className={
                                med.stockStatus === 'disponible' ? 'bg-green-600' :
                                med.stockStatus === 'bajo' ? 'bg-yellow-600' :
                                'bg-red-600'
                              }>
                                <Package className="w-3 h-3 mr-1" />
                                {med.stockStatus === 'disponible' ? 'Disponible' : 
                                 med.stockStatus === 'bajo' ? 'Stock bajo' : 
                                 'No disponible'}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Dosis:</span>{' '}
                                <strong>{med.dose}</strong>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Vía:</span>{' '}
                                <strong>{med.via}</strong>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Frecuencia:</span>{' '}
                                <strong>{med.frequency}</strong>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duración:</span>{' '}
                                <strong>{med.duration}</strong>
                              </div>
                            </div>

                            <div className="p-2 bg-white/70 rounded text-xs">
                              <strong>Instrucciones:</strong> {med.instructions}
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {(med.confidence * 100).toFixed(0)}% confianza
                              </Badge>
                              {med.clinicalGuideline && (
                                <Badge variant="secondary" className="text-xs">
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  Evidencia clínica
                                </Badge>
                              )}
                            </div>

                            <details className="text-xs">
                              <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                Ver razonamiento de IA
                              </summary>
                              <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                                <p className="text-purple-900">{med.reasoning}</p>
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>
                    ))}

                    {generatedMedications.length === 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          No hay template de prescripción para este diagnóstico.
                          Agregue medicamentos manualmente.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Info sobre IA */}
            <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <Brain className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900 text-sm">
                <strong>🤖 Tecnología:</strong> Procesamiento de Lenguaje Natural (NLP) con modelo BERT clínico.
                Compatible con HL7 FHIR. Aprende continuamente de decisiones médicas.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            {showMedications && (
              <Button 
                onClick={handleApply}
                className="bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Aplicar a prescripción
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
