/**
 * Store para Clasificación de Medicamentos
 * Define categorías y reglas de prescripción
 * 
 * REGLAS DE PRESCRIPCIÓN:
 * - Estupefacientes: 1 medicamento por receta
 * - Psicotrópicos: 1 medicamento por receta
 * - Antimicrobianos: Hasta 3 medicamentos por receta
 * - Medicamentos libres: Sin límite
 * 
 * Actualizado: 20/11/2025
 */

export type MedicineCategory = 
  | "narcotics" // Estupefacientes
  | "psychotropics" // Psicotrópicos
  | "antimicrobials" // Antimicrobianos
  | "controlled" // Controlados
  | "free"; // Libres

export interface MedicineClassification {
  genericName: string;
  category: MedicineCategory;
  requiresSpecialControl: boolean;
  maxPerPrescription: number;
  notes?: string;
}

// Base de datos de clasificaciones
const classificationsStore: Record<string, MedicineClassification> = {};

/**
 * Reglas de prescripción por categoría
 */
export const PRESCRIPTION_RULES = {
  narcotics: {
    maxMedicines: 1,
    label: "Estupefacientes",
    description: "Solo se permite 1 medicamento estupefaciente por receta",
    color: "red"
  },
  psychotropics: {
    maxMedicines: 1,
    label: "Psicotrópicos",
    description: "Solo se permite 1 medicamento psicotrópico por receta",
    color: "orange"
  },
  antimicrobials: {
    maxMedicines: 3,
    label: "Antimicrobianos",
    description: "Se permiten hasta 3 medicamentos antimicrobianos por receta",
    color: "yellow"
  },
  controlled: {
    maxMedicines: 5,
    label: "Controlados",
    description: "Se permiten hasta 5 medicamentos controlados por receta",
    color: "blue"
  },
  free: {
    maxMedicines: Infinity,
    label: "Medicamentos Libres",
    description: "Sin límite de medicamentos por receta",
    color: "green"
  }
};

/**
 * API de Clasificación de Medicamentos
 */
