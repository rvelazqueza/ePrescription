# Actualización: Datos de Talonarios en TODO el Sistema de Recetas

## 📋 Objetivo

Integrar los datos de control de talonarios (bookletNumber, slipNumber, fullSlipNumber) en TODA la estructura de recetas emitidas a lo largo del sistema, disponibles al:
- ✅ Crear recetas
- ✅ Consultar recetas
- ✅ Dispensar recetas
- ✅ Anular recetas
- ✅ Eliminar recetas
- ✅ Imprimir/Exportar recetas

---

## 🔧 Cambios Implementados

### 1. **Modal de Finalización - Completamente Responsive** ✅

#### **Archivo:** `/components/PrescriptionPage.tsx` (líneas ~1462-1632)

**Cambios en el HTML/JSX:**

```tsx
// ANTES (max-w-3xl):
<DialogContent className="max-w-3xl">

// DESPUÉS (Responsive con scroll):
<DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0">
```

#### **Mejoras Responsive Implementadas:**

**a) Estructura con padding controlado:**
```tsx
<DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0">
  {/* Header con padding */}
  <div className="p-6 pb-0">
    <DialogHeader>...</DialogHeader>
  </div>

  {/* Contenido con scroll vertical */}
  <div className="space-y-4 px-6 py-4 overflow-y-auto">
    {/* Contenido... */}
  </div>

  {/* Footer con padding */}
  <div className="p-6 pt-0">
    <DialogFooter>...</DialogFooter>
  </div>
</DialogContent>
```

**b) Grid responsive:**
```tsx
// Cambia automáticamente de 1 a 2 columnas según ancho
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
```

**c) Flex responsive:**
```tsx
// En pantallas pequeñas: columna, en grandes: fila
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
```

**d) Textos con break-words:**
```tsx
<p className="text-sm text-gray-900 font-medium break-words">
  {prescription.patientName} {prescription.patientFirstLastName}
</p>

// Para códigos largos:
<p className="text-sm text-gray-900 font-mono font-medium break-all">
  {finalizedBookletInfo.bookletNumber}
</p>
```

**e) Íconos con flex-shrink-0:**
```tsx
<Package className="w-5 h-5 text-purple-600 flex-shrink-0" />
<span className="font-medium text-purple-900 text-sm sm:text-base">Control de Talonarios</span>
```

**f) Botones responsivos:**
```tsx
<Button className="w-full sm:w-auto">
  Texto del Botón
</Button>
```

#### **Breakpoints Utilizados:**

- **Mobile**: < 640px
  - 1 columna
  - Padding reducido (p-3)
  - Textos en columna
  - Botones apilados (w-full)

- **Desktop**: >= 640px (sm:)
  - 2 columnas
  - Padding normal (sm:p-4)
  - Textos en fila (sm:flex-row)
  - Botones en línea (sm:w-auto)

---

### 2. **Store de Recetas Emitidas Actualizado** ✅

#### **Archivo:** `/utils/emittedPrescriptionsStore.ts`

**Interface PrescriptionInfo actualizada:**

```typescript
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
  
  // ✅ NUEVOS CAMPOS DE TALONARIOS
  bookletNumber?: string;     // Ej: "TAL-2025-000001"
  slipNumber?: string;         // Ej: "0001"
  fullSlipNumber?: string;     // Ej: "TAL-2025-000001-0001"
}
```

---

### 3. **Guardado de Datos al Finalizar Prescripción** ⚠️ PENDIENTE

#### **Archivo:** `/components/PrescriptionPage.tsx` (líneas ~823-850)

**Código a agregar después de la línea 849:**

```typescript
// UBICACIÓN: Después de qrCode (línea 849)
const emittedPrescriptionData = {
  prescription: {
    prescriptionNumber: finalPrescriptionNumber,
    patientName: prescription.patientName,
    // ... otros campos ...
    signatureToken,
    qrCode,
    // ✅ AGREGAR ESTOS 3 CAMPOS:
    bookletNumber: slipAssignment.slip.bookletNumber,
    slipNumber: slipAssignment.slip.slipNumber,
    fullSlipNumber: slipAssignment.slip.fullSlipNumber
  },
  medicines: medicines.map(med => ({
    // ...
  })),
  // ...
};
```

