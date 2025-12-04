# Guía de Implementación: Sistema de Control de Talonarios

## ✅ Archivos Creados

### 1. `/utils/prescriptionBookletsStore.ts`
- ✅ Store completo de talonarios con CRUD
- ✅ Control de saldo de boletas por profesional
- ✅ Sistema de compra de talonarios
- ✅ Asignación automática de boletas a recetas
- ✅ Configuración parametrizable (máximo de talonarios, boletas por talonario, costo)

### 2. `/utils/medicineClassificationStore.ts`
- ✅ Clasificación de medicamentos (estupefacientes, psicotrópicos, antimicrobianos, controlados, libres)
- ✅ Validaciones automáticas según categoría:
  - **Estupefacientes:** Solo 1 por receta
  - **Psicotrópicos:** Solo 1 por receta
  - **Antimicrobianos:** Hasta 3 por receta
  - **Libres:** Sin límite
- ✅ API de validación `canAddMedicineToList()`

### 3. `/components/BookletPurchaseDialog.tsx`
- ✅ Diálogo para compra de talonarios
- ✅ Selección de cantidad y método de pago
- ✅ Resumen de compra con cálculo automático

### 4. `/components/BookletBalanceDisplay.tsx`
- ✅ Componente para mostrar saldo de boletas
- ✅ Alertas visuales (rojo=0, ámbar=bajo, verde=normal)
- ✅ Estadísticas de uso

### 5. `/utils/emittedPrescriptionsStore.ts` - ACTUALIZADO
- ✅ Agregados campos `bookletNumber`, `slipNumber`, `fullSlipNumber` en `PrescriptionInfo`

## 📋 Cambios Necesarios en PrescriptionPage.tsx

### Imports Agregados
```typescript
import { PrescriptionBookletsAPI, ConfigurationAPI } from "../utils/prescriptionBookletsStore";
import { MedicineClassificationAPI, PRESCRIPTION_RULES } from "../utils/medicineClassificationStore";
import { BookletPurchaseDialog } from "./BookletPurchaseDialog";
import { BookletBalanceDisplay } from "./BookletBalanceDisplay";
```

### Estados Adicionales Necesarios
```typescript
// Dentro de PrescriptionPage component
const [showBookletPurchaseDialog, setShowBookletPurchaseDialog] = useState(false);
const [bookletBalanceKey, setBookletBalanceKey] = useState(0); // Para refrescar saldo

// ID del doctor (hardcodeado para demo, en producción viene de sesión)
const doctorId = "DOC-001";
const doctorLicense = "RM-12345-COL";
```

### Validación al Agregar Medicamento
Reemplazar la función `handleAddMedicine` para incluir validaciones:

```typescript
const handleAddMedicine = (medicine: Medicine) => {
  // NUEVA: Validación de categoría
  const validation = MedicineClassificationAPI.canAddMedicineToList(
    { genericName: medicine.genericName },
    medicines
  );

  if (!validation.canAdd) {
    toast.error("No se puede agregar el medicamento", {
      description: validation.reason,
      duration: 5000,
    });
    return;
  }

  // Mostrar info de categoría si es especial
  const info = MedicineClassificationAPI.getMedicineInfo(medicine.genericName);
  if (info.requiresSpecialControl) {
    toast.info(`Medicamento ${info.categoryLabel}`, {
      description: info.description,
      duration: 4000,
    });
  }

  // Código existente para agregar...
  const newMedicine = { ...medicine, id: `${Date.now()}-${Math.random()}` };
  setMedicines([...medicines, newMedicine]);
  toast.success("Medicamento agregado");
};
```

### Validación al Finalizar Receta
Actualizar `finalizePrescriptionProcess`:

