import { useState, useEffect } from "react";
import { MedicineTable, Medicine } from "./MedicineTable";
import { MedicinePanel } from "./MedicinePanel";
import { PrescriptionHeader } from "./PrescriptionHeader";
import { PageBanner } from "./PageBanner";
import { PatientSelectorDialog } from "./PatientSelectorDialog";
import { AIPrescriptionAssistant } from "./AIPrescriptionAssistant";
import { PrescriptionOptionsCard } from "./PrescriptionOptionsCard";
import { RepeatPrescriptionDialog } from "./RepeatPrescriptionDialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Pill, Package, Save, X, FileCheck, AlertTriangle, Clock, ArrowLeft, User, FileText, CheckCircle2, Award, Printer, ShieldAlert, Download, UserPlus, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { DraftsAPI } from "../utils/draftsStore";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { 
  checkMedicineInteractions, 
  shouldBlockPrescription, 
  getHighestSeverity, 
  getSeverityLabel, 
  getSeverityColor,
  getInteractionStats,
  type InteractionAlert 
} from "../utils/drugInteractionsDatabase";
import { generatePrescriptionPDF } from "../utils/pdfGenerator";
import { InteractionsHistoryAPI } from "../utils/interactionsHistoryStore";
import { ExternalPharmacologyAPI, type ExternalSource } from "../utils/externalPharmacologyAPI";
import type { CIE10Code, MedicationSuggestion } from "../utils/aiAssistantStore";