export const MedicineClassificationAPI = {
  
  /**
   * Clasificar un medicamento
   */
  classifyMedicine: (genericName: string): MedicineCategory => {
    const normalized = genericName.toLowerCase().trim();
    
    // Buscar en el store
    if (classificationsStore[normalized]) {
      return classificationsStore[normalized].category;
    }

    // Clasificación por patrones comunes (simplificado para demo)
    
    // Estupefacientes (narcóticos) - Solo opioides mayores (Escalón 3 OMS)
    if (
      normalized.includes("morfina") ||
      normalized.includes("fentanilo") ||
      normalized.includes("oxicodona") ||
      normalized.includes("metadona") ||
      normalized.includes("hidromorfona") ||
      normalized.includes("buprenorfina")
    ) {
      return "narcotics";
    }

    // Psicotrópicos
    if (
      normalized.includes("diazepam") ||
      normalized.includes("alprazolam") ||
      normalized.includes("lorazepam") ||
      normalized.includes("clonazepam") ||
      normalized.includes("zolpidem") ||
      normalized.includes("metilfenidato") ||
      normalized.includes("anfetamina")
    ) {
      return "psychotropics";
    }

    // Antimicrobianos
    if (
      normalized.includes("amoxicilina") ||
      normalized.includes("azitromicina") ||
      normalized.includes("ciprofloxacino") ||
      normalized.includes("levofloxacino") ||
      normalized.includes("cefalexina") ||
      normalized.includes("ceftriaxona") ||
      normalized.includes("cefazolina") ||
      normalized.includes("cefotaxima") ||
      normalized.includes("cefuroxima") ||
      normalized.includes("claritromicina") ||
      normalized.includes("penicilina") ||
      normalized.includes("eritromicina") ||
      normalized.includes("metronidazol") ||
      normalized.includes("trimetoprim") ||
      normalized.includes("sulfametoxazol") ||
      normalized.includes("doxiciclina") ||
      normalized.includes("nitrofurantoína") ||
      normalized.includes("fosfomicina")
    ) {
      return "antimicrobials";
    }

    // Medicamentos controlados (no estupefacientes ni psicotrópicos)
    if (
      normalized.includes("insulina") ||
      normalized.includes("warfarina") ||
      normalized.includes("levotiroxina")
    ) {
      return "controlled";
    }

    // Analgésicos opioides débiles (Escalón 2 OMS) - Receta Libre con control
    // Tramadol y Codeína NO son estupefacientes, son receta libre en la mayoría de países
    if (
      normalized.includes("tramadol") ||
      normalized.includes("codeína") ||
      normalized.includes("tapentadol")
    ) {
      return "free";
    }

    // Por defecto: medicamento libre
    return "free";
  },

  /**
   * Obtener reglas de prescripción para una categoría
   */
  getPrescriptionRules: (category: MedicineCategory) => {
    return PRESCRIPTION_RULES[category];
  },

  /**
   * Validar si se puede agregar un medicamento a la receta
   */
  canAddMedicineToList: (
    newMedicine: { genericName: string },
    existingMedicines: { genericName: string }[]
  ): { canAdd: boolean; reason?: string; category?: MedicineCategory; limit?: number } => {
    
    const newCategory = MedicineClassificationAPI.classifyMedicine(newMedicine.genericName);
    const newRules = PRESCRIPTION_RULES[newCategory];

    // Categorías especiales (estupefacientes y psicotrópicos): Solo 1 por receta
    if (newCategory === "narcotics" || newCategory === "psychotropics") {
      // Verificar si ya hay un medicamento de esta categoría
      const existingOfSameCategory = existingMedicines.filter(m => 
        MedicineClassificationAPI.classifyMedicine(m.genericName) === newCategory
      );

      if (existingOfSameCategory.length >= newRules.maxMedicines) {
        return {
          canAdd: false,
          reason: `${newRules.description}. Ya tiene ${existingOfSameCategory.length} medicamento(s) de esta categoría.`,
          category: newCategory,
          limit: newRules.maxMedicines
        };
      }

      // También verificar si hay otros estupefacientes o psicotrópicos
      const hasNarcotics = existingMedicines.some(m => 
        MedicineClassificationAPI.classifyMedicine(m.genericName) === "narcotics"
      );
      const hasPsychotropics = existingMedicines.some(m => 
        MedicineClassificationAPI.classifyMedicine(m.genericName) === "psychotropics"
      );

      if (newCategory === "narcotics" && (hasNarcotics || hasPsychotropics)) {
        return {
          canAdd: false,
          reason: "No se pueden mezclar estupefacientes con otros estupefacientes o psicotrópicos en la misma receta.",
          category: newCategory,
          limit: 1
        };
      }

      if (newCategory === "psychotropics" && (hasNarcotics || hasPsychotropics)) {
        return {
          canAdd: false,
          reason: "No se pueden mezclar psicotrópicos con otros psicotrópicos o estupefacientes en la misma receta.",
          category: newCategory,
          limit: 1
        };
      }
    }

    // Antimicrobianos: Máximo 3
    if (newCategory === "antimicrobials") {
      const existingAntimicrobials = existingMedicines.filter(m => 
        MedicineClassificationAPI.classifyMedicine(m.genericName) === "antimicrobials"
      );

      if (existingAntimicrobials.length >= newRules.maxMedicines) {
        return {
          canAdd: false,
          reason: `${newRules.description}. Ya tiene ${existingAntimicrobials.length} antimicrobiano(s).`,
          category: newCategory,
          limit: newRules.maxMedicines
        };
      }
    }

    // Medicamentos libres: Sin límite
    return {
      canAdd: true,
      category: newCategory
    };
  },

  /**
   * Validar lista completa de medicamentos
   */
  validateMedicineList: (
    medicines: { genericName: string }[]
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Contar por categoría
    const categoryCounts: Record<MedicineCategory, number> = {
      narcotics: 0,
      psychotropics: 0,
      antimicrobials: 0,
      controlled: 0,
      free: 0
    };

    medicines.forEach(med => {
      const category = MedicineClassificationAPI.classifyMedicine(med.genericName);
      categoryCounts[category]++;
    });

    // Validar estupefacientes
    if (categoryCounts.narcotics > 1) {
      errors.push(`Solo se permite 1 estupefaciente por receta. Tiene ${categoryCounts.narcotics}.`);
    }

    // Validar psicotrópicos
    if (categoryCounts.psychotropics > 1) {
      errors.push(`Solo se permite 1 psicotrópico por receta. Tiene ${categoryCounts.psychotropics}.`);
    }

    // No mezclar estupefacientes con psicotrópicos
    if (categoryCounts.narcotics > 0 && categoryCounts.psychotropics > 0) {
      errors.push("No se pueden mezclar estupefacientes con psicotrópicos en la misma receta.");
    }

    // Validar antimicrobianos
    if (categoryCounts.antimicrobials > 3) {
      errors.push(`Solo se permiten hasta 3 antimicrobianos por receta. Tiene ${categoryCounts.antimicrobials}.`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Obtener información de categoría de un medicamento
   */
  getMedicineInfo: (genericName: string) => {
    const category = MedicineClassificationAPI.classifyMedicine(genericName);
    const rules = PRESCRIPTION_RULES[category];
    
    return {
      genericName,
      category,
      categoryLabel: rules.label,
      maxPerPrescription: rules.maxMedicines,
      requiresSpecialControl: category === "narcotics" || category === "psychotropics",
      description: rules.description
    };
  },

  /**
   * Registrar clasificación manual de un medicamento
   */
  registerClassification: (
    genericName: string,
    category: MedicineCategory,
    notes?: string
  ): void => {
    const normalized = genericName.toLowerCase().trim();
    const rules = PRESCRIPTION_RULES[category];
    
    classificationsStore[normalized] = {
      genericName,
      category,
      requiresSpecialControl: category === "narcotics" || category === "psychotropics",
      maxPerPrescription: rules.maxMedicines,
      notes
    };
  }
};

// Inicializar algunas clasificaciones comunes
const initializeCommonMedications = () => {
  // ====================================
  // ESTUPEFACIENTES (Narcóticos)
  // ====================================
  MedicineClassificationAPI.registerClassification("Morfina", "narcotics", "Analgésico opioide - Dolor severo");
  MedicineClassificationAPI.registerClassification("Codeína", "narcotics", "Analgésico opioide - Dolor moderado");
  MedicineClassificationAPI.registerClassification("Tramadol", "narcotics", "Analgésico opioide sintético - Dolor moderado a severo");
  MedicineClassificationAPI.registerClassification("Fentanilo", "narcotics", "Analgésico opioide potente - Dolor severo/crónico");
  MedicineClassificationAPI.registerClassification("Oxicodona", "narcotics", "Analgésico opioide - Dolor severo");
  MedicineClassificationAPI.registerClassification("Metadona", "narcotics", "Analgésico opioide - Dolor crónico/tratamiento de adicción");
  MedicineClassificationAPI.registerClassification("Hidrocodona", "narcotics", "Analgésico opioide - Dolor moderado a severo");
  MedicineClassificationAPI.registerClassification("Buprenorfina", "narcotics", "Analgésico opioide parcial - Dolor crónico");
  
  // ====================================
  // PSICOTRÓPICOS
  // ====================================
  // Benzodiacepinas
  MedicineClassificationAPI.registerClassification("Diazepam", "psychotropics", "Benzodiacepina - Ansiedad/relajante muscular");
  MedicineClassificationAPI.registerClassification("Alprazolam", "psychotropics", "Benzodiacepina - Ansiedad/pánico");
  MedicineClassificationAPI.registerClassification("Clonazepam", "psychotropics", "Benzodiacepina - Ansiedad/convulsiones");
  MedicineClassificationAPI.registerClassification("Lorazepam", "psychotropics", "Benzodiacepina - Ansiedad");
  MedicineClassificationAPI.registerClassification("Bromazepam", "psychotropics", "Benzodiacepina - Ansiedad");
  
  // Hipnóticos/Sedantes
  MedicineClassificationAPI.registerClassification("Zolpidem", "psychotropics", "Hipnótico - Insomnio");
  MedicineClassificationAPI.registerClassification("Zopiclona", "psychotropics", "Hipnótico - Insomnio");
  MedicineClassificationAPI.registerClassification("Eszopiclona", "psychotropics", "Hipnótico - Insomnio");
  
  // Estimulantes
  MedicineClassificationAPI.registerClassification("Metilfenidato", "psychotropics", "Estimulante - TDAH");
  MedicineClassificationAPI.registerClassification("Anfetamina", "psychotropics", "Estimulante - TDAH/narcolepsia");
  MedicineClassificationAPI.registerClassification("Lisdexanfetamina", "psychotropics", "Estimulante - TDAH");
  
  // Antipsicóticos controlados
  MedicineClassificationAPI.registerClassification("Risperidona", "psychotropics", "Antipsicótico - Esquizofrenia/bipolaridad");
  MedicineClassificationAPI.registerClassification("Quetiapina", "psychotropics", "Antipsicótico - Esquizofrenia/bipolaridad");
  
  // ====================================
  // ANTIMICROBIANOS
  // ====================================
  // Penicilinas
  MedicineClassificationAPI.registerClassification("Amoxicilina", "antimicrobials", "Penicilina - Infecciones bacterianas");
  MedicineClassificationAPI.registerClassification("Amoxicilina/Ácido Clavulánico", "antimicrobials", "Penicilina + inhibidor - Infecciones resistentes");
  MedicineClassificationAPI.registerClassification("Penicilina G", "antimicrobials", "Penicilina - Infecciones bacterianas");
  MedicineClassificationAPI.registerClassification("Ampicilina", "antimicrobials", "Penicilina - Infecciones bacterianas");
  
  // Cefalosporinas
  MedicineClassificationAPI.registerClassification("Cefalexina", "antimicrobials", "Cefalosporina 1ra gen - Infecciones piel/respiratorias");
  MedicineClassificationAPI.registerClassification("Cefuroxima", "antimicrobials", "Cefalosporina 2da gen - Infecciones respiratorias");
  MedicineClassificationAPI.registerClassification("Ceftriaxona", "antimicrobials", "Cefalosporina 3ra gen - Infecciones graves");
  MedicineClassificationAPI.registerClassification("Cefepime", "antimicrobials", "Cefalosporina 4ta gen - Infecciones graves");
  
  // Macrólidos
  MedicineClassificationAPI.registerClassification("Azitromicina", "antimicrobials", "Macrólido - Infecciones respiratorias/piel");
  MedicineClassificationAPI.registerClassification("Claritromicina", "antimicrobials", "Macrólido - Infecciones respiratorias");
  MedicineClassificationAPI.registerClassification("Eritromicina", "antimicrobials", "Macrólido - Infecciones bacterianas");
  
  // Fluoroquinolonas
  MedicineClassificationAPI.registerClassification("Ciprofloxacino", "antimicrobials", "Fluoroquinolona - Infecciones urinarias/respiratorias");
  MedicineClassificationAPI.registerClassification("Levofloxacino", "antimicrobials", "Fluoroquinolona - Infecciones respiratorias/urinarias");
  MedicineClassificationAPI.registerClassification("Moxifloxacino", "antimicrobials", "Fluoroquinolona - Infecciones respiratorias");
  
  // Tetraciclinas
  MedicineClassificationAPI.registerClassification("Doxiciclina", "antimicrobials", "Tetraciclina - Infecciones bacterianas/acné");
  MedicineClassificationAPI.registerClassification("Minociclina", "antimicrobials", "Tetraciclina - Acné/infecciones");
  
  // Otros antimicrobianos
  MedicineClassificationAPI.registerClassification("Metronidazol", "antimicrobials", "Nitroimidazol - Infecciones anaerobias/protozoarias");
  MedicineClassificationAPI.registerClassification("Trimetoprim/Sulfametoxazol", "antimicrobials", "Sulfa - Infecciones urinarias/respiratorias");
  MedicineClassificationAPI.registerClassification("Clindamicina", "antimicrobials", "Lincosamida - Infecciones bacterianas anaerobias");
  MedicineClassificationAPI.registerClassification("Vancomicina", "antimicrobials", "Glicopéptido - Infecciones por MRSA");
  
  // ====================================
  // MEDICAMENTOS CONTROLADOS (no estupefacientes ni psicotrópicos)
  // ====================================
  MedicineClassificationAPI.registerClassification("Insulina", "controlled", "Hormona - Diabetes");
  MedicineClassificationAPI.registerClassification("Warfarina", "controlled", "Anticoagulante - Prevención trombosis");
  MedicineClassificationAPI.registerClassification("Levotiroxina", "controlled", "Hormona tiroidea - Hipotiroidismo");
  MedicineClassificationAPI.registerClassification("Isotretinoína", "controlled", "Retinoide - Acné severo");
  MedicineClassificationAPI.registerClassification("Metotrexato", "controlled", "Antimetabolito - Artritis/cáncer");
  
  // ====================================
  // MEDICAMENTOS LIBRES
  // ====================================
  // Analgésicos
  MedicineClassificationAPI.registerClassification("Paracetamol", "free", "Analgésico/antipirético");
  MedicineClassificationAPI.registerClassification("Acetaminofén", "free", "Analgésico/antipirético");
  MedicineClassificationAPI.registerClassification("Ibuprofeno", "free", "AINE - Analgésico/antiinflamatorio");
  MedicineClassificationAPI.registerClassification("Naproxeno", "free", "AINE - Analgésico/antiinflamatorio");
  MedicineClassificationAPI.registerClassification("Diclofenaco", "free", "AINE - Analgésico/antiinflamatorio");
  MedicineClassificationAPI.registerClassification("Ketoprofeno", "free", "AINE - Analgésico/antiinflamatorio");
  
  // Gastroprotectores
  MedicineClassificationAPI.registerClassification("Omeprazol", "free", "Inhibidor bomba de protones - Acidez");
  MedicineClassificationAPI.registerClassification("Esomeprazol", "free", "Inhibidor bomba de protones - Acidez");
  MedicineClassificationAPI.registerClassification("Pantoprazol", "free", "Inhibidor bomba de protones - Acidez");
  MedicineClassificationAPI.registerClassification("Ranitidina", "free", "Antagonista H2 - Acidez");
  
  // Antihistamínicos
  MedicineClassificationAPI.registerClassification("Loratadina", "free", "Antihistamínico - Alergias");
  MedicineClassificationAPI.registerClassification("Cetirizina", "free", "Antihistamínico - Alergias");
  MedicineClassificationAPI.registerClassification("Desloratadina", "free", "Antihistamínico - Alergias");
  MedicineClassificationAPI.registerClassification("Fexofenadina", "free", "Antihistamínico - Alergias");
  
  // Otros comunes
  MedicineClassificationAPI.registerClassification("Metformina", "free", "Antidiabético - Diabetes tipo 2");
  MedicineClassificationAPI.registerClassification("Losartán", "free", "Antihipertensivo - Presión alta");
  MedicineClassificationAPI.registerClassification("Atorvastatina", "free", "Estatina - Colesterol alto");
  MedicineClassificationAPI.registerClassification("Salbutamol", "free", "Broncodilatador - Asma");
};

initializeCommonMedications();