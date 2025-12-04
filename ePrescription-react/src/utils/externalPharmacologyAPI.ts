/**
 * Integración con Bases de Datos Externas de Farmacología
 * Simula integración con APIs farmacológicas reconocidas internacionalmente
 * Incluye cache local y fallback a base de datos interna
 */

import { DrugInteraction, checkMedicineInteractions, type InteractionAlert } from "./drugInteractionsDatabase";

/**
 * Fuentes de datos externas disponibles
 */
export type ExternalSource = "RxNorm" | "DrugBank" | "OpenFDA" | "Medscape";

export interface ExternalMedicineInfo {
  genericName: string;
  commercialNames: string[];
  atcCode?: string; // Anatomical Therapeutic Chemical Classification
  rxcui?: string; // RxNorm Concept Unique Identifier
  drugbankId?: string;
  fdaApplicationNumber?: string;
  therapeuticClass: string;
  pharmacologicalClass: string;
  mechanism: string;
  indications: string[];
  contraindications: string[];
  adverseEffects: string[];
  dosageForm: string[];
  routes: string[];
  manufacturer?: string;
  approvalDate?: string;
  source: ExternalSource;
  lastUpdated: string;
}

export interface ExternalInteractionData {
  drug1: string;
  drug2: string;
  severity: "critical" | "severe" | "moderate" | "mild";
  description: string;
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  references: string;
  source: ExternalSource;
  confidence: "high" | "medium" | "low";
  evidenceLevel: "A" | "B" | "C" | "D"; // A=Highest, D=Lowest
}

/**
 * Cache local para reducir llamadas repetidas
 */
const medicineInfoCache: Map<string, ExternalMedicineInfo> = new Map();
const interactionCache: Map<string, ExternalInteractionData[]> = new Map();

/**
 * Configuración de APIs externas (en producción serían URLs reales)
 */
const API_CONFIG = {
  RxNorm: {
    baseURL: "https://rxnav.nlm.nih.gov/REST",
    enabled: true,
    rateLimit: 20 // requests per second
  },
  DrugBank: {
    baseURL: "https://api.drugbank.com/v1",
    apiKey: "YOUR_DRUGBANK_API_KEY", // En producción
    enabled: true,
    rateLimit: 10
  },
  OpenFDA: {
    baseURL: "https://api.fda.gov/drug",
    enabled: true,
    rateLimit: 240 // per minute
  },
  Medscape: {
    baseURL: "https://reference.medscape.com/api",
    enabled: true,
    rateLimit: 30
  }
};

/**
 * Base de datos mock enriquecida con información de APIs externas
 */
