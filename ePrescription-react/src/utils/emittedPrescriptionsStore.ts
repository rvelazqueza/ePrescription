/**
 * Store para Recetas Médicas Emitidas (Finalizadas)
 * Gestiona las prescripciones que han sido completadas y firmadas
 */

export interface Medicine {
  id: string;
  genericName: string;
  commercialName: string;
  presentation: string;
  concentration: string;
  quantity: number;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  indications: string;
  substitutable: boolean;
}

export interface PrescriptionInfo {
  prescriptionNumber: string;
  patientName: string;
  patientFirstLastName: string;
  patientSecondLastName: string;
  patientId: string;
  patientIdType: string;
  patientAge: number;
  patientGender: "M" | "F";
  patientBloodType: string;
  patientAllergies: string[];
  patientChronicConditions: string[];
  issueDate: string;
  issueTime: string;
  medicalCenter: string;
  diagnosis: string;
  clinicalNotes: string;
  doctorName: string;
  doctorLicense: string;
  doctorSpecialty: string;
  status: "emitted" | "dispensed" | "cancelled";
  signatureToken?: string;
  qrCode?: string;
}

// Metadata de IA para prescripciones asistidas
export interface AIAssistanceMetadata {
  modelUsed: string; // ej: "BERT Clínico v2.1"
  confidence: number; // 0-1
  suggestedDiagnosisCIE10?: string;
  suggestedDiagnosisDescription?: string;
  clinicalDescriptionProcessed: string;
  interactionsDetected: number;
  contraindicationsDetected: string[];
  nlpProcessingTimestamp: string;
  suggestionAcceptanceRate: number; // 0-1
  medicationsSuggested: number;
  medicationsAccepted: number;
  medicationsModified: number;
  userFeedback?: 'helpful' | 'neutral' | 'not-helpful';
  aiAuditLogId?: string; // Referencia al log de auditoría IA
}

export interface EmittedPrescriptionData {
  prescription: PrescriptionInfo;
  medicines: Medicine[];
  emittedAt: string; // Timestamp de finalización
  emittedBy: string; // Usuario que emitió
  // NUEVO: Campos para unificación
  origin: 'manual' | 'ai-assisted'; // Origen de la prescripción
  aiMetadata?: AIAssistanceMetadata; // Metadata opcional de IA
  // NUEVO: Campos para dispensación
  dispensationStatus?: 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled';
  dispensationRecords?: DispensationRecord[];
}

// NUEVO: Registro de dispensación
export interface DispensationRecord {
  timestamp: string;
  pharmacy: string;
  pharmacist: string;
  notes?: string;
  medicinesDispensed: Array<{
    medicineId: string;
    quantityDispensed: number;
    totalQuantity: number;
  }>;
  statusBefore: 'emitted' | 'partially_dispensed' | 'fully_dispensed';
  statusAfter: 'emitted' | 'partially_dispensed' | 'fully_dispensed';
}

// Store en memoria para recetas emitidas
const emittedPrescriptionsStore: Record<string, EmittedPrescriptionData> = {};

