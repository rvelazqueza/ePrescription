/**
 * AI Assistant Store
 * Sistema de inteligencia artificial para sugerencia de diagnósticos CIE-10
 * y generación automática de recetas preliminares
 * 
 * Simula integración con modelos NLP tipo BERT clínico o BioGPT
 * Compatible con HL7 FHIR Condition y MedicationRequest resources
 */

// ============================================
// TIPOS Y ESTRUCTURAS
// ============================================

export interface CIE10Code {
  code: string;
  description: string;
  category: string;
  subcategory?: string;
}

export interface DiagnosticSuggestion {
  cie10: CIE10Code;
  confidence: number; // 0-1
  reasoning: string;
  clinicalNotes?: string;
  prevalence?: string; // alta, media, baja
  references?: string[];
}

export interface MedicationSuggestion {
  id: string;
  genericName: string;
  commercialName: string;
  category?: string; // Categoría del medicamento (Estupefacientes, Psicotrópicos, etc.)
  dose: string;
  via: string;
  frequency: string;
  duration: string;
  instructions: string;
  confidence: number; // 0-1
  reasoning: string;
  stockStatus: 'disponible' | 'bajo' | 'no-disponible';
  alternatives?: string[];
  interactions?: string[];
  contraindications?: string[];
  clinicalGuideline?: string;
}

export interface PrescriptionTemplate {
  cie10Code: string;
  medications: MedicationSuggestion[];
  clinicalGuideline: string;
  additionalInstructions?: string;
  followUpRecommendation?: string;
}

export interface AIAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  patientId: string;
  patientName: string;
  
  // Input
  clinicalDescription: string;
  
  // AI Suggestions
  suggestedDiagnoses: DiagnosticSuggestion[];
  suggestedMedications: MedicationSuggestion[];
  
  // User Actions
  selectedDiagnosis?: CIE10Code;
  selectedMedications: string[]; // IDs de medicamentos seleccionados
  modifiedMedications: string[]; // IDs de medicamentos modificados
  rejectedSuggestions: string[]; // IDs rechazados
  
  // Metadata
  timeToDecision: number; // segundos
  suggestionAcceptanceRate: number; // 0-1
  manualChanges: number;
  
  // Outcome
  finalPrescriptionId?: string;
  feedback?: 'helpful' | 'neutral' | 'not-helpful';
  feedbackNotes?: string;
}

export interface AIMetrics {
  totalSuggestions: number;
  acceptedSuggestions: number;
  rejectedSuggestions: number;
  modifiedSuggestions: number;
  averageConfidence: number;
  averageTimeToDecision: number; // segundos
  topDiagnoses: { cie10: string; count: number }[];
  topMedications: { name: string; count: number }[];
  userSatisfaction: number; // 0-5
}

// ============================================
// BASE DE CONOCIMIENTO SIMULADA (MOCK DATA)
// ============================================

// Catálogo CIE-10 (muestra representativa)
const CIE10_DATABASE: Record<string, CIE10Code[]> = {
  // Infecciones respiratorias - KEYWORDS PRIORITARIAS
  'fiebre dolor garganta': [
    {
      code: 'J06.9',
      description: 'Infección aguda de las vías respiratorias superiores, no especificada',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Infecciones agudas de las vías respiratorias superiores'
    }
  ],
  
  'tos fiebre': [
    {
      code: 'J06.9',
      description: 'Infección aguda de las vías respiratorias superiores, no especificada',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Infecciones agudas de las vías respiratorias superiores'
    }
  ],
  
  'dolor garganta malestar': [
    {
      code: 'J06.9',
      description: 'Infección aguda de las vías respiratorias superiores, no especificada',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Infecciones agudas de las vías respiratorias superiores'
    }
  ],
  
  'infección respiratoria': [
    {
      code: 'J06.9',
      description: 'Infección aguda de las vías respiratorias superiores, no especificada',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Infecciones agudas de las vías respiratorias superiores'
    },
    {
      code: 'J20.9',
      description: 'Bronquitis aguda, no especificada',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Otras infecciones agudas de las vías respiratorias inferiores'
    },
    {
      code: 'J18.9',
      description: 'Neumonía, no especificada',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Neumonía'
    }
  ],
  
  'gripe': [
    {
      code: 'J11.1',
      description: 'Gripe con otras manifestaciones respiratorias, virus no identificado',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Influenza'
    },
    {
      code: 'J10.1',
      description: 'Gripe con otras manifestaciones respiratorias, virus de la influenza identificado',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Influenza'
    }
  ],
  
  'tos': [
    {
      code: 'R05',
      description: 'Tos',
      category: 'Síntomas y signos generales',
      subcategory: 'Síntomas y signos que involucran el sistema respiratorio'
    },
    {
      code: 'J20.9',
      description: 'Bronquitis aguda, no especificada',
      category: 'Enfermedades del sistema respiratorio',
      subcategory: 'Otras infecciones agudas de las vías respiratorias inferiores'
    }
  ],
  
  // Hipertensión
  'hipertensión': [
    {
      code: 'I10',
      description: 'Hipertensión esencial (primaria)',
      category: 'Enfermedades del sistema circulatorio',
      subcategory: 'Enfermedades hipertensivas'
    },
    {
      code: 'I11.9',
      description: 'Enfermedad cardíaca hipertensiva sin insuficiencia cardíaca (congestiva)',
      category: 'Enfermedades del sistema circulatorio',
      subcategory: 'Enfermedades hipertensivas'
    }
  ],
  
  'presión alta': [
    {
      code: 'I10',
      description: 'Hipertensión esencial (primaria)',
      category: 'Enfermedades del sistema circulatorio',
      subcategory: 'Enfermedades hipertensivas'
    }
  ],
  
  // Diabetes
  'diabetes': [
    {
      code: 'E11.9',
      description: 'Diabetes mellitus no insulinodependiente, sin mención de complicación',
      category: 'Enfermedades endocrinas, nutricionales y metabólicas',
      subcategory: 'Diabetes mellitus'
    },
    {
      code: 'E10.9',
      description: 'Diabetes mellitus insulinodependiente, sin mención de complicación',
      category: 'Enfermedades endocrinas, nutricionales y metabólicas',
      subcategory: 'Diabetes mellitus'
    }
  ],
  
  // Dolor
  'dolor abdominal': [
    {
      code: 'R10.4',
      description: 'Otros dolores abdominales y los no especificados',
      category: 'Síntomas y signos generales',
      subcategory: 'Síntomas y signos que involucran el sistema digestivo'
    },
    {
      code: 'K59.0',
      description: 'Estreñimiento',
      category: 'Enfermedades del sistema digestivo',
      subcategory: 'Otros trastornos funcionales del intestino'
    }
  ],
  
  'dolor de cabeza': [
    {
      code: 'R51',
      description: 'Cefalea',
      category: 'Síntomas y signos generales',
      subcategory: 'Síntomas y signos que involucran el sistema nervioso'
    },
    {
      code: 'G43.9',
      description: 'Migraña, sin especificar',
      category: 'Enfermedades del sistema nervioso',
      subcategory: 'Trastornos episódicos y paroxísticos'
    }
  ],
  
  'migraña': [
    {
      code: 'G43.9',
      description: 'Migraña, sin especificar',
      category: 'Enfermedades del sistema nervioso',
      subcategory: 'Trastornos episódicos y paroxísticos'
    },
    {
      code: 'G43.0',
      description: 'Migraña sin aura',
      category: 'Enfermedades del sistema nervioso',
      subcategory: 'Trastornos episódicos y paroxísticos'
    }
  ],
  
  // Infecciones urinarias
  'infección urinaria': [
    {
      code: 'N39.0',
      description: 'Infección de vías urinarias, sitio no especificado',
      category: 'Enfermedades del sistema genitourinario',
      subcategory: 'Otros trastornos del sistema urinario'
    },
    {
      code: 'N30.0',
      description: 'Cistitis aguda',
      category: 'Enfermedades del sistema genitourinario',
      subcategory: 'Cistitis'
    }
  ],
  
  // Gastritis
  'gastritis': [
    {
      code: 'K29.7',
      description: 'Gastritis, no especificada',
      category: 'Enfermedades del sistema digestivo',
      subcategory: 'Gastritis y duodenitis'
    },
    {
      code: 'K29.0',
      description: 'Gastritis hemorrágica aguda',
      category: 'Enfermedades del sistema digestivo',
      subcategory: 'Gastritis y duodenitis'
    }
  ],
  
  // Ansiedad/Depresión
  'ansiedad': [
    {
      code: 'F41.9',
      description: 'Trastorno de ansiedad, no especificado',
      category: 'Trastornos mentales y del comportamiento',
      subcategory: 'Trastornos neuróticos'
    },
    {
      code: 'F41.0',
      description: 'Trastorno de pánico',
      category: 'Trastornos mentales y del comportamiento',
      subcategory: 'Trastornos neuróticos'
    }
  ],
  
  'depresión': [
    {
      code: 'F32.9',
      description: 'Episodio depresivo, no especificado',
      category: 'Trastornos mentales y del comportamiento',
      subcategory: 'Trastornos del humor (afectivos)'
    },
    {
      code: 'F33.9',
      description: 'Trastorno depresivo recurrente, no especificado',
      category: 'Trastornos mentales y del comportamiento',
      subcategory: 'Trastornos del humor (afectivos)'
    }
  ],
  
  // Cáncer / Oncología
  'cáncer páncreas': [
    {
      code: 'C25.9',
      description: 'Tumor maligno del páncreas, parte no especificada',
      category: 'Neoplasias',
      subcategory: 'Tumor maligno de los órganos digestivos'
    }
  ],
  
  'dolor oncológico': [
    {
      code: 'C25.9',
      description: 'Tumor maligno del páncreas, parte no especificada',
      category: 'Neoplasias',
      subcategory: 'Tumor maligno de los órganos digestivos'
    },
    {
      code: 'R52.2',
      description: 'Dolor crónico intratable',
      category: 'Síntomas y signos generales',
      subcategory: 'Dolor'
    }
  ],
  
  'dolor cáncer': [
    {
      code: 'R52.2',
      description: 'Dolor crónico intratable',
      category: 'Síntomas y signos generales',
      subcategory: 'Dolor'
    }
  ],
  
  // Ansiedad con comorbilidades
  'ansiedad insomnio': [
    {
      code: 'F41.2',
      description: 'Trastorno mixto de ansiedad y depresión',
      category: 'Trastornos mentales y del comportamiento',
      subcategory: 'Trastornos neuróticos'
    },
    {
      code: 'F41.9',
      description: 'Trastorno de ansiedad, no especificado',
      category: 'Trastornos mentales y del comportamiento',
      subcategory: 'Trastornos neuróticos'
    }
  ],
  
  'ansiedad infección urinaria': [
    {
      code: 'F41.2',
      description: 'Trastorno mixto de ansiedad y depresión',
      category: 'Trastornos mentales y del comportamiento',
      subcategory: 'Trastornos neuróticos'
    }
  ],
  
  // Post-operatorio
  'post operatorio': [
    {
      code: 'T81.8',
      description: 'Otras complicaciones de procedimientos, no clasificadas en otra parte',
      category: 'Traumatismos, envenenamientos y otras consecuencias',
      subcategory: 'Complicaciones de la atención médica y quirúrgica'
    },
    {
      code: 'T81.4',
      description: 'Infección consecutiva a procedimiento, no clasificada en otra parte',
      category: 'Traumatismos, envenenamientos y otras consecuencias',
      subcategory: 'Complicaciones de la atención médica y quirúrgica'
    }
  ],
  
  'dolor post quirúrgico': [
    {
      code: 'T81.8',
      description: 'Otras complicaciones de procedimientos, no clasificadas en otra parte',
      category: 'Traumatismos, envenenamientos y otras consecuencias',
      subcategory: 'Complicaciones de la atención médica y quirúrgica'
    }
  ],
  
  'cirugía abdominal': [
    {
      code: 'T81.8',
      description: 'Otras complicaciones de procedimientos, no clasificadas en otra parte',
      category: 'Traumatismos, envenenamientos y otras consecuencias',
      subcategory: 'Complicaciones de la atención médica y quirúrgica'
    }
  ]
};