const EXTERNAL_MEDICINE_DATABASE: ExternalMedicineInfo[] = [
  {
    genericName: "Amoxicilina",
    commercialNames: ["Amoxil", "Trimox", "Moxatag"],
    atcCode: "J01CA04",
    rxcui: "723",
    drugbankId: "DB01060",
    fdaApplicationNumber: "NDA050542",
    therapeuticClass: "Antibiótico",
    pharmacologicalClass: "Penicilina",
    mechanism: "Inhibe la síntesis de la pared celular bacteriana",
    indications: [
      "Infecciones respiratorias",
      "Infecciones de oído",
      "Infecciones urinarias",
      "Infecciones de piel"
    ],
    contraindications: [
      "Alergia a penicilinas",
      "Mononucleosis infecciosa"
    ],
    adverseEffects: [
      "Náuseas",
      "Diarrea",
      "Erupción cutánea",
      "Reacciones alérgicas"
    ],
    dosageForm: ["Cápsulas", "Tabletas", "Suspensión oral"],
    routes: ["Oral"],
    manufacturer: "GlaxoSmithKline",
    approvalDate: "1974-01-18",
    source: "RxNorm",
    lastUpdated: new Date().toISOString()
  },
  {
    genericName: "Losartán",
    commercialNames: ["Cozaar", "Hyzaar"],
    atcCode: "C09CA01",
    rxcui: "52175",
    drugbankId: "DB00678",
    fdaApplicationNumber: "NDA020386",
    therapeuticClass: "Antihipertensivo",
    pharmacologicalClass: "Antagonista de receptores de angiotensina II",
    mechanism: "Bloquea los receptores AT1 de angiotensina II",
    indications: [
      "Hipertensión arterial",
      "Protección renal en diabetes",
      "Insuficiencia cardíaca"
    ],
    contraindications: [
      "Embarazo",
      "Hiperpotasemia severa",
      "Estenosis bilateral de arteria renal"
    ],
    adverseEffects: [
      "Mareos",
      "Hipotensión",
      "Hiperpotasemia",
      "Fatiga"
    ],
    dosageForm: ["Tabletas"],
    routes: ["Oral"],
    manufacturer: "Merck",
    approvalDate: "1995-04-14",
    source: "DrugBank",
    lastUpdated: new Date().toISOString()
  },
  {
    genericName: "Warfarina",
    commercialNames: ["Coumadin", "Jantoven"],
    atcCode: "B01AA03",
    rxcui: "11289",
    drugbankId: "DB00682",
    fdaApplicationNumber: "NDA009218",
    therapeuticClass: "Anticoagulante",
    pharmacologicalClass: "Antagonista de vitamina K",
    mechanism: "Inhibe la síntesis de factores de coagulación dependientes de vitamina K",
    indications: [
      "Prevención de tromboembolismo",
      "Fibrilación auricular",
      "Válvulas cardíacas mecánicas",
      "Trombosis venosa profunda"
    ],
    contraindications: [
      "Sangrado activo",
      "Embarazo",
      "Cirugía reciente del SNC",
      "HTA no controlada severa"
    ],
    adverseEffects: [
      "Sangrado",
      "Hematomas",
      "Necrosis cutánea",
      "Alopecia"
    ],
    dosageForm: ["Tabletas"],
    routes: ["Oral"],
    manufacturer: "Bristol-Myers Squibb",
    approvalDate: "1954-06-07",
    source: "OpenFDA",
    lastUpdated: new Date().toISOString()
  },
  {
    genericName: "Atorvastatina",
    commercialNames: ["Lipitor", "Torvast"],
    atcCode: "C10AA05",
    rxcui: "83367",
    drugbankId: "DB01076",
    fdaApplicationNumber: "NDA020702",
    therapeuticClass: "Hipolipemiante",
    pharmacologicalClass: "Inhibidor de HMG-CoA reductasa (Estatina)",
    mechanism: "Inhibe la enzima HMG-CoA reductasa, limitando síntesis de colesterol",
    indications: [
      "Hipercolesterolemia",
      "Prevención cardiovascular",
      "Dislipidemia mixta"
    ],
    contraindications: [
      "Enfermedad hepática activa",
      "Embarazo",
      "Lactancia"
    ],
    adverseEffects: [
      "Miopatía",
      "Elevación de transaminasas",
      "Dolor muscular",
      "Cefalea"
    ],
    dosageForm: ["Tabletas"],
    routes: ["Oral"],
    manufacturer: "Pfizer",
    approvalDate: "1996-12-17",
    source: "Medscape",
    lastUpdated: new Date().toISOString()
  },
  {
    genericName: "Ibuprofeno",
    commercialNames: ["Advil", "Motrin", "Nurofen"],
    atcCode: "M01AE01",
    rxcui: "5640",
    drugbankId: "DB01050",
    fdaApplicationNumber: "NDA018989",
    therapeuticClass: "Antiinflamatorio no esteroideo (AINE)",
    pharmacologicalClass: "Inhibidor no selectivo de COX",
    mechanism: "Inhibe las enzimas ciclooxigenasa (COX-1 y COX-2)",
    indications: [
      "Dolor leve a moderado",
      "Fiebre",
      "Inflamación",
      "Dismenorrea"
    ],
    contraindications: [
      "Úlcera péptica activa",
      "Alergia a AINEs",
      "Tercer trimestre de embarazo",
      "Insuficiencia renal severa"
    ],
    adverseEffects: [
      "Dolor abdominal",
      "Náuseas",
      "Úlcera gástrica",
      "Sangrado gastrointestinal"
    ],
    dosageForm: ["Tabletas", "Cápsulas", "Suspensión", "Gel tópico"],
    routes: ["Oral", "Tópica"],
    manufacturer: "Múltiples fabricantes",
    approvalDate: "1974-09-01",
    source: "RxNorm",
    lastUpdated: new Date().toISOString()
  }
];

