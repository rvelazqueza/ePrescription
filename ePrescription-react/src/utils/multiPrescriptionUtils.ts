/**
 * Multi-Prescription Utilities
 * 
 * Sistema para manejo inteligente de tratamientos que requieren múltiples recetas
 * debido a restricciones de talonarios por categoría de medicamentos.
 * 
 * Reglas de negocio:
 * - Estupefacientes: 1 medicamento por receta
 * - Psicotrópicos: 1 medicamento por receta
 * - Antimicrobianos: máximo 3 medicamentos por receta
 * - Receta Libre: sin límite (pero no mezclar con las anteriores)
 * 
 * Created: 27/11/2025
 */

import type { BookletType } from './prescriptionBookletsStore';
import type { MedicationCategory } from './medicineClassificationStore';

/**
 * Medicamento para prescripción múltiple
 */
export interface MultiPrescriptionMedication {
  id: string;
  name: string;
  category: MedicationCategory;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity?: number;
}

/**
 * Grupo de medicamentos por categoría (representa una receta)
 */
export interface MedicationPrescriptionGroup {
  category: MedicationCategory;
  bookletType: BookletType;
  medications: MultiPrescriptionMedication[];
  requiresMultipleSlips: boolean; // Requiere múltiples boletas del mismo tipo
  numberOfSlips: number; // Número de boletas necesarias
  displayLabel: string; // Etiqueta para mostrar (ej: "Estupefacientes")
}

/**
 * Resultado del análisis de tratamiento
 */
export interface TreatmentAnalysis {
  isValid: boolean;
  groups: MedicationPrescriptionGroup[];
  totalPrescriptions: number;
  warnings: string[];
  errors: string[];
  summary: string;
}

/**
 * Mapeo de categoría a tipo de talonario
 */
export const categoryToBookletType = (category: MedicationCategory): BookletType => {
  switch (category) {
    case 'Estupefacientes':
      return 'estupefaciente';
    case 'Psicotrópicos':
      return 'psicotropico';
    case 'Antimicrobianos':
      return 'antimicrobiano';
    case 'Receta Libre':
    case 'Analgésicos':
    case 'Antiinflamatorios':
    case 'Antihipertensivos':
    case 'Antidiabéticos':
    case 'Anticoagulantes':
    case 'Broncodilatadores':
    case 'Corticosteroides':
    case 'Antihistamínicos':
    case 'Gastrointestinales':
    case 'Vitaminas y Suplementos':
    case 'Dermatológicos':
    case 'Oftalmológicos':
    case 'Otros':
      return 'libre';
    default:
      return 'libre';
  }
};

/**
 * Obtener límite de medicamentos por categoría
 */
export const getMedicationLimitByCategory = (category: MedicationCategory): number | 'unlimited' => {
  switch (category) {
    case 'Estupefacientes':
    case 'Psicotrópicos':
      return 1;
    case 'Antimicrobianos':
      return 3;
    default:
      return 'unlimited';
  }
};

/**
 * Obtener etiqueta de display para categoría
 */
export const getCategoryDisplayLabel = (category: MedicationCategory): string => {
  return category;
};

/**
 * Analizar tratamiento completo y agrupar por categoría
 */
export const analyzeTreatment = (
  medications: MultiPrescriptionMedication[]
): TreatmentAnalysis => {
  
  if (medications.length === 0) {
    return {
      isValid: false,
      groups: [],
      totalPrescriptions: 0,
      warnings: [],
      errors: ['No hay medicamentos para analizar'],
      summary: 'Tratamiento vacío'
    };
  }

  // Agrupar por categoría
  const medicationsByCategory = medications.reduce((acc, med) => {
    if (!acc[med.category]) {
      acc[med.category] = [];
    }
    acc[med.category].push(med);
    return acc;
  }, {} as Record<MedicationCategory, MultiPrescriptionMedication[]>);

  const groups: MedicationPrescriptionGroup[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  let totalPrescriptions = 0;

  // Analizar cada grupo
  Object.entries(medicationsByCategory).forEach(([category, meds]) => {
    const cat = category as MedicationCategory;
    const limit = getMedicationLimitByCategory(cat);
    const bookletType = categoryToBookletType(cat);
    const count = meds.length;

    if (limit === 1 && count > 1) {
      // Estupefacientes o Psicotrópicos: 1 receta por medicamento
      const numSlips = count;
      totalPrescriptions += numSlips;
      
      warnings.push(
        `${cat}: ${count} medicamentos requieren ${numSlips} recetas separadas (1 por medicamento)`
      );

      // Crear un grupo por cada medicamento
      meds.forEach((med, index) => {
        groups.push({
          category: cat,
          bookletType,
          medications: [med],
          requiresMultipleSlips: false,
          numberOfSlips: 1,
          displayLabel: `${cat} (${index + 1} de ${count})`
        });
      });

    } else if (limit === 3 && count > 3) {
      // Antimicrobianos: agrupar en recetas de máximo 3
      const numSlips = Math.ceil(count / 3);
      totalPrescriptions += numSlips;
      
      warnings.push(
        `${cat}: ${count} medicamentos requieren ${numSlips} recetas (máximo 3 por receta)`
      );

      // Dividir en grupos de máximo 3
      for (let i = 0; i < meds.length; i += 3) {
        const groupMeds = meds.slice(i, i + 3);
        const groupNumber = Math.floor(i / 3) + 1;
        
        groups.push({
          category: cat,
          bookletType,
          medications: groupMeds,
          requiresMultipleSlips: true,
          numberOfSlips: 1,
          displayLabel: `${cat} (Grupo ${groupNumber} de ${numSlips})`
        });
      }

    } else {
      // Receta Libre o dentro del límite
      totalPrescriptions += 1;
      
      groups.push({
        category: cat,
        bookletType,
        medications: meds,
        requiresMultipleSlips: false,
        numberOfSlips: 1,
        displayLabel: cat
      });
    }
  });

  // Generar resumen
  const categoriesCount = Object.keys(medicationsByCategory).length;
  const summary = totalPrescriptions === 1
    ? 'Este tratamiento se emitirá en 1 receta'
    : `Este tratamiento requiere ${totalPrescriptions} recetas separadas (${categoriesCount} ${categoriesCount === 1 ? 'categoría' : 'categorías'})`;

  return {
    isValid: errors.length === 0,
    groups,
    totalPrescriptions,
    warnings,
    errors,
    summary
  };
};

/**
 * Verificar si hay suficientes talonarios disponibles
 */
export const checkBookletAvailability = (
  analysis: TreatmentAnalysis,
  availableSlipsByType: Record<BookletType, number>
): {
  hasEnough: boolean;
  missing: Array<{ bookletType: BookletType; needed: number; available: number }>;
} => {
  
  const needed: Record<BookletType, number> = {
    estupefaciente: 0,
    psicotropico: 0,
    antimicrobiano: 0,
    libre: 0
  };

  // Contar boletas necesarias por tipo
  analysis.groups.forEach(group => {
    needed[group.bookletType] += group.numberOfSlips;
  });

  const missing: Array<{ bookletType: BookletType; needed: number; available: number }> = [];

  // Verificar disponibilidad
  Object.entries(needed).forEach(([type, count]) => {
    const bookletType = type as BookletType;
    const available = availableSlipsByType[bookletType] || 0;
    
    if (count > available) {
      missing.push({
        bookletType,
        needed: count,
        available
      });
    }
  });

  return {
    hasEnough: missing.length === 0,
    missing
  };
};

/**
 * Formatear medicamento para display
 */
export const formatMedicationDisplay = (med: MultiPrescriptionMedication): string => {
  const parts = [
    med.name,
    med.dosage,
    med.frequency,
    med.duration
  ].filter(Boolean);
  
  return parts.join(' - ');
};

/**
 * Obtener color del badge por categoría
 */
export const getCategoryBadgeColor = (category: MedicationCategory): string => {
  switch (category) {
    case 'Estupefacientes':
      return 'bg-red-600 text-white';
    case 'Psicotrópicos':
      return 'bg-orange-600 text-white';
    case 'Antimicrobianos':
      return 'bg-blue-600 text-white';
    case 'Receta Libre':
      return 'bg-green-600 text-white';
    case 'Analgésicos':
      return 'bg-purple-600 text-white';
    case 'Antiinflamatorios':
      return 'bg-pink-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

/**
 * Obtener icono por categoría
 */
export const getCategoryIcon = (category: MedicationCategory): string => {
  switch (category) {
    case 'Estupefacientes':
    case 'Psicotrópicos':
      return '🔴';
    case 'Antimicrobianos':
      return '🔵';
    case 'Receta Libre':
      return '🟢';
    case 'Analgésicos':
      return '💊';
    case 'Antiinflamatorios':
      return '🌡️';
    default:
      return '📋';
  }
};