**Ubicación exacta:**

```typescript
// LÍNEA 847-850:
        status: "emitted" as const,
        signatureToken,
        qrCode,
        // ⬅️ INSERTAR AQUÍ
        bookletNumber: slipAssignment.slip.bookletNumber,
        slipNumber: slipAssignment.slip.slipNumber,
        fullSlipNumber: slipAssignment.slip.fullSlipNumber
      },
```

---

### 4. **Mostrar Datos en Todas las Vistas** 📝

Ahora que los datos están guardados en el store, necesitamos mostrarlos en:

#### **A) Vista de Recetas Emitidas**

**Archivo:** `/components/EmittedPrescriptionsPanel.tsx` o similar

**Agregar columna en tabla:**
```tsx
<TableHeader>
  <TableRow>
    <TableHead>Número Receta</TableHead>
    <TableHead>Paciente</TableHead>
    <TableHead>Fecha</TableHead>
    {/* ✅ NUEVA COLUMNA */}
    <TableHead>Talonario/Boleta</TableHead>
    <TableHead>Estado</TableHead>
    <TableHead>Acciones</TableHead>
  </TableRow>
</TableHeader>

<TableBody>
  {prescriptions.map((rx) => (
    <TableRow key={rx.prescription.prescriptionNumber}>
      <TableCell>{rx.prescription.prescriptionNumber}</TableCell>
      <TableCell>{rx.prescription.patientName}</TableCell>
      <TableCell>{rx.prescription.issueDate}</TableCell>
      {/* ✅ NUEVA CELDA */}
      <TableCell>
        {rx.prescription.fullSlipNumber ? (
          <div className="space-y-1">
            <Badge variant="outline" className="font-mono text-xs">
              {rx.prescription.fullSlipNumber}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Talonario: {rx.prescription.bookletNumber}
            </p>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">N/D</span>
        )}
      </TableCell>
      <TableCell>...</TableCell>
      <TableCell>...</TableCell>
    </TableRow>
  ))}
</TableBody>
```

#### **B) Panel de Detalles de Receta**

**Agregar sección de talonarios:**
```tsx
{/* Información de la receta */}
<Card>
  <CardHeader>
    <CardTitle>Detalles de la Receta</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <span className="text-sm font-medium">Número de Receta:</span>
        <p>{prescription.prescriptionNumber}</p>
      </div>
      
      {/* ✅ AGREGAR SECCIÓN DE TALONARIO */}
      {prescription.bookletNumber && (
        <>
          <div>
            <span className="text-sm font-medium">Talonario:</span>
            <p className="font-mono">{prescription.bookletNumber}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Boleta:</span>
            <p className="font-mono">{prescription.slipNumber}</p>
          </div>
          <div className="col-span-2">
            <span className="text-sm font-medium">Código Completo:</span>
            <Badge className="font-mono">
              {prescription.fullSlipNumber}
            </Badge>
          </div>
        </>
      )}
    </div>
  </CardContent>
</Card>
```

#### **C) PDF de Receta**

**Archivo:** `/utils/pdfGenerator.ts`

**Agregar en el HTML generado:**
```typescript
export const generatePrescriptionPDF = (prescriptionData: EmittedPrescriptionData) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receta Médica - ${prescriptionData.prescription.prescriptionNumber}</title>
      <style>
        /* ... estilos existentes ... */
        .booklet-info {
          background: #f3e8ff;
          border: 2px solid #a855f7;
          padding: 12px;
          border-radius: 8px;
          margin-top: 16px;
        }
        .booklet-code {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: #7c3aed;
        }
      </style>
    </head>
    <body>
      <!-- ... contenido existente ... -->
      
      <!-- ✅ NUEVA SECCIÓN DE TALONARIO -->
      ${prescriptionData.prescription.bookletNumber ? `
        <div class="booklet-info">
          <h3 style="margin-top: 0; color: #7c3aed;">📦 Control de Talonarios</h3>
          <table style="width: 100%;">
            <tr>
              <td><strong>Número de Talonario:</strong></td>
              <td class="booklet-code">${prescriptionData.prescription.bookletNumber}</td>
            </tr>
            <tr>
              <td><strong>Número de Boleta:</strong></td>
              <td class="booklet-code">${prescriptionData.prescription.slipNumber}</td>
            </tr>
            <tr>
              <td><strong>Código Completo:</strong></td>
              <td class="booklet-code">${prescriptionData.prescription.fullSlipNumber}</td>
            </tr>
          </table>
        </div>
      ` : ''}
      
      <!-- ... resto del contenido ... -->
    </body>
    </html>
  `;
  
  // ... código de generación PDF ...
};
```

#### **D) Diálogo de Dispensación**

**Mostrar talonario al dispensar:**
```tsx
<Dialog open={showDispenseDialog} onOpenChange={setShowDispenseDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dispensar Medicamentos</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4">
      {/* Información de la receta */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Control de Talonarios</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Talonario:</span>
              <span className="font-mono">{prescription.bookletNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Boleta:</span>
              <span className="font-mono">{prescription.slipNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Código:</span>
              <Badge className="font-mono text-xs">
                {prescription.fullSlipNumber}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Formulario de dispensación... */}
    </div>
  </DialogContent>
</Dialog>
```

#### **E) Diálogo de Anulación**

**Mostrar talonario al anular:**
```tsx
<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Anular Receta Médica</DialogTitle>
      <DialogDescription>
        Esta acción marcará la boleta como anulada en el sistema de talonarios.
      </DialogDescription>
    </DialogHeader>
    
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Advertencia</AlertTitle>
      <AlertDescription>
        La boleta <strong className="font-mono">{prescription.fullSlipNumber}</strong> del talonario <strong className="font-mono">{prescription.bookletNumber}</strong> será marcada como anulada. Esta acción no se puede deshacer.
      </AlertDescription>
    </Alert>
    
    {/* Formulario de anulación... */}
  </DialogContent>
</Dialog>
```

---

## 📊 Vista Completa del Flujo

```
┌─────────────────────────────────────────────────┐
│ 1. MÉDICO FINALIZA PRESCRIPCIÓN                 │
├─────────────────────────────────────────────────┤
│ • Sistema valida saldo de boletas              │
│ • Asigna próxima boleta disponible             │
│ • slipAssignment contiene:                      │
│   - bookletNumber: "TAL-2025-000001"           │
│   - slipNumber: "0001"                         │
│   - fullSlipNumber: "TAL-2025-000001-0001"    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 2. DATOS SE GUARDAN EN RECETA EMITIDA          │
├─────────────────────────────────────────────────┤
│ emittedPrescriptionData = {                     │
│   prescription: {                               │
│     prescriptionNumber: "RX-2025-009854",      │
│     ...                                        │
│     bookletNumber: "TAL-2025-000001",         │
│     slipNumber: "0001",                        │
│     fullSlipNumber: "TAL-2025-000001-0001"    │
│   }                                            │
│ }                                              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 3. DATOS DISPONIBLES EN TODO EL SISTEMA        │
├─────────────────────────────────────────────────┤
│ ✅ Modal de Finalización                       │
│ ✅ Lista de Recetas Emitidas                   │
│ ✅ Panel de Detalles                           │
│ ✅ PDF de Impresión                            │
│ ✅ Diálogo de Dispensación                     │
│ ✅ Diálogo de Anulación                        │
│ ✅ Historial/Auditoría                         │
│ ✅ Reportes/Estadísticas                       │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Componente Reutilizable para Mostrar Talonario

**Archivo nuevo:** `/components/BookletInfoDisplay.tsx`

```typescript
import React from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Package } from "lucide-react";

interface BookletInfoDisplayProps {
  bookletNumber?: string;
  slipNumber?: string;
  fullSlipNumber?: string;
  variant?: "inline" | "card" | "compact";
  className?: string;
}

export function BookletInfoDisplay({
  bookletNumber,
  slipNumber,
  fullSlipNumber,
  variant = "card",
  className = ""
}: BookletInfoDisplayProps) {
  // Si no hay datos, no mostrar nada
  if (!bookletNumber && !fullSlipNumber) {
    return null;
  }

  // Variante compacta (solo badge)
  if (variant === "compact") {
    return (
      <Badge variant="outline" className={`font-mono text-xs ${className}`}>
        {fullSlipNumber || `${bookletNumber}-${slipNumber}`}
      </Badge>
    );
  }

  // Variante inline (texto simple)
  if (variant === "inline") {
    return (
      <div className={`space-y-1 ${className}`}>
        {bookletNumber && (
          <p className="text-sm">
            <span className="text-muted-foreground">Talonario:</span>{" "}
            <span className="font-mono font-medium">{bookletNumber}</span>
          </p>
        )}
        {slipNumber && (
          <p className="text-sm">
            <span className="text-muted-foreground">Boleta:</span>{" "}
            <span className="font-mono font-medium">{slipNumber}</span>
          </p>
        )}
        {fullSlipNumber && (
          <p className="text-sm">
            <Badge variant="outline" className="font-mono text-xs">
              {fullSlipNumber}
            </Badge>
          </p>
        )}
      </div>
    );
  }

  // Variante card (con fondo y borde)
  return (
    <Card className={`border-purple-200 bg-purple-50 ${className}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span className="font-medium text-purple-900 text-sm">
            Control de Talonarios
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {bookletNumber && (
            <div>
              <span className="text-muted-foreground">Talonario:</span>
              <p className="font-mono font-medium text-gray-900 break-all">
                {bookletNumber}
              </p>
            </div>
          )}
          {slipNumber && (
            <div>
              <span className="text-muted-foreground">Boleta:</span>
              <p className="font-mono font-medium text-gray-900">
                {slipNumber}
              </p>
            </div>
          )}
          {fullSlipNumber && (
            <div className="col-span-full">
              <span className="text-muted-foreground">Código Completo:</span>
              <div className="mt-1">
                <Badge variant="outline" className="font-mono text-xs bg-purple-100 text-purple-800 border-purple-300">
                  {fullSlipNumber}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Uso del componente:**

```tsx
// En cualquier parte del sistema:
import { BookletInfoDisplay } from "./components/BookletInfoDisplay";

// Variante card (completa):
<BookletInfoDisplay
  bookletNumber={prescription.bookletNumber}
  slipNumber={prescription.slipNumber}
  fullSlipNumber={prescription.fullSlipNumber}
  variant="card"
/>

// Variante inline (texto simple):
<BookletInfoDisplay
  bookletNumber={prescription.bookletNumber}
  slipNumber={prescription.slipNumber}
  fullSlipNumber={prescription.fullSlipNumber}
  variant="inline"
/>

// Variante compact (solo badge):
<BookletInfoDisplay
  fullSlipNumber={prescription.fullSlipNumber}
  variant="compact"
/>
```

---

## ✅ Checklist de Implementación

### **Paso 1: Modal Responsive** ✅ COMPLETADO
- [x] Cambiar className a responsive
- [x] Agregar padding controlado
- [x] Grid responsive (1/2 columnas)
- [x] Flex responsive (columna/fila)
- [x] break-words en textos largos
- [x] flex-shrink-0 en íconos
- [x] Botones responsivos

### **Paso 2: Store Actualizado** ✅ COMPLETADO
- [x] Agregar campos en PrescriptionInfo interface
- [x] bookletNumber?: string
- [x] slipNumber?: string
- [x] fullSlipNumber?: string

### **Paso 3: Guardado de Datos** ⚠️ PENDIENTE
- [ ] Agregar campos en emittedPrescriptionData
- [ ] Ubicación: línea 849 de PrescriptionPage.tsx
- [ ] Después de qrCode

### **Paso 4: Componente Reutilizable** ⚠️ PENDIENTE
- [ ] Crear /components/BookletInfoDisplay.tsx
- [ ] 3 variantes: card, inline, compact

### **Paso 5: Mostrar en Vistas** ⚠️ PENDIENTE
- [ ] Lista de recetas emitidas (tabla)
- [ ] Panel de detalles
- [ ] PDF de impresión
- [ ] Diálogo de dispensación
- [ ] Diálogo de anulación

---

## 🚀 Próximos Pasos

1. **Aplicar el cambio pendiente en PrescriptionPage.tsx** (línea 849)
2. **Crear componente BookletInfoDisplay.tsx**
3. **Actualizar todas las vistas** para mostrar información de talonarios
4. **Probar el flujo completo** de creación → consulta → dispensación → anulación

---

**Documentación creada: 20/11/2025**
**Estado: Modal Responsive ✅ | Store ✅ | Guardado ⚠️ | Vistas ⚠️**