// Inicializar con datos de ejemplo
const initializeMockData = () => {
  // Receta ejemplo 1 - MANUAL
  emittedPrescriptionsStore["RX-2025-001234"] = {
    prescription: {
      prescriptionNumber: "RX-2025-001234",
      patientName: "Carlos",
      patientFirstLastName: "Rodríguez",
      patientSecondLastName: "Sánchez",
      patientId: "1-0856-0432",
      patientIdType: "Cédula Nacional",
      patientAge: 45,
      patientGender: "M",
      patientBloodType: "O+",
      patientAllergies: ["Penicilina"],
      patientChronicConditions: ["Hipertensión"],
      issueDate: "05/10/2025",
      issueTime: "09:30",
      medicalCenter: "Hospital San Juan de Dios",
      diagnosis: "Hipertensión arterial leve",
      clinicalNotes: "Control mensual de presión arterial",
      doctorName: "Dra. María Fernández López",
      doctorLicense: "MED-8542",
      doctorSpecialty: "Medicina Interna",
      status: "emitted",
      signatureToken: "SIG-2025-8432947",
      qrCode: "QR-RX-2025-001234"
    },
    medicines: [
      {
        id: "1",
        genericName: "Losartán",
        commercialName: "Cozaar",
        presentation: "Tabletas",
        concentration: "50 mg",
        quantity: 30,
        dose: "50 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en ayunas con abundante agua",
        substitutable: true
      }
    ],
    emittedAt: new Date("2025-10-05T09:30:00").toISOString(),
    emittedBy: "Dra. María Fernández López",
    origin: 'manual' // Prescripción manual sin IA
  };

  // Receta ejemplo 2 - ASISTIDA POR IA
  emittedPrescriptionsStore["RX-2025-001235"] = {
    prescription: {
      prescriptionNumber: "RX-2025-001235",
      patientName: "Ana",
      patientFirstLastName: "García",
      patientSecondLastName: "Mora",
      patientId: "2-0654-0821",
      patientIdType: "Cédula Nacional",
      patientAge: 32,
      patientGender: "F",
      patientBloodType: "A+",
      patientAllergies: [],
      patientChronicConditions: [],
      issueDate: "05/10/2025",
      issueTime: "10:15",
      medicalCenter: "Clínica Santa María",
      diagnosis: "Infección respiratoria aguda (J06.9)",
      clinicalNotes: "Reposo relativo, abundantes líquidos. Sugerido por IA.",
      doctorName: "Dr. José Ramírez Castro",
      doctorLicense: "MED-7621",
      doctorSpecialty: "Medicina General",
      status: "emitted",
      signatureToken: "SIG-2025-8432948",
      qrCode: "QR-RX-2025-001235"
    },
    medicines: [
      {
        id: "1",
        genericName: "Amoxicilina",
        commercialName: "Amoxil",
        presentation: "Cápsulas",
        concentration: "500 mg",
        quantity: 21,
        dose: "500 mg",
        frequency: "Cada 8 horas",
        duration: "7 días",
        route: "Oral",
        indications: "Tomar después de alimentos",
        substitutable: true
      },
      {
        id: "2",
        genericName: "Paracetamol",
        commercialName: "Tylenol",
        presentation: "Tabletas",
        concentration: "500 mg",
        quantity: 12,
        dose: "500 mg",
        frequency: "Cada 6 horas según necesidad",
        duration: "4 días",
        route: "Oral",
        indications: "Para fiebre o dolor",
        substitutable: true
      }
    ],
    emittedAt: new Date("2025-10-05T10:15:00").toISOString(),
    emittedBy: "Dr. José Ramírez Castro",
    origin: 'ai-assisted', // Prescripción asistida por IA
    aiMetadata: {
      modelUsed: "BERT Clínico v2.1",
      confidence: 0.94,
      suggestedDiagnosisCIE10: "J06.9",
      suggestedDiagnosisDescription: "Infección aguda de las vías respiratorias superiores, no especificada",
      clinicalDescriptionProcessed: "Paciente de 32 años con fiebre, dolor de garganta y malestar general desde hace 2 días",
      interactionsDetected: 0,
      contraindicationsDetected: [],
      nlpProcessingTimestamp: new Date("2025-10-05T10:10:00").toISOString(),
      suggestionAcceptanceRate: 1.0,
      medicationsSuggested: 2,
      medicationsAccepted: 2,
      medicationsModified: 0,
      userFeedback: 'helpful',
      aiAuditLogId: 'AI-LOG-001'
    }
  };

  // Receta ejemplo 3 - RX-2025-009842
  emittedPrescriptionsStore["RX-2025-009842"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009842",
      patientName: "Carlos Andrés",
      patientFirstLastName: "Pérez",
      patientSecondLastName: "Gutiérrez",
      patientId: "41.523.789",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 52,
      patientGender: "M",
      patientBloodType: "O+",
      patientAllergies: ["Sulfas"],
      patientChronicConditions: ["Diabetes tipo 2"],
      issueDate: "01/10/2025",
      issueTime: "09:45",
      medicalCenter: "Hospital San Rafael",
      diagnosis: "Diabetes mellitus tipo 2, control metabólico",
      clinicalNotes: "Paciente con buen control glicémico. Continuar con dieta y ejercicio.",
      doctorName: "Dr. Carlos Andrés Martínez López",
      doctorLicense: "MED-9876",
      doctorSpecialty: "Endocrinología",
      status: "emitted",
      signatureToken: "SIG-2025-9842",
      qrCode: "QR-RX-2025-009842"
    },
    medicines: [
      {
        id: "1",
        genericName: "Metformina",
        commercialName: "Glucophage",
        presentation: "Tabletas",
        concentration: "850 mg",
        quantity: 60,
        dose: "850 mg",
        frequency: "Cada 12 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar con las comidas principales",
        substitutable: true
      },
      {
        id: "2",
        genericName: "Atorvastatina",
        commercialName: "Lipitor",
        presentation: "Tabletas",
        concentration: "20 mg",
        quantity: 30,
        dose: "20 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en la noche",
        substitutable: true
      },
      {
        id: "3",
        genericName: "Ácido Acetilsalicílico",
        commercialName: "Aspirina",
        presentation: "Tabletas",
        concentration: "100 mg",
        quantity: 30,
        dose: "100 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar con alimentos",
        substitutable: true
      }
    ],
    emittedAt: new Date("2025-10-01T09:45:00").toISOString(),
    emittedBy: "Dr. Carlos Andrés Martínez López",
    origin: 'manual'
  };

  // Receta ejemplo 4 - RX-2025-009841
  emittedPrescriptionsStore["RX-2025-009841"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009841",
      patientName: "Sandra Milena",
      patientFirstLastName: "Torres",
      patientSecondLastName: "Vargas",
      patientId: "52.367.941",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 38,
      patientGender: "F",
      patientBloodType: "A+",
      patientAllergies: [],
      patientChronicConditions: [],
      issueDate: "01/10/2025",
      issueTime: "08:30",
      medicalCenter: "Hospital San Rafael",
      diagnosis: "Cefalea tensional",
      clinicalNotes: "Manejo del estrés laboral. Técnicas de relajación recomendadas.",
      doctorName: "Dra. María Elena Rodríguez Silva",
      doctorLicense: "MED-7654",
      doctorSpecialty: "Neurología",
      status: "emitted",
      signatureToken: "SIG-2025-9841",
      qrCode: "QR-RX-2025-009841"
    },
    medicines: [
      {
        id: "1",
        genericName: "Ibuprofeno",
        commercialName: "Advil",
        presentation: "Tabletas",
        concentration: "400 mg",
        quantity: 20,
        dose: "400 mg",
        frequency: "Cada 8 horas según necesidad",
        duration: "10 días",
        route: "Oral",
        indications: "Tomar con alimentos para evitar molestias gástricas",
        substitutable: true
      },
      {
        id: "2",
        genericName: "Paracetamol",
        commercialName: "Tylenol",
        presentation: "Tabletas",
        concentration: "500 mg",
        quantity: 20,
        dose: "500 mg",
        frequency: "Cada 6 horas según necesidad",
        duration: "10 días",
        route: "Oral",
        indications: "Para dolor de cabeza",
        substitutable: true
      }
    ],
    emittedAt: new Date("2025-10-01T08:30:00").toISOString(),
    emittedBy: "Dra. María Elena Rodríguez Silva",
    origin: 'ai-assisted',
    aiMetadata: {
      modelUsed: "BERT Clínico v2.1",
      confidence: 0.89,
      suggestedDiagnosisCIE10: "G43.9",
      suggestedDiagnosisDescription: "Migraña, sin especificar",
      clinicalDescriptionProcessed: "Dolor de cabeza pulsátil unilateral, náuseas, fotofobia",
      interactionsDetected: 1,
      contraindicationsDetected: [],
      nlpProcessingTimestamp: new Date("2025-10-01T08:25:00").toISOString(),
      suggestionAcceptanceRate: 0.5,
      medicationsSuggested: 3,
      medicationsAccepted: 1,
      medicationsModified: 1,
      userFeedback: 'neutral',
      aiAuditLogId: 'AI-LOG-002'
    }
  };

  // Receta ejemplo 5 - RX-2025-009840
  emittedPrescriptionsStore["RX-2025-009840"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009840",
      patientName: "Diego Fernando",
      patientFirstLastName: "Ramírez",
      patientSecondLastName: "Castro",
      patientId: "38.941.652",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 65,
      patientGender: "M",
      patientBloodType: "B+",
      patientAllergies: ["Penicilina"],
      patientChronicConditions: ["Hipertensión arterial", "Insuficiencia cardíaca"],
      issueDate: "30/09/2025",
      issueTime: "16:15",
      medicalCenter: "Hospital San Rafael",
      diagnosis: "Hipertensión arterial esencial, Insuficiencia cardíaca compensada",
      clinicalNotes: "Paciente con buen control de presión arterial. Continuar con tratamiento actual.",
      doctorName: "Dr. Carlos Andrés Martínez López",
      doctorLicense: "MED-9876",
      doctorSpecialty: "Cardiología",
      status: "emitted",
      signatureToken: "SIG-2025-9840",
      qrCode: "QR-RX-2025-009840"
    },
    medicines: [
      {
        id: "1",
        genericName: "Enalapril",
        commercialName: "Renitec",
        presentation: "Tabletas",
        concentration: "10 mg",
        quantity: 60,
        dose: "10 mg",
        frequency: "Cada 12 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar a la misma hora todos los días",
        substitutable: true
      },
      {
        id: "2",
        genericName: "Furosemida",
        commercialName: "Lasix",
        presentation: "Tabletas",
        concentration: "40 mg",
        quantity: 30,
        dose: "40 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en la mañana",
        substitutable: true
      },
      {
        id: "3",
        genericName: "Carvedilol",
        commercialName: "Dilatrend",
        presentation: "Tabletas",
        concentration: "6.25 mg",
        quantity: 60,
        dose: "6.25 mg",
        frequency: "Cada 12 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar con alimentos",
        substitutable: true
      },
      {
        id: "4",
        genericName: "Ácido Acetilsalicílico",
        commercialName: "Aspirina",
        presentation: "Tabletas",
        concentration: "100 mg",
        quantity: 30,
        dose: "100 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar con alimentos",
        substitutable: true
      },
      {
        id: "5",
        genericName: "Atorvastatina",
        commercialName: "Lipitor",
        presentation: "Tabletas",
        concentration: "40 mg",
        quantity: 30,
        dose: "40 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en la noche",
        substitutable: true
      }
    ],
    emittedAt: new Date("2025-09-30T16:15:00").toISOString(),
    emittedBy: "Dr. Carlos Andrés Martínez López",
    origin: 'manual'
  };
};