/**
 * Interacciones externas enriquecidas
 */
const EXTERNAL_INTERACTIONS_DATABASE: ExternalInteractionData[] = [
  {
    drug1: "Warfarina",
    drug2: "Aspirina",
    severity: "critical",
    description: "Riesgo severo de hemorragia por potenciación de efectos anticoagulantes",
    mechanism: "La aspirina inhibe la agregación plaquetaria y puede dañar la mucosa gástrica, aumentando el riesgo de sangrado en pacientes anticoagulados",
    clinicalEffect: "Aumento de INR >5, sangrado gastrointestinal, hematomas espontáneos, hemorragia intracraneal",
    recommendation: "CONTRAINDICADO. Si se requiere antiagregación, considerar clopidogrel con ajuste de dosis de warfarina y monitoreo estricto de INR",
    references: "FDA Drug Safety Communication 2014; N Engl J Med 2018;379:1215-1224",
    source: "OpenFDA",
    confidence: "high",
    evidenceLevel: "A"
  },
  {
    drug1: "Atorvastatina",
    drug2: "Eritromicina",
    severity: "severe",
    description: "La eritromicina inhibe el metabolismo de atorvastatina vía CYP3A4",
    mechanism: "Inhibición del citocromo P450 3A4 que metaboliza estatinas, aumentando concentraciones plasmáticas hasta 400%",
    clinicalEffect: "Rabdomiólisis (CPK >10,000 U/L), mioglobinuria, insuficiencia renal aguda, miopatía severa",
    recommendation: "Suspender temporalmente la estatina durante tratamiento con eritromicina o reducir dosis a 10-20mg/día con monitoreo de CPK",
    references: "Clin Pharmacol Ther 2024;115(3):567-574; DrugBank Interaction Database",
    source: "DrugBank",
    confidence: "high",
    evidenceLevel: "A"
  },
  {
    drug1: "Losartán",
    drug2: "Ibuprofeno",
    severity: "severe",
    description: "Los AINEs reducen la eficacia antihipertensiva de los ARAII y aumentan riesgo de daño renal",
    mechanism: "Los AINEs inhiben la síntesis de prostaglandinas renales, reduciendo el flujo sanguíneo renal y la natriuresis",
    clinicalEffect: "Aumento de presión arterial sistólica 10-20 mmHg, deterioro de función renal (aumento creatinina >0.5 mg/dL), hiperpotasemia",
    recommendation: "Evitar uso crónico concomitante. Si es necesario, usar dosis mínima de AINE por tiempo limitado, monitorear PA y función renal semanalmente",
    references: "Hypertension 2023;81(5):1123-1131; Medscape Drug Interaction Checker",
    source: "Medscape",
    confidence: "high",
    evidenceLevel: "B"
  },
  {
    drug1: "Amoxicilina",
    drug2: "Warfarina",
    severity: "severe",
    description: "Los antibióticos betalactámicos pueden potenciar el efecto de warfarina",
    mechanism: "Alteración de la flora intestinal que sintetiza vitamina K, potenciación del efecto anticoagulante",
    clinicalEffect: "Aumento de INR en 30-50%, riesgo de sangrado aumentado durante y hasta 1 semana post-antibiótico",
    recommendation: "Monitoreo intensivo de INR: antes, durante y 1 semana después del tratamiento antibiótico. Considerar ajuste de dosis de warfarina",
    references: "Thromb Haemost 2024;124(2):234-241; RxNorm Clinical Decision Support",
    source: "RxNorm",
    confidence: "medium",
    evidenceLevel: "B"
  }
];

/**
 * Simular latencia de red para APIs externas
 */
const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * API de Integración Externa
 */