```typescript
const finalizePrescriptionProcess = () => {
  // NUEVA: Validar saldo de boletas
  const availableSlips = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId);
  
  if (availableSlips === 0) {
    toast.error("Sin boletas disponibles", {
      description: "Debes comprar talonarios para emitir recetas",
      duration: 5000,
    });
    setShowBookletPurchaseDialog(true);
    return;
  }

  // NUEVA: Validar lista de medicamentos
  const medicineValidation = MedicineClassificationAPI.validateMedicineList(medicines);
  if (!medicineValidation.isValid) {
    toast.error("Validación de medicamentos falló", {
      description: medicineValidation.errors.join(". "),
      duration: 6000,
    });
    return;
  }

  // Generar número definitivo
  const finalPrescriptionNumber = prescription.prescriptionNumber.startsWith('DRAFT-') 
    ? EmittedPrescriptionsAPI.generatePrescriptionNumber()
    : prescription.prescriptionNumber;
  
  // NUEVA: Asignar boleta
  const slipAssignment = PrescriptionBookletsAPI.assignSlipToPrescription(
    doctorId,
    finalPrescriptionNumber
  );

  if (!slipAssignment.success) {
    toast.error("Error al asignar boleta", {
      description: slipAssignment.error,
      duration: 5000,
    });
    return;
  }

  // Generar token y QR
  const signatureToken = `SIG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000000)}`;
  const qrCode = `QR-${finalPrescriptionNumber}`;

  // Preparar datos con información de boleta
  const emittedPrescriptionData = {
    prescription: {
      prescriptionNumber: finalPrescriptionNumber,
      // ... todos los campos existentes ...
      signatureToken,
      qrCode,
      // NUEVO: Información de talonario
      bookletNumber: slipAssignment.slip.bookletNumber,
      slipNumber: slipAssignment.slip.slipNumber,
      fullSlipNumber: slipAssignment.slip.fullSlipNumber,
    },
    medicines: medicines.map(med => ({
      // ... campos existentes ...
      dispensationStatus: 'pending' as const,
      quantityDispensed: 0
    })),
    emittedAt: new Date().toISOString(),
    emittedBy: prescription.doctorName,
    dispensationStatus: 'emitted' as const,
    origin: prescriptionOrigin === 'repeated' ? 'manual' as const : 
            (prescriptionOrigin === 'ai-assisted' ? 'ai-assisted' as const : 'manual' as const),
  };

  // Guardar receta
  EmittedPrescriptionsAPI.savePrescription(finalPrescriptionNumber, emittedPrescriptionData);

  // Disparar evento
  window.dispatchEvent(new CustomEvent('prescription-emitted', { 
    detail: { prescriptionNumber: finalPrescriptionNumber } 
  }));

  // Eliminar borrador si existe
  if (currentDraftId) {
    DraftsAPI.deleteDraft(currentDraftId);
  }

  // NUEVA: Refrescar saldo
  setBookletBalanceKey(prev => prev + 1);

  // Mostrar diálogo de éxito con información de boleta
  toast.success("¡Receta finalizada exitosamente!", {
    description: `Boleta: ${slipAssignment.slip.fullSlipNumber}`,
    duration: 5000,
  });

  setShowFinalizationDialog(true);
};
```

### UI: Agregar Display de Saldo
En el JSX, antes del formulario de prescripción, agregar:

```tsx
{/* Saldo de Talonarios */}
<BookletBalanceDisplay
  key={bookletBalanceKey}
  doctorId={doctorId}
  onPurchaseClick={() => setShowBookletPurchaseDialog(true)}
/>

{/* Diálogo de Compra */}
<BookletPurchaseDialog
  isOpen={showBookletPurchaseDialog}
  onClose={() => setShowBookletPurchaseDialog(false)}
  doctorId={doctorId}
  doctorName={prescription.doctorName}
  doctorLicense={doctorLicense}
  onPurchaseComplete={() => {
    setBookletBalanceKey(prev => prev + 1);
    toast.success("Talonarios comprados. Ya puedes continuar con la prescripción.");
  }}
/>
```

### UI: Badge de Categoría en Tabla de Medicamentos
Modificar el render de medicamentos para mostrar badge de categoría:

```tsx
{medicines.map(med => {
  const info = MedicineClassificationAPI.getMedicineInfo(med.genericName);
  const rules = PRESCRIPTION_RULES[info.category];
  
  return (
    <TableRow key={med.id}>
      <TableCell>
        <div>
          <div className="font-medium">{med.genericName}</div>
          {info.requiresSpecialControl && (
            <Badge 
              variant="outline" 
              className={`mt-1 text-xs border-${rules.color}-500 text-${rules.color}-700`}
            >
              {rules.label}
            </Badge>
          )}
        </div>
      </TableCell>
      {/* ... resto de columnas ... */}
    </TableRow>
  );
})}
```

## 🔧 Configuración del Sistema

Los parámetros se pueden modificar desde código:

```typescript
// Cambiar máximo de talonarios por compra
ConfigurationAPI.setMaxBookletsPerPurchase(15);

// Cambiar boletas por talonario
ConfigurationAPI.setSlipsPerBooklet(100);

// Cambiar costo por boleta
ConfigurationAPI.setCostPerSlip(1500);
```

En producción, estos valores deberían venir de una página de configuración en `/pages/ConfigPage.tsx`.

## 📊 Página de Compra de Talonarios (Opcional)

Se puede crear una página dedicada en `/pages/TalonariosPage.tsx` que ya existe en el routing:

- Mostrar historial de compras
- Ver talonarios activos y completados
- Realizar compras
- Ver estadísticas de uso

## ✅ Testing

1. **Saldo Cero:** 
   - Intentar crear receta sin talonarios
   - Debe mostrar alerta y abrir diálogo de compra

2. **Validación Estupefacientes:**
   - Agregar "Morfina" → Debe permitir
   - Intentar agregar otro estupefaciente → Debe bloquear

3. **Validación Antimicrobianos:**
   - Agregar 3 antimicrobianos → Debe permitir
   - Intentar agregar un 4to → Debe bloquear

4. **Asignación de Boletas:**
   - Finalizar receta → Debe asignar boleta automáticamente
   - Verificar que el número de boleta aparece en la receta emitida
   - Saldo debe decrementar

5. **Compra de Talonarios:**
   - Comprar 2 talonarios de 50 boletas
   - Saldo debe aumentar en 100
   - Poder crear recetas inmediatamente

## 🔄 Próximos Pasos

1. Aplicar cambios a `PrescriptionPage.tsx` según esta guía
2. Crear página de gestión de talonarios (opcional)
3. Agregar vista de configuración de parámetros
4. Integrar con sistema de reportes (uso de talonarios por doctor)
5. Agregar auditoría de compras y asignaciones