// Inicializar datos mock
initializeMockData();

/**
 * API para gestionar recetas emitidas
 */
export const EmittedPrescriptionsAPI = {
  /**
   * Guardar una nueva receta emitida
   */
  savePrescription: (prescriptionNumber: string, data: EmittedPrescriptionData): void => {
    emittedPrescriptionsStore[prescriptionNumber] = {
      ...data,
      emittedAt: new Date().toISOString()
    };
  },

  /**
   * Obtener una receta emitida por número
   */
  getPrescription: (prescriptionNumber: string): EmittedPrescriptionData | null => {
    return emittedPrescriptionsStore[prescriptionNumber] || null;
  },

  /**
   * Obtener todas las recetas emitidas con sus números
   */
  getAllPrescriptions: (): Array<{ prescriptionNumber: string; data: EmittedPrescriptionData }> => {
    return Object.entries(emittedPrescriptionsStore).map(([prescriptionNumber, data]) => ({
      prescriptionNumber,
      data
    }));
  },

  /**
   * Obtener solo los datos de todas las recetas
   */
  getAllPrescriptionsData: (): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore);
  },

  /**
   * NUEVO: Obtener última receta de un paciente específico
   */
  getLastPrescriptionByPatient: (patientId: string): EmittedPrescriptionData | null => {
    const patientPrescriptions = Object.values(emittedPrescriptionsStore)
      .filter(data => data.prescription.patientId === patientId)
      .sort((a, b) => new Date(b.emittedAt).getTime() - new Date(a.emittedAt).getTime());
    
    return patientPrescriptions.length > 0 ? patientPrescriptions[0] : null;
  },

  /**
   * NUEVO: Obtener todas las recetas de un paciente específico
   */
  getPrescriptionsByPatient: (patientId: string): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore)
      .filter(data => data.prescription.patientId === patientId)
      .sort((a, b) => new Date(b.emittedAt).getTime() - new Date(a.emittedAt).getTime());
  },

  /**
   * NUEVO: Verificar si un paciente tiene recetas previas
   */
  hasPatientPrescriptions: (patientId: string): boolean => {
    return Object.values(emittedPrescriptionsStore)
      .some(data => data.prescription.patientId === patientId);
  },

  /**
   * Eliminar una receta emitida
   */
  deletePrescription: (prescriptionNumber: string): boolean => {
    if (emittedPrescriptionsStore[prescriptionNumber]) {
      delete emittedPrescriptionsStore[prescriptionNumber];
      return true;
    }
    return false;
  },

  /**
   * Verificar si existe una receta
   */
  exists: (prescriptionNumber: string): boolean => {
    return !!emittedPrescriptionsStore[prescriptionNumber];
  },

  /**
   * Actualizar el estado de una receta
   */
  updateStatus: (prescriptionNumber: string, status: "emitted" | "dispensed" | "cancelled"): boolean => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    if (prescription) {
      prescription.prescription.status = status;
      return true;
    }
    return false;
  },

  /**
   * Buscar recetas por paciente
   */
  searchByPatient: (patientId: string): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore).filter(
      prescription => prescription.prescription.patientId === patientId
    );
  },

  /**
   * Buscar recetas por médico
   */
  searchByDoctor: (doctorLicense: string): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore).filter(
      prescription => prescription.prescription.doctorLicense === doctorLicense
    );
  },

  /**
   * Generar número de receta único
   */
  generatePrescriptionNumber: (): string => {
    const year = new Date().getFullYear();
    const existingNumbers = Object.keys(emittedPrescriptionsStore)
      .filter(num => num.startsWith(`RX-${year}-`))
      .map(num => {
        const match = num.match(/RX-\d{4}-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const newNumber = (maxNumber + 1).toString().padStart(6, '0');
    return `RX-${year}-${newNumber}`;
  },

  /**
   * Obtener conteo de recetas por estado
   */
  getCountByStatus: (): Record<string, number> => {
    const counts = { emitted: 0, dispensed: 0, cancelled: 0 };
    Object.values(emittedPrescriptionsStore).forEach(prescription => {
      counts[prescription.prescription.status]++;
    });
    return counts;
  },

  /**
   * NUEVO: Actualizar estado de dispensación
   */
  updateDispensationStatus: (
    prescriptionNumber: string, 
    status: 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled',
    record: DispensationRecord
  ): boolean => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    if (prescription) {
      prescription.dispensationStatus = status;
      
      // Inicializar array si no existe
      if (!prescription.dispensationRecords) {
        prescription.dispensationRecords = [];
      }
      
      // Agregar registro de dispensación
      prescription.dispensationRecords.push(record);
      
      return true;
    }
    return false;
  },

  /**
   * NUEVO: Obtener historial de dispensación
   */
  getDispensationHistory: (prescriptionNumber: string): DispensationRecord[] => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    return prescription?.dispensationRecords || [];
  },

  /**
   * NUEVO: Obtener estado de dispensación actual
   */
  getDispensationStatus: (prescriptionNumber: string): 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled' | null => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    return prescription?.dispensationStatus || null;
  }
};