// Templates de prescripción por diagnóstico
const PRESCRIPTION_TEMPLATES: Record<string, PrescriptionTemplate> = {
  'R05': { // Tos (síntoma)
    cie10Code: 'R05',
    clinicalGuideline: 'Guía de Manejo Sintomático de Tos Aguda',
    medications: [
      {
        id: 'med-r05-1',
        genericName: 'Dextrometorfano',
        commercialName: 'Romilar',
        dose: '15mg',
        via: 'Oral',
        frequency: 'Cada 6-8 horas',
        duration: '5 días',
        instructions: 'Antitusivo para tos seca no productiva. No usar si hay expectoración.',
        confidence: 0.82,
        reasoning: 'Supresor de tos de acción central para tos seca',
        stockStatus: 'disponible',
        alternatives: ['Levodropropizina 60mg'],
        interactions: ['No combinar con IMAOs'],
        contraindications: ['Tos productiva', 'Asma no controlada']
      },
      {
        id: 'med-r05-2',
        genericName: 'Ambroxol',
        commercialName: 'Mucosolvan',
        dose: '30mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '7 días',
        instructions: 'Para tos con flemas. Facilita expectoración.',
        confidence: 0.88,
        reasoning: 'Mucolítico para tos productiva',
        stockStatus: 'disponible',
        alternatives: ['Bromhexina 8mg', 'N-acetilcisteína 600mg'],
        interactions: [],
        contraindications: ['Úlcera gástrica activa']
      }
    ],
    additionalInstructions: 'Identificar causa subyacente de la tos. Hidratación abundante. Evitar irritantes respiratorios.',
    followUpRecommendation: 'Si tos persiste >3 semanas, descartar causa crónica (asma, reflujo, goteo post-nasal)'
  },
  
  'J06.9': { // Infección respiratoria superior
    cie10Code: 'J06.9',
    clinicalGuideline: 'Guía OMS de Tratamiento de Infecciones Respiratorias Agudas',
    medications: [
      {
        id: 'med-1',
        genericName: 'Paracetamol',
        commercialName: 'Acetaminofén',
        category: 'Receta Libre',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 6 horas',
        duration: '5 días',
        instructions: 'Tomar con alimentos. No exceder 4g/día.',
        confidence: 0.95,
        reasoning: 'Analgésico y antipirético de primera línea para síntomas gripales',
        stockStatus: 'disponible',
        alternatives: ['Ibuprofeno 400mg'],
        interactions: [],
        contraindications: ['Insuficiencia hepática severa'],
        clinicalGuideline: 'OMS - Primera línea para fiebre y dolor'
      },
      {
        id: 'med-2',
        genericName: 'Ambroxol',
        commercialName: 'Mucosolvan',
        category: 'Receta Libre',
        dose: '30mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '7 días',
        instructions: 'Tomar después de las comidas.',
        confidence: 0.88,
        reasoning: 'Mucolítico para facilitar expectoración',
        stockStatus: 'disponible',
        alternatives: ['Bromhexina 8mg'],
        interactions: [],
        contraindications: ['Úlcera gástrica activa']
      }
    ],
    additionalInstructions: 'Hidratación abundante. Reposo relativo. Evitar cambios bruscos de temperatura.',
    followUpRecommendation: 'Control en 5-7 días si persisten síntomas o empeoramiento'
  },
  
  'I10': { // Hipertensión esencial
    cie10Code: 'I10',
    clinicalGuideline: 'Guía ACC/AHA 2017 de Hipertensión Arterial',
    medications: [
      {
        id: 'med-3',
        genericName: 'Losartán',
        commercialName: 'Cozaar',
        dose: '50mg',
        via: 'Oral',
        frequency: 'Una vez al día',
        duration: 'Continuo',
        instructions: 'Tomar preferiblemente en la mañana. Monitorear presión arterial.',
        confidence: 0.92,
        reasoning: 'IECA de primera línea, cardio y neuroprotector',
        stockStatus: 'disponible',
        alternatives: ['Enalapril 10mg', 'Telmisartán 40mg'],
        interactions: ['Evitar AINEs', 'Precaución con diuréticos'],
        contraindications: ['Embarazo', 'Estenosis renal bilateral'],
        clinicalGuideline: 'ACC/AHA 2017 - Primera línea'
      },
      {
        id: 'med-4',
        genericName: 'Hidroclorotiazida',
        commercialName: 'HCTZ',
        dose: '12.5mg',
        via: 'Oral',
        frequency: 'Una vez al día',
        duration: 'Continuo',
        instructions: 'Tomar en la mañana para evitar nicturia. Monitorear electrolitos.',
        confidence: 0.85,
        reasoning: 'Diurético tiazídico, efecto sinérgico con IECA',
        stockStatus: 'disponible',
        alternatives: ['Clortalidona 12.5mg'],
        interactions: ['Aumenta riesgo de hipopotasemia'],
        contraindications: ['Insuficiencia renal severa', 'Gota']
      }
    ],
    additionalInstructions: 'Dieta hiposódica. Control de peso. Ejercicio regular 30min/día.',
    followUpRecommendation: 'Control en 2 semanas para evaluar respuesta. Laboratorios de función renal y electrolitos en 1 mes.'
  },
  
  'E11.9': { // Diabetes tipo 2
    cie10Code: 'E11.9',
    clinicalGuideline: 'Guía ADA 2024 - Manejo de Diabetes Mellitus tipo 2',
    medications: [
      {
        id: 'med-5',
        genericName: 'Metformina',
        commercialName: 'Glucophage',
        dose: '850mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: 'Continuo',
        instructions: 'Tomar con las comidas. Iniciar con dosis baja y aumentar gradualmente.',
        confidence: 0.96,
        reasoning: 'Primera línea según ADA. Reduce HbA1c 1-2%. Bajo riesgo de hipoglucemia.',
        stockStatus: 'disponible',
        alternatives: ['Metformina XR 1000mg'],
        interactions: ['Evitar alcohol', 'Suspender ante contraste yodado'],
        contraindications: ['FG <30 ml/min', 'Acidosis metabólica'],
        clinicalGuideline: 'ADA 2024 - Primera línea absoluta'
      }
    ],
    additionalInstructions: 'Dieta para diabetes. Ejercicio regular. Monitoreo de glucemia capilar.',
    followUpRecommendation: 'Control en 2 semanas. HbA1c y perfil lipídico en 3 meses.'
  },
  
  'N39.0': { // Infección urinaria
    cie10Code: 'N39.0',
    clinicalGuideline: 'Guía IDSA 2019 - Infecciones del Tracto Urinario',
    medications: [
      {
        id: 'med-6',
        genericName: 'Ciprofloxacina',
        commercialName: 'Cipro',
        category: 'Antimicrobianos',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Tomar con abundante agua. Evitar lácteos 2 horas antes/después.',
        confidence: 0.89,
        reasoning: 'Fluoroquinolona efectiva contra uropatógenos comunes',
        stockStatus: 'disponible',
        alternatives: ['Nitrofurantoína 100mg', 'Trimetoprim-sulfametoxazol'],
        interactions: ['Evitar antiácidos', 'Precaución con teofilina'],
        contraindications: ['Embarazo', 'Menores de 18 años', 'Tendinopatías'],
        clinicalGuideline: 'IDSA 2019 - Primera línea en infección no complicada'
      }
    ],
    additionalInstructions: 'Hidratación abundante (2-3 litros/día). Orinar frecuentemente. Higiene genital adecuada.',
    followUpRecommendation: 'Control en 3 días si no mejora. Urocultivo de control si síntomas persisten.'
  },
  
  'G43.9': { // Migraña
    cie10Code: 'G43.9',
    clinicalGuideline: 'Guía AAN/AHS 2021 - Tratamiento Agudo de Migraña',
    medications: [
      {
        id: 'med-7',
        genericName: 'Sumatriptán',
        commercialName: 'Imitrex',
        dose: '50mg',
        via: 'Oral',
        frequency: 'Al inicio de la crisis (máx 2 dosis/día)',
        duration: 'Según necesidad',
        instructions: 'Tomar al primer signo de migraña. Puede repetir dosis en 2 horas si no responde.',
        confidence: 0.91,
        reasoning: 'Triptán de primera línea. Efectivo en 70% de crisis migrañosas.',
        stockStatus: 'disponible',
        alternatives: ['Rizatriptán 10mg', 'Naratriptán 2.5mg'],
        interactions: ['No combinar con ergotamínicos', 'Precaución con ISRSs'],
        contraindications: ['Cardiopatía isquémica', 'Hipertensión no controlada'],
        clinicalGuideline: 'AAN/AHS 2021 - Nivel A de evidencia'
      },
      {
        id: 'med-8',
        genericName: 'Naproxeno',
        commercialName: 'Naprosyn',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: '3-5 días',
        instructions: 'Tomar con alimentos. Útil como coadyuvante del triptán.',
        confidence: 0.82,
        reasoning: 'AINE con buena evidencia en migraña. Efecto sinérgico con triptanes.',
        stockStatus: 'disponible',
        alternatives: ['Ibuprofeno 600mg'],
        interactions: ['Evitar con anticoagulantes'],
        contraindications: ['Úlcera péptica', 'Insuficiencia renal']
      }
    ],
    additionalInstructions: 'Identificar y evitar desencadenantes. Ambiente tranquilo y oscuro durante crisis. Registro de cefaleas.',
    followUpRecommendation: 'Control en 1 mes. Considerar profilaxis si >4 crisis/mes.'
  },
  
  'R10.4': { // Dolor abdominal
    cie10Code: 'R10.4',
    clinicalGuideline: 'Protocolo de Manejo de Dolor Abdominal Agudo',
    medications: [
      {
        id: 'med-r104-1',
        genericName: 'Ranitidina',
        commercialName: 'Zantac',
        dose: '150mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Tomar antes de las comidas. Útil para dolor relacionado con acidez.',
        confidence: 0.78,
        reasoning: 'Bloqueador H2 efectivo para dolor abdominal de origen gástrico',
        stockStatus: 'disponible',
        alternatives: ['Omeprazol 20mg', 'Famotidina 20mg'],
        interactions: [],
        contraindications: ['Hipersensibilidad conocida']
      },
      {
        id: 'med-r104-2',
        genericName: 'Butilhioscina',
        commercialName: 'Buscapina',
        dose: '10mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '3-5 días',
        instructions: 'Antiespasmódico para cólicos y dolor tipo cólico.',
        confidence: 0.85,
        reasoning: 'Antiespasmódico efectivo para dolor abdominal tipo cólico',
        stockStatus: 'disponible',
        alternatives: ['Mebeverina 135mg'],
        interactions: [],
        contraindications: ['Glaucoma de ángulo cerrado', 'Megacolon']
      },
      {
        id: 'med-r104-3',
        genericName: 'Paracetamol',
        commercialName: 'Acetaminofén',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 6-8 horas',
        duration: '3-5 días',
        instructions: 'Para el dolor. No exceder 4g/día.',
        confidence: 0.82,
        reasoning: 'Analgésico seguro para dolor abdominal leve a moderado',
        stockStatus: 'disponible',
        alternatives: ['Metamizol 500mg'],
        interactions: [],
        contraindications: ['Insuficiencia hepática severa']
      }
    ],
    additionalInstructions: 'Síntomas sugestivos de patología abdominal. Requiere evaluación clínica dirigida. Dieta blanda.',
    followUpRecommendation: 'Control en 48-72 horas. Si dolor intenso, fiebre o vómitos persistentes, acudir a urgencias.'
  },
  
  'K59.0': { // Estreñimiento
    cie10Code: 'K59.0',
    clinicalGuideline: 'Guía de Manejo de Estreñimiento Funcional',
    medications: [
      {
        id: 'med-k590-1',
        genericName: 'Lactulosa',
        commercialName: 'Duphalac',
        dose: '15ml',
        via: 'Oral',
        frequency: 'Una vez al día',
        duration: '7-14 días',
        instructions: 'Tomar preferiblemente en la mañana. Aumentar ingesta de líquidos.',
        confidence: 0.89,
        reasoning: 'Laxante osmótico de primera línea, seguro para uso prolongado',
        stockStatus: 'disponible',
        alternatives: ['Polietilenglicol 3350 17g'],
        interactions: [],
        contraindications: ['Obstrucción intestinal', 'Galactosemia']
      },
      {
        id: 'med-k590-2',
        genericName: 'Bisacodilo',
        commercialName: 'Dulcolax',
        dose: '5mg',
        via: 'Oral',
        frequency: 'Una vez al día (al acostarse)',
        duration: '3-5 días máximo',
        instructions: 'Estimulante intestinal. No usar a largo plazo.',
        confidence: 0.75,
        reasoning: 'Laxante estimulante para alivio rápido de estreñimiento agudo',
        stockStatus: 'disponible',
        alternatives: ['Senósidos 8.6mg'],
        interactions: [],
        contraindications: ['Obstrucción intestinal', 'Dolor abdominal agudo']
      }
    ],
    additionalInstructions: 'Aumentar fibra dietética (frutas, verduras, cereales integrales). Ejercicio regular. Ingesta de 2 litros de agua/día.',
    followUpRecommendation: 'Control en 2 semanas. Si no mejora, considerar estudios adicionales.'
  },

  'K21.9': { // Enfermedad por reflujo gastroesofágico
    cie10Code: 'K21.9',
    clinicalGuideline: 'Guía ACG 2022 - Manejo de ERGE',
    medications: [
      {
        id: 'med-k219-1',
        genericName: 'Omeprazol',
        commercialName: 'Prilosec',
        dose: '20mg',
        via: 'Oral',
        frequency: 'Una vez al día antes del desayuno',
        duration: '4-8 semanas',
        instructions: 'Tomar 30 minutos antes de la primera comida del día.',
        confidence: 0.94,
        reasoning: 'IBP de primera línea según ACG. Supresión ácida potente.',
        stockStatus: 'disponible',
        alternatives: ['Pantoprazol 40mg', 'Lansoprazol 30mg'],
        interactions: ['Puede reducir absorción de hierro y vitamina B12'],
        contraindications: ['Hipersensibilidad a IBPs'],
        clinicalGuideline: 'ACG 2022 - Primera línea para ERGE'
      }
    ],
    additionalInstructions: 'Evitar comidas copiosas. No acostarse inmediatamente después de comer. Elevar cabecera de la cama. Evitar alimentos que desencadenan síntomas (cítricos, picantes, café, alcohol).',
    followUpRecommendation: 'Control en 4 semanas. Si no mejora, considerar endoscopia.'
  },

  'J00': { // Rinofaringitis aguda (resfriado común)
    cie10Code: 'J00',
    clinicalGuideline: 'Guía de Manejo de Infecciones Respiratorias Virales',
    medications: [
      {
        id: 'med-j00-1',
        genericName: 'Paracetamol',
        commercialName: 'Tylenol',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 6 horas según necesidad',
        duration: '5 días',
        instructions: 'Para fiebre y malestar general.',
        confidence: 0.92,
        reasoning: 'Tratamiento sintomático estándar para resfriado común',
        stockStatus: 'disponible',
        alternatives: ['Ibuprofeno 400mg'],
        interactions: [],
        contraindications: ['Insuficiencia hepática']
      },
      {
        id: 'med-j00-2',
        genericName: 'Pseudoefedrina',
        commercialName: 'Sudafed',
        dose: '60mg',
        via: 'Oral',
        frequency: 'Cada 6 horas',
        duration: '5 días',
        instructions: 'Descongestionante nasal. Evitar en la noche (puede causar insomnio).',
        confidence: 0.80,
        reasoning: 'Descongestionante oral efectivo para congestión nasal',
        stockStatus: 'disponible',
        alternatives: ['Fenilefrina 10mg'],
        interactions: ['Evitar con IMAOs'],
        contraindications: ['Hipertensión no controlada', 'Cardiopatía']
      }
    ],
    additionalInstructions: 'Reposo. Hidratación abundante. Lavados nasales con solución salina. No requiere antibióticos.',
    followUpRecommendation: 'Autolimitado en 7-10 días. Consultar si fiebre >39°C persistente o dificultad respiratoria.'
  },

  'A09': { // Diarrea y gastroenteritis de presunto origen infeccioso
    cie10Code: 'A09',
    clinicalGuideline: 'Guía OMS - Manejo de Diarrea Aguda',
    medications: [
      {
        id: 'med-a09-1',
        genericName: 'Sales de rehidratación oral',
        commercialName: 'Pedialyte',
        dose: '1 sobre en 1 litro de agua',
        via: 'Oral',
        frequency: 'Según necesidad',
        duration: '3-5 días',
        instructions: 'Tomar después de cada evacuación líquida. Previene deshidratación.',
        confidence: 0.98,
        reasoning: 'Pilar del tratamiento según OMS. Previene y trata deshidratación.',
        stockStatus: 'disponible',
        alternatives: ['Suero oral casero'],
        interactions: [],
        contraindications: [],
        clinicalGuideline: 'OMS - Evidencia nivel 1'
      },
      {
        id: 'med-a09-2',
        genericName: 'Racecadotrilo',
        commercialName: 'Hidrasec',
        dose: '100mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '3-5 días',
        instructions: 'Antisecretor intestinal. No paraliza el intestino.',
        confidence: 0.83,
        reasoning: 'Reduce secreción intestinal sin afectar motilidad',
        stockStatus: 'disponible',
        alternatives: ['Loperamida 2mg (con precaución)'],
        interactions: [],
        contraindications: ['Diarrea sanguinolenta', 'Fiebre alta']
      }
    ],
    additionalInstructions: 'Hidratación abundante. Dieta astringente (arroz, plátano, manzana). Evitar lácteos temporalmente. Lavado de manos frecuente.',
    followUpRecommendation: 'Control si diarrea persiste >3 días, sangre en heces, fiebre alta o signos de deshidratación.'
  },
  
  // ============================================
  // CASOS COMPLEJOS - MÚLTIPLES CATEGORÍAS
  // ============================================
  
  'T81.4': { // Dolor post-operatorio con infección
    cie10Code: 'T81.4',
    clinicalGuideline: 'Guía de Manejo Post-Operatorio - Cirugía Abdominal Mayor',
    medications: [
      {
        id: 'med-postop-1',
        genericName: 'Morfina',
        commercialName: 'Morfina',
        category: 'Estupefacientes',
        dose: '10mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '7 días',
        instructions: 'Para dolor severo post-operatorio. Puede causar somnolencia y estreñimiento.',
        confidence: 0.95,
        reasoning: 'Analgésico opioide mayor para dolor severo post-quirúrgico',
        stockStatus: 'disponible',
        alternatives: ['Fentanilo 100mcg transdérmico'],
        interactions: ['No combinar con alcohol', 'Precaución con benzodiacepinas'],
        contraindications: ['Depresión respiratoria', 'Íleo paralítico']
      },
      {
        id: 'med-postop-2',
        genericName: 'Cefazolina',
        commercialName: 'Ancef',
        category: 'Antimicrobianos',
        dose: '1g',
        via: 'Intravenosa',
        frequency: 'Cada 12 horas',
        duration: '10 días',
        instructions: 'Profilaxis antimicrobiana post-operatoria. Administrar lentamente.',
        confidence: 0.92,
        reasoning: 'Cefalosporina de primera generación para profilaxis quirúrgica',
        stockStatus: 'disponible',
        alternatives: ['Cefuroxima 1.5g IV'],
        interactions: [],
        contraindications: ['Alergia a betalactámicos']
      },
      {
        id: 'med-postop-3',
        genericName: 'Omeprazol',
        commercialName: 'Losec',
        category: 'Receta Libre',
        dose: '20mg',
        via: 'Oral',
        frequency: 'Cada 24 horas',
        duration: '14 días',
        instructions: 'Protección gástrica. Tomar 30 minutos antes del desayuno.',
        confidence: 0.90,
        reasoning: 'Inhibidor de bomba de protones para protección gástrica con opioides',
        stockStatus: 'disponible',
        alternatives: ['Pantoprazol 40mg'],
        interactions: ['Puede reducir absorción de clopidogrel'],
        contraindications: ['Hipersensibilidad conocida']
      }
    ],
    additionalInstructions: 'Control de herida quirúrgica. Deambulación precoz. Dieta progresiva según tolerancia.',
    followUpRecommendation: 'Control en 3 días para evaluar herida y respuesta analgésica. Control en 10 días para retiro de puntos.'
  },
  
  'F41.1': { // Trastorno de ansiedad con insomnio e infección urinaria
    cie10Code: 'F41.1',
    clinicalGuideline: 'Guía de Tratamiento de Trastorno de Ansiedad Generalizada',
    medications: [
      {
        id: 'med-anx-1',
        genericName: 'Clonazepam',
        commercialName: 'Rivotril',
        category: 'Psicotrópicos',
        dose: '2mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: '14 días',
        instructions: 'Para ansiedad e insomnio. Puede causar somnolencia. No conducir.',
        confidence: 0.88,
        reasoning: 'Benzodiacepina de acción prolongada para ansiedad generalizada',
        stockStatus: 'disponible',
        alternatives: ['Alprazolam 0.5mg', 'Lorazepam 1mg'],
        interactions: ['Potencia efecto con alcohol', 'No combinar con opioides'],
        contraindications: ['Glaucoma de ángulo estrecho', 'Miastenia gravis']
      },
      {
        id: 'med-anx-2',
        genericName: 'Nitrofurantoína',
        commercialName: 'Macrodantina',
        category: 'Antimicrobianos',
        dose: '100mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Para infección urinaria concomitante. Tomar con alimentos.',
        confidence: 0.87,
        reasoning: 'Antibiótico específico para tracto urinario inferior',
        stockStatus: 'disponible',
        alternatives: ['Ciprofloxacina 500mg'],
        interactions: ['No usar con antiácidos'],
        contraindications: ['Insuficiencia renal severa', 'Embarazo a término']
      },
      {
        id: 'med-anx-3',
        genericName: 'Paracetamol',
        commercialName: 'Acetaminofén',
        category: 'Receta Libre',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 8 horas según necesidad',
        duration: '5 días',
        instructions: 'Para malestar general y fiebre si presenta. No exceder 3g/día.',
        confidence: 0.82,
        reasoning: 'Analgésico y antipirético seguro para sintomatología asociada',
        stockStatus: 'disponible',
        alternatives: ['Ibuprofeno 400mg'],
        interactions: [],
        contraindications: ['Insuficiencia hepática']
      }
    ],
    additionalInstructions: 'Terapia psicológica cognitivo-conductual. Técnicas de relajación. Hidratación abundante para ITU.',
    followUpRecommendation: 'Control en 7 días para evaluar respuesta. Considerar tratamiento antidepresivo a largo plazo si ansiedad persiste.'
  },
  
  'J18.9': { // Neumonía comunitaria severa
    cie10Code: 'J18.9',
    clinicalGuideline: 'Guía ATS/IDSA 2019 - Neumonía Adquirida en la Comunidad',
    medications: [
      {
        id: 'med-pneum-1',
        genericName: 'Ceftriaxona',
        commercialName: 'Rocephin',
        category: 'Antimicrobianos',
        dose: '2g',
        via: 'Intravenosa',
        frequency: 'Cada 24 horas',
        duration: '10 días',
        instructions: 'Cefalosporina de tercera generación. Cobertura empírica amplia.',
        confidence: 0.94,
        reasoning: 'Primera línea para neumonía comunitaria severa',
        stockStatus: 'disponible',
        alternatives: ['Cefotaxima 2g IV'],
        interactions: [],
        contraindications: ['Alergia a betalactámicos']
      },
      {
        id: 'med-pneum-2',
        genericName: 'Azitromicina',
        commercialName: 'Zithromax',
        category: 'Antimicrobianos',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 24 horas',
        duration: '5 días',
        instructions: 'Cobertura para gérmenes atípicos. Tomar 1 hora antes o 2 horas después de comidas.',
        confidence: 0.90,
        reasoning: 'Macrólido para cobertura de Mycoplasma y Chlamydia',
        stockStatus: 'disponible',
        alternatives: ['Claritromicina 500mg'],
        interactions: ['Prolonga QT', 'No usar con estatinas'],
        contraindications: ['Arritmias cardiacas']
      },
      {
        id: 'med-pneum-3',
        genericName: 'Tramadol',
        commercialName: 'Tramal',
        category: 'Receta Libre',
        dose: '50mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '5 días',
        instructions: 'Para dolor torácico asociado. Puede causar náuseas inicialmente.',
        confidence: 0.80,
        reasoning: 'Analgésico para dolor pleurítico asociado',
        stockStatus: 'disponible',
        alternatives: ['Paracetamol 1g'],
        interactions: ['Precaución con ISRSs'],
        contraindications: ['Epilepsia no controlada']
      }
    ],
    additionalInstructions: 'Hospitalización si criterios de severidad. Oxigenoterapia si SpO2 <92%. Hidratación IV. Reposo absoluto.',
    followUpRecommendation: 'Radiografía de control en 48-72 horas. Re-evaluación clínica diaria. Alta según mejoría clínica y radiológica.'
  },
  
  // ============================================
  // CASOS CLÍNICOS REALISTAS - MEZCLA DE CATEGORÍAS
  // ============================================
  
  'C25.9': { // Caso 1: Dolor Oncológico Severo + Infección
    cie10Code: 'C25.9',
    clinicalGuideline: 'Guía NCCN de Cuidados Paliativos en Cáncer de Páncreas',
    medications: [
      {
        id: 'med-onco-1',
        genericName: 'Morfina',
        commercialName: 'Morfina Sulfato',
        category: 'Estupefacientes',
        dose: '10mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '14 días',
        instructions: 'Para dolor severo oncológico. Iniciar con dosis baja y titular según respuesta. Puede causar somnolencia y estreñimiento.',
        confidence: 0.96,
        reasoning: 'Opioide mayor de primera línea para dolor oncológico severo según OMS',
        stockStatus: 'disponible',
        alternatives: ['Oxicodona 5mg', 'Hidromorfona 2mg'],
        interactions: ['No combinar con alcohol', 'Precaución con benzodiacepinas', 'Evitar IMAOs'],
        contraindications: ['Depresión respiratoria severa', 'Íleo paralítico'],
        clinicalGuideline: 'Escalera analgésica OMS - Nivel 3'
      },
      {
        id: 'med-onco-2',
        genericName: 'Ciprofloxacino',
        commercialName: 'Cipro',
        category: 'Antimicrobianos',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: '10 días',
        instructions: 'Para infección bacteriana secundaria. Tomar con abundante agua. Evitar lácteos 2 horas antes/después.',
        confidence: 0.90,
        reasoning: 'Fluoroquinolona de amplio espectro para infección en paciente inmunodeprimido',
        stockStatus: 'disponible',
        alternatives: ['Levofloxacino 500mg', 'Moxifloxacino 400mg'],
        interactions: ['Evitar antiácidos', 'Precaución con teofilina', 'Prolonga QT'],
        contraindications: ['Embarazo', 'Menores de 18 años', 'Tendinopatías'],
        clinicalGuideline: 'IDSA - Tratamiento empírico en inmunosupresión'
      },
      {
        id: 'med-onco-3',
        genericName: 'Omeprazol',
        commercialName: 'Losec',
        category: 'Receta Libre',
        dose: '20mg',
        via: 'Oral',
        frequency: 'Cada 24 horas',
        duration: '30 días',
        instructions: 'Protección gástrica por uso de opioides. Tomar 30 minutos antes del desayuno en ayunas.',
        confidence: 0.93,
        reasoning: 'Inhibidor de bomba de protones para prevenir gastritis por AINES y opioides',
        stockStatus: 'disponible',
        alternatives: ['Pantoprazol 40mg', 'Esomeprazol 40mg'],
        interactions: ['Puede reducir absorción de clopidogrel'],
        contraindications: ['Hipersensibilidad conocida'],
        clinicalGuideline: 'ACG - Prevención de gastritis medicamentosa'
      },
      {
        id: 'med-onco-4',
        genericName: 'Ondansetrón',
        commercialName: 'Zofran',
        category: 'Receta Libre',
        dose: '8mg',
        via: 'Oral',
        frequency: 'Cada 8 horas según necesidad',
        duration: '14 días',
        instructions: 'Para náuseas y vómitos asociados a opioides o enfermedad. Disolver en la boca.',
        confidence: 0.89,
        reasoning: 'Antiemético potente para náuseas inducidas por opioides y cáncer',
        stockStatus: 'disponible',
        alternatives: ['Metoclopramida 10mg', 'Granisetrón 1mg'],
        interactions: ['Prolonga QT', 'No combinar con apomorfina'],
        contraindications: ['Síndrome QT largo congénito'],
        clinicalGuideline: 'MASCC/ESMO - Manejo de náuseas y vómitos'
      }
    ],
    additionalInstructions: 'Cuidados paliativos. Monitoreo de función intestinal (laxantes profilácticos con morfina). Control oncológico multidisciplinario. Apoyo psicológico. Valorar equipo de dolor y cuidados paliativos.',
    followUpRecommendation: 'Control en 3-5 días para evaluar control del dolor y efectos adversos. Ajuste de dosis según respuesta. Seguimiento oncológico según protocolo. Interconsulta a cuidados paliativos si no está ya establecida.'
  },
  
  'F41.2': { // Caso 2: Trastorno de Ansiedad con Insomnio e Infección Urinaria
    cie10Code: 'F41.2',
    clinicalGuideline: 'Guía NICE de Trastorno de Ansiedad Generalizada + Tratamiento ITU',
    medications: [
      {
        id: 'med-anx-itu-1',
        genericName: 'Clonazepam',
        commercialName: 'Rivotril',
        category: 'Psicotrópicos',
        dose: '2mg',
        via: 'Oral',
        frequency: 'Cada 12 horas (0.5mg mañana, 1.5mg noche)',
        duration: '14 días',
        instructions: 'Para ansiedad generalizada e insomnio. Tomar dosis mayor en la noche. Puede causar somnolencia - NO CONDUCIR. No suspender bruscamente.',
        confidence: 0.88,
        reasoning: 'Benzodiacepina de acción prolongada, efectiva para ansiedad y como hipnótico',
        stockStatus: 'disponible',
        alternatives: ['Alprazolam 0.5mg', 'Lorazepam 1mg', 'Diazepam 5mg'],
        interactions: ['Potencia efecto sedante del alcohol', 'No combinar con opioides sin supervisión', 'Aumenta toxicidad con cimetidina'],
        contraindications: ['Glaucoma de ángulo estrecho', 'Miastenia gravis', 'Insuficiencia respiratoria severa'],
        clinicalGuideline: 'APA - Tratamiento a corto plazo de ansiedad generalizada'
      },
      {
        id: 'med-anx-itu-2',
        genericName: 'Nitrofurantoína',
        commercialName: 'Macrodantina',
        category: 'Antimicrobianos',
        dose: '100mg',
        via: 'Oral',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Para infección urinaria no complicada. Tomar CON ALIMENTOS para mejorar absorción y reducir náuseas. Puede colorear la orina de amarillo oscuro/marrón (normal).',
        confidence: 0.91,
        reasoning: 'Antibiótico específico para tracto urinario inferior, primera línea en ITU no complicada',
        stockStatus: 'disponible',
        alternatives: ['Ciprofloxacina 500mg', 'Trimetoprim-sulfametoxazol 160/800mg', 'Fosfomicina 3g dosis única'],
        interactions: ['No usar con antiácidos que contengan magnesio', 'Reduce eficacia de quinolonas'],
        contraindications: ['Insuficiencia renal severa (ClCr <60 ml/min)', 'Embarazo a término (>38 sem)', 'Deficiencia de G6PD'],
        clinicalGuideline: 'IDSA 2019 - Primera línea en ITU no complicada'
      },
      {
        id: 'med-anx-itu-3',
        genericName: 'Paracetamol',
        commercialName: 'Acetaminofén',
        category: 'Receta Libre',
        dose: '500mg',
        via: 'Oral',
        frequency: 'Cada 8 horas según necesidad',
        duration: '5 días',
        instructions: 'Para malestar general, fiebre o disuria. Tomar con alimentos. NO EXCEDER 3g/día (6 tabletas).',
        confidence: 0.85,
        reasoning: 'Analgésico y antipirético seguro para sintomatología asociada a ITU y ansiedad somática',
        stockStatus: 'disponible',
        alternatives: ['Ibuprofeno 400mg (precaución con benzodiacepinas)'],
        interactions: ['Alcohol aumenta riesgo hepatotóxico', 'Warfarina (monitorear INR)'],
        contraindications: ['Insuficiencia hepática severa', 'Hepatitis activa'],
        clinicalGuideline: 'OMS - Analgésico de primera línea'
      }
    ],
    additionalInstructions: 'Terapia cognitivo-conductual como tratamiento de base para ansiedad. Técnicas de relajación (respiración diafragmática, mindfulness). Hidratación abundante 2-3 litros/día para ITU. Orinar frecuentemente, no retener orina. Higiene genital adecuada. Evitar irritantes vesicales (café, alcohol, picantes). Considerar descontinuación gradual de benzodiacepina después de 2-4 semanas y cambio a ISRS si ansiedad persiste.',
    followUpRecommendation: 'Control en 3 días para evaluar respuesta a antibiótico y síntomas de ITU. Control en 7 días para evaluar ansiedad y planificar retiro gradual de benzodiacepina. Urocultivo de control NO necesario si resolución clínica. Interconsulta a psiquiatría/psicología para manejo a largo plazo de ansiedad.'
  },
  
  'T81.8': { // Caso 3: Post-operatorio Complejo con múltiples medicamentos
    cie10Code: 'T81.8',
    clinicalGuideline: 'Guía WHO de Cuidados Post-Operatorios en Cirugía Abdominal Mayor',
    medications: [
      {
        id: 'med-postop-fent-1',
        genericName: 'Fentanilo Transdérmico',
        commercialName: 'Durogesic',
        category: 'Estupefacientes',
        dose: '100mcg/hora',
        via: 'Transdérmica',
        frequency: 'Cambiar parche cada 72 horas',
        duration: '9 días (3 parches)',
        instructions: 'Para dolor severo post-operatorio continuo. Aplicar en piel sana, sin vello, área plana (tórax, espalda, brazo). Rotar sitio de aplicación. NO CORTAR EL PARCHE. Tarda 12-24h en hacer efecto completo.',
        confidence: 0.94,
        reasoning: 'Opioide transdérmico de liberación sostenida para dolor basal post-quirúrgico severo',
        stockStatus: 'disponible',
        alternatives: ['Morfina oral 30mg c/8h', 'Buprenorfina transdérmica 35mcg/h'],
        interactions: ['No combinar con alcohol', 'Precaución con benzodiacepinas', 'La fiebre aumenta absorción'],
        contraindications: ['Depresión respiratoria', 'Dolor agudo que requiere titulación rápida', 'Íleo paralítico'],
        clinicalGuideline: 'ASA - Manejo de dolor post-operatorio severo'
      },
      {
        id: 'med-postop-fent-2',
        genericName: 'Cefazolina',
        commercialName: 'Ancef',
        category: 'Antimicrobianos',
        dose: '1g',
        via: 'Intravenosa',
        frequency: 'Cada 12 horas',
        duration: '7 días',
        instructions: 'Profilaxis antimicrobiana post-operatoria. Administrar en 30 minutos IV lento. Observar reacciones alérgicas.',
        confidence: 0.93,
        reasoning: 'Cefalosporina de primera generación, gold standard para profilaxis en cirugía abdominal',
        stockStatus: 'disponible',
        alternatives: ['Cefuroxima 1.5g IV', 'Cefoxitina 2g IV'],
        interactions: ['Probenecid aumenta niveles', 'Evitar aminoglucósidos (nefrotoxicidad)'],
        contraindications: ['Alergia severa a betalactámicos', 'Antecedente de anafilaxia a penicilinas'],
        clinicalGuideline: 'ASHP - Profilaxis quirúrgica estándar'
      },
      {
        id: 'med-postop-fent-3',
        genericName: 'Metronidazol',
        commercialName: 'Flagyl',
        category: 'Antimicrobianos',
        dose: '500mg',
        via: 'Intravenosa',
        frequency: 'Cada 8 horas',
        duration: '7 días',
        instructions: 'Cobertura anaeróbica en cirugía abdominal. Infundir en 30-60 minutos. Puede causar sabor metálico.',
        confidence: 0.92,
        reasoning: 'Antibiótico anaerobicida, esencial en cirugía colorrectal y abdominal contaminada',
        stockStatus: 'disponible',
        alternatives: ['Clindamicina 900mg IV'],
        interactions: ['EFECTO ANTABUSE con alcohol (evitar durante tratamiento y 48h después)', 'Aumenta efecto de warfarina'],
        contraindications: ['Primer trimestre de embarazo', 'Alergia conocida'],
        clinicalGuideline: 'SIS - Tratamiento de infecciones anaeróbicas'
      },
      {
        id: 'med-postop-fent-4',
        genericName: 'Tramadol',
        commercialName: 'Tramal',
        category: 'Receta Libre',
        dose: '50mg',
        via: 'Oral',
        frequency: 'Cada 8 horas',
        duration: '10 días',
        instructions: 'Para dolor moderado de rescate. Tomar con alimentos si causa náuseas. NO exceder 400mg/día.',
        confidence: 0.87,
        reasoning: 'Analgésico opioide débil para dolor incidental y transición del fentanilo',
        stockStatus: 'disponible',
        alternatives: ['Ketorolaco 10mg (máximo 5 días)', 'Paracetamol 1g'],
        interactions: ['Precaución con ISRSs (riesgo de síndrome serotoninérgico)', 'No combinar con IMAOs'],
        contraindications: ['Epilepsia no controlada', 'Uso de IMAOs en últimas 2 semanas'],
        clinicalGuideline: 'OMS - Escalón 2 de analgesia'
      }
    ],
    additionalInstructions: 'Post-operatorio de cirugía abdominal mayor. Control estricto de herida quirúrgica (curación diaria, signos de infección). Deambulación precoz (inicio en 24-48h según tolerancia). Dieta progresiva: líquidos claros → completa → blanda → normal según tolerancia y tránsito intestinal. Ejercicios respiratorios para prevenir atelectasias. Medias de compresión para TVP. Monitoreo de signos vitales. Control de balance hídrico. Retiro gradual de sonda vesical y drenajes según evolución.',
    followUpRecommendation: 'Control diario hospitalario: evaluación de dolor (EVA), herida quirúrgica, signos vitales, tránsito intestinal, tolerancia oral. Control ambulatorio en 3 días post-alta. Retiro de puntos/grapas en 10-14 días según ubicación. Considerar transición de fentanilo transdérmico a opioides orales según evolución del dolor. Suspender antibióticos a los 7 días si evolución favorable. Laboratorios de control: BHC, PCR, función renal en día 3 y 7.'
  }
};

