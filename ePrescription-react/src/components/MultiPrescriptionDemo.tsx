/**
 * Multi-Prescription Demo Component
 * 
 * Componente de demostración del sistema de múltiples recetas automáticas.
 * Muestra ejemplos de casos clínicos complejos con múltiples categorías.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MultiPrescriptionConfirmationDialog } from './MultiPrescriptionConfirmationDialog';
import {
  analyzeTreatment,
  type MultiPrescriptionMedication
} from '../utils/multiPrescriptionUtils';
import { PrescriptionBookletsAPI, type BookletType } from '../utils/prescriptionBookletsStore';
import { FileText, Stethoscope, Pill, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ClinicalCase {
  id: string;
  title: string;
  diagnosis: string;
  cie10: string;
  description: string;
  medications: MultiPrescriptionMedication[];
  expectedRecipes: number;
  complexity: 'simple' | 'medium' | 'complex';
}

const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-realista-1',
    title: '🔴 Dolor Oncológico Severo + Infección',
    diagnosis: 'Cáncer de páncreas estadio IV con infección bacteriana secundaria',
    cie10: 'C25.9',
    description: 'Paciente oncológico con dolor severo que requiere opioide mayor + tratamiento de infección concomitante + manejo de efectos adversos.',
    complexity: 'complex',
    expectedRecipes: 3,
    medications: [
      {
        id: 'med-onco-1',
        name: 'Morfina',
        category: 'Estupefacientes',
        dosage: '10mg',
        frequency: 'Cada 8 horas',
        duration: '14 días',
        instructions: 'Para dolor severo oncológico. Titular según respuesta.'
      },
      {
        id: 'med-onco-2',
        name: 'Ciprofloxacino',
        category: 'Antimicrobianos',
        dosage: '500mg',
        frequency: 'Cada 12 horas',
        duration: '10 días',
        instructions: 'Para infección bacteriana secundaria. Evitar lácteos.'
      },
      {
        id: 'med-onco-3',
        name: 'Omeprazol',
        category: 'Receta Libre',
        dosage: '20mg',
        frequency: 'Cada 24 horas',
        duration: '30 días',
        instructions: 'Protección gástrica por opioides.'
      },
      {
        id: 'med-onco-4',
        name: 'Ondansetrón',
        category: 'Receta Libre',
        dosage: '8mg',
        frequency: 'Cada 8 horas PRN',
        duration: '14 días',
        instructions: 'Para náuseas asociadas a opioides.'
      }
    ]
  },
  {
    id: 'case-realista-2',
    title: '🟠 Ansiedad con Insomnio + ITU',
    diagnosis: 'Trastorno de ansiedad generalizada con infección del tracto urinario',
    cie10: 'F41.2',
    description: 'Paciente con trastorno de ansiedad e insomnio que presenta infección urinaria concomitante.',
    complexity: 'medium',
    expectedRecipes: 3,
    medications: [
      {
        id: 'med-anx-1',
        name: 'Clonazepam',
        category: 'Psicotrópicos',
        dosage: '2mg',
        frequency: 'Cada 12 horas',
        duration: '14 días',
        instructions: 'Para ansiedad e insomnio. No conducir.'
      },
      {
        id: 'med-anx-2',
        name: 'Nitrofurantoína',
        category: 'Antimicrobianos',
        dosage: '100mg',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Para ITU. Tomar con alimentos.'
      },
      {
        id: 'med-anx-3',
        name: 'Paracetamol',
        category: 'Receta Libre',
        dosage: '500mg',
        frequency: 'Cada 8 horas PRN',
        duration: '5 días',
        instructions: 'Para malestar general si presenta.'
      }
    ]
  },
  {
    id: 'case-realista-3',
    title: '🔵 Post-Operatorio Complejo',
    diagnosis: 'Post-operatorio de cirugía abdominal mayor',
    cie10: 'T81.8',
    description: 'Post-cirugía abdominal mayor requiriendo opioide transdérmico, doble cobertura antibiótica (aerobios y anaerobios), y analgesia de rescate.',
    complexity: 'complex',
    expectedRecipes: 4,
    medications: [
      {
        id: 'med-postop-1',
        name: 'Fentanilo Transdérmico',
        category: 'Estupefacientes',
        dosage: '100mcg/h parche',
        frequency: 'Cambiar cada 72h',
        duration: '9 días',
        instructions: 'Para dolor basal severo. No cortar el parche.'
      },
      {
        id: 'med-postop-2',
        name: 'Cefazolina',
        category: 'Antimicrobianos',
        dosage: '1g IV',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Profilaxis quirúrgica aerobios.'
      },
      {
        id: 'med-postop-3',
        name: 'Metronidazol',
        category: 'Antimicrobianos',
        dosage: '500mg IV',
        frequency: 'Cada 8 horas',
        duration: '7 días',
        instructions: 'Cobertura anaeróbica. Evitar alcohol.'
      },
      {
        id: 'med-postop-4',
        name: 'Tramadol',
        category: 'Receta Libre',
        dosage: '50mg',
        frequency: 'Cada 8 horas',
        duration: '10 días',
        instructions: 'Analgesia de rescate para dolor incidental.'
      }
    ]
  },

  {
    id: 'case-3',
    title: 'Neumonía Comunitaria Severa',
    diagnosis: 'Neumonía adquirida en la comunidad',
    cie10: 'J18.9',
    description: 'Neumonía comunitaria severa requiriendo cobertura empírica amplia.',
    complexity: 'complex',
    expectedRecipes: 2,
    medications: [
      {
        id: 'med-7',
        name: 'Ceftriaxona',
        category: 'Antimicrobianos',
        dosage: '2g IV',
        frequency: 'Cada 24 horas',
        duration: '10 días',
        instructions: 'Cefalosporina de tercera generación.'
      },
      {
        id: 'med-8',
        name: 'Azitromicina',
        category: 'Antimicrobianos',
        dosage: '500mg',
        frequency: 'Cada 24 horas',
        duration: '5 días',
        instructions: 'Cobertura para gérmenes atípicos.'
      },
      {
        id: 'med-9',
        name: 'Tramadol',
        category: 'Receta Libre',
        dosage: '50mg',
        frequency: 'Cada 8 horas',
        duration: '5 días',
        instructions: 'Para dolor torácico asociado.'
      }
    ]
  },
  {
    id: 'case-4',
    title: 'Dolor Oncológico Refractario',
    diagnosis: 'Dolor crónico intratable en paciente oncológico',
    cie10: 'R52.2',
    description: 'Paciente con cáncer requiriendo múltiples opioides para control del dolor.',
    complexity: 'complex',
    expectedRecipes: 2,
    medications: [
      {
        id: 'med-10',
        name: 'Morfina',
        category: 'Estupefacientes',
        dosage: '20mg',
        frequency: 'Cada 8 horas',
        duration: '14 días',
        instructions: 'Opioide mayor para dolor basal.'
      },
      {
        id: 'med-11',
        name: 'Fentanilo Transdérmico',
        category: 'Estupefacientes',
        dosage: '50mcg/h',
        frequency: 'Cambiar cada 72 horas',
        duration: '14 días',
        instructions: 'Parche transdérmico para dolor continuo.'
      }
    ]
  },
  {
    id: 'case-5',
    title: 'Infección Severa Multi-Resistente',
    diagnosis: 'Sepsis por bacteria multi-resistente',
    cie10: 'A41.9',
    description: 'Infección sistémica requiriendo múltiples antimicrobianos.',
    complexity: 'complex',
    expectedRecipes: 2,
    medications: [
      {
        id: 'med-12',
        name: 'Meropenem',
        category: 'Antimicrobianos',
        dosage: '1g IV',
        frequency: 'Cada 8 horas',
        duration: '14 días',
        instructions: 'Carbapenem de amplio espectro.'
      },
      {
        id: 'med-13',
        name: 'Vancomicina',
        category: 'Antimicrobianos',
        dosage: '1g IV',
        frequency: 'Cada 12 horas',
        duration: '14 días',
        instructions: 'Cobertura para gram positivos resistentes.'
      },
      {
        id: 'med-14',
        name: 'Linezolid',
        category: 'Antimicrobianos',
        dosage: '600mg',
        frequency: 'Cada 12 horas',
        duration: '14 días',
        instructions: 'Alternativa para MRSA.'
      },
      {
        id: 'med-15',
        name: 'Amikacina',
        category: 'Antimicrobianos',
        dosage: '15mg/kg IV',
        frequency: 'Cada 24 horas',
        duration: '7 días',
        instructions: 'Aminoglucósido. Monitorear función renal.'
      }
    ]
  }
];

export function MultiPrescriptionDemo() {
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Mock de disponibilidad de talonarios (simulado)
  const mockAvailableSlips: Record<BookletType, number> = {
    estupefaciente: 50,
    psicotropico: 50,
    antimicrobiano: 50,
    libre: 100
  };

  const handleSelectCase = (clinicalCase: ClinicalCase) => {
    setSelectedCase(clinicalCase);
    setShowDialog(true);
  };

  const handleConfirm = (analysis: any) => {
    toast.success(`✅ ${analysis.totalPrescriptions} recetas generadas correctamente`);
    setShowDialog(false);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'complex':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'Simple';
      case 'medium':
        return 'Moderado';
      case 'complex':
        return 'Complejo';
      default:
        return complexity;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            Sistema de Múltiples Recetas - Demostración
          </h1>
          <p className="text-gray-600 mt-2">
            Casos clínicos que demuestran la separación automática de medicamentos en múltiples recetas
          </p>
        </div>
      </div>

      {/* Info Box */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm text-blue-900">
                <strong>Sistema Inteligente:</strong> El asistente de IA puede sugerir tratamientos completos
                con medicamentos de diferentes categorías. El sistema automáticamente:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>Agrupa medicamentos por categoría</li>
                <li>Valida límites por tipo de talonario</li>
                <li>Calcula número de recetas necesarias</li>
                <li>Verifica disponibilidad de talonarios</li>
                <li>Genera todas las recetas automáticamente al confirmar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLINICAL_CASES.map(clinicalCase => {
          const analysis = analyzeTreatment(clinicalCase.medications);
          
          return (
            <Card key={clinicalCase.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getComplexityColor(clinicalCase.complexity)}>
                    {getComplexityLabel(clinicalCase.complexity)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {clinicalCase.expectedRecipes} receta{clinicalCase.expectedRecipes > 1 ? 's' : ''}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{clinicalCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">CIE-10:</span>{' '}
                      <span className="text-gray-900">{clinicalCase.cie10}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{clinicalCase.description}</p>
                </div>

                {/* Medications Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <Pill className="w-3 h-3" />
                    Medicamentos ({clinicalCase.medications.length})
                  </div>
                  <div className="space-y-1">
                    {clinicalCase.medications.map(med => (
                      <div key={med.id} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${
                          med.category === 'Estupefacientes' ? 'bg-red-600' :
                          med.category === 'Psicotrópicos' ? 'bg-orange-600' :
                          med.category === 'Antimicrobianos' ? 'bg-blue-600' : 'bg-green-600'
                        }`} />
                        <span className="text-gray-900 font-medium">{med.name}</span>
                        <span className="text-gray-600">({med.category})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">{analysis.summary}</p>
                </div>

                <Button
                  onClick={() => handleSelectCase(clinicalCase)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Ver Análisis Completo
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog */}
      {selectedCase && (
        <MultiPrescriptionConfirmationDialog
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false);
            setSelectedCase(null);
          }}
          medications={selectedCase.medications}
          diagnosis={`${selectedCase.cie10} - ${selectedCase.diagnosis}`}
          availableSlipsByType={mockAvailableSlips}
          onConfirm={handleConfirm}
          onEdit={() => {
            setShowDialog(false);
            toast.info('Abrir editor manual (por implementar)');
          }}
          onPurchaseBooklets={() => {
            setShowDialog(false);
            toast.info('Abrir diálogo de compra de talonarios (por implementar)');
          }}
        />
      )}
    </div>
  );
}
