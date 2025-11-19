/**
 * Store de Historial de Interacciones Medicamentosas
 * Registra y gestiona todas las interacciones detectadas en el sistema
 * Proporciona analytics, reportes y trazabilidad completa
 */

import { InteractionAlert } from "./drugInteractionsDatabase";

export interface InteractionHistoryRecord {
  id: string;
  timestamp: string;
  prescriptionNumber: string | null;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicalCenter: string;
  interaction: InteractionAlert;
  wasBlocked: boolean;
  userDecision: "blocked" | "accepted" | "modified" | "pending";
  notes?: string;
  externalSource?: "RxNorm" | "DrugBank" | "OpenFDA" | "Medscape" | "Internal";
  sessionId?: string;
}

// Store en memoria
const interactionsHistory: InteractionHistoryRecord[] = [];

// ID counter
let nextId = 1;

// Inicializar con datos de ejemplo
const initializeMockHistory = () => {
  const mockRecords: InteractionHistoryRecord[] = [
    {
      id: "INT-001",
      timestamp: new Date("2025-10-01T09:15:00").toISOString(),
      prescriptionNumber: "RX-2025-001200",
      patientId: "1-0856-0432",
      patientName: "Carlos Rodríguez Sánchez",
      doctorId: "MED-8542",
      doctorName: "Dra. María Fernández López",
      medicalCenter: "Hospital San Juan de Dios",
      interaction: {
        drug1: "Warfarina",
        drug2: "Aspirina",
        interaction: {
          drug1: "warfarina",
          drug2: "aspirina",
          severity: "critical",
          description: "Riesgo severo de hemorragia gastrointestinal y sangrado",
          clinicalEffect: "Aumento significativo del riesgo de sangrado mayor (INR >5)",
          recommendation: "CONTRAINDICADO. Considerar alternativas anticoagulantes",
          references: "FDA Drug Safety Communication 2014"
        },
        source: "prescription"
      },
      wasBlocked: true,
      userDecision: "blocked",
      notes: "El médico modificó la prescripción eliminando aspirina",
      externalSource: "OpenFDA",
      sessionId: "SES-20251001-001"
    },
    {
      id: "INT-002",
      timestamp: new Date("2025-10-02T14:30:00").toISOString(),
      prescriptionNumber: "RX-2025-001215",
      patientId: "2-0654-0821",
      patientName: "Ana García Mora",
      doctorId: "MED-7621",
      doctorName: "Dr. José Ramírez Castro",
      medicalCenter: "Clínica Santa María",
      interaction: {
        drug1: "Losartán",
        drug2: "Ibuprofeno",
        interaction: {
          drug1: "losartan",
          drug2: "ibuprofeno",
          severity: "severe",
          description: "Reducción de eficacia antihipertensiva y riesgo renal",
          clinicalEffect: "Aumento de presión arterial, deterioro función renal",
          recommendation: "Monitorear presión arterial y creatinina. Considerar paracetamol",
          references: "Hypertension Journal 2023"
        },
        source: "prescription"
      },
      wasBlocked: false,
      userDecision: "accepted",
      notes: "Médico decidió continuar con monitoreo estricto de función renal",
      externalSource: "DrugBank",
      sessionId: "SES-20251002-005"
    },
    {
      id: "INT-003",
      timestamp: new Date("2025-10-03T10:45:00").toISOString(),
      prescriptionNumber: "RX-2025-001228",
      patientId: "1-0745-0932",
      patientName: "Luis Morales Vega",
      doctorId: "MED-8542",
      doctorName: "Dra. María Fernández López",
      medicalCenter: "Hospital San Juan de Dios",
      interaction: {
        drug1: "Omeprazol",
        drug2: "Clopidogrel",
        interaction: {
          drug1: "omeprazol",
          drug2: "clopidogrel",
          severity: "moderate",
          description: "Reducción de activación de clopidogrel",
          clinicalEffect: "Menor efecto antiagregante plaquetario",
          recommendation: "Separar administración 12 horas o usar pantoprazol",
          references: "Circulation AHA 2024"
        },
        source: "patient_history"
      },
      wasBlocked: false,
      userDecision: "modified",
      notes: "Se cambió omeprazol por pantoprazol como alternativa segura",
      externalSource: "Medscape",
      sessionId: "SES-20251003-012"
    },
    {
      id: "INT-004",
      timestamp: new Date("2025-10-04T16:20:00").toISOString(),
      prescriptionNumber: "RX-2025-001245",
      patientId: "3-0456-0123",
      patientName: "Patricia Jiménez Solís",
      doctorId: "MED-7621",
      doctorName: "Dr. José Ramírez Castro",
      medicalCenter: "Clínica Santa María",
      interaction: {
        drug1: "Ibuprofeno",
        drug2: "Paracetamol",
        interaction: {
          drug1: "ibuprofeno",
          drug2: "paracetamol",
          severity: "mild",
          description: "Combinación segura con efectos complementarios",
          clinicalEffect: "Efecto analgésico aditivo sin aumento de efectos adversos",
          recommendation: "Puede usarse de forma alterna o combinada",
          references: "British Journal of Anesthesia 2023"
        },
        source: "prescription"
      },
      wasBlocked: false,
      userDecision: "accepted",
      notes: "Combinación estándar para manejo de dolor moderado",
      externalSource: "RxNorm",
      sessionId: "SES-20251004-008"
    },
    {
      id: "INT-005",
      timestamp: new Date("2025-10-05T11:00:00").toISOString(),
      prescriptionNumber: "RX-2025-001260",
      patientId: "1-0856-0432",
      patientName: "Carlos Rodríguez Sánchez",
      doctorId: "MED-8542",
      doctorName: "Dra. María Fernández López",
      medicalCenter: "Hospital San Juan de Dios",
      interaction: {
        drug1: "Atorvastatina",
        drug2: "Eritromicina",
        interaction: {
          drug1: "atorvastatina",
          drug2: "eritromicina",
          severity: "severe",
          description: "Aumento de niveles de estatina con riesgo de rabdomiólisis",
          clinicalEffect: "Miopatía, elevación de CPK, insuficiencia renal aguda",
          recommendation: "Suspender estatina temporalmente o reducir dosis",
          references: "Clinical Pharmacology & Therapeutics 2024"
        },
        source: "prescription"
      },
      wasBlocked: false,
      userDecision: "modified",
      notes: "Se suspendió atorvastatina durante tratamiento con eritromicina",
      externalSource: "DrugBank",
      sessionId: "SES-20251005-003"
    }
  ];

  interactionsHistory.push(...mockRecords);
  nextId = mockRecords.length + 1;
};

// Inicializar datos mock
initializeMockHistory();

/**
 * API para gestionar historial de interacciones
 */
export const InteractionsHistoryAPI = {
  /**
   * Registrar una nueva interacción detectada
   */
  recordInteraction: (record: Omit<InteractionHistoryRecord, "id" | "timestamp">): string => {
    const id = `INT-${nextId.toString().padStart(3, '0')}`;
    nextId++;

    const newRecord: InteractionHistoryRecord = {
      ...record,
      id,
      timestamp: new Date().toISOString()
    };

    interactionsHistory.unshift(newRecord); // Agregar al inicio (más recientes primero)
    return id;
  },

  /**
   * Registrar múltiples interacciones de una prescripción
   */
  recordMultipleInteractions: (
    alerts: InteractionAlert[],
    prescriptionData: {
      prescriptionNumber: string | null;
      patientId: string;
      patientName: string;
      doctorId: string;
      doctorName: string;
      medicalCenter: string;
    },
    decision: "blocked" | "accepted" | "modified" | "pending",
    notes?: string,
    externalSource?: "RxNorm" | "DrugBank" | "OpenFDA" | "Medscape" | "Internal"
  ): string[] => {
    const sessionId = `SES-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    return alerts.map(alert => {
      return InteractionsHistoryAPI.recordInteraction({
        ...prescriptionData,
        interaction: alert,
        wasBlocked: decision === "blocked",
        userDecision: decision,
        notes,
        externalSource: externalSource || "Internal",
        sessionId
      });
    });
  },

  /**
   * Obtener todas las interacciones
   */
  getAll: (): InteractionHistoryRecord[] => {
    return [...interactionsHistory];
  },

  /**
   * Buscar interacciones por paciente
   */
  getByPatient: (patientId: string): InteractionHistoryRecord[] => {
    return interactionsHistory.filter(record => record.patientId === patientId);
  },

  /**
   * Buscar interacciones por médico
   */
  getByDoctor: (doctorId: string): InteractionHistoryRecord[] => {
    return interactionsHistory.filter(record => record.doctorId === doctorId);
  },

  /**
   * Buscar interacciones por medicamento
   */
  getByMedicine: (medicineName: string): InteractionHistoryRecord[] => {
    const normalized = medicineName.toLowerCase();
    return interactionsHistory.filter(record => 
      record.interaction.drug1.toLowerCase().includes(normalized) ||
      record.interaction.drug2.toLowerCase().includes(normalized)
    );
  },

  /**
   * Buscar interacciones por severidad
   */
  getBySeverity: (severity: "critical" | "severe" | "moderate" | "mild"): InteractionHistoryRecord[] => {
    return interactionsHistory.filter(record => 
      record.interaction.interaction.severity === severity
    );
  },

  /**
   * Buscar interacciones por rango de fechas
   */
  getByDateRange: (startDate: Date, endDate: Date): InteractionHistoryRecord[] => {
    return interactionsHistory.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= startDate && recordDate <= endDate;
    });
  },

  /**
   * Buscar interacciones bloqueadas
   */
  getBlocked: (): InteractionHistoryRecord[] => {
    return interactionsHistory.filter(record => record.wasBlocked);
  },

  /**
   * Buscar interacciones aceptadas
   */
  getAccepted: (): InteractionHistoryRecord[] => {
    return interactionsHistory.filter(record => record.userDecision === "accepted");
  },

  /**
   * Obtener estadísticas generales
   */
  getStatistics: () => {
    const total = interactionsHistory.length;
    const bySeverity = {
      critical: interactionsHistory.filter(r => r.interaction.interaction.severity === "critical").length,
      severe: interactionsHistory.filter(r => r.interaction.interaction.severity === "severe").length,
      moderate: interactionsHistory.filter(r => r.interaction.interaction.severity === "moderate").length,
      mild: interactionsHistory.filter(r => r.interaction.interaction.severity === "mild").length
    };
    const byDecision = {
      blocked: interactionsHistory.filter(r => r.userDecision === "blocked").length,
      accepted: interactionsHistory.filter(r => r.userDecision === "accepted").length,
      modified: interactionsHistory.filter(r => r.userDecision === "modified").length,
      pending: interactionsHistory.filter(r => r.userDecision === "pending").length
    };
    const bySource = {
      RxNorm: interactionsHistory.filter(r => r.externalSource === "RxNorm").length,
      DrugBank: interactionsHistory.filter(r => r.externalSource === "DrugBank").length,
      OpenFDA: interactionsHistory.filter(r => r.externalSource === "OpenFDA").length,
      Medscape: interactionsHistory.filter(r => r.externalSource === "Medscape").length,
      Internal: interactionsHistory.filter(r => r.externalSource === "Internal" || !r.externalSource).length
    };

    return {
      total,
      bySeverity,
      byDecision,
      bySource,
      blockedPercentage: total > 0 ? Math.round((byDecision.blocked / total) * 100) : 0,
      criticalPercentage: total > 0 ? Math.round((bySeverity.critical / total) * 100) : 0
    };
  },

  /**
   * Obtener top medicamentos con más interacciones
   */
  getTopInteractingMedicines: (limit: number = 10): Array<{ medicine: string; count: number }> => {
    const medicineCount: Record<string, number> = {};

    interactionsHistory.forEach(record => {
      const drug1 = record.interaction.drug1;
      const drug2 = record.interaction.drug2;

      medicineCount[drug1] = (medicineCount[drug1] || 0) + 1;
      medicineCount[drug2] = (medicineCount[drug2] || 0) + 1;
    });

    return Object.entries(medicineCount)
      .map(([medicine, count]) => ({ medicine, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  /**
   * Obtener tendencias por mes
   */
  getTrendsByMonth: (): Record<string, number> => {
    const trends: Record<string, number> = {};

    interactionsHistory.forEach(record => {
      const date = new Date(record.timestamp);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      trends[monthKey] = (trends[monthKey] || 0) + 1;
    });

    return trends;
  },

  /**
   * Eliminar una interacción del historial
   */
  deleteRecord: (id: string): boolean => {
    const index = interactionsHistory.findIndex(r => r.id === id);
    if (index !== -1) {
      interactionsHistory.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Actualizar notas de una interacción
   */
  updateNotes: (id: string, notes: string): boolean => {
    const record = interactionsHistory.find(r => r.id === id);
    if (record) {
      record.notes = notes;
      return true;
    }
    return false;
  },

  /**
   * Actualizar decisión del usuario
   */
  updateDecision: (
    id: string, 
    decision: "blocked" | "accepted" | "modified" | "pending",
    notes?: string
  ): boolean => {
    const record = interactionsHistory.find(r => r.id === id);
    if (record) {
      record.userDecision = decision;
      record.wasBlocked = decision === "blocked";
      if (notes) record.notes = notes;
      return true;
    }
    return false;
  },

  /**
   * Buscar interacciones por sesión
   */
  getBySession: (sessionId: string): InteractionHistoryRecord[] => {
    return interactionsHistory.filter(record => record.sessionId === sessionId);
  },

  /**
   * Obtener interacciones recientes (últimos N días)
   */
  getRecent: (days: number = 7): InteractionHistoryRecord[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return interactionsHistory.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= cutoffDate;
    });
  }
};