// ============================================
// MOTOR DE IA SIMULADO (NLP)
// ============================================

/**
 * Simula un modelo NLP tipo BERT clínico o BioGPT
 * En producción: API a servicio de ML (AWS SageMaker, Azure ML, Google AI)
 */
class AIEngine {
  /**
   * Procesa texto clínico y sugiere diagnósticos CIE-10
   */
  static suggestDiagnoses(clinicalDescription: string): DiagnosticSuggestion[] {
    const normalizedText = clinicalDescription.toLowerCase().trim();
    
    // Buscar coincidencias en base de conocimiento
    const suggestions: DiagnosticSuggestion[] = [];
    const keywordMatches: { keyword: string; codes: CIE10Code[]; matchScore: number }[] = [];
    
    // Primero, encontrar todas las coincidencias y calcular puntuación
    for (const [keyword, codes] of Object.entries(CIE10_DATABASE)) {
      const keywords = keyword.split(' ');
      let matchCount = 0;
      
      // Contar cuántas palabras clave coinciden
      keywords.forEach(kw => {
        if (normalizedText.includes(kw)) {
          matchCount++;
        }
      });
      
      if (matchCount > 0) {
        const matchScore = matchCount / keywords.length; // 0 a 1
        keywordMatches.push({ keyword, codes, matchScore });
      }
    }
    
    // Ordenar por mejor coincidencia (más palabras clave coincidentes)
    keywordMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    // Generar sugerencias de las mejores coincidencias
    let position = 0;
    for (const match of keywordMatches.slice(0, 5)) { // Top 5 coincidencias
      match.codes.forEach((cie10, index) => {
        // Calcular confianza basada en coincidencia y posición
        const confidence = this.calculateConfidence(normalizedText, match.keyword, position) * match.matchScore;
        position++;
        
        suggestions.push({
          cie10,
          confidence,
          reasoning: this.generateReasoning(match.keyword, normalizedText),
          clinicalNotes: this.generateClinicalNotes(cie10.code),
          prevalence: this.getPrevalence(cie10.code),
          references: [
            'CIE-10 OMS 2024',
            'UpToDate Clinical Guidelines'
          ]
        });
      });
    }
    
    // Ordenar por confianza y retornar top 5
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }
  
