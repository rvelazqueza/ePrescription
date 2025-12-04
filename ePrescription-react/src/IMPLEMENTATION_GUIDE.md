# Guía de Implementación - Sistema de Múltiples Recetas Automáticas

## 📋 Resumen

Sistema que permite al asistente de IA sugerir tratamientos completos con medicamentos de diferentes categorías, y automáticamente los separa en las recetas correspondientes según las reglas de talonarios.

## 🎯 Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. MÉDICO USA ASISTENTE IA                                  │
├─────────────────────────────────────────────────────────────┤
│ Input: "Dolor post-operatorio con infección"               │
│ Diagnóstico CIE-10: T81.4                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ASISTENTE DEVUELVE TRATAMIENTO COMPLETO                 │
├─────────────────────────────────────────────────────────────┤
│ • Morfina (Estupefacientes)                                 │
│ • Cefazolina (Antimicrobianos)                              │
│ • Omeprazol (Receta Libre)                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SISTEMA ANALIZA AUTOMÁTICAMENTE                         │
├─────────────────────────────────────────────────────────────┤
│ analyzeTreatment(medications)                               │
│ → Agrupa por categoría                                      │
│ → Calcula número de recetas necesarias                      │
│ → Valida límites por categoría                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. VALIDA DISPONIBILIDAD                                    │
├─────────────────────────────────────────────────────────────┤
│ checkBookletAvailability(analysis, availableSlips)          │
│ → ¿Hay suficientes talonarios?                              │
└─────────────────────────────────────────────────────────────┘
          ↓                                    ↓
    ✅ SÍ HAY                              ❌ NO HAY
          ↓                                    ↓
┌──────────────────────┐        ┌────────────────────────────┐
│ 5a. MUESTRA DIÁLOGO  │        │ 5b. MUESTRA ALERTA         │
│ DE CONFIRMACIÓN      │        │ + BOTÓN COMPRAR            │
├──────────────────────┤        └────────────────────────────┘
│ "Se generarán        │
│  3 recetas:"         │
│                      │
│ 📋 Receta 1: Estup.  │
│ 📋 Receta 2: Antim.  │
│ 📋 Receta 3: Libre   │
│                      │
│ [Editar] [Confirmar] │
└──────────────────────┘
          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. USUARIO CONFIRMA → GENERA AUTOMÁTICAMENTE                │
├─────────────────────────────────────────────────────────────┤
│ for each group in analysis.groups:                         │
│   - Asignar boleta del tipo correcto                        │
│   - Crear prescripción                                      │
│   - Vincular al mismo diagnóstico                           │
│   - Numerar secuencialmente                                 │
└─────────────────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. RESULTADO                                                │
├─────────────────────────────────────────────────────────────┤
│ ✅ RX-2025-001234 (Estupefacientes) - Morfina              │
│ ✅ RX-2025-001235 (Antimicrobianos) - Cefazolina           │
│ ✅ RX-2025-001236 (Receta Libre) - Omeprazol               │
└─────────────────────────────────────────────────────────────┘
```

## 🔌 Integración en PrescriptionPage.tsx

### Paso 1: Importar Componentes y Utilidades

```typescript
import { MultiPrescriptionConfirmationDialog } from './MultiPrescriptionConfirmationDialog';
import {
  analyzeTreatment,
  checkBookletAvailability,
  type MultiPrescriptionMedication,
  type TreatmentAnalysis
} from '../utils/multiPrescriptionUtils';
import { PrescriptionBookletsAPI } from '../utils/prescriptionBookletsStore';
```

### Paso 2: Agregar Estados

```typescript
// Estados para múltiples recetas
const [showMultiPrescriptionDialog, setShowMultiPrescriptionDialog] = useState(false);
const [suggestedMedications, setSuggestedMedications] = useState<MultiPrescriptionMedication[]>([]);
const [currentDiagnosis, setCurrentDiagnosis] = useState('');
```

### Paso 3: Obtener Disponibilidad de Talonarios

```typescript
const getAvailableSlips = () => {
  return PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);
};
```

### Paso 4: Handler del Asistente IA

```typescript
const handleAIAssistantSuggestion = (
  diagnosis: string,
  medications: MedicationSuggestion[]
) => {
  // Convertir MedicationSuggestion a MultiPrescriptionMedication
  const multiMeds: MultiPrescriptionMedication[] = medications.map(med => ({
    id: med.id,
    name: med.genericName,
    category: (med.category || 'Receta Libre') as MedicationCategory,
    dosage: med.dose,
    frequency: med.frequency,
    duration: med.duration,
    instructions: med.instructions
  }));

  // Analizar si requiere múltiples recetas
  const analysis = analyzeTreatment(multiMeds);
  
  if (analysis.totalPrescriptions > 1) {
    // Múltiples recetas: mostrar diálogo de confirmación
    setCurrentDiagnosis(diagnosis);
    setSuggestedMedications(multiMeds);
    setShowMultiPrescriptionDialog(true);
  } else {
    // Una sola receta: flujo normal
    handleSinglePrescription(diagnosis, medications);
  }
};
```

### Paso 5: Handler de Confirmación

```typescript
const handleConfirmMultiplePrescriptions = (analysis: TreatmentAnalysis) => {
  // Generar todas las recetas automáticamente
  analysis.groups.forEach((group, index) => {
    // Asignar boleta del tipo correcto
    const slipResult = PrescriptionBookletsAPI.assignSlipToPrescription(
      doctorId,
      `RX-${Date.now()}-${index}`,
      group.bookletType
    );

    if (slipResult.success && slipResult.slip) {
      // Crear prescripción con los medicamentos del grupo
      const newPrescription = {
        id: `RX-${Date.now()}-${index}`,
        slipNumber: slipResult.slip.fullSlipNumber,
        bookletType: group.bookletType,
        diagnosis: currentDiagnosis,
        medications: group.medications,
        createdAt: new Date().toISOString(),
        // ... otros campos
      };

      // Guardar prescripción
      savePrescription(newPrescription);
    }
  });

  // Cerrar diálogo y mostrar éxito
  setShowMultiPrescriptionDialog(false);
  toast.success(`✅ ${analysis.totalPrescriptions} recetas generadas correctamente`);
  
  // Recargar datos
  loadPrescriptions();
};
```

### Paso 6: Renderizar Diálogo

```tsx
{/* Diálogo de confirmación múltiples recetas */}
<MultiPrescriptionConfirmationDialog
  isOpen={showMultiPrescriptionDialog}
  onClose={() => setShowMultiPrescriptionDialog(false)}
  medications={suggestedMedications}
  diagnosis={currentDiagnosis}
  availableSlipsByType={getAvailableSlips()}
  onConfirm={handleConfirmMultiplePrescriptions}
  onEdit={() => {
    setShowMultiPrescriptionDialog(false);
    // Abrir editor manual con medicamentos pre-cargados
    openManualEditor(suggestedMedications);
  }}
  onPurchaseBooklets={() => {
    setShowMultiPrescriptionDialog(false);
    setShowBookletPurchaseDialog(true);
  }}
/>
```

## 📊 Ejemplos de Uso

### Caso 1: Dolor Post-Operatorio + Infección

**Input del Asistente:**
```typescript
{
  diagnosis: "T81.4 - Infección postoperatoria",
  medications: [
    { name: "Morfina", category: "Estupefacientes", ... },
    { name: "Cefazolina", category: "Antimicrobianos", ... },
    { name: "Omeprazol", category: "Receta Libre", ... }
  ]
}
```

**Análisis Automático:**
```typescript
{
  totalPrescriptions: 3,
  groups: [
    { category: "Estupefacientes", medications: [Morfina], numberOfSlips: 1 },
    { category: "Antimicrobianos", medications: [Cefazolina], numberOfSlips: 1 },
    { category: "Receta Libre", medications: [Omeprazol], numberOfSlips: 1 }
  ]
}
```

**Resultado:** 3 recetas separadas

---

### Caso 2: Neumonía Severa (Múltiples Antimicrobianos)

**Input del Asistente:**
```typescript
{
  diagnosis: "J18.9 - Neumonía no especificada",
  medications: [
    { name: "Ceftriaxona", category: "Antimicrobianos", ... },
    { name: "Azitromicina", category: "Antimicrobianos", ... },
    { name: "Tramadol", category: "Receta Libre", ... }
  ]
}
```

**Análisis Automático:**
```typescript
{
  totalPrescriptions: 2,
  groups: [
    { 
      category: "Antimicrobianos", 
      medications: [Ceftriaxona, Azitromicina], 
      numberOfSlips: 1 
    },
    { category: "Receta Libre", medications: [Tramadol], numberOfSlips: 1 }
  ]
}
```

**Resultado:** 2 recetas (antibióticos juntos, analgésico separado)

---

### Caso 3: Múltiples Estupefacientes

**Input del Asistente:**
```typescript
{
  diagnosis: "R52.2 - Dolor crónico intratable",
  medications: [
    { name: "Morfina", category: "Estupefacientes", ... },
    { name: "Fentanilo", category: "Estupefacientes", ... }
  ]
}
```

**Análisis Automático:**
```typescript
{
  totalPrescriptions: 2,
  warnings: ["2 estupefacientes requieren 2 recetas separadas (1 por medicamento)"],
  groups: [
    { category: "Estupefacientes", medications: [Morfina], numberOfSlips: 1 },
    { category: "Estupefacientes", medications: [Fentanilo], numberOfSlips: 1 }
  ]
}
```

**Resultado:** 2 recetas (1 medicamento cada una)

---

### Caso 4: Excede Límite de Antimicrobianos

**Input del Asistente:**
```typescript
{
  diagnosis: "J18.9 - Neumonía complicada",
  medications: [
    { name: "Ceftriaxona", category: "Antimicrobianos", ... },
    { name: "Azitromicina", category: "Antimicrobianos", ... },
    { name: "Levofloxacino", category: "Antimicrobianos", ... },
    { name: "Vancomicina", category: "Antimicrobianos", ... } // 4º antibiótico
  ]
}
```

**Análisis Automático:**
```typescript
{
  totalPrescriptions: 2,
  warnings: ["4 antimicrobianos requieren 2 recetas (máximo 3 por receta)"],
  groups: [
    { 
      category: "Antimicrobianos", 
      medications: [Ceftriaxona, Azitromicina, Levofloxacino],
      numberOfSlips: 1,
      displayLabel: "Antimicrobianos (Grupo 1 de 2)"
    },
    { 
      category: "Antimicrobianos", 
      medications: [Vancomicina],
      numberOfSlips: 1,
      displayLabel: "Antimicrobianos (Grupo 2 de 2)"
    }
  ]
}
```

**Resultado:** 2 recetas antimicrobianas (3 + 1 medicamentos)

## ⚙️ Validaciones Automáticas

### 1. Validación de Disponibilidad

```typescript
const availability = checkBookletAvailability(analysis, availableSlipsByType);

if (!availability.hasEnough) {
  // Muestra qué talonarios faltan
  availability.missing.forEach(missing => {
    console.log(`Faltan ${missing.needed} boletas de ${missing.bookletType}`);
  });
  // Botón "Comprar Talonarios" visible
}
```

### 2. Validación de Límites

```typescript
// Automático en analyzeTreatment()
- Estupefacientes > 1 → Separa en múltiples recetas
- Psicotrópicos > 1 → Separa en múltiples recetas
- Antimicrobianos > 3 → Separa en grupos de máximo 3
- Receta Libre → Sin límite
```

### 3. Validación de Mezclas

```typescript
// No se pueden mezclar categorías en una misma boleta
// El sistema separa automáticamente por bookletType
```

## 🎨 UX Features

### Colores por Categoría
- 🔴 Estupefacientes: Rojo
- 🟠 Psicotrópicos: Naranja
- 🔵 Antimicrobianos: Azul
- 🟢 Receta Libre: Verde

### Iconos
- 🔴 Estupefacientes/Psicotrópicos
- 🔵 Antimicrobianos
- 🟢 Receta Libre
- 💊 Analgésicos
- 🌡️ Antiinflamatorios

### Alertas Inteligentes
- ⚠️ Amarillo: Requiere múltiples recetas
- 🔴 Rojo: Talonarios insuficientes
- ✅ Verde: Todo correcto

## 📦 Ventajas del Sistema

1. ✅ **Práctica Médica Real**: El médico piensa en tratamiento completo
2. ✅ **Cumplimiento Automático**: Sistema maneja restricciones legales
3. ✅ **Eficiencia**: 1 consulta al asistente vs múltiples
4. ✅ **Transparencia**: Médico ve exactamente qué se generará
5. ✅ **Flexibilidad**: Puede editar antes de confirmar
6. ✅ **Trazabilidad**: Todas las recetas vinculadas al diagnóstico
7. ✅ **Zero Errores**: No hay forma de violar límites por categoría

## 🚀 Próximos Pasos

1. Integrar en `PrescriptionPage.tsx`
2. Actualizar función `handleAIAssistantSelect` 
3. Agregar lógica de generación automática de múltiples prescripciones
4. Vincular con el sistema de impresión para imprimir todas juntas
5. Agregar analytics para tracking de uso

---

**Fecha de Implementación:** 27 de Noviembre, 2025  
**Autor:** Sistema ePrescription  
**Versión:** 1.0.0