export const ExternalPharmacologyAPI = {
  /**
   * Buscar información de medicamento en base de datos externa
   */
  async searchMedicineInfo(
    medicineName: string,
    source: ExternalSource = "RxNorm"
  ): Promise<ExternalMedicineInfo | null> {
    // Verificar cache
    const cacheKey = `${medicineName.toLowerCase()}-${source}`;
    if (medicineInfoCache.has(cacheKey)) {
      console.log(`[Cache Hit] Medicine info for ${medicineName} from ${source}`);
      return medicineInfoCache.get(cacheKey)!;
    }

    // Simular llamada a API externa
    console.log(`[API Call] Fetching ${medicineName} from ${source}...`);
    await simulateNetworkDelay();

    // Buscar en base de datos mock
    const normalized = medicineName.toLowerCase();
    const medicine = EXTERNAL_MEDICINE_DATABASE.find(med =>
      med.genericName.toLowerCase().includes(normalized) ||
      med.commercialNames.some(name => name.toLowerCase().includes(normalized))
    );

    if (medicine && medicine.source === source) {
      // Guardar en cache
      medicineInfoCache.set(cacheKey, medicine);
      return medicine;
    }

    // Si no se encuentra en la fuente especificada, buscar en otras
    const anyMedicine = EXTERNAL_MEDICINE_DATABASE.find(med =>
      med.genericName.toLowerCase().includes(normalized) ||
      med.commercialNames.some(name => name.toLowerCase().includes(normalized))
    );

    if (anyMedicine) {
      medicineInfoCache.set(cacheKey, anyMedicine);
      return anyMedicine;
    }

    return null;
  },

  /**
   * Verificar interacciones usando API externa
   */
  async checkInteractionsExternal(
    drug1: string,
    drug2: string,
    source: ExternalSource = "DrugBank"
  ): Promise<ExternalInteractionData | null> {
    // Verificar cache
    const cacheKey = `${drug1.toLowerCase()}-${drug2.toLowerCase()}-${source}`;
    const reverseCacheKey = `${drug2.toLowerCase()}-${drug1.toLowerCase()}-${source}`;
    
    if (interactionCache.has(cacheKey)) {
      console.log(`[Cache Hit] Interaction between ${drug1} and ${drug2}`);
      return interactionCache.get(cacheKey)![0] || null;
    }
    if (interactionCache.has(reverseCacheKey)) {
      return interactionCache.get(reverseCacheKey)![0] || null;
    }

    // Simular llamada a API
    console.log(`[API Call] Checking interaction ${drug1} + ${drug2} via ${source}...`);
    await simulateNetworkDelay();

    // Buscar en base de datos
    const normalized1 = drug1.toLowerCase();
    const normalized2 = drug2.toLowerCase();

    const interaction = EXTERNAL_INTERACTIONS_DATABASE.find(int =>
      (int.drug1.toLowerCase().includes(normalized1) && int.drug2.toLowerCase().includes(normalized2)) ||
      (int.drug1.toLowerCase().includes(normalized2) && int.drug2.toLowerCase().includes(normalized1))
    );

    if (interaction) {
      interactionCache.set(cacheKey, [interaction]);
      return interaction;
    }

    return null;
  },

  /**
   * Verificar múltiples medicamentos contra APIs externas
   */
  async checkMultipleMedicines(
    medicines: Array<{ genericName: string; commercialName: string }>,
    source: ExternalSource = "DrugBank"
  ): Promise<ExternalInteractionData[]> {
    const interactions: ExternalInteractionData[] = [];

    console.log(`[API Call] Checking ${medicines.length} medicines via ${source}...`);
    await simulateNetworkDelay(800);

    // Verificar cada par de medicamentos
    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        const interaction = await ExternalPharmacologyAPI.checkInteractionsExternal(
          medicines[i].genericName,
          medicines[j].genericName,
          source
        );
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }

    return interactions;
  },

  /**
   * Enriquecer interacciones locales con datos de API externa
   */
  async enrichInteractions(
    localInteractions: InteractionAlert[],
    source: ExternalSource = "DrugBank"
  ): Promise<Array<InteractionAlert & { externalData?: ExternalInteractionData }>> {
    console.log(`[API Call] Enriching ${localInteractions.length} interactions with ${source} data...`);
    await simulateNetworkDelay(600);

    const enriched = await Promise.all(
      localInteractions.map(async (alert) => {
        const externalData = await ExternalPharmacologyAPI.checkInteractionsExternal(
          alert.drug1,
          alert.drug2,
          source
        );

        return {
          ...alert,
          externalData: externalData || undefined
        };
      })
    );

    return enriched;
  },

  /**
   * Obtener información completa de múltiples medicamentos
   */
  async getMedicinesInfo(
    medicineNames: string[],
    source: ExternalSource = "RxNorm"
  ): Promise<Map<string, ExternalMedicineInfo>> {
    console.log(`[API Call] Fetching info for ${medicineNames.length} medicines from ${source}...`);
    await simulateNetworkDelay(700);

    const infoMap = new Map<string, ExternalMedicineInfo>();

    for (const name of medicineNames) {
      const info = await ExternalPharmacologyAPI.searchMedicineInfo(name, source);
      if (info) {
        infoMap.set(name, info);
      }
    }

    return infoMap;
  },

  /**
   * Verificar disponibilidad de APIs externas
   */
  checkAPIStatus: (): Record<ExternalSource, boolean> => {
    return {
      RxNorm: API_CONFIG.RxNorm.enabled,
      DrugBank: API_CONFIG.DrugBank.enabled,
      OpenFDA: API_CONFIG.OpenFDA.enabled,
      Medscape: API_CONFIG.Medscape.enabled
    };
  },

  /**
   * Limpiar cache
   */
  clearCache: (): void => {
    medicineInfoCache.clear();
    interactionCache.clear();
    console.log("[Cache] Cache cleared");
  },

  /**
   * Obtener estadísticas de cache
   */
  getCacheStats: () => {
    return {
      medicinesInCache: medicineInfoCache.size,
      interactionsInCache: interactionCache.size,
      totalCacheSize: medicineInfoCache.size + interactionCache.size
    };
  },

  /**
   * Buscar medicamentos por clase terapéutica
   */
  async searchByTherapeuticClass(
    therapeuticClass: string,
    source: ExternalSource = "DrugBank"
  ): Promise<ExternalMedicineInfo[]> {
    console.log(`[API Call] Searching medicines by class: ${therapeuticClass} via ${source}...`);
    await simulateNetworkDelay();

    const normalized = therapeuticClass.toLowerCase();
    return EXTERNAL_MEDICINE_DATABASE.filter(med =>
      med.therapeuticClass.toLowerCase().includes(normalized) &&
      med.source === source
    );
  },

  /**
   * Obtener todas las interacciones conocidas de un medicamento
   */
  async getAllInteractionsForMedicine(
    medicineName: string,
    source: ExternalSource = "DrugBank"
  ): Promise<ExternalInteractionData[]> {
    console.log(`[API Call] Getting all interactions for ${medicineName} via ${source}...`);
    await simulateNetworkDelay();

    const normalized = medicineName.toLowerCase();
    return EXTERNAL_INTERACTIONS_DATABASE.filter(int =>
      (int.drug1.toLowerCase().includes(normalized) ||
       int.drug2.toLowerCase().includes(normalized)) &&
      int.source === source
    );
  }
};

/**
 * Utilidades de conversión entre formatos
 */
export const ConversionUtils = {
  /**
   * Convertir interacción externa a formato local
   */
  externalToLocal: (external: ExternalInteractionData): DrugInteraction => {
    return {
      drug1: external.drug1.toLowerCase(),
      drug2: external.drug2.toLowerCase(),
      severity: external.severity,
      description: external.description,
      clinicalEffect: external.clinicalEffect,
      recommendation: external.recommendation,
      references: `${external.references} [${external.source}]`
    };
  },

  /**
   * Convertir interacción local a alerta con datos externos
   */
  localToEnriched: (
    local: InteractionAlert,
    external?: ExternalInteractionData
  ): InteractionAlert & { externalData?: ExternalInteractionData } => {
    return {
      ...local,
      externalData: external
    };
  }
};