  /**
   * Genera receta preliminar basada en diagnóstico
   */
  static generatePrescription(cie10Code: string, patientProfile?: any): MedicationSuggestion[] {
    const template = PRESCRIPTION_TEMPLATES[cie10Code];
    
    if (!template) {
      return [];
    }
    
    // En producción: ajustar según perfil del paciente
    // (edad, peso, alergias, medicamentos actuales, función renal, etc.)
    return template.medications;
  }
  
  /**
   * Obtiene template completo de prescripción
   */
  static getPrescriptionTemplate(cie10Code: string): PrescriptionTemplate | null {
    return PRESCRIPTION_TEMPLATES[cie10Code] || null;
  }
  
  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================
  
  private static calculateConfidence(text: string, keyword: string, position: number): number {
    // Fórmula simple de confianza
    // En producción: salida del modelo ML
    let confidence = 0.7;
    
    // Bonus por coincidencia exacta
    if (text === keyword) confidence += 0.2;
    
    // Penalty por posición (primeras sugerencias más confiables)
    confidence -= position * 0.05;
    
    // Bonus por palabras clave adicionales
    const medicalTerms = ['aguda', 'crónica', 'severa', 'leve', 'moderada'];
    medicalTerms.forEach(term => {
      if (text.includes(term)) confidence += 0.03;
    });
    
    return Math.max(0.5, Math.min(0.99, confidence));
  }
  
  private static generateReasoning(keyword: string, fullText: string): string {
    const reasonings: Record<string, string> = {
      'fiebre dolor garganta': 'Tríada clásica de infección respiratoria aguda: fiebre + odinofagia + síntomas sistémicos. Alta probabilidad de etiología viral.',
      'tos fiebre': 'Combinación de síntomas respiratorios y sistémicos sugestiva de infección de vías respiratorias superiores.',
      'dolor garganta malestar': 'Síntomas compatibles con faringitis o infección respiratoria superior aguda.',
      'infección respiratoria': 'Cuadro clínico compatible con infección de vías respiratorias. Síntomas sugestivos de compromiso del tracto respiratorio.',
      'hipertensión': 'Patrón sintomático consistente con hipertensión arterial. Requiere confirmación con mediciones seriadas.',
      'diabetes': 'Presentación clínica compatible con diabetes mellitus. Confirmar con HbA1c y glucemia en ayunas.',
      'dolor abdominal': 'Síntomas sugestivos de patología abdominal. Requiere evaluación clínica dirigida.',
      'migraña': 'Cefalea con características migrañosas según criterios ICHD-3.',
      'infección urinaria': 'Síntomas compatibles con infección del tracto urinario. Confirmar con urocultivo.',
      'gastritis': 'Cuadro clínico sugestivo de gastritis. Considerar endoscopia si síntomas persisten.',
      'ansiedad': 'Síntomas compatibles con trastorno de ansiedad según DSM-5.',
      'gripe': 'Síndrome gripal agudo. Compatible con infección viral respiratoria.',
      'tos': 'Tos como síntoma cardinal. Evaluar causa subyacente.'
    };
    
    return reasonings[keyword] || 'Análisis de NLP sugiere correlación con el diagnóstico basado en términos clínicos identificados.';
  }
  
  private static generateClinicalNotes(cie10Code: string): string {
    const notes: Record<string, string> = {
      'J06.9': 'Considerar etiología viral. Antibióticos solo si sospecha bacteriana.',
      'I10': 'Medir PA en ambos brazos. Descartar HTA secundaria en jóvenes.',
      'E11.9': 'Solicitar HbA1c, perfil lipídico, función renal. Educar sobre automonitoreo.',
      'N39.0': 'Urocultivo antes de iniciar antibiótico en casos complicados.',
      'G43.9': 'Diario de cefaleas. Evaluar necesidad de profilaxis.',
      'K29.7': 'Considerar test para H. pylori. Evitar AINEs.'
    };
    
    return notes[cie10Code] || 'Seguir guías clínicas actualizadas para manejo.';
  }
  
  private static getPrevalence(cie10Code: string): string {
    const prevalence: Record<string, string> = {
      'J06.9': 'alta',
      'I10': 'alta',
      'E11.9': 'alta',
      'N39.0': 'media',
      'G43.9': 'media',
      'K29.7': 'media'
    };
    
    return prevalence[cie10Code] || 'media';
  }
}

// ============================================
// STORE DE AUDITORÍA
// ============================================

let auditLogs: AIAuditLog[] = [];
let currentLogId = 1;

/**
 * Registra uso del asistente de IA
 */
export function logAIUsage(log: Omit<AIAuditLog, 'id' | 'timestamp'>): void {
  const newLog: AIAuditLog = {
    ...log,
    id: `AI-LOG-${currentLogId++}`,
    timestamp: new Date().toISOString()
  };
  
  auditLogs.push(newLog);
  
  console.log('🤖 AI Usage Logged:', newLog);
}

/**
 * Obtiene todos los logs de auditoría
 */
export function getAuditLogs(): AIAuditLog[] {
  return [...auditLogs];
}

/**
 * Calcula métricas agregadas
 */
export function calculateAIMetrics(): AIMetrics {
  if (auditLogs.length === 0) {
    return {
      totalSuggestions: 0,
      acceptedSuggestions: 0,
      rejectedSuggestions: 0,
      modifiedSuggestions: 0,
      averageConfidence: 0,
      averageTimeToDecision: 0,
      topDiagnoses: [],
      topMedications: [],
      userSatisfaction: 0
    };
  }
  
  let totalSuggestions = 0;
  let acceptedSuggestions = 0;
  let rejectedSuggestions = 0;
  let modifiedSuggestions = 0;
  let totalConfidence = 0;
  let totalTime = 0;
  let totalSatisfaction = 0;
  let satisfactionCount = 0;
  
  const diagnosisCount: Record<string, number> = {};
  const medicationCount: Record<string, number> = {};
  
  auditLogs.forEach(log => {
    totalSuggestions += log.suggestedDiagnoses.length + log.suggestedMedications.length;
    acceptedSuggestions += log.selectedMedications.length;
    rejectedSuggestions += log.rejectedSuggestions.length;
    modifiedSuggestions += log.modifiedMedications.length;
    
    log.suggestedDiagnoses.forEach(d => {
      totalConfidence += d.confidence;
    });
    
    log.suggestedMedications.forEach(m => {
      totalConfidence += m.confidence;
    });
    
    totalTime += log.timeToDecision;
    
    if (log.selectedDiagnosis) {
      diagnosisCount[log.selectedDiagnosis.code] = (diagnosisCount[log.selectedDiagnosis.code] || 0) + 1;
    }
    
    log.selectedMedications.forEach(medId => {
      const med = log.suggestedMedications.find(m => m.id === medId);
      if (med) {
        medicationCount[med.genericName] = (medicationCount[med.genericName] || 0) + 1;
      }
    });
    
    if (log.feedback) {
      const satisfactionMap = { 'helpful': 5, 'neutral': 3, 'not-helpful': 1 };
      totalSatisfaction += satisfactionMap[log.feedback];
      satisfactionCount++;
    }
  });
  
  const topDiagnoses = Object.entries(diagnosisCount)
    .map(([cie10, count]) => ({ cie10, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const topMedications = Object.entries(medicationCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    totalSuggestions,
    acceptedSuggestions,
    rejectedSuggestions,
    modifiedSuggestions,
    averageConfidence: totalSuggestions > 0 ? totalConfidence / totalSuggestions : 0,
    averageTimeToDecision: auditLogs.length > 0 ? totalTime / auditLogs.length : 0,
    topDiagnoses,
    topMedications,
    userSatisfaction: satisfactionCount > 0 ? totalSatisfaction / satisfactionCount : 0
  };
}

// ============================================
// API PÚBLICA DEL STORE
// ============================================

/**
 * Obtiene sugerencias de diagnóstico basadas en texto clínico
 */
export function getSuggestedDiagnoses(clinicalDescription: string): DiagnosticSuggestion[] {
  if (!clinicalDescription || clinicalDescription.trim().length < 3) {
    return [];
  }
  
  return AIEngine.suggestDiagnoses(clinicalDescription);
}

/**
 * Obtiene sugerencias de medicamentos para un diagnóstico
 */
export function getSuggestedMedications(cie10Code: string): MedicationSuggestion[] {
  return AIEngine.generatePrescription(cie10Code);
}

/**
 * Obtiene template completo de prescripción
 */
export function getPrescriptionTemplate(cie10Code: string): PrescriptionTemplate | null {
  return AIEngine.getPrescriptionTemplate(cie10Code);
}

/**
 * Busca código CIE-10 por texto
 */
export function searchCIE10(query: string): CIE10Code[] {
  const normalizedQuery = query.toLowerCase().trim();
  const results: CIE10Code[] = [];
  
  for (const codes of Object.values(CIE10_DATABASE)) {
    codes.forEach(code => {
      if (
        code.code.toLowerCase().includes(normalizedQuery) ||
        code.description.toLowerCase().includes(normalizedQuery) ||
        code.category.toLowerCase().includes(normalizedQuery)
      ) {
        results.push(code);
      }
    });
  }
  
  return results.slice(0, 10);
}

/**
 * Obtiene información detallada de un código CIE-10
 */
export function getCIE10Details(code: string): CIE10Code | null {
  for (const codes of Object.values(CIE10_DATABASE)) {
    const found = codes.find(c => c.code === code);
    if (found) return found;
  }
  return null;
}

// ============================================
// DATOS MOCK PARA DEMO
// ============================================

// Generar algunos logs de ejemplo para el dashboard de auditoría
function initializeMockAuditLogs() {
  const mockLogs: Omit<AIAuditLog, 'id' | 'timestamp'>[] = [
    {
      userId: 'USR-0023',
      userName: 'Dr. Carlos Martínez',
      patientId: 'PAT-001',
      patientName: 'María González',
      clinicalDescription: 'Paciente con tos, fiebre y malestar general de 3 días de evolución',
      suggestedDiagnoses: AIEngine.suggestDiagnoses('infección respiratoria'),
      suggestedMedications: AIEngine.generatePrescription('J06.9'),
      selectedDiagnosis: { code: 'J06.9', description: 'Infección aguda de las vías respiratorias superiores', category: 'Respiratorio' },
      selectedMedications: ['med-1', 'med-2'],
      modifiedMedications: [],
      rejectedSuggestions: [],
      timeToDecision: 45,
      suggestionAcceptanceRate: 1.0,
      manualChanges: 0,
      finalPrescriptionId: 'RX-2024-0245',
      feedback: 'helpful',
      feedbackNotes: 'Sugerencias muy precisas'
    },
    {
      userId: 'USR-0023',
      userName: 'Dr. Carlos Martínez',
      patientId: 'PAT-002',
      patientName: 'Juan Rodríguez',
      clinicalDescription: 'Paciente hipertenso con presión 160/95, sin control adecuado',
      suggestedDiagnoses: AIEngine.suggestDiagnoses('hipertensión'),
      suggestedMedications: AIEngine.generatePrescription('I10'),
      selectedDiagnosis: { code: 'I10', description: 'Hipertensión esencial', category: 'Circulatorio' },
      selectedMedications: ['med-3'],
      modifiedMedications: ['med-4'], // Modificó la dosis del diurético
      rejectedSuggestions: [],
      timeToDecision: 120,
      suggestionAcceptanceRate: 0.5,
      manualChanges: 1,
      finalPrescriptionId: 'RX-2024-0246',
      feedback: 'helpful'
    }
  ];
  
  mockLogs.forEach(log => logAIUsage(log));
}

// Inicializar datos mock
initializeMockAuditLogs();

export default {
  getSuggestedDiagnoses,
  getSuggestedMedications,
  getPrescriptionTemplate,
  searchCIE10,
  getCIE10Details,
  logAIUsage,
  getAuditLogs,
  calculateAIMetrics
};
