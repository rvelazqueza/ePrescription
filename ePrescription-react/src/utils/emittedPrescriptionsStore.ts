/**
 * Store para Recetas Médicas Emitidas (Finalizadas)
 * Gestiona las prescripciones que han sido completadas y firmadas
 * 
 * DATOS 100% CONSISTENTES CON ESTADOS SINCRONIZADOS
 * Actualizado: 19/11/2025
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
  // NUEVO: Estado de dispensación individual
  dispensationStatus?: 'pending' | 'partial' | 'dispensed';
  quantityDispensed?: number; // Cantidad ya dispensada (para estado parcial)
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
  modelUsed: string;
  confidence: number;
  suggestedDiagnosisCIE10?: string;
  suggestedDiagnosisDescription?: string;
  clinicalDescriptionProcessed: string;
  interactionsDetected: number;
  contraindicationsDetected: string[];
  nlpProcessingTimestamp: string;
  suggestionAcceptanceRate: number;
  medicationsSuggested: number;
  medicationsAccepted: number;
  medicationsModified: number;
  userFeedback?: 'helpful' | 'neutral' | 'not-helpful';
  aiAuditLogId?: string;
}

export interface EmittedPrescriptionData {
  prescription: PrescriptionInfo;
  medicines: Medicine[];
  emittedAt: string;
  emittedBy: string;
  origin: 'manual' | 'ai-assisted';
  aiMetadata?: AIAssistanceMetadata;
  // Estado de dispensación general (calculado automáticamente)
  dispensationStatus?: 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled';
  dispensationRecords?: DispensationRecord[];
}

// Registro de dispensación
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

// ============================================================================
// REGLAS DE CONSISTENCIA - OPCIÓN 1: ESTADOS SEPARADOS SINCRONIZADOS
// ============================================================================
// 
// NIVEL 1: ESTADO GENERAL DE LA RECETA
// - "emitted" → TODOS los medicamentos están en estado "pending"
// - "partially_dispensed" → ALGUNOS medicamentos en "partial" o "dispensed"
// - "fully_dispensed" → TODOS los medicamentos en estado "dispensed"
// 
// NIVEL 2: ESTADO DE CADA MEDICAMENTO
// - "pending" → 0% dispensado (quantityDispensed = 0)
// - "partial" → 1-99% dispensado (0 < quantityDispensed < quantity)
// - "dispensed" → 100% dispensado (quantityDispensed = quantity)
// 
// SINCRONIZACIÓN:
// El estado general se calcula automáticamente según los estados individuales
// ============================================================================

const initializeMockData = () => {
  
  // ========== RECETAS EN ESTADO: EMITIDA ==========
  // Todos los medicamentos en estado "pending"
  
  // RX-2025-009850 - EMITIDA - Infección urinaria
  emittedPrescriptionsStore["RX-2025-009850"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009850",
      patientName: "Laura Patricia",
      patientFirstLastName: "Morales",
      patientSecondLastName: "García",
      patientId: "35.789.456",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 29,
      patientGender: "F",
      patientBloodType: "A+",
      patientAllergies: [],
      patientChronicConditions: [],
      issueDate: "15/11/2025",
      issueTime: "09:15 a.m.",
      medicalCenter: "Clínica Santa María",
      diagnosis: "Infección urinaria aguda",
      clinicalNotes: "Abundantes líquidos. Control en 7 días si persisten síntomas.",
      doctorName: "Dra. María Elena Rodríguez Silva",
      doctorLicense: "MED-7654",
      doctorSpecialty: "Medicina General",
      status: "emitted",
      signatureToken: "SIG-2025-9850",
      qrCode: "QR-RX-2025-009850"
    },
    medicines: [
      {
        id: "1",
        genericName: "Nitrofurantoína",
        commercialName: "Macrodantina",
        presentation: "Cápsulas",
        concentration: "100 mg",
        quantity: 21,
        dose: "100 mg",
        frequency: "Cada 8 horas",
        duration: "7 días",
        route: "Oral",
        indications: "Tomar con alimentos y abundante agua",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      },
      {
        id: "2",
        genericName: "Fenazopiridina",
        commercialName: "Pyridium",
        presentation: "Tabletas",
        concentration: "100 mg",
        quantity: 9,
        dose: "100 mg",
        frequency: "Cada 8 horas",
        duration: "3 días",
        route: "Oral",
        indications: "Puede colorear la orina de naranja. Tomar después de alimentos.",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      }
    ],
    emittedAt: new Date("2025-11-15T09:15:00").toISOString(),
    emittedBy: "Dra. María Elena Rodríguez Silva",
    origin: 'manual',
    dispensationStatus: 'emitted' // ✅ Consistente: TODOS los medicamentos están "pending"
  };

  // RX-2025-009851 - EMITIDA - Diabetes
  emittedPrescriptionsStore["RX-2025-009851"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009851",
      patientName: "Miguel Ángel",
      patientFirstLastName: "Santos",
      patientSecondLastName: "Jiménez",
      patientId: "42.963.147",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 55,
      patientGender: "M",
      patientBloodType: "B+",
      patientAllergies: ["Penicilina"],
      patientChronicConditions: ["Diabetes tipo 2"],
      issueDate: "16/11/2025",
      issueTime: "02:30 p.m.",
      medicalCenter: "Hospital San Rafael",
      diagnosis: "Diabetes mellitus tipo 2, control metabólico",
      clinicalNotes: "Paciente con buen control glicémico. Continuar con dieta y ejercicio. Control en 30 días.",
      doctorName: "Dr. Carlos Andrés Martínez López",
      doctorLicense: "MED-9876",
      doctorSpecialty: "Endocrinología",
      status: "emitted",
      signatureToken: "SIG-2025-9851",
      qrCode: "QR-RX-2025-009851"
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
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      },
      {
        id: "2",
        genericName: "Glibenclamida",
        commercialName: "Daonil",
        presentation: "Tabletas",
        concentration: "5 mg",
        quantity: 30,
        dose: "5 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar 30 minutos antes del desayuno",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      },
      {
        id: "3",
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
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      }
    ],
    emittedAt: new Date("2025-11-16T14:30:00").toISOString(),
    emittedBy: "Dr. Carlos Andrés Martínez López",
    origin: 'manual',
    dispensationStatus: 'emitted' // ✅ Consistente: TODOS los medicamentos están "pending"
  };

  // RX-2025-009852 - EMITIDA CON IA - Amigdalitis
  emittedPrescriptionsStore["RX-2025-009852"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009852",
      patientName: "Carolina",
      patientFirstLastName: "Vásquez",
      patientSecondLastName: "Pérez",
      patientId: "38.147.258",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 34,
      patientGender: "F",
      patientBloodType: "O+",
      patientAllergies: [],
      patientChronicConditions: [],
      issueDate: "17/11/2025",
      issueTime: "10:45 a.m.",
      medicalCenter: "Clínica Central",
      diagnosis: "Amigdalitis bacteriana aguda (J03.9)",
      clinicalNotes: "Reposo relativo. Abundantes líquidos. Evitar irritantes. Sugerido por IA.",
      doctorName: "Dr. Jorge Enrique Salazar Ramírez",
      doctorLicense: "MED-5432",
      doctorSpecialty: "Medicina General",
      status: "emitted",
      signatureToken: "SIG-2025-9852",
      qrCode: "QR-RX-2025-009852"
    },
    medicines: [
      {
        id: "1",
        genericName: "Azitromicina",
        commercialName: "Zitromax",
        presentation: "Tabletas",
        concentration: "500 mg",
        quantity: 3,
        dose: "500 mg",
        frequency: "Cada 24 horas",
        duration: "3 días",
        route: "Oral",
        indications: "Tomar 1 hora antes o 2 horas después de alimentos",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      },
      {
        id: "2",
        genericName: "Ibuprofeno",
        commercialName: "Advil",
        presentation: "Tabletas",
        concentration: "400 mg",
        quantity: 15,
        dose: "400 mg",
        frequency: "Cada 8 horas según necesidad",
        duration: "5 días",
        route: "Oral",
        indications: "Tomar con alimentos para evitar molestias gástricas",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      },
      {
        id: "3",
        genericName: "Paracetamol",
        commercialName: "Tylenol",
        presentation: "Tabletas",
        concentration: "500 mg",
        quantity: 15,
        dose: "500 mg",
        frequency: "Cada 6 horas según necesidad",
        duration: "5 días",
        route: "Oral",
        indications: "Para fiebre o dolor",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      }
    ],
    emittedAt: new Date("2025-11-17T10:45:00").toISOString(),
    emittedBy: "Dr. Jorge Enrique Salazar Ramírez",
    origin: 'ai-assisted',
    aiMetadata: {
      modelUsed: "BERT Clínico v2.1",
      confidence: 0.92,
      suggestedDiagnosisCIE10: "J03.9",
      suggestedDiagnosisDescription: "Amigdalitis aguda, no especificada",
      clinicalDescriptionProcessed: "Paciente de 34 años con dolor de garganta intenso, fiebre de 38.5°C, dificultad para tragar, adenopatías cervicales palpables",
      interactionsDetected: 0,
      contraindicationsDetected: [],
      nlpProcessingTimestamp: new Date("2025-11-17T10:40:00").toISOString(),
      suggestionAcceptanceRate: 1.0,
      medicationsSuggested: 3,
      medicationsAccepted: 3,
      medicationsModified: 0,
      userFeedback: 'helpful',
      aiAuditLogId: 'AI-LOG-003'
    },
    dispensationStatus: 'emitted' // ✅ Consistente: TODOS los medicamentos están "pending"
  };

  // RX-2025-009853 - EMITIDA - Cefalea
  emittedPrescriptionsStore["RX-2025-009853"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009853",
      patientName: "Andrés Felipe",
      patientFirstLastName: "Gómez",
      patientSecondLastName: "Castro",
      patientId: "29.852.741",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 22,
      patientGender: "M",
      patientBloodType: "AB+",
      patientAllergies: [],
      patientChronicConditions: [],
      issueDate: "18/11/2025",
      issueTime: "04:20 p.m.",
      medicalCenter: "Clínica Santa María",
      diagnosis: "Cefalea tensional",
      clinicalNotes: "Manejo del estrés. Técnicas de relajación. Evitar pantallas prolongadas.",
      doctorName: "Dra. María Elena Rodríguez Silva",
      doctorLicense: "MED-7654",
      doctorSpecialty: "Neurología",
      status: "emitted",
      signatureToken: "SIG-2025-9853",
      qrCode: "QR-RX-2025-009853"
    },
    medicines: [
      {
        id: "1",
        genericName: "Paracetamol",
        commercialName: "Tylenol",
        presentation: "Tabletas",
        concentration: "500 mg",
        quantity: 20,
        dose: "500 mg",
        frequency: "Cada 6 horas según necesidad",
        duration: "10 días",
        route: "Oral",
        indications: "Para dolor de cabeza. No exceder 4 gramos al día.",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      }
    ],
    emittedAt: new Date("2025-11-18T16:20:00").toISOString(),
    emittedBy: "Dra. María Elena Rodríguez Silva",
    origin: 'manual',
    dispensationStatus: 'emitted' // ✅ Consistente: TODOS los medicamentos están "pending"
  };

  // RX-2025-009844 - EMITIDA - Hipertensión
  emittedPrescriptionsStore["RX-2025-009844"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009844",
      patientName: "María Fernanda",
      patientFirstLastName: "Castro",
      patientSecondLastName: "Díaz",
      patientId: "38.147.852",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 35,
      patientGender: "F",
      patientBloodType: "O-",
      patientAllergies: [],
      patientChronicConditions: ["Hipertensión arterial"],
      issueDate: "12/11/2025",
      issueTime: "09:15 a.m.",
      medicalCenter: "Hospital San Rafael",
      diagnosis: "Hipertensión arterial esencial",
      clinicalNotes: "Control de presión arterial en 15 días. Dieta baja en sodio y ejercicio regular.",
      doctorName: "Dra. María Elena Rodríguez Silva",
      doctorLicense: "MED-7654",
      doctorSpecialty: "Cardiología",
      status: "emitted",
      signatureToken: "SIG-2025-9844",
      qrCode: "QR-RX-2025-009844"
    },
    medicines: [
      {
        id: "1",
        genericName: "Enalapril",
        commercialName: "Renitec",
        presentation: "Tabletas",
        concentration: "10 mg",
        quantity: 30,
        dose: "10 mg",
        frequency: "Cada 12 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar a la misma hora todos los días",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      },
      {
        id: "2",
        genericName: "Amlodipino",
        commercialName: "Norvasc",
        presentation: "Tabletas",
        concentration: "5 mg",
        quantity: 30,
        dose: "5 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en la mañana",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      },
      {
        id: "3",
        genericName: "Hidroclorotiazida",
        commercialName: "Diurex",
        presentation: "Tabletas",
        concentration: "25 mg",
        quantity: 30,
        dose: "25 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en la mañana con alimentos",
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
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
        substitutable: true,
        dispensationStatus: 'pending',
        quantityDispensed: 0
      }
    ],
    emittedAt: new Date("2025-11-12T09:15:00").toISOString(),
    emittedBy: "Dra. María Elena Rodríguez Silva",
    origin: 'manual',
    dispensationStatus: 'emitted' // ✅ Consistente: TODOS los medicamentos están "pending"
  };

  // ========== RECETAS EN ESTADO: PARCIALMENTE DISPENSADA ==========
  // ALGUNOS medicamentos en estado "partial" o "dispensed"
  
  // RX-2025-009838 - PARCIALMENTE DISPENSADA
  emittedPrescriptionsStore["RX-2025-009838"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009838",
      patientName: "Javier Alejandro",
      patientFirstLastName: "Ruiz",
      patientSecondLastName: "Moreno",
      patientId: "50.124.897",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 47,
      patientGender: "M",
      patientBloodType: "O+",
      patientAllergies: [],
      patientChronicConditions: ["Hipertensión arterial"],
      issueDate: "05/11/2025",
      issueTime: "11:10 a.m.",
      medicalCenter: "Hospital San Rafael",
      diagnosis: "Hipertensión arterial no controlada",
      clinicalNotes: "Control de presión arterial en 7 días. Dieta baja en sodio.",
      doctorName: "Dr. Carlos Andrés Martínez López",
      doctorLicense: "MED-9876",
      doctorSpecialty: "Cardiología",
      status: "emitted",
      signatureToken: "SIG-2025-9838",
      qrCode: "QR-RX-2025-009838"
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
        indications: "Tomar en ayunas",
        substitutable: true,
        dispensationStatus: 'pending', // ❌ NO dispensado
        quantityDispensed: 0
      },
      {
        id: "2",
        genericName: "Amlodipino",
        commercialName: "Norvasc",
        presentation: "Tabletas",
        concentration: "5 mg",
        quantity: 30,
        dose: "5 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en la mañana",
        substitutable: true,
        dispensationStatus: 'pending', // ❌ NO dispensado
        quantityDispensed: 0
      },
      {
        id: "3",
        genericName: "Hidroclorotiazida",
        commercialName: "Diurex",
        presentation: "Tabletas",
        concentration: "25 mg",
        quantity: 30,
        dose: "25 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en la mañana con alimentos",
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 30
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
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 30
      }
    ],
    emittedAt: new Date("2025-11-05T11:10:00").toISOString(),
    emittedBy: "Dr. Carlos Andrés Martínez López",
    origin: 'manual',
    dispensationStatus: 'partially_dispensed', // ✅ Consistente: 2 de 4 medicamentos dispensados
    dispensationRecords: [
      {
        timestamp: new Date("2025-11-06T14:30:00").toISOString(),
        pharmacy: "Farmacia Hospital San Rafael",
        pharmacist: "Farm. Pedro Luis González",
        notes: "Dispensación parcial. Losartán y Amlodipino agotados en inventario.",
        medicinesDispensed: [
          { medicineId: "1", quantityDispensed: 0, totalQuantity: 30 },
          { medicineId: "2", quantityDispensed: 0, totalQuantity: 30 },
          { medicineId: "3", quantityDispensed: 30, totalQuantity: 30 },
          { medicineId: "4", quantityDispensed: 30, totalQuantity: 30 }
        ],
        statusBefore: 'emitted',
        statusAfter: 'partially_dispensed'
      }
    ]
  };

  // ========== RECETAS EN ESTADO: COMPLETAMENTE DISPENSADA ==========
  // TODOS los medicamentos en estado "dispensed"
  
  // RX-2025-009843 - COMPLETAMENTE DISPENSADA
  emittedPrescriptionsStore["RX-2025-009843"] = {
    prescription: {
      prescriptionNumber: "RX-2025-009843",
      patientName: "Roberto Luis",
      patientFirstLastName: "Fernández",
      patientSecondLastName: "Mora",
      patientId: "47.258.963",
      patientIdType: "Cédula de Ciudadanía",
      patientAge: 41,
      patientGender: "M",
      patientBloodType: "A+",
      patientAllergies: [],
      patientChronicConditions: ["Gastritis crónica"],
      issueDate: "10/11/2025",
      issueTime: "03:30 p.m.",
      medicalCenter: "Clínica Central",
      diagnosis: "Gastritis aguda",
      clinicalNotes: "Control en 15 días",
      doctorName: "Dr. Carlos Andrés Martínez López",
      doctorLicense: "MED-9876",
      doctorSpecialty: "Gastroenterología",
      status: "emitted",
      signatureToken: "SIG-2025-9843",
      qrCode: "QR-RX-2025-009843"
    },
    medicines: [
      {
        id: "1",
        genericName: "Omeprazol",
        commercialName: "Omepral",
        presentation: "Cápsulas",
        concentration: "20 mg",
        quantity: 30,
        dose: "20 mg",
        frequency: "Cada 24 horas",
        duration: "30 días",
        route: "Oral",
        indications: "Tomar en ayunas, 30 minutos antes del desayuno",
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 30
      },
      {
        id: "2",
        genericName: "Sucralfato",
        commercialName: "Antepsin",
        presentation: "Suspensión",
        concentration: "1 g/5 ml",
        quantity: 1,
        dose: "5 ml",
        frequency: "Cada 8 horas",
        duration: "14 días",
        route: "Oral",
        indications: "Tomar 1 hora antes de las comidas",
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 1
      }
    ],
    emittedAt: new Date("2025-11-10T15:30:00").toISOString(),
    emittedBy: "Dr. Carlos Andrés Martínez López",
    origin: 'manual',
    dispensationStatus: 'fully_dispensed', // ✅ Consistente: TODOS los medicamentos dispensados
    dispensationRecords: [
      {
        timestamp: new Date("2025-11-12T10:00:00").toISOString(),
        pharmacy: "Farmacia Central Hospital San José",
        pharmacist: "Farm. Ana María Castillo",
        notes: "Dispensación completa realizada",
        medicinesDispensed: [
          { medicineId: "1", quantityDispensed: 30, totalQuantity: 30 },
          { medicineId: "2", quantityDispensed: 1, totalQuantity: 1 }
        ],
        statusBefore: 'emitted',
        statusAfter: 'fully_dispensed'
      }
    ]
  };

  // RX-2025-009840 - COMPLETAMENTE DISPENSADA
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
      issueTime: "04:15 p.m.",
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
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 60
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
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 30
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
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 60
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
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 30
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
        substitutable: true,
        dispensationStatus: 'dispensed', // ✅ 100% dispensado
        quantityDispensed: 30
      }
    ],
    emittedAt: new Date("2025-09-30T16:15:00").toISOString(),
    emittedBy: "Dr. Carlos Andrés Martínez López",
    origin: 'manual',
    dispensationStatus: 'fully_dispensed', // ✅ Consistente: TODOS los medicamentos dispensados
    dispensationRecords: [
      {
        timestamp: new Date("2025-10-02T09:30:00").toISOString(),
        pharmacy: "Farmacia Hospital San Rafael",
        pharmacist: "Farm. Ana María Castillo",
        notes: "Dispensación completa de todos los medicamentos",
        medicinesDispensed: [
          { medicineId: "1", quantityDispensed: 60, totalQuantity: 60 },
          { medicineId: "2", quantityDispensed: 30, totalQuantity: 30 },
          { medicineId: "3", quantityDispensed: 60, totalQuantity: 60 },
          { medicineId: "4", quantityDispensed: 30, totalQuantity: 30 },
          { medicineId: "5", quantityDispensed: 30, totalQuantity: 30 }
        ],
        statusBefore: 'emitted',
        statusAfter: 'fully_dispensed'
      }
    ]
  };
};

// Inicializar datos mock
initializeMockData();

/**
 * Función helper: Calcular estado general de dispensación automáticamente
 */
export const calculateDispensationStatus = (
  medicines: Medicine[]
): 'emitted' | 'partially_dispensed' | 'fully_dispensed' => {
  const allPending = medicines.every(m => m.dispensationStatus === 'pending');
  const allDispensed = medicines.every(m => m.dispensationStatus === 'dispensed');
  
  if (allPending) return 'emitted';
  if (allDispensed) return 'fully_dispensed';
  return 'partially_dispensed';
};

/**
 * API para gestionar recetas emitidas
 */
export const EmittedPrescriptionsAPI = {
  savePrescription: (prescriptionNumber: string, data: EmittedPrescriptionData): void => {
    // Calcular estado automáticamente si no se proporciona
    const calculatedStatus = calculateDispensationStatus(data.medicines);
    
    emittedPrescriptionsStore[prescriptionNumber] = {
      ...data,
      dispensationStatus: data.dispensationStatus || calculatedStatus,
      emittedAt: new Date().toISOString()
    };
  },

  getPrescription: (prescriptionNumber: string): EmittedPrescriptionData | null => {
    return emittedPrescriptionsStore[prescriptionNumber] || null;
  },

  getAllPrescriptions: (): Array<{ prescriptionNumber: string; data: EmittedPrescriptionData }> => {
    return Object.entries(emittedPrescriptionsStore).map(([prescriptionNumber, data]) => ({
      prescriptionNumber,
      data
    }));
  },

  getAllPrescriptionsData: (): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore);
  },

  getLastPrescriptionByPatient: (patientId: string): EmittedPrescriptionData | null => {
    const patientPrescriptions = Object.values(emittedPrescriptionsStore)
      .filter(data => data.prescription.patientId === patientId)
      .sort((a, b) => new Date(b.emittedAt).getTime() - new Date(a.emittedAt).getTime());
    
    return patientPrescriptions.length > 0 ? patientPrescriptions[0] : null;
  },

  getPrescriptionsByPatient: (patientId: string): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore)
      .filter(data => data.prescription.patientId === patientId)
      .sort((a, b) => new Date(b.emittedAt).getTime() - new Date(a.emittedAt).getTime());
  },

  hasPatientPrescriptions: (patientId: string): boolean => {
    return Object.values(emittedPrescriptionsStore)
      .some(data => data.prescription.patientId === patientId);
  },

  deletePrescription: (prescriptionNumber: string): boolean => {
    if (emittedPrescriptionsStore[prescriptionNumber]) {
      delete emittedPrescriptionsStore[prescriptionNumber];
      return true;
    }
    return false;
  },

  exists: (prescriptionNumber: string): boolean => {
    return !!emittedPrescriptionsStore[prescriptionNumber];
  },

  updateStatus: (prescriptionNumber: string, status: "emitted" | "dispensed" | "cancelled"): boolean => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    if (prescription) {
      prescription.prescription.status = status;
      return true;
    }
    return false;
  },

  searchByPatient: (patientId: string): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore).filter(
      prescription => prescription.prescription.patientId === patientId
    );
  },

  searchByDoctor: (doctorLicense: string): EmittedPrescriptionData[] => {
    return Object.values(emittedPrescriptionsStore).filter(
      prescription => prescription.prescription.doctorLicense === doctorLicense
    );
  },

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

  getCountByStatus: (): Record<string, number> => {
    const counts = { emitted: 0, dispensed: 0, cancelled: 0 };
    Object.values(emittedPrescriptionsStore).forEach(prescription => {
      counts[prescription.prescription.status]++;
    });
    return counts;
  },

  updateDispensationStatus: (
    prescriptionNumber: string, 
    status: 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled',
    record: DispensationRecord
  ): boolean => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    if (prescription) {
      prescription.dispensationStatus = status;
      
      if (!prescription.dispensationRecords) {
        prescription.dispensationRecords = [];
      }
      
      prescription.dispensationRecords.push(record);
      
      return true;
    }
    return false;
  },

  getDispensationHistory: (prescriptionNumber: string): DispensationRecord[] => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    return prescription?.dispensationRecords || [];
  },

  getDispensationStatus: (prescriptionNumber: string): 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled' | null => {
    const prescription = emittedPrescriptionsStore[prescriptionNumber];
    return prescription?.dispensationStatus || null;
  }
};
