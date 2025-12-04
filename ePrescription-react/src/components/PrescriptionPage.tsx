import { useState, useEffect } from "react";
import { MedicineTable, Medicine } from "./MedicineTable";
import { MedicinePanel } from "./MedicinePanel";
import { PrescriptionHeader } from "./PrescriptionHeader";
import { PageBanner } from "./PageBanner";
import { PatientSelectorDialog } from "./PatientSelectorDialog";
import { AIPrescriptionAssistant } from "./AIPrescriptionAssistant";
import { ManualMedicineDialog, type ManualMedicineEntry } from "./ManualMedicineDialog";
import { PrescriptionOptionsCard } from "./PrescriptionOptionsCard";
import { RepeatPrescriptionDialog } from "./RepeatPrescriptionDialog";
import { BookletPurchaseDialog } from "./BookletPurchaseDialog";
import { BookletManagementAccordion } from "./BookletManagementAccordion";
import { DoctorRoleSelector } from "./DoctorRoleSelector";
import { CategoryConflictDialog } from "./CategoryConflictDialog";
import { ReplaceMedicineDialog } from "./ReplaceMedicineDialog";
import { FinalizePrescriptionAlert } from "./FinalizePrescriptionAlert";
import { SessionAPI } from "../utils/doctorsStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Pill, Package, Save, X, FileCheck, AlertTriangle, Clock, ArrowLeft, User, FileText, CheckCircle2, Award, Printer, ShieldAlert, Download, UserPlus, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { DraftsAPI } from "../utils/draftsStore";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { PrescriptionBookletsAPI, ConfigurationAPI, BookletUtils, type BookletType } from "../utils/prescriptionBookletsStore";
import { MedicineClassificationAPI, PRESCRIPTION_RULES } from "../utils/medicineClassificationStore";
import { 
  checkMedicineInteractions, 
  shouldBlockPrescription, 
  getHighestSeverity, 
  getSeverityLabel, 
  getSeverityColor,
  getInteractionStats,
  type InteractionAlert 
} from "../utils/drugInteractionsDatabase";
import { generatePrescriptionPDF, generateMultiplePrescriptionsPDF, downloadPrescriptionPDF, downloadMultiplePrescriptionsPDF } from "../utils/pdfGenerator";
import { PrintOptionsDialog } from "./PrintOptionsDialog";
import { InteractionsHistoryAPI } from "../utils/interactionsHistoryStore";
import { ExternalPharmacologyAPI, type ExternalSource } from "../utils/externalPharmacologyAPI";
import type { CIE10Code, MedicationSuggestion } from "../utils/aiAssistantStore";
import { 
  analyzeTreatment, 
  checkBookletAvailability,
  categoryToBookletType,
  type MultiPrescriptionMedication 
} from "../utils/multiPrescriptionUtils";

// Datos mock para la demostración
const mockPrescription = {
  prescriptionNumber: `DRAFT-FALLBACK-${Date.now()}`,
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
  status: "draft" as const
};

const mockMedicines: Medicine[] = [
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
  },
  {
    id: "3",
    name: "Omeprazol",
    quantity: "14 tabletas",
    dose: "20 mg",
    frequency: "1 vez al día",
    administration: "Oral",
    duration: "14 días",
    observations: ""
  }
];

// Datos mock de borradores para simular carga
const mockDrafts: Record<string, { prescription: typeof mockPrescription; medicines: Medicine[] }> = {
  "1": {
    prescription: mockPrescription,
    medicines: mockMedicines
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
      status: "draft" as const
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
      },
      {
        id: "2",
        name: "Atorvastatina",
        quantity: "30 tabletas",
        dose: "20 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar por la noche"
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
      status: "draft" as const
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
      },
      {
        id: "3",
        name: "Aspirina",
        quantity: "30 tabletas",
        dose: "100 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar después del desayuno"
      },
      {
        id: "4",
        name: "Atorvastatina",
        quantity: "30 tabletas",
        dose: "40 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar por la noche"
      },
      {
        id: "5",
        name: "Levotiroxina",
        quantity: "30 tabletas",
        dose: "75 mcg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "30 días",
        observations: "Tomar en ayunas 30 min antes del desayuno"
      }
    ]
  },
  "4": {
    prescription: {
      prescriptionNumber: "RX-2025-009844",
      patientId: "CC-51.428.967",
      patientName: "Roberto José",
      patientFirstLastName: "Sánchez",
      patientSecondLastName: "Mora",
      patientGender: "Masculino",
      patientAge: 51,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "25/09/2025",
      issueTime: "14:20 p.m.",
      status: "draft" as const
    },
    medicines: [
      {
        id: "1",
        name: "Cetirizina",
        quantity: "10 tabletas",
        dose: "10 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "10 días",
        observations: "Tomar en la noche"
      }
    ]
  },
  "5": {
    prescription: {
      prescriptionNumber: "RX-2025-009843",
      patientId: "CC-29.847.563",
      patientName: "Laura Sofía",
      patientFirstLastName: "Díaz",
      patientSecondLastName: "Ramírez",
      patientGender: "Femenino",
      patientAge: 29,
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      doctorCode: "RM-12345-COL",
      issueDate: "25/09/2025",
      issueTime: "11:30 a.m.",
      status: "draft" as const
    },
    medicines: [
      {
        id: "1",
        name: "Acetaminofén",
        quantity: "12 tabletas",
        dose: "500 mg",
        frequency: "3 veces al día",
        administration: "Oral",
        duration: "4 días",
        observations: "Tomar cada 8 horas"
      },
      {
        id: "2",
        name: "Loratadina",
        quantity: "7 tabletas",
        dose: "10 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "7 días",
        observations: ""
      },
      {
        id: "3",
        name: "Fluticasona nasal",
        quantity: "1 frasco",
        dose: "50 mcg",
        frequency: "2 aplicaciones por fosa nasal, 2 veces al día",
        administration: "Nasal",
        duration: "14 días",
        observations: "Agitar antes de usar"
      },
      {
        id: "4",
        name: "Dextrometorfano",
        quantity: "1 frasco de 120 ml",
        dose: "15 mg/5ml",
        frequency: "3 veces al día",
        administration: "Oral",
        duration: "5 días",
        observations: "Tomar 10 ml cada 8 horas"
      }
    ]
  }
};

interface PatientData {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  age: number;
  gender: "M" | "F";
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
}

interface PrescriptionPageProps {
  draftId?: string;
  onBack?: () => void;
  onNavigateToDrafts?: () => void;
  onNavigateToEmitted?: () => void;
  patientData?: PatientData;
}

/**
 * Formatear hora en formato 12h con AM/PM y segundos
 * Ejemplo: "10:32:45 AM" o "02:15:30 PM"
 */
const formatTime12h = (date: Date = new Date()): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours || 12; // la hora '0' debe ser '12'
  
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');
  
  return `${hoursStr}:${minutesStr}:${secondsStr} ${ampm}`;
};

export function PrescriptionPage({ draftId, onBack, onNavigateToDrafts, onNavigateToEmitted, patientData }: PrescriptionPageProps) {
  // Si hay un draftId, carga los datos del borrador, si no, usa datos vacíos/mock
  const loadDraftData = () => {
    if (draftId) {
      const draft = DraftsAPI.getDraft(draftId);
      if (draft) {
        return draft;
      }
    }
    
    // Si hay patientData, crear una nueva receta con los datos del paciente
    if (patientData) {
      const nameParts = patientData.fullName.split(' ');
      const newPrescription = {
        prescriptionNumber: `DRAFT-${Date.now()}`,
        patientId: `${patientData.idType}-${patientData.idNumber}`,
        patientName: patientData.firstName,
        patientFirstLastName: nameParts[nameParts.length - 2] || patientData.lastName.split(' ')[0] || '',
        patientSecondLastName: nameParts[nameParts.length - 1] || patientData.lastName.split(' ')[1] || '',
        patientGender: patientData.gender === "M" ? "Masculino" : "Femenino",
        patientAge: patientData.age,
        doctorName: "Dr. Carlos Alberto Mendoza Herrera",
        doctorCode: "RM-12345-COL",
        issueDate: new Date().toLocaleDateString('es-ES'),
        issueTime: formatTime12h(),
        status: "draft" as const
      };
      
      return {
        prescription: newPrescription,
        medicines: [] // Empezar sin medicamentos
      };
    }
    
    // Si el draftId no existe en mockDrafts (como en duplicados nuevos),
    // intentar encontrar un borrador similar basado en datos guardados
    // Por ahora, usar datos por defecto
    return {
      prescription: mockPrescription,
      medicines: mockMedicines
    };
  };

  const initialData = loadDraftData();
  const [prescription, setPrescription] = useState(initialData.prescription);
  const [medicines, setMedicines] = useState<Medicine[]>(initialData.medicines);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(draftId);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showFinalizationDialog, setShowFinalizationDialog] = useState(false);
  const [finalizedPrescriptionNumber, setFinalizedPrescriptionNumber] = useState<string | null>(null);
  const [finalizedBookletInfo, setFinalizedBookletInfo] = useState<{ bookletNumber: string; slipNumber: string; fullSlipNumber: string } | null>(null);
  // NUEVO: Información de múltiples recetas emitidas
  const [finalizedPrescriptions, setFinalizedPrescriptions] = useState<Array<{
    prescriptionNumber: string;
    bookletInfo: { bookletNumber: string; slipNumber: string; fullSlipNumber: string };
    category: string;
    medicinesCount: number;
  }>>([]);
  const [showInteractionsDialog, setShowInteractionsDialog] = useState(false);
  const [interactionAlerts, setInteractionAlerts] = useState<InteractionAlert[]>([]);
  const [isCheckingExternalAPIs, setIsCheckingExternalAPIs] = useState(false);
  const [externalAPISource, setExternalAPISource] = useState<ExternalSource>("DrugBank");
  const [showPrintOptionsDialog, setShowPrintOptionsDialog] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [currentPatientData, setCurrentPatientData] = useState<PatientData | null>(patientData || null);
  
  // NUEVO: Estados para el flujo mejorado de prescripción
  type PrescriptionMode = 'select-patient' | 'select-mode' | 'new' | 'repeat' | 'ai' | 'draft-edit';
  const [prescriptionMode, setPrescriptionMode] = useState<PrescriptionMode>(() => {
    if (draftId) return 'draft-edit';
    if (patientData) return 'select-mode';
    return 'select-patient';
  });
  const [showRepeatDialog, setShowRepeatDialog] = useState(false);
  const [lastPrescriptionData, setLastPrescriptionData] = useState<any>(null);
  const [prescriptionOrigin, setPrescriptionOrigin] = useState<'manual' | 'ai-assisted' | 'repeated'>('manual');
  const [basedOnPrescription, setBasedOnPrescription] = useState<string | null>(null);
  
  // NUEVO: Estados para sistema de talonarios
  const [showBookletPurchaseDialog, setShowBookletPurchaseDialog] = useState(false);
  const [bookletBalanceKey, setBookletBalanceKey] = useState(0);
  const [preselectedBookletType, setPreselectedBookletType] = useState<BookletType | null>(null);
  
  // Estado para controlar apertura del asistente IA
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Estado para controlar apertura del diálogo manual de medicamentos
  const [showManualMedicineDialog, setShowManualMedicineDialog] = useState(false);
  
  // NUEVO: Estados para sistema híbrido de validación
  const [showCategoryConflictDialog, setShowCategoryConflictDialog] = useState(false);
  const [showReplaceMedicineDialog, setShowReplaceMedicineDialog] = useState(false);
  const [conflictingMedicine, setConflictingMedicine] = useState<any>(null);
  
  // NUEVO: Doctor dinámico desde sesión
  const [currentDoctor, setCurrentDoctor] = useState(() => SessionAPI.getCurrentDoctor());
  const doctorId = currentDoctor?.id || "DOC-001";
  const doctorLicense = currentDoctor?.license || "RM-12345-COL";

  // NUEVO: Actualizar doctor cuando cambia la sesión
  useEffect(() => {
    const handleDoctorChange = () => {
      const newDoctor = SessionAPI.getCurrentDoctor();
      setCurrentDoctor(newDoctor);
      setBookletBalanceKey(prev => prev + 1); // Refrescar saldo
    };

    window.addEventListener('doctor-changed', handleDoctorChange);
    return () => window.removeEventListener('doctor-changed', handleDoctorChange);
  }, []);

  // Mostrar información cuando se carga con datos de paciente
  useEffect(() => {
    if (patientData) {
      const alertsCount = patientData.allergies.length + patientData.chronicConditions.length;
      if (alertsCount > 0) {
        toast.info('Datos del paciente cargados', {
          description: `Revise las ${alertsCount} alerta${alertsCount !== 1 ? 's' : ''} médica${alertsCount !== 1 ? 's' : ''} del paciente antes de prescribir`,
          duration: 5000,
        });
      }
    }
  }, [patientData]);

  // NUEVO: Reconstruir currentPatientData cuando se carga un borrador
  useEffect(() => {
    if (draftId && prescription.patientId && !currentPatientData) {
      // Reconstruir el objeto PatientData desde la información del borrador
      const reconstructedPatientData: PatientData = {
        id: prescription.patientId,
        idType: prescription.patientId.split('-')[0] || 'Cédula Nacional',
        idNumber: prescription.patientId.split('-').slice(1).join('-') || prescription.patientId,
        firstName: prescription.patientName,
        lastName: `${prescription.patientFirstLastName} ${prescription.patientSecondLastName}`.trim(),
        fullName: `${prescription.patientName} ${prescription.patientFirstLastName} ${prescription.patientSecondLastName}`.trim(),
        age: prescription.patientAge,
        gender: prescription.patientGender === "Masculino" ? "M" : "F",
        bloodType: patientData?.bloodType || "N/D",
        allergies: patientData?.allergies || [],
        chronicConditions: patientData?.chronicConditions || [],
        currentMedications: patientData?.currentMedications || []
      };
      
      setCurrentPatientData(reconstructedPatientData);
    }
  }, [draftId, prescription, currentPatientData, patientData]);

  // Handler para seleccionar un paciente
  const handleSelectPatient = (patient: PatientData) => {
    setCurrentPatientData(patient);
    
    // Actualizar los datos de la prescripción con el paciente seleccionado
    const nameParts = patient.fullName.split(' ');
    const updatedPrescription = {
      ...prescription,
      patientId: `${patient.idType}-${patient.idNumber}`,
      patientName: patient.firstName,
      patientFirstLastName: nameParts[nameParts.length - 2] || patient.lastName.split(' ')[0] || '',
      patientSecondLastName: nameParts[nameParts.length - 1] || patient.lastName.split(' ')[1] || '',
      patientGender: patient.gender === "M" ? "Masculino" : "Femenino",
      patientAge: patient.age,
    };
    
    setPrescription(updatedPrescription);
    
    // NUEVO: Detectar si el paciente tiene recetas previas
    const patientIdForSearch = `${patient.idType}-${patient.idNumber}`;
    const lastPrescription = EmittedPrescriptionsAPI.getLastPrescriptionByPatient(patientIdForSearch);
    
    if (lastPrescription) {
      setLastPrescriptionData(lastPrescription);
      toast.info('Historial encontrado', {
        description: `Este paciente tiene ${EmittedPrescriptionsAPI.getPrescriptionsByPatient(patientIdForSearch).length} receta(s) previa(s)`,
        duration: 4000,
      });
    }
    
    // Cambiar a modo de selección de tipo de prescripción
    setPrescriptionMode('select-mode');
    setHasUnsavedChanges(true);
  };

  // NUEVO: Handlers para modos de prescripción
  const handleNewPrescription = () => {
    setPrescriptionMode('new');
    setPrescriptionOrigin('manual');
    setBasedOnPrescription(null);
    // Limpiar medicamentos si existen
    setMedicines([]);
    // Abrir directamente el modal de múltiples medicamentos
    setShowManualMedicineDialog(true);
    toast.success('Nueva prescripción iniciada', {
      description: 'Agregue uno o más medicamentos',
      duration: 3000,
    });
  };

  const handleRepeatLastPrescription = () => {
    if (!lastPrescriptionData) {
      toast.error('No se encontró receta previa');
      return;
    }
    setShowRepeatDialog(true);
  };

  const handleConfirmRepeatPrescription = () => {
    if (!lastPrescriptionData) return;
    
    // Copiar medicamentos de la última receta
    const copiedMedicines: Medicine[] = lastPrescriptionData.medicines.map((med: any, index: number) => ({
      id: `repeat-${Date.now()}-${index}`,
      name: med.genericName || med.commercialName,
      quantity: `${med.quantity} ${med.presentation}`,
      dose: `${med.concentration}`,
      frequency: med.frequency,
      administration: med.route,
      duration: med.duration,
      observations: med.indications || ''
    }));
    
    setMedicines(copiedMedicines);
    setPrescriptionMode('repeat');
    setPrescriptionOrigin('repeated');
    setBasedOnPrescription(lastPrescriptionData.prescription.prescriptionNumber);
    setShowRepeatDialog(false);
    
    toast.success('Medicamentos copiados exitosamente', {
      description: `${copiedMedicines.length} medicamento(s) cargado(s) para revisión médica`,
      duration: 5000,
    });
    
    // Mostrar alerta recordatoria
    setTimeout(() => {
      toast.warning('Revisión médica obligatoria', {
        description: 'Verifique cada medicamento antes de emitir la receta',
        duration: 6000,
      });
    }, 2000);
  };

  const handleUseAIAssistant = () => {
    setPrescriptionMode('ai');
    setPrescriptionOrigin('ai-assisted');
    setBasedOnPrescription(null);
    setMedicines([]);
    // Abrir directamente el diálogo del asistente IA
    setShowAIAssistant(true);
    toast.info('Asistente IA activado', {
      description: 'Ingrese la descripción clínica para obtener sugerencias',
      duration: 3000,
    });
  };

  const handleMedicineDoubleClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsPanelOpen(true);
  };

  const handleAddMedicine = () => {
    // Abrir el diálogo de agregar medicamentos manualmente (múltiples)
    setShowManualMedicineDialog(true);
  };

  const handleSaveMedicine = (updatedMedicine: Medicine) => {
    setMedicines(prev => 
      prev.map(medicine => 
        medicine.id === updatedMedicine.id ? updatedMedicine : medicine
      )
    );
    setSelectedMedicine(updatedMedicine);
    setHasUnsavedChanges(true);
  };

  const handleAddNewMedicine = (newMedicine: Omit<Medicine, 'id'>) => {
    // Obtener información del medicamento nuevo
    const newMedicineInfo = MedicineClassificationAPI.getMedicineInfo(newMedicine.name);
    
    if (!newMedicineInfo) {
      toast.error("Medicamento no encontrado", {
        description: "El medicamento no está en el catálogo del sistema",
        duration: 5000,
      });
      return;
    }

    // VALIDACIÓN 1: Verificar tipo de receta actual
    // Si ya hay medicamentos, determinar el tipo de receta actual
    if (medicines.length > 0) {
      const currentMedicineInfo = MedicineClassificationAPI.getMedicineInfo(medicines[0].name);
      
      if (currentMedicineInfo && currentMedicineInfo.category !== newMedicineInfo.category) {
        // Intentando agregar medicamento de categoría diferente - BLOQUEAR
        setConflictingMedicine({
          newMedicine: newMedicine,
          newCategory: newMedicineInfo.categoryLabel,
          currentCategory: currentMedicineInfo.categoryLabel,
          action: 'different-category'
        });
        setShowCategoryConflictDialog(true);
        return;
      }
    }

    // VALIDACIÓN 2: Verificar límites de la misma categoría
    const categoryMedicines = medicines.filter(m => {
      const info = MedicineClassificationAPI.getMedicineInfo(m.name);
      return info?.category === newMedicineInfo.category;
    });

    const limit = newMedicineInfo.maxPerPrescription;
    
    if (categoryMedicines.length >= limit && limit !== Infinity) {
      // Excede límite de la misma categoría - OFRECER REEMPLAZO
      setConflictingMedicine({
        newMedicine: newMedicine,
        newCategory: newMedicineInfo.categoryLabel,
        existingMedicines: categoryMedicines,
        limit: limit,
        action: 'exceed-limit'
      });
      setShowReplaceMedicineDialog(true);
      return;
    }

    // VALIDACIÓN 3: Todo OK - Agregar medicamento
    const medicine: Medicine = {
      ...newMedicine,
      id: Date.now().toString()
    };
    setMedicines(prev => [...prev, medicine]);
    setHasUnsavedChanges(true);
    
    toast.success("Medicamento agregado", {
      description: `${categoryMedicines.length + 1} de ${limit === Infinity ? '∞' : limit} permitido(s) en ${newMedicineInfo.categoryLabel}`,
      duration: 3000,
    });
  };

  const handleDeleteMedicine = (medicineId: string, medicineName: string) => {
    const medicineInfo = MedicineClassificationAPI.getMedicineInfo(medicineName);
    
    // Confirmación especial para medicamentos controlados
    if (medicineInfo && medicineInfo.requiresSpecialControl) {
      if (!confirm(`¿Está seguro de eliminar ${medicineName}?\n\nEste es un medicamento controlado (${medicineInfo.categoryLabel}).`)) {
        return;
      }
    }
    
    setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
    if (selectedMedicine?.id === medicineId) {
      setIsPanelOpen(false);
      setSelectedMedicine(null);
    }
    setHasUnsavedChanges(true);
    
    toast.success("Medicamento eliminado", {
      description: `${medicineName} ha sido eliminado de la prescripción`,
      duration: 3000,
    });
  };

  // Handlers para el sistema híbrido de validación
  const handleCreateNewPrescriptionFromConflict = () => {
    // Guardar la receta actual como borrador si tiene cambios
    if (medicines.length > 0 && hasUnsavedChanges) {
      handleSaveDraft();
      toast.info("Receta actual guardada", {
        description: "Puede continuar con una nueva receta",
        duration: 4000,
      });
    }
    
    // Redirigir a nueva prescripción (en una aplicación real, esto navegaría a nueva página)
    // Por ahora, solo informamos al usuario
    toast.info("Crear nueva receta", {
      description: "Finalice la receta actual y cree una nueva para medicamentos de diferente categoría",
      duration: 5000,
    });
  };

  const handleReplaceMedicine = (medicineIdToReplace: string) => {
    if (!conflictingMedicine?.newMedicine) return;
    
    // Eliminar el medicamento antiguo
    setMedicines(prev => prev.filter(m => m.id !== medicineIdToReplace));
    
    // Agregar el nuevo medicamento
    const medicine: Medicine = {
      ...conflictingMedicine.newMedicine,
      id: Date.now().toString()
    };
    setMedicines(prev => [...prev, medicine]);
    setHasUnsavedChanges(true);
    
    const oldMedicine = medicines.find(m => m.id === medicineIdToReplace);
    toast.success("Medicamento reemplazado", {
      description: `${oldMedicine?.name} ha sido reemplazado por ${medicine.name}`,
      duration: 3000,
    });
    
    setConflictingMedicine(null);
    setShowReplaceMedicineDialog(false);
  };

  const handleViewMedicineDetails = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsPanelOpen(true);
  };

  // Handlers para el Asistente de IA
  const handleAIDiagnosisSelected = (diagnosis: CIE10Code) => {
    // Actualizar el diagnóstico en la prescripción (podrías agregar un campo diagnosis)
    toast.info('Diagnóstico seleccionado', {
      description: `${diagnosis.code} - ${diagnosis.description}`
    });
  };

  const handleAIMedicationsGenerated = (medications: MedicationSuggestion[]) => {
    console.log('🟣 Recibiendo medicamentos de IA:', medications);
    
    // Convertir las sugerencias de IA a formato Medicine y agregarlas
    const newMedicines: Medicine[] = medications.map((med, index) => ({
      id: `ai-${Date.now()}-${index}`,
      name: med.genericName,
      quantity: med.duration.includes('día') ? 
        `${parseInt(med.duration) * (med.frequency.includes('3') ? 3 : med.frequency.includes('2') ? 2 : 1)} ${med.dose.includes('tabletas') || med.dose.includes('cápsulas') ? 'unidades' : 'dosis'}` : 
        '30 unidades',
      dose: med.dose,
      frequency: med.frequency,
      administration: med.via,
      duration: med.duration,
      observations: med.instructions
    }));

    console.log('🟣 Medicamentos convertidos:', newMedicines);
    console.log('🟣 Medicamentos actuales antes de agregar:', medicines);

    setMedicines(prev => {
      const updated = [...prev, ...newMedicines];
      console.log('🟣 Medicamentos después de agregar:', updated);
      return updated;
    });
    
    setHasUnsavedChanges(true);

    toast.success('Medicamentos agregados por IA', {
      description: `${newMedicines.length} medicamento(s) agregado(s) automáticamente`
    });
  };

  const handleManualMedicationsAdded = (medications: ManualMedicineEntry[]) => {
    console.log('🔵 Recibiendo medicamentos manuales:', medications);
    
    // Convertir ManualMedicineEntry a formato Medicine (mismo formato que IA)
    const newMedicines: Medicine[] = medications.map((med, index) => ({
      id: `manual-${Date.now()}-${index}`,
      name: med.genericName,
      quantity: med.duration.includes('día') ? 
        `${parseInt(med.duration) * (med.frequency.includes('3') ? 3 : med.frequency.includes('2') ? 2 : 1)} unidades` : 
        '30 unidades',
      dose: med.dose,
      frequency: med.frequency,
      administration: med.via,
      duration: med.duration,
      observations: med.instructions
    }));

    console.log('🔵 Medicamentos convertidos:', newMedicines);
    console.log('🔵 Medicamentos actuales antes de agregar:', medicines);

    setMedicines(prev => {
      const updated = [...prev, ...newMedicines];
      console.log('🔵 Medicamentos después de agregar:', updated);
      return updated;
    });
    
    setHasUnsavedChanges(true);

    toast.success('Medicamentos agregados manualmente', {
      description: `${newMedicines.length} medicamento(s) agregado(s) a la prescripción`
    });
  };

  // Guardar borrador
  const handleSaveDraft = () => {
    // Validar que hay información mínima para guardar
    if (!prescription.patientName && medicines.length === 0) {
      toast.error("No hay información para guardar", {
        description: "Agregue al menos un medicamento antes de guardar el borrador"
      });
      return;
    }

    // Generar o usar ID existente
    const draftIdToSave = currentDraftId || DraftsAPI.generateDraftId();
    
    // Actualizar timestamp
    const updatedPrescription = {
      ...prescription,
      issueDate: new Date().toLocaleDateString('es-ES'),
      issueTime: formatTime12h(),
    };

    // Guardar en el store usando la API
    DraftsAPI.saveDraft(draftIdToSave, {
      prescription: updatedPrescription,
      medicines: medicines
    });

    // Actualizar estado local
    setPrescription(updatedPrescription);
    setCurrentDraftId(draftIdToSave);
    setSavedDraftId(draftIdToSave);
    setHasUnsavedChanges(false);

    // Mostrar diálogo de confirmación
    setShowSaveDialog(true);

    // También mostrar toast
    toast.success("Borrador guardado exitosamente", {
      description: `Número de borrador: ${draftIdToSave}`
    });
  };

  // Cancelar receta
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = confirm(
        "Tiene cambios sin guardar. ¿Está seguro de que desea cancelar?\n\nLos cambios no guardados se perderán."
      );
      if (!confirmCancel) return;
    }

    if (onBack) {
      onBack();
    } else {
      // Limpiar formulario
      setMedicines([]);
      setSelectedMedicine(null);
      setHasUnsavedChanges(false);
      toast.info("Prescripci��n cancelada");
    }
  };

  // Finalizar prescripción
  const handleFinalizePrescription = () => {
    // Validaciones básicas
    if (medicines.length === 0) {
      toast.error("No se puede finalizar la prescripción", {
        description: "Debe agregar al menos un medicamento antes de finalizar"
      });
      return;
    }

    if (!prescription.patientName || !prescription.patientFirstLastName) {
      toast.error("Datos del paciente incompletos", {
        description: "Complete la información del paciente antes de finalizar"
      });
      return;
    }

    if (!prescription.doctorName) {
      toast.error("Datos del médico incompletos", {
        description: "Complete la información del médico antes de finalizar"
      });
      return;
    }

    // VALIDACIÓN DE INTERACCIONES MEDICAMENTOSAS
    const medicinesForCheck = medicines.map(med => ({
      genericName: med.name,
      commercialName: med.name
    }));
    
    const patientCurrentMeds = patientData?.currentMedications || [];
    const interactions = checkMedicineInteractions(medicinesForCheck, patientCurrentMeds);
    
    if (interactions.length > 0) {
      setInteractionAlerts(interactions);
      const highestSeverity = getHighestSeverity(interactions);
      
      // REGISTRAR EN HISTORIAL
      InteractionsHistoryAPI.recordMultipleInteractions(
        interactions,
        {
          prescriptionNumber: null, // Aún no finalizada
          patientId: prescription.patientId,
          patientName: `${prescription.patientName} ${prescription.patientFirstLastName}`,
          doctorId: prescription.doctorCode,
          doctorName: prescription.doctorName,
          medicalCenter: "Hospital San Juan de Dios"
        },
        shouldBlockPrescription(interactions) ? "blocked" : "pending",
        undefined,
        "Internal" // Fuente interna por ahora
      );
      
      // Si hay interacciones críticas, bloquear
      if (shouldBlockPrescription(interactions)) {
        setShowInteractionsDialog(true);
        toast.error("Interacciones medicamentosas críticas detectadas", {
          description: `Se encontraron ${interactions.length} interacción(es) CRÍTICA(S) que requieren revisión inmediata`,
          duration: 8000
        });
        return; // BLOQUEAR finalización
      }
      
      // Si hay interacciones severas o moderadas, mostrar advertencia
      if (highestSeverity === "severe" || highestSeverity === "moderate") {
        setShowInteractionsDialog(true);
        toast.warning("Advertencia: Interacciones medicamentosas detectadas", {
          description: `Se encontraron ${interactions.length} interacción(es). Revise antes de continuar`,
          duration: 6000
        });
        return; // Mostrar diálogo para que el usuario decida
      }
      
      // Si solo hay interacciones leves, mostrar info pero continuar
      if (highestSeverity === "mild") {
        toast.info("Interacciones leves detectadas", {
          description: `${interactions.length} interacción(es) informativa(s). La prescripción es segura`,
          duration: 4000
        });
      }
    }

    // Proceder con la finalización si no hay interacciones críticas
    finalizePrescriptionProcess();
  };

  // Proceder con finalización (usado cuando usuario acepta interacciones)
  const proceedWithFinalization = () => {
    finalizePrescriptionProcess();
  };

  // Proceso de finalización centralizado
  const finalizePrescriptionProcess = () => {
    // NUEVA VALIDACIÓN: Analizar tratamiento completo y verificar talonarios disponibles
    
    // 1. Clasificar medicamentos por categoría
    const medicationsWithCategories: MultiPrescriptionMedication[] = medicines.map(med => {
      const category = MedicineClassificationAPI.classifyMedicine(med.name);
      const rules = PRESCRIPTION_RULES[category];
      
      return {
        id: med.id,
        name: med.name,
        category: rules.label as any, // Convertir a MedicationCategory
        dosage: med.dose,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.observations,
        quantity: parseInt(med.quantity) || 1
      };
    });

    // 2. Analizar tratamiento para determinar cuántas recetas se necesitan
    const analysis = analyzeTreatment(medicationsWithCategories);
    
    if (!analysis.isValid) {
      toast.error("Análisis de tratamiento falló", {
        description: analysis.errors.join(". "),
        duration: 6000,
      });
      return;
    }

    // 3. Obtener saldo de talonarios por tipo
    const availableSlipsByType = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
    
    // 4. Verificar si hay suficientes talonarios de cada tipo
    const bookletCheck = checkBookletAvailability(analysis, availableSlipsByType);
    
    if (!bookletCheck.hasEnough) {
      // Construir mensaje detallado de talonarios faltantes
      const missingDetails = bookletCheck.missing.map(m => {
        const typeLabel = BookletUtils.getBookletTypeLabel(m.bookletType);
        return `${typeLabel}: necesita ${m.needed}, disponible ${m.available}`;
      }).join("\n• ");
      
      toast.error("Talonarios insuficientes", {
        description: `Debe comprar talonarios antes de finalizar:\n• ${missingDetails}`,
        duration: 8000,
      });
      
      setShowBookletPurchaseDialog(true);
      return;
    }

    // 5. Mostrar advertencias si el tratamiento requiere múltiples recetas
    if (analysis.totalPrescriptions > 1) {
      toast.warning(`Este tratamiento generará ${analysis.totalPrescriptions} recetas separadas`, {
        description: analysis.warnings.join("\n"),
        duration: 6000,
      });
    }

    // ========================================
    // NUEVO: GENERACIÓN DE MÚLTIPLES RECETAS
    // ========================================
    
    const generatedPrescriptions: string[] = [];
    const generatedBooklets: Array<{ bookletNumber: string; slipNumber: string; fullSlipNumber: string }> = [];
    
    // Iterar sobre cada grupo de medicamentos
    for (let i = 0; i < analysis.groups.length; i++) {
      const group = analysis.groups[i];
      
      // Generar número de receta único para cada grupo
      const prescriptionNumber = EmittedPrescriptionsAPI.generatePrescriptionNumber();
      
      // Asignar boleta del talonario correspondiente
      const slipAssignment = PrescriptionBookletsAPI.assignSlipToPrescription(
        doctorId,
        prescriptionNumber,
        group.bookletType // Asignar del tipo correcto
      );

      if (!slipAssignment.success) {
        toast.error(`Error al asignar boleta de ${BookletUtils.getBookletTypeLabel(group.bookletType)}`, {
          description: slipAssignment.error,
          duration: 5000,
        });
        return;
      }
      
      // Generar token de firma y QR (simulado)
      const signatureToken = `SIG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000000)}`;
      const qrCode = `QR-${prescriptionNumber}`;

      // Preparar medicamentos de este grupo específico
      const groupMedicines = group.medications.map(med => {
        const originalMed = medicines.find(m => m.id === med.id)!;
        const medCategory = MedicineClassificationAPI.classifyMedicine(med.name);
        return {
          id: med.id,
          genericName: med.name,
          commercialName: med.name,
          presentation: "Tabletas",
          concentration: med.dosage,
          quantity: med.quantity || 1,
          dose: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          route: originalMed.administration,
          indications: med.instructions || "",
          substitutable: true,
          category: medCategory,
          dispensationStatus: 'pending' as const,
          quantityDispensed: 0
        };
      });

      // Preparar datos para receta emitida de este grupo
      const emittedPrescriptionData = {
        prescription: {
          prescriptionNumber,
          patientName: prescription.patientName,
          patientFirstLastName: prescription.patientFirstLastName,
          patientSecondLastName: prescription.patientSecondLastName || "",
          patientId: prescription.patientId,
          patientIdType: "Cédula Nacional",
          patientAge: prescription.patientAge,
          patientGender: prescription.patientGender === "Masculino" ? "M" as const : "F" as const,
          patientBloodType: patientData?.bloodType || "N/D",
          patientAllergies: patientData?.allergies || [],
          patientChronicConditions: patientData?.chronicConditions || [],
          issueDate: new Date().toLocaleDateString('es-ES'),
          issueTime: formatTime12h(),
          medicalCenter: "Hospital San Juan de Dios",
          diagnosis: "Diagnóstico médico",
          clinicalNotes: prescriptionOrigin === 'repeated' && basedOnPrescription 
            ? `Receta repetida basada en: ${basedOnPrescription}. Verificación médica completada. Receta ${i + 1} de ${analysis.totalPrescriptions} (${group.displayLabel})`
            : `Receta ${i + 1} de ${analysis.totalPrescriptions} - ${group.displayLabel}`,
          doctorName: prescription.doctorName,
          doctorLicense: prescription.doctorCode,
          doctorSpecialty: "Medicina General",
          status: "emitted" as const,
          signatureToken,
          qrCode,
          // NUEVO: Información de talonario y boleta
          bookletNumber: slipAssignment.slip.bookletNumber,
          slipNumber: slipAssignment.slip.slipNumber,
          fullSlipNumber: slipAssignment.slip.fullSlipNumber,
          // NUEVO: Metadata de grupo múltiple
          multiPrescriptionMetadata: analysis.totalPrescriptions > 1 ? {
            groupNumber: i + 1,
            totalGroups: analysis.totalPrescriptions,
            category: group.category,
            bookletType: group.bookletType
          } : undefined
        },
        medicines: groupMedicines,
        emittedAt: new Date().toISOString(),
        emittedBy: prescription.doctorName,
        dispensationStatus: 'emitted' as const,
        origin: prescriptionOrigin === 'repeated' ? 'manual' as const : (prescriptionOrigin === 'ai-assisted' ? 'ai-assisted' as const : 'manual' as const),
        ...(prescriptionOrigin === 'repeated' && basedOnPrescription && {
          repeatMetadata: {
            basedOnPrescription,
            repeatDate: new Date().toISOString(),
            verifiedBy: prescription.doctorName
          }
        })
      };

      // Guardar esta receta
      EmittedPrescriptionsAPI.savePrescription(prescriptionNumber, emittedPrescriptionData);
      
      // Guardar para el resumen
      generatedPrescriptions.push(prescriptionNumber);
      generatedBooklets.push(slipAssignment.slip);

      // Disparar evento para cada receta
      window.dispatchEvent(new CustomEvent('prescription-emitted', { 
        detail: { prescriptionNumber } 
      }));
    }

    // Si existe un borrador, eliminarlo
    if (currentDraftId) {
      DraftsAPI.deleteDraft(currentDraftId);
    }

    // Refreshar saldo de talonarios
    setBookletBalanceKey(prev => prev + 1);

    // Guardar información de todas las recetas generadas
    setFinalizedPrescriptionNumber(generatedPrescriptions.join(', '));
    setFinalizedBookletInfo(generatedBooklets[0]); // Primera boleta para compatibilidad
    
    // NUEVO: Guardar información detallada de cada receta
    const prescriptionsInfo = analysis.groups.map((group, idx) => ({
      prescriptionNumber: generatedPrescriptions[idx],
      bookletInfo: generatedBooklets[idx],
      category: group.displayLabel,
      medicinesCount: group.medications.length
    }));
    setFinalizedPrescriptions(prescriptionsInfo);
    
    // Limpiar estados
    setHasUnsavedChanges(false);
    setShowInteractionsDialog(false);
    
    // Mostrar diálogo de confirmación
    setShowFinalizationDialog(true);

    // Mostrar toast de éxito con resumen
    if (analysis.totalPrescriptions === 1) {
      toast.success("Prescripción finalizada exitosamente", {
        description: `Receta: ${generatedPrescriptions[0]} | Boleta: ${generatedBooklets[0].fullSlipNumber}`,
        duration: 5000
      });
    } else {
      toast.success(`${analysis.totalPrescriptions} recetas emitidas exitosamente`, {
        description: generatedPrescriptions.map((rx, idx) => 
          `${idx + 1}. ${rx} (${generatedBooklets[idx].fullSlipNumber})`
        ).join('\n'),
        duration: 8000
      });
    }
  };

  // Función para exportar PDF
  const handleExportPDF = () => {
    if (finalizedPrescriptions.length > 1) {
      // Si hay múltiples recetas, mostrar el diálogo de opciones
      setShowPrintOptionsDialog(true);
    } else if (finalizedPrescriptions.length === 1) {
      // Si solo hay una receta, imprimir directamente
      const prescriptionData = EmittedPrescriptionsAPI.getPrescription(finalizedPrescriptions[0].prescriptionNumber);
      if (prescriptionData) {
        generatePrescriptionPDF(prescriptionData);
        toast.success("Generando PDF", {
          description: "Se abrirá una nueva ventana con la receta lista para imprimir",
          duration: 3000
        });
      }
    } else if (finalizedPrescriptionNumber) {
      // Fallback para una sola receta (compatibilidad con flujo anterior)
      const prescriptionData = EmittedPrescriptionsAPI.getPrescription(finalizedPrescriptionNumber);
      if (prescriptionData) {
        generatePrescriptionPDF(prescriptionData);
        toast.success("Generando PDF", {
          description: "Se abrirá una nueva ventana con la receta lista para imprimir",
          duration: 3000
        });
      }
    }
  };

  // Funciones para manejar las opciones de impresión múltiple
  const handlePrintAllTogether = () => {
    const prescriptionsData = finalizedPrescriptions
      .map(rx => EmittedPrescriptionsAPI.getPrescription(rx.prescriptionNumber))
      .filter(data => data !== null);
    
    if (prescriptionsData.length > 0) {
      generateMultiplePrescriptionsPDF(prescriptionsData);
      toast.success(`Imprimiendo ${prescriptionsData.length} recetas juntas`, {
        description: "Se abrirá una ventana con todas las recetas con saltos de página",
        duration: 4000
      });
    }
    setShowPrintOptionsDialog(false);
  };

  const handleDownloadAllTogether = () => {
    const prescriptionsData = finalizedPrescriptions
      .map(rx => EmittedPrescriptionsAPI.getPrescription(rx.prescriptionNumber))
      .filter(data => data !== null);
    
    if (prescriptionsData.length > 0) {
      downloadMultiplePrescriptionsPDF(prescriptionsData);
      toast.success(`Descargando ${prescriptionsData.length} recetas juntas`, {
        description: "Se abrirá el diálogo para guardar el PDF con todas las recetas",
        duration: 4000
      });
    }
    setShowPrintOptionsDialog(false);
  };

  const handlePrintIndividual = () => {
    // Abrir todas las ventanas inmediatamente (sin setTimeout) para evitar que el navegador las bloquee
    let successCount = 0;
    
    finalizedPrescriptions.forEach((rx) => {
      const prescriptionData = EmittedPrescriptionsAPI.getPrescription(rx.prescriptionNumber);
      if (prescriptionData) {
        generatePrescriptionPDF(prescriptionData);
        successCount++;
      }
    });
    
    if (successCount > 0) {
      toast.success(`Abriendo ${successCount} ventana${successCount > 1 ? 's' : ''} de impresión`, {
        description: "Si no se abren todas, permita ventanas emergentes en su navegador",
        duration: 5000
      });
    } else {
      toast.error("No se pudieron abrir las ventanas de impresión");
    }
    
    setShowPrintOptionsDialog(false);
  };

  const handleDownloadIndividual = () => {
    // Abrir todas las ventanas inmediatamente (sin setTimeout) para evitar que el navegador las bloquee
    let successCount = 0;
    
    finalizedPrescriptions.forEach((rx) => {
      const prescriptionData = EmittedPrescriptionsAPI.getPrescription(rx.prescriptionNumber);
      if (prescriptionData) {
        downloadPrescriptionPDF(prescriptionData);
        successCount++;
      }
    });
    
    if (successCount > 0) {
      toast.success(`Abriendo ${successCount} ventana${successCount > 1 ? 's' : ''} de descarga`, {
        description: "Si no se abren todas, permita ventanas emergentes en su navegador",
        duration: 5000
      });
    } else {
      toast.error("No se pudieron abrir las ventanas de descarga");
    }
    
    setShowPrintOptionsDialog(false);
  };

  // Consultar APIs externas de farmacología
  const handleCheckExternalAPIs = async () => {
    if (medicines.length === 0) {
      toast.error("No hay medicamentos para verificar");
      return;
    }

    setIsCheckingExternalAPIs(true);
    
    try {
      toast.info(`Consultando ${externalAPISource}...`, {
        description: "Verificando interacciones con base de datos externa",
        duration: 3000
      });

      const medicinesForCheck = medicines.map(med => ({
        genericName: med.name,
        commercialName: med.name
      }));

      // Consultar API externa
      const externalInteractions = await ExternalPharmacologyAPI.checkMultipleMedicines(
        medicinesForCheck,
        externalAPISource
      );

      if (externalInteractions.length > 0) {
        toast.success(`Consulta completada: ${externalAPISource}`, {
          description: `Se encontraron ${externalInteractions.length} interacción(es) adicional(es)`,
          duration: 5000
        });

        // Mostrar información enriquecida
        console.log("External Interactions:", externalInteractions);
      } else {
        toast.success(`Consulta completada: ${externalAPISource}`, {
          description: "No se encontraron interacciones adicionales",
          duration: 3000
        });
      }
    } catch (error) {
      toast.error("Error al consultar API externa", {
        description: "Se usará la base de datos local como fallback"
      });
    } finally {
      setIsCheckingExternalAPIs(false);
    }
  };

  // Calcular el estado dinámico de la receta
  const calculatePrescriptionStatus = () => {
    if (medicines.length === 0) return "draft";
    return "draft"; // Para prescripción siempre será draft hasta que se guarde
  };

  const dynamicPrescription = {
    ...prescription,
    status: calculatePrescriptionStatus() as "draft" | "completed"
  };

  // Helper para verificar si se puede finalizar la prescripción
  const canFinalizePrescription = (): { can: boolean; reason: string } => {
    if (!currentPatientData) {
      return { can: false, reason: "Primero debe seleccionar un paciente" };
    }
    
    if (medicines.length === 0) {
      return { can: false, reason: "Debe agregar al menos un medicamento" };
    }

    // Analizar medicamentos por categoría
    const medicationsWithCategories: MultiPrescriptionMedication[] = medicines.map(med => {
      const category = MedicineClassificationAPI.classifyMedicine(med.name);
      const rules = PRESCRIPTION_RULES[category];
      
      return {
        id: med.id,
        name: med.name,
        category: rules.label as any,
        dosage: med.dose,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.observations,
        quantity: parseInt(med.quantity) || 1
      };
    });

    const analysis = analyzeTreatment(medicationsWithCategories);
    const availableSlipsByType = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
    const bookletCheck = checkBookletAvailability(analysis, availableSlipsByType);

    if (!bookletCheck.hasEnough) {
      const missingTypes = bookletCheck.missing
        .map(m => BookletUtils.getBookletTypeLabel(m.bookletType))
        .join(", ");
      return { 
        can: false, 
        reason: `Talonarios insuficientes para: ${missingTypes}. Debe comprar talonarios.` 
      };
    }

    return { can: true, reason: "" };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner de encabezado */}
      <PageBanner
        icon={FileText}
        title="Nueva Receta Médica"
        description="Sistema de prescripción electrónica con alertas clínicas en tiempo real"
        gradient="from-blue-600 via-indigo-500 to-purple-600"
        action={
          draftId && onBack ? (
            <Button 
              variant="outline" 
              onClick={onBack}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Borradores
            </Button>
          ) : undefined
        }
      />

      {/* NUEVO: Selector de Profesional / Rol */}
      <DoctorRoleSelector
        onDoctorChange={(newDoctorId) => {
          // Refrescar saldo cuando cambia doctor
          setBookletBalanceKey(prev => prev + 1);
        }}
        showBookletBalance={true}
      />

      {/* Gestión Consolidada de Talonarios */}
      <BookletManagementAccordion
        key={bookletBalanceKey}
        doctorId={doctorId}
        onPurchaseClick={() => setShowBookletPurchaseDialog(true)}
        onUpdate={() => setBookletBalanceKey(prev => prev + 1)}
      />

      {/* Selector de Paciente */}
      {!currentPatientData && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-900 mb-1">
                    Seleccione un paciente
                  </h3>
                  <p className="text-sm text-blue-700">
                    Debe seleccionar un paciente antes de poder prescribir medicamentos
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowPatientSelector(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Seleccionar Paciente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del paciente seleccionado - Fusionada */}
      {currentPatientData && (
        <Card className="border-l-4 border-l-primary shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Header con título y estado */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Prescripción Médica Electrónica</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-gray-600">#{dynamicPrescription.prescriptionNumber}</p>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">Certificada Digitalmente</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${dynamicPrescription.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'} px-3 py-1 text-sm border`}>
                  {dynamicPrescription.status === 'completed' ? 'Receta Finalizada' : 'Borrador'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPatientSelector(true)}
                  className="border-primary/30 text-primary hover:bg-primary/5"
                >
                  Cambiar paciente
                </Button>
              </div>
            </div>

            {/* Información del paciente */}
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border border-blue-100">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0">
                  <span className="text-2xl font-semibold text-primary">
                    {currentPatientData.firstName?.[0] || currentPatientData.fullName[0]}
                    {currentPatientData.lastName?.[0] || currentPatientData.fullName.split(' ')[1]?.[0] || ''}
                  </span>
                </div>
                
                {/* Información del paciente */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Paciente Activo
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">{currentPatientData.fullName}</h3>
                    <div className="flex items-center gap-6 mt-2 flex-wrap">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{currentPatientData.gender === 'M' ? 'Masculino' : 'Femenino'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{currentPatientData.age} años</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{currentPatientData.idType} {currentPatientData.idNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Tipo de sangre: {currentPatientData.bloodType}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Información médica adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Información del Médico</h4>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm text-gray-600">{currentDoctor?.name || dynamicPrescription.doctorName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Licencia: {currentDoctor?.license || dynamicPrescription.doctorCode}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Fecha y Hora</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{dynamicPrescription.issueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{dynamicPrescription.issueTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas médicas del paciente */}
      {currentPatientData && (currentPatientData.allergies.length > 0 || currentPatientData.chronicConditions.length > 0 || currentPatientData.currentMedications.length > 0) && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              Alertas médicas del paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPatientData.allergies.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-900 mb-2">⚠️ Alergias conocidas:</p>
                <div className="flex flex-wrap gap-2">
                  {currentPatientData.allergies.map((allergy, index) => (
                    <Badge key={index} className="bg-red-100 text-red-800 border-red-300">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {currentPatientData.chronicConditions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-orange-900 mb-2">⚕️ Condiciones crónicas:</p>
                <div className="flex flex-wrap gap-2">
                  {currentPatientData.chronicConditions.map((condition, index) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800 border-orange-300">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {currentPatientData.currentMedications.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">💊 Medicación actual:</p>
                <div className="flex flex-wrap gap-2">
                  {currentPatientData.currentMedications.map((medication, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-300">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* NUEVO: Opciones de Prescripción (solo si estamos en modo 'select-mode') */}
      {prescriptionMode === 'select-mode' && currentPatientData && lastPrescriptionData && (
        <PrescriptionOptionsCard
          patientName={currentPatientData.fullName}
          lastPrescription={{
            prescriptionNumber: lastPrescriptionData.prescription.prescriptionNumber,
            issueDate: lastPrescriptionData.prescription.issueDate,
            daysAgo: Math.floor((new Date().getTime() - new Date(lastPrescriptionData.emittedAt).getTime()) / (1000 * 60 * 60 * 24)),
            medicinesCount: lastPrescriptionData.medicines.length,
            medicinesSummary: lastPrescriptionData.medicines.slice(0, 3).map((m: any) => 
              `${m.genericName || m.commercialName} ${m.concentration}`
            )
          }}
          onNewPrescription={handleNewPrescription}
          onRepeatLastPrescription={handleRepeatLastPrescription}
          onUseAIAssistant={handleUseAIAssistant}
        />
      )}

      {/* NUEVO: Opciones de Prescripción (paciente sin recetas previas) */}
      {prescriptionMode === 'select-mode' && currentPatientData && !lastPrescriptionData && (
        <PrescriptionOptionsCard
          patientName={currentPatientData.fullName}
          onNewPrescription={handleNewPrescription}
          onRepeatLastPrescription={handleRepeatLastPrescription}
          onUseAIAssistant={handleUseAIAssistant}
        />
      )}

      {/* Header de la receta - ELIMINADO: Ahora fusionado con la tarjeta de paciente seleccionado */}

      {/* Badge indicando origen de la prescripción */}
      {prescriptionMode === 'repeat' && (
        <Card className="border-amber-500 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-medium text-amber-900">Receta Repetida - Revisión Médica Obligatoria</p>
                <p className="text-sm text-amber-700 mt-1">
                  Basada en: {basedOnPrescription} • {medicines.length} medicamento(s) copiado(s) para revisión
                </p>
              </div>
              <Badge variant="outline" className="border-amber-500 text-amber-700 bg-white">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Requiere Verificación
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerta de talonarios insuficientes */}
      {prescriptionMode !== 'select-mode' && prescriptionMode !== 'select-patient' && medicines.length > 0 && (() => {
        const medicationsWithCategories: MultiPrescriptionMedication[] = medicines.map(med => {
          const category = MedicineClassificationAPI.classifyMedicine(med.name);
          const rules = PRESCRIPTION_RULES[category];
          
          return {
            id: med.id,
            name: med.name,
            category: rules.label as any,
            dosage: med.dose,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.observations,
            quantity: parseInt(med.quantity) || 1
          };
        });

        const analysis = analyzeTreatment(medicationsWithCategories);
        const availableSlipsByType = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
        const bookletCheck = checkBookletAvailability(analysis, availableSlipsByType);

        if (!bookletCheck.hasEnough) {
          return (
            <Card className="border-2 border-red-500 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 text-lg mb-2">
                      Talonarios Insuficientes
                    </h3>
                    <p className="text-sm text-red-800 mb-3">
                      Este tratamiento requiere <strong>{analysis.totalPrescriptions} receta(s) separada(s)</strong> por las regulaciones de medicamentos controlados.
                    </p>
                    <div className="bg-white rounded-lg p-4 mb-3 border border-red-200">
                      <p className="text-sm font-medium text-red-900 mb-3">Talonarios faltantes:</p>
                      <div className="space-y-3">
                        {bookletCheck.missing.map((m, idx) => {
                          const typeLabel = BookletUtils.getBookletTypeLabel(m.bookletType);
                          return (
                            <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-red-50 rounded border border-red-200">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-red-900">
                                  {typeLabel}
                                </p>
                                <p className="text-xs text-red-700">
                                  Necesita {m.needed} • Disponible {m.available} • Faltan {m.needed - m.available}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setPreselectedBookletType(m.bookletType);
                                  setShowBookletPurchaseDialog(true);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                              >
                                <Package className="w-3 h-3 mr-1" />
                                Comprar
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {analysis.warnings.length > 0 && (
                      <div className="text-xs text-red-700 mb-3 bg-red-100/50 p-2 rounded">
                        {analysis.warnings.map((w, idx) => (
                          <div key={idx}>• {w}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        // Si hay suficientes talonarios pero se requieren múltiples recetas, mostrar info
        if (analysis.totalPrescriptions > 1) {
          return (
            <Card className="border-blue-500 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">
                      Este tratamiento generará {analysis.totalPrescriptions} recetas separadas
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {analysis.summary}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-700 bg-white">
                    Múltiples Recetas
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        }

        return null;
      })()}

      {/* Sección principal con tabla de medicamentos (solo mostrar si NO estamos en select-mode o select-patient) */}
      {prescriptionMode !== 'select-mode' && prescriptionMode !== 'select-patient' && (
        <>
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Medicamentos Prescritos</CardTitle>
              <p className="text-sm text-gray-600">
                Doble clic en cualquier fila para ver detalles y editar • {medicines.length} medicamento{medicines.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Clock className="w-3 h-3 mr-1" />
              Borrador
            </Badge>
            <AIPrescriptionAssistant
              onDiagnosisSelected={handleAIDiagnosisSelected}
              onMedicationsGenerated={handleAIMedicationsGenerated}
              open={showAIAssistant}
              onOpenChange={setShowAIAssistant}
            />
            <Button 
              onClick={handleAddMedicine}
              disabled={!currentPatientData}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!currentPatientData ? "Primero debe seleccionar un paciente" : "Agregar uno o más medicamentos"}
            >
              <Plus className="w-4 h-4" />
              Agregar Medicamento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <MedicineTable 
            medicines={medicines}
            onMedicineDoubleClick={handleMedicineDoubleClick}
            onMedicineDelete={handleDeleteMedicine}
          />
        </CardContent>
      </Card>

      {/* Resumen de medicamentos prescritos */}
      {medicines.length > 0 && (
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">Resumen de Medicamentos</CardTitle>
                <p className="text-sm text-gray-600">Vista rápida de los medicamentos prescritos</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicines.map((medicine) => (
                <div key={`summary-${medicine.id}`} className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{medicine.name}</p>
                    <p className="text-sm text-gray-600">{medicine.dose} • {medicine.frequency}</p>
                    <p className="text-xs text-gray-500 mt-1">Duración: {medicine.duration}</p>
                    <Badge variant="outline" className="mt-2 text-xs bg-green-50 text-green-700 border-green-200">
                      {medicine.administration}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerta de bloqueo de finalización */}
      <FinalizePrescriptionAlert
        doctorId={doctorId}
        hasPatient={!!currentPatientData}
        medicineCount={medicines.length}
        medicines={medicines.map(m => ({ 
          name: m.name, 
          category: MedicineClassificationAPI.getMedicineInfo(m.name)?.categoryLabel 
        }))}
        onOpenBookletPurchase={() => setShowBookletPurchaseDialog(true)}
      />

      {/* Botones de acción finales */}
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-gray-600">Revise todos los medicamentos antes de finalizar</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex items-center gap-2"
                onClick={handleCancel}
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex items-center gap-2"
                onClick={handleSaveDraft}
                disabled={!currentPatientData || (!hasUnsavedChanges && !!currentDraftId)}
                title={!currentPatientData ? "Primero debe seleccionar un paciente" : ""}
              >
                <Save className="w-4 h-4" />
                {currentDraftId ? 'Guardar Cambios' : 'Guardar Borrador'}
              </Button>
              {/* 
                BOTÓN TEMPORALMENTE OCULTO: Verificar con API Externa (DrugBank/Medscape)
                
                UTILIDAD:
                - Permite consultar bases de datos farmacológicas externas en tiempo real
                - Valida interacciones medicamentosas con fuentes internacionales
                - Proporciona una capa adicional de seguridad clínica
                - Complementa la base de datos local con información actualizada
                
                CONSIDERACIONES PARA REACTIVAR:
                - Requiere conexión a API externa (DrugBank, Medscape, FDA)
                - Puede tener costo por consulta según el proveedor
                - Útil para validación cruzada en casos complejos
                - Recomendado para hospitales con suscripción a servicios externos
                
                Para reactivar: descomentar el siguiente bloque de código
              */}
              {/* <Button 
                variant="outline"
                size="lg" 
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={handleCheckExternalAPIs}
                disabled={!currentPatientData || medicines.length === 0 || isCheckingExternalAPIs}
                title={!currentPatientData ? "Primero debe seleccionar un paciente" : ""}
              >
                <ShieldAlert className="w-4 h-4" />
                {isCheckingExternalAPIs ? 'Consultando...' : 'Verificar con ' + externalAPISource}
              </Button> */}
              <Button 
                size="lg" 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                disabled={!canFinalizePrescription().can}
                onClick={handleFinalizePrescription}
                title={canFinalizePrescription().reason}
              >
                <FileCheck className="w-4 h-4" />
                Finalizar Prescripción
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel lateral para detalles */}
      <MedicinePanel
        medicine={selectedMedicine}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSave={handleSaveMedicine}
        onAdd={handleAddNewMedicine}
        onDelete={handleDeleteMedicine}
      />

      {/* Diálogo de confirmación de guardado */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Borrador Guardado Exitosamente
            </DialogTitle>
            <DialogDescription>
              Su receta ha sido guardada como borrador y puede continuarla más tarde.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">ID del Borrador:</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {savedDraftId}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Paciente:</span>
                <span className="text-sm text-gray-600">
                  {prescription.patientName} {prescription.patientFirstLastName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Medicamentos:</span>
                <span className="text-sm text-gray-600">{medicines.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Última actualización:</span>
                <span className="text-sm text-gray-600">
                  {prescription.issueDate} {prescription.issueTime}
                </span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                El borrador estará disponible en "Mis Borradores"
              </p>
              <p className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Puede editar o finalizar el borrador en cualquier momento
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveDialog(false);
                // Priorizar onBack si existe, sino usar onNavigateToDrafts
                if (onBack) {
                  onBack();
                } else if (onNavigateToDrafts) {
                  onNavigateToDrafts();
                } else {
                  toast.info('Navegación no disponible', {
                    description: 'No se pudo navegar a la página de borradores',
                  });
                }
              }}
              className="w-full sm:w-auto"
            >
              Ir a Mis Borradores
            </Button>
            <Button
              onClick={() => setShowSaveDialog(false)}
              className="w-full sm:w-auto"
            >
              Continuar Editando
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de finalización */}
      <Dialog open={showFinalizationDialog} onOpenChange={setShowFinalizationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Award className="w-6 h-6 text-green-600" />
              {finalizedPrescriptions.length > 1 
                ? `${finalizedPrescriptions.length} Recetas Emitidas Exitosamente`
                : 'Prescripción Finalizada y Firmada'
              }
            </DialogTitle>
            <DialogDescription>
              {finalizedPrescriptions.length > 1
                ? `El tratamiento ha sido separado en ${finalizedPrescriptions.length} recetas independientes según las regulaciones de medicamentos controlados.`
                : 'La receta ha sido emitida exitosamente y está lista para ser dispensada.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto flex-1 px-1">
            {/* Información del Paciente */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Paciente:</span>
                  <p className="text-sm text-gray-900 font-medium">
                    {prescription.patientName} {prescription.patientFirstLastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">ID Paciente:</span>
                  <p className="text-sm text-gray-600">{prescription.patientId}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Médico:</span>
                  <p className="text-sm text-gray-600">{prescription.doctorName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Fecha y Hora:</span>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('es-ES')} - {formatTime12h()}
                  </span>
                </div>
              </div>
            </div>

            {/* Lista de Recetas Emitidas */}
            {finalizedPrescriptions.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Recetas Emitidas:</h3>
                </div>
                
                {finalizedPrescriptions.map((rx, idx) => (
                  <div key={idx} className="p-4 bg-green-50 border-2 border-green-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-green-600 text-white text-base px-3 py-1 mb-2">
                          {rx.prescriptionNumber}
                        </Badge>
                        <p className="text-sm font-medium text-gray-700">
                          {rx.category} • {rx.medicinesCount} medicamento{rx.medicinesCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Receta {idx + 1} de {finalizedPrescriptions.length}
                      </Badge>
                    </div>
                    
                    {/* Información del Talonario */}
                    <div className="p-3 bg-white border border-green-200 rounded space-y-2">
                      <div className="flex items-center gap-2 pb-1 border-b border-green-100">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-900">Control de Talonario</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-gray-600">Talonario:</span>
                          <p className="text-xs font-mono font-medium text-gray-900">
                            {rx.bookletInfo.bookletNumber}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Boleta:</span>
                          <p className="text-xs font-mono font-medium text-gray-900">
                            {rx.bookletInfo.slipNumber}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <span className="text-xs text-gray-600">Código Completo:</span>
                        <Badge variant="outline" className="font-mono bg-purple-100 text-purple-800 border-purple-300 text-xs ml-2">
                          {rx.bookletInfo.fullSlipNumber}
                        </Badge>
                      </div>
                    </div>

                    {/* Detalle de Medicamentos Prescritos */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-2">
                      <div className="flex items-center gap-2 pb-1 border-b border-blue-100">
                        <Pill className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-900">Medicamentos Prescritos</span>
                      </div>
                      {(() => {
                        const prescriptionData = EmittedPrescriptionsAPI.getPrescription(rx.prescriptionNumber);
                        if (!prescriptionData || !prescriptionData.medicines) {
                          return <p className="text-xs text-gray-500">No se encontraron medicamentos</p>;
                        }
                        return (
                          <div className="space-y-2">
                            {prescriptionData.medicines.map((med, medIdx) => (
                              <div key={medIdx} className="p-2 bg-white border border-blue-100 rounded text-xs space-y-1">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{med.genericName}</p>
                                    <p className="text-gray-600">{med.commercialName}</p>
                                  </div>
                                  <Badge variant="outline" className="text-[10px] ml-2">
                                    {med.quantity}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                                  <div><span className="font-medium">Dosis:</span> {med.dose}</div>
                                  <div><span className="font-medium">Vía:</span> {med.route}</div>
                                  <div><span className="font-medium">Frecuencia:</span> {med.frequency}</div>
                                  <div><span className="font-medium">Duración:</span> {med.duration}</div>
                                </div>
                                {med.indications && (
                                  <p className="text-[10px] text-gray-700 italic pt-1 border-t border-blue-50">
                                    <span className="font-medium">Indicaciones:</span> {med.indications}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Botones de acción por receta */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const prescriptionData = EmittedPrescriptionsAPI.getPrescription(rx.prescriptionNumber);
                          if (prescriptionData) {
                            generatePrescriptionPDF(prescriptionData);
                            toast.success(`Imprimiendo receta ${rx.prescriptionNumber}`, {
                              description: `${rx.category} - ${rx.medicinesCount} medicamento(s)`,
                              duration: 3000
                            });
                          }
                        }}
                        className="flex-1"
                      >
                        <Printer className="w-3 h-3 mr-1" />
                        Imprimir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const prescriptionData = EmittedPrescriptionsAPI.getPrescription(rx.prescriptionNumber);
                          if (prescriptionData) {
                            generatePrescriptionPDF(prescriptionData);
                            toast.success(`Descargando receta ${rx.prescriptionNumber}`, {
                              description: `${rx.category} - ${rx.medicinesCount} medicamento(s)`,
                              duration: 3000
                            });
                          }
                        }}
                        className="flex-1"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback para receta única (compatibilidad) */
              finalizedBookletInfo && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-green-200">
                    <span className="text-sm font-medium text-gray-700">Número de Receta:</span>
                    <Badge className="bg-green-600 text-white text-base px-3 py-1">
                      {finalizedPrescriptionNumber}
                    </Badge>
                  </div>
                  <div className="p-3 bg-white border border-green-200 rounded">
                    <div className="flex items-center gap-2 pb-2 border-b border-green-100 mb-2">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-900">Control de Talonario</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-600">Talonario:</span>
                        <p className="text-xs font-mono font-medium">{finalizedBookletInfo.bookletNumber}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Boleta:</span>
                        <p className="text-xs font-mono font-medium">{finalizedBookletInfo.slipNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Detalles de firma digital */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Firma Digital Aplicada</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Token de firma:</span>
                  <span className="font-mono text-gray-900">SIG-{new Date().getFullYear()}-XXXXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Código QR:</span>
                  <span className="font-mono text-gray-900">QR-{finalizedPrescriptionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <Badge className="bg-green-100 text-green-800 border-green-300">Emitida</Badge>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="text-sm text-muted-foreground space-y-2 bg-gray-50 p-3 rounded-lg">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                La receta ha sido registrada en el sistema de recetas emitidas
              </p>
              <p className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Puede imprimir o enviar la receta al paciente
              </p>
              <p className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                La firma digital garantiza la autenticidad de la prescripción
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowFinalizationDialog(false);
                // Navegar a recetas emitidas
                if (onNavigateToEmitted) {
                  onNavigateToEmitted();
                } else if (onBack) {
                  onBack();
                } else {
                  toast.info('Navegación no disponible');
                }
              }}
              className="w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Recetas Emitidas
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleExportPDF();
                // No cerrar el diálogo para que pueda seguir usando otras opciones
                // setShowFinalizationDialog(false);
              }}
              className="w-full sm:w-auto"
            >
              <Printer className="w-4 h-4 mr-2" />
              {finalizedPrescriptions.length > 1 
                ? `Imprimir Recetas (${finalizedPrescriptions.length})`
                : 'Imprimir Receta'
              }
            </Button>
            <Button
              onClick={() => {
                setShowFinalizationDialog(false);
                // Limpiar formulario para nueva receta
                setMedicines([]);
                setSelectedMedicine(null);
                setPrescription({...mockPrescription, prescriptionNumber: `DRAFT-${Date.now()}`});
                setCurrentDraftId(undefined);
                setHasUnsavedChanges(false);
                setFinalizedPrescriptions([]); // Limpiar array de recetas finalizadas
                setFinalizedPrescriptionNumber(null);
                setFinalizedBookletInfo(null);
                toast.success('Listo para nueva prescripción');
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              Nueva Prescripción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cierre del fragmento condicional de prescripción */}
      </>
      )}

      {/* Diálogo de Interacciones Medicamentosas */}
      <Dialog open={showInteractionsDialog} onOpenChange={setShowInteractionsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className={`w-6 h-6 ${
                shouldBlockPrescription(interactionAlerts) ? 'text-red-600' : 'text-orange-600'
              }`} />
              {shouldBlockPrescription(interactionAlerts) 
                ? 'Interacciones Medicamentosas CRÍTICAS Detectadas' 
                : 'Advertencia: Interacciones Medicamentosas Detectadas'
              }
            </DialogTitle>
            <DialogDescription>
              {shouldBlockPrescription(interactionAlerts)
                ? 'Se han detectado interacciones críticas que BLOQUEAN la finalización de esta prescripción. Revise y modifique los medicamentos.'
                : 'Se han detectado interacciones que requieren su revisión antes de finalizar la prescripción.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Estadísticas de interacciones */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(() => {
                const stats = getInteractionStats(interactionAlerts);
                return (
                  <>
                    <div className="p-3 bg-gray-100 rounded-lg text-center">
                      <div className="font-bold text-lg text-gray-900">{stats.total}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg text-center">
                      <div className="font-bold text-lg text-red-700">{stats.critical}</div>
                      <div className="text-xs text-red-600">Críticas</div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg text-center">
                      <div className="font-bold text-lg text-orange-700">{stats.severe}</div>
                      <div className="text-xs text-orange-600">Severas</div>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg text-center">
                      <div className="font-bold text-lg text-yellow-700">{stats.moderate}</div>
                      <div className="text-xs text-yellow-600">Moderadas</div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg text-center">
                      <div className="font-bold text-lg text-blue-700">{stats.mild}</div>
                      <div className="text-xs text-blue-600">Leves</div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Lista de interacciones */}
            <div className="space-y-3">
              {interactionAlerts.map((alert, index) => (
                <div 
                  key={index} 
                  className={`border-2 rounded-lg p-4 ${getSeverityColor(alert.interaction.severity)}`}
                >
                  {/* Header de la interacción */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(alert.interaction.severity)}>
                          {getSeverityLabel(alert.interaction.severity)}
                        </Badge>
                        <span className="text-xs text-gray-600">
                          {alert.source === 'prescription' 
                            ? 'Entre medicamentos prescritos' 
                            : 'Con medicación actual del paciente'
                          }
                        </span>
                      </div>
                      <h4 className="font-bold text-base">
                        {alert.drug1} ↔ {alert.drug2}
                      </h4>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Descripción:</span>
                      <p className="mt-1">{alert.interaction.description}</p>
                    </div>

                    <div>
                      <span className="font-medium">Efecto clínico:</span>
                      <p className="mt-1">{alert.interaction.clinicalEffect}</p>
                    </div>

                    <div className="bg-white/50 p-3 rounded border-l-4 border-current">
                      <span className="font-medium">📋 Recomendación:</span>
                      <p className="mt-1 font-medium">{alert.interaction.recommendation}</p>
                    </div>

                    {alert.interaction.references && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Referencia:</span> {alert.interaction.references}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mensaje de bloqueo o advertencia */}
            {shouldBlockPrescription(interactionAlerts) && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-900">PRESCRIPCIÓN BLOQUEADA</span>
                </div>
                <p className="text-sm text-red-800">
                  Esta prescripción contiene interacciones CRÍTICAS que están contraindicadas. 
                  Debe modificar los medicamentos antes de poder finalizar la prescripción.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInteractionsDialog(false)}
              className="w-full sm:w-auto"
            >
              {shouldBlockPrescription(interactionAlerts) ? 'Revisar Medicamentos' : 'Cancelar'}
            </Button>
            
            {!shouldBlockPrescription(interactionAlerts) && (
              <Button
                onClick={proceedWithFinalization}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Continuar de Todas Formas
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Selección de Paciente */}
      <PatientSelectorDialog
        open={showPatientSelector}
        onOpenChange={setShowPatientSelector}
        onSelectPatient={handleSelectPatient}
      />

      {/* NUEVO: Diálogo de Confirmación para Repetir Receta */}
      {lastPrescriptionData && (
        <RepeatPrescriptionDialog
          open={showRepeatDialog}
          onOpenChange={setShowRepeatDialog}
          onConfirm={handleConfirmRepeatPrescription}
          prescriptionNumber={lastPrescriptionData.prescription.prescriptionNumber}
          issueDate={lastPrescriptionData.prescription.issueDate}
          medicinesCount={lastPrescriptionData.medicines.length}
          medicinesSummary={lastPrescriptionData.medicines.map((m: any) => 
            `${m.genericName || m.commercialName} ${m.concentration} - ${m.frequency} por ${m.duration}`
          )}
          patientName={currentPatientData?.fullName || ''}
        />
      )}

      {/* NUEVO: Diálogo de Compra de Talonarios */}
      <BookletPurchaseDialog
        isOpen={showBookletPurchaseDialog}
        onClose={() => {
          setShowBookletPurchaseDialog(false);
          setPreselectedBookletType(null); // Limpiar pre-selección
        }}
        doctorId={doctorId}
        doctorName={currentDoctor?.name || prescription.doctorName}
        doctorLicense={doctorLicense}
        preselectedType={preselectedBookletType || undefined}
        onPurchaseComplete={() => {
          setBookletBalanceKey(prev => prev + 1);
          setPreselectedBookletType(null); // Limpiar pre-selección
          toast.success("Talonarios comprados. Ya puedes continuar con la prescripción.");
        }}
      />

      {/* NUEVO: Diálogo de Conflicto de Categoría */}
      {conflictingMedicine?.action === 'different-category' && (
        <CategoryConflictDialog
          isOpen={showCategoryConflictDialog}
          onClose={() => {
            setShowCategoryConflictDialog(false);
            setConflictingMedicine(null);
          }}
          onCreateNewPrescription={handleCreateNewPrescriptionFromConflict}
          newMedicineName={conflictingMedicine.newMedicine.name}
          newCategory={conflictingMedicine.newCategory}
          currentCategory={conflictingMedicine.currentCategory}
        />
      )}

      {/* NUEVO: Diálogo de Reemplazo de Medicamento */}
      {conflictingMedicine?.action === 'exceed-limit' && (
        <ReplaceMedicineDialog
          isOpen={showReplaceMedicineDialog}
          onClose={() => {
            setShowReplaceMedicineDialog(false);
            setConflictingMedicine(null);
          }}
          onReplace={handleReplaceMedicine}
          onViewDetails={handleViewMedicineDetails}
          newMedicineName={conflictingMedicine.newMedicine.name}
          category={conflictingMedicine.newCategory}
          existingMedicines={conflictingMedicine.existingMedicines}
          limit={conflictingMedicine.limit}
        />
      )}

      {/* Diálogo de Agregar Medicamentos Manualmente */}
      <ManualMedicineDialog
        open={showManualMedicineDialog}
        onOpenChange={setShowManualMedicineDialog}
        onMedicationsAdded={handleManualMedicationsAdded}
      />

      {/* Diálogo de Opciones de Impresión */}
      <PrintOptionsDialog
        open={showPrintOptionsDialog}
        onClose={() => setShowPrintOptionsDialog(false)}
        prescriptionCount={finalizedPrescriptions.length}
        onPrintAll={handlePrintAllTogether}
        onDownloadAll={handleDownloadAllTogether}
        onPrintIndividual={handlePrintIndividual}
        onDownloadIndividual={handleDownloadIndividual}
      />
    </div>
  );
}