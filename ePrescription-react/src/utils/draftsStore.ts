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