// Datos mock para la demostración
const mockPrescription = {
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
        prescriptionNumber: `RX-2025-${Math.floor(Math.random() * 900000 + 100000)}`,
        patientId: `${patientData.idType}-${patientData.idNumber}`,
        patientName: patientData.firstName,
        patientFirstLastName: nameParts[nameParts.length - 2] || patientData.lastName.split(' ')[0] || '',
        patientSecondLastName: nameParts[nameParts.length - 1] || patientData.lastName.split(' ')[1] || '',
        patientGender: patientData.gender === "M" ? "Masculino" : "Femenino",
        patientAge: patientData.age,
        doctorName: "Dr. Carlos Alberto Mendoza Herrera",
        doctorCode: "RM-12345-COL",
        issueDate: new Date().toLocaleDateString('es-ES'),
        issueTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
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
  const [showInteractionsDialog, setShowInteractionsDialog] = useState(false);
  const [interactionAlerts, setInteractionAlerts] = useState<InteractionAlert[]>([]);
  const [isCheckingExternalAPIs, setIsCheckingExternalAPIs] = useState(false);
  const [externalAPISource, setExternalAPISource] = useState<ExternalSource>("DrugBank");
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
    toast.success('Nueva prescripción iniciada', {
      description: 'Agregue medicamentos manualmente haciendo doble clic en la tabla',
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
    toast.info('Asistente IA activado', {
      description: 'Ingrese la descripción clínica para obtener sugerencias',
    });
  };

  const handleMedicineDoubleClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsPanelOpen(true);
  };

  const handleAddMedicine = () => {
    setSelectedMedicine(null);
    setIsPanelOpen(true);
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
    const medicine: Medicine = {
      ...newMedicine,
      id: Date.now().toString()
    };
    setMedicines(prev => [...prev, medicine]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteMedicine = (medicineId: string) => {
    setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
    if (selectedMedicine?.id === medicineId) {
      setIsPanelOpen(false);
      setSelectedMedicine(null);
    }
    setHasUnsavedChanges(true);
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
      issueTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
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
    // Generar número de prescripción definitivo
    const finalPrescriptionNumber = EmittedPrescriptionsAPI.generatePrescriptionNumber();
    
    // Generar token de firma y QR (simulado)
    const signatureToken = `SIG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000000)}`;
    const qrCode = `QR-${finalPrescriptionNumber}`;

    // Preparar datos para receta emitida
    const emittedPrescriptionData = {
      prescription: {
        prescriptionNumber: finalPrescriptionNumber,
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
        issueTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        medicalCenter: "Hospital San Juan de Dios",
        diagnosis: "Diagnóstico médico",
        clinicalNotes: prescriptionOrigin === 'repeated' && basedOnPrescription 
          ? `Receta repetida basada en: ${basedOnPrescription}. Verificación médica completada.`
          : "Notas clínicas",
        doctorName: prescription.doctorName,
        doctorLicense: prescription.doctorCode,
        doctorSpecialty: "Medicina General",
        status: "emitted" as const,
        signatureToken,
        qrCode
      },
      medicines: medicines.map(med => ({
        id: med.id,
        genericName: med.name,
        commercialName: med.name,
        presentation: "Tabletas",
        concentration: med.dose,
        quantity: parseInt(med.quantity) || 1,
        dose: med.dose,
        frequency: med.frequency,
        duration: med.duration,
        route: med.administration,
        indications: med.observations || "",
        substitutable: true
      })),
      emittedAt: new Date().toISOString(),
      emittedBy: prescription.doctorName,
      // NUEVO: Metadata de origen y trazabilidad
      origin: prescriptionOrigin === 'repeated' ? 'manual' as const : (prescriptionOrigin === 'ai-assisted' ? 'ai-assisted' as const : 'manual' as const),
      ...(prescriptionOrigin === 'repeated' && basedOnPrescription && {
        // Agregar nota en metadata que es una repetición
        repeatMetadata: {
          basedOnPrescription,
          repeatDate: new Date().toISOString(),
          verifiedBy: prescription.doctorName
        }
      })
    };

    // Guardar en el store de recetas emitidas
    EmittedPrescriptionsAPI.savePrescription(finalPrescriptionNumber, emittedPrescriptionData);

    // Si existe un borrador, eliminarlo
    if (currentDraftId) {
      DraftsAPI.deleteDraft(currentDraftId);
    }

    // Guardar número de prescripción finalizada
    setFinalizedPrescriptionNumber(finalPrescriptionNumber);
    
    // Limpiar estados
    setHasUnsavedChanges(false);
    setShowInteractionsDialog(false);
    
    // Mostrar diálogo de confirmación
    setShowFinalizationDialog(true);

    // Mostrar toast de éxito
    toast.success("Prescripción finalizada exitosamente", {
      description: `Número de receta: ${finalPrescriptionNumber}`,
      duration: 5000
    });
  };

  // Función para exportar PDF
  const handleExportPDF = () => {
    if (!finalizedPrescriptionNumber) return;
    
    const prescriptionData = EmittedPrescriptionsAPI.getPrescription(finalizedPrescriptionNumber);
    if (prescriptionData) {
      generatePrescriptionPDF(prescriptionData);
      toast.success("Generando PDF", {
        description: "Se abrirá una nueva ventana con la receta lista para imprimir",
        duration: 3000
      });
    }
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

      {/* Información del paciente seleccionado */}
      {currentPatientData && (
        <Card className="border-l-4 border-l-green-500 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-green-900">
                      Paciente seleccionado:
                    </p>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Activo
                    </Badge>
                  </div>
                  <p className="font-semibold text-green-900">{currentPatientData.fullName}</p>
                  <p className="text-xs text-green-700 mt-1">
                    {currentPatientData.idType} {currentPatientData.idNumber} • {currentPatientData.age} años • Tipo de sangre: {currentPatientData.bloodType}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPatientSelector(true)}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Cambiar paciente
              </Button>
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

      {/* Header de la receta - Simplificado (solo mostrar si NO estamos en modo select-mode) */}
      {prescriptionMode !== 'select-mode' && prescriptionMode !== 'select-patient' && (
        <PrescriptionHeader prescription={dynamicPrescription} />
      )}

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
            />
            <Button 
              onClick={handleAddMedicine}
              disabled={!currentPatientData}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!currentPatientData ? "Primero debe seleccionar un paciente" : "Agregar medicamento"}
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
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                disabled={!currentPatientData || medicines.length === 0}
                onClick={handleFinalizePrescription}
                title={!currentPatientData ? "Primero debe seleccionar un paciente" : ""}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Award className="w-6 h-6 text-green-600" />
              Prescripción Finalizada y Firmada
            </DialogTitle>
            <DialogDescription>
              La receta ha sido emitida exitosamente y está lista para ser dispensada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Información principal */}
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-green-200">
                <span className="text-sm font-medium text-gray-700">Número de Receta:</span>
                <Badge className="bg-green-600 text-white text-base px-3 py-1">
                  {finalizedPrescriptionNumber}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Paciente:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {prescription.patientName} {prescription.patientFirstLastName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">ID Paciente:</span>
                  <span className="text-sm text-gray-600">{prescription.patientId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Médico:</span>
                  <span className="text-sm text-gray-600">{prescription.doctorName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Medicamentos:</span>
                  <span className="text-sm text-gray-600">{medicines.length}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-green-200">
                <span className="text-sm font-medium text-gray-700">Fecha y Hora:</span>
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('es-ES')} - {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

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

          <DialogFooter className="flex-col sm:flex-row gap-2">
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
              Imprimir Receta
            </Button>
            <Button
              onClick={() => {
                setShowFinalizationDialog(false);
                // Limpiar formulario para nueva receta
                setMedicines([]);
                setSelectedMedicine(null);
                setPrescription(mockPrescription);
                setCurrentDraftId(undefined);
                setHasUnsavedChanges(false);
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
    </div>
  );
}