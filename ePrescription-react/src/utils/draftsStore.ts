// Utilidad para gestión de borradores de recetas
// En producción esto se reemplazaría con llamadas a API/Base de datos

import { Medicine } from "../components/MedicineTable";

export interface PrescriptionDraft {
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientFirstLastName: string;
  patientSecondLastName: string;
  patientGender: string;
  patientAge: number;
  doctorName: string;
  doctorCode: string;
  issueDate: string;
  issueTime: string;
  status: "draft" | "completed";
}

export interface DraftData {
  prescription: PrescriptionDraft;
  medicines: Medicine[];
}

// Mock data inicial
const initialDrafts: Record<string, DraftData> = {
  "1": {
    prescription: {
      prescriptionNumber: "RX-2025-009847",
      patientId: "CC-52.841.963",
      patientName: "María Elena",
      patientFirstLastName: "González",
      patientSecondLastName: "Rodríguez",
      patientGender: "Femenino",
      patientAge: 45,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "27/09/2025",
      issueTime: "10:32 a.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Ibuprofeno",
        quantity: "15 tabletas",
        dose: "400 mg",
        frequency: "3 veces al día",
        administration: "Oral",
        duration: "5 días",
        observations: ""
      },
      {
        id: "2",
        name: "Amoxicilina",
        quantity: "14 cápsulas",
        dose: "500 mg",
        frequency: "2 veces al día",
        administration: "Oral",
        duration: "7 días",
        observations: ""
      }
    ]
  },
  "2": {
    prescription: {
      prescriptionNumber: "RX-2025-009846",
      patientId: "CC-43.729.541",
      patientName: "Juan Carlos",
      patientFirstLastName: "Martínez",
      patientSecondLastName: "López",
      patientGender: "Masculino",
      patientAge: 62,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "26/09/2025",
      issueTime: "09:15 a.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Losartán",
        quantity: "30 tabletas",
        dose: "50 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar en ayunas"
      }
    ]
  },
  "3": {
    prescription: {
      prescriptionNumber: "RX-2025-009845",
      patientId: "CC-38.615.892",
      patientName: "Ana Patricia",
      patientFirstLastName: "Rojas",
      patientSecondLastName: "Fernández",
      patientGender: "Femenino",
      patientAge: 38,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "26/09/2025",
      issueTime: "16:45 p.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Metformina",
        quantity: "60 tabletas",
        dose: "850 mg",
        frequency: "2 veces al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar con alimentos"
      },
      {
        id: "2",
        name: "Enalapril",
        quantity: "30 tabletas",
        dose: "10 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: ""
      }
    ]
  },
  // ========== NUEVOS BORRADORES PARA PRÁCTICA ==========
  "4": {
    prescription: {
      prescriptionNumber: "RX-2025-009860",
      patientId: "CC-45.123.789",
      patientName: "Sofía",
      patientFirstLastName: "Ramírez",
      patientSecondLastName: "Castro",
      patientGender: "Femenino",
      patientAge: 28,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "19/11/2025",
      issueTime: "09:00 a.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Nitrofurantoína",
        quantity: "21 cápsulas",
        dose: "100 mg",
        frequency: "Cada 8 horas",
        administration: "Oral",
        duration: "7 días",
        observations: "Tomar con abundante agua y alimentos"
      },
      {
        id: "2",
        name: "Fenazopiridina",
        quantity: "9 tabletas",
        dose: "100 mg",
        frequency: "Cada 8 horas",
        administration: "Oral",
        duration: "3 días",
        observations: "Puede colorear la orina de naranja"
      }
    ]
  },
  "5": {
    prescription: {
      prescriptionNumber: "RX-2025-009861",
      patientId: "CC-51.987.456",
      patientName: "Roberto",
      patientFirstLastName: "Torres",
      patientSecondLastName: "Vargas",
      patientGender: "Masculino",
      patientAge: 58,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "19/11/2025",
      issueTime: "10:15 a.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Atorvastatina",
        quantity: "30 tabletas",
        dose: "20 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar en la noche"
      },
      {
        id: "2",
        name: "Ácido Acetilsalicílico",
        quantity: "30 tabletas",
        dose: "100 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar con alimentos"
      },
      {
        id: "3",
        name: "Metformina",
        quantity: "60 tabletas",
        dose: "850 mg",
        frequency: "2 veces al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar con las comidas principales"
      }
    ]
  },
  "6": {
    prescription: {
      prescriptionNumber: "RX-2025-009862",
      patientId: "CC-36.741.852",
      patientName: "Gabriela",
      patientFirstLastName: "Mendoza",
      patientSecondLastName: "Silva",
      patientGender: "Femenino",
      patientAge: 32,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "19/11/2025",
      issueTime: "11:30 a.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Levotiroxina",
        quantity: "30 tabletas",
        dose: "100 mcg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar en ayunas, 30 minutos antes del desayuno"
      }
    ]
  },
  "7": {
    prescription: {
      prescriptionNumber: "RX-2025-009863",
      patientId: "CC-42.369.147",
      patientName: "Carlos Eduardo",
      patientFirstLastName: "Pérez",
      patientSecondLastName: "Moreno",
      patientGender: "Masculino",
      patientAge: 41,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "19/11/2025",
      issueTime: "02:00 p.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Omeprazol",
        quantity: "30 cápsulas",
        dose: "20 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar en ayunas, 30 minutos antes del desayuno"
      },
      {
        id: "2",
        name: "Ranitidina",
        quantity: "30 tabletas",
        dose: "150 mg",
        frequency: "2 veces al día",
        administration: "Oral",
        duration: "15 días",
        observations: "Tomar antes de las comidas"
      }
    ]
  },
  "8": {
    prescription: {
      prescriptionNumber: "RX-2025-009864",
      patientId: "CC-29.654.321",
      patientName: "Daniela",
      patientFirstLastName: "Ortiz",
      patientSecondLastName: "Gutiérrez",
      patientGender: "Femenino",
      patientAge: 24,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "19/11/2025",
      issueTime: "03:45 p.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Azitromicina",
        quantity: "3 tabletas",
        dose: "500 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "3 días",
        observations: "Tomar 1 hora antes o 2 horas después de alimentos"
      },
      {
        id: "2",
        name: "Ibuprofeno",
        quantity: "15 tabletas",
        dose: "400 mg",
        frequency: "Cada 8 horas según necesidad",
        administration: "Oral",
        duration: "5 días",
        observations: "Tomar con alimentos"
      },
      {
        id: "3",
        name: "Paracetamol",
        quantity: "15 tabletas",
        dose: "500 mg",
        frequency: "Cada 6 horas según necesidad",
        administration: "Oral",
        duration: "5 días",
        observations: "Para fiebre o dolor"
      }
    ]
  },
  "9": {
    prescription: {
      prescriptionNumber: "RX-2025-009865",
      patientId: "CC-48.852.963",
      patientName: "Fernando",
      patientFirstLastName: "Salazar",
      patientSecondLastName: "Jiménez",
      patientGender: "Masculino",
      patientAge: 52,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "19/11/2025",
      issueTime: "04:20 p.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Enalapril",
        quantity: "60 tabletas",
        dose: "10 mg",
        frequency: "2 veces al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar a la misma hora todos los días"
      },
      {
        id: "2",
        name: "Amlodipino",
        quantity: "30 tabletas",
        dose: "5 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar en la mañana"
      },
      {
        id: "3",
        name: "Hidroclorotiazida",
        quantity: "30 tabletas",
        dose: "25 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar en la mañana con alimentos"
      },
      {
        id: "4",
        name: "Ácido Acetilsalicílico",
        quantity: "30 tabletas",
        dose: "100 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar con alimentos"
      }
    ]
  },
  "10": {
    prescription: {
      prescriptionNumber: "RX-2025-009866",
      patientId: "CC-33.147.258",
      patientName: "Valentina",
      patientFirstLastName: "Herrera",
      patientSecondLastName: "Rojas",
      patientGender: "Femenino",
      patientAge: 19,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "19/11/2025",
      issueTime: "05:00 p.m.",
      status: "draft"
    },
    medicines: [
      {
        id: "1",
        name: "Paracetamol",
        quantity: "20 tabletas",
        dose: "500 mg",
        frequency: "Cada 6 horas según necesidad",
        administration: "Oral",
        duration: "10 días",
        observations: "Para dolor de cabeza. No exceder 4 gramos al día"
      }
    ]
  }
};

// Store en memoria (simulando base de datos)
let draftsStore: Record<string, DraftData> = { ...initialDrafts };

// API de gestión de borradores
export const DraftsAPI = {
  // Obtener todos los borradores con sus IDs
  getAllDrafts: (): Array<{ id: string; data: DraftData }> => {
    return Object.entries(draftsStore).map(([id, data]) => ({ id, data }));
  },

  // Obtener todos los borradores (solo datos, sin IDs)
  getAllDraftsData: (): DraftData[] => {
    return Object.values(draftsStore);
  },

  // Obtener un borrador por ID
  getDraft: (draftId: string): DraftData | null => {
    return draftsStore[draftId] || null;
  },

  // Guardar un borrador (crear o actualizar)
  saveDraft: (draftId: string, data: DraftData): string => {
    draftsStore[draftId] = {
      ...data,
      prescription: {
        ...data.prescription,
        issueDate: new Date().toLocaleDateString('es-ES'),
        issueTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      }
    };
    return draftId;
  },

  // Eliminar un borrador
  deleteDraft: (draftId: string): boolean => {
    if (draftsStore[draftId]) {
      delete draftsStore[draftId];
      return true;
    }
    return false;
  },

  // Generar nuevo ID de borrador
  generateDraftId: (): string => {
    return `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Buscar borradores por paciente
  findDraftsByPatient: (patientId: string): DraftData[] => {
    return Object.values(draftsStore).filter(
      draft => draft.prescription.patientId === patientId
    );
  },

  // Contar total de borradores
  countDrafts: (): number => {
    return Object.keys(draftsStore).length;
  },

  // Limpiar todos los borradores (solo para desarrollo)
  clearAllDrafts: (): void => {
    draftsStore = {};
  },

  // Restaurar borradores iniciales
  resetToInitialDrafts: (): void => {
    draftsStore = { ...initialDrafts };
  }
};

// Hook para usar en componentes React
export const useDrafts = () => {
  return DraftsAPI;
};