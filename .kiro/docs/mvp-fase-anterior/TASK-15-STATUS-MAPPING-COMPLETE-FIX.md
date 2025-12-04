# Task 15 - Corrección Completa de Mapeo de Status

## 🎯 Objetivo

Corregir **todos** los lugares donde se usan valores de status incorrectos que no coinciden con el backend.

## 📊 Status Válidos del Backend

| Backend Value | Descripción |
|---------------|-------------|
| `draft` | Borrador/Prescripción en proceso |
| `active` | Prescripción activa/emitida |
| `dispensed` | Prescripción completamente dispensada |
| `expired` | Prescripción vencida |
| `cancelled` | Prescripción cancelada |

## 🔍 Archivos que Necesitan Corrección

### ✅ 1. emitidas.component.ts - **CORREGIDO**
- Cambio: `status: 'Issued'` → `status: 'active'`
- Mapeo actualizado para usar valores correctos

### ⚠️ 2. registrar.component.ts - **NECESITA CORRECCIÓN**

**Problema**: Usa valores con mayúsculas que el backend no reconoce

```typescript
// ❌ INCORRECTO
if (prescription.status === 'Cancelled') {
  verificationStatus = 'cancelled';
} else if (prescription.status === 'Dispensed') {
  verificationStatus = 'already_dispensed';
}
```

**Solución**: Usar valores en minúsculas

```typescript
// ✅ CORRECTO
if (prescription.status === 'cancelled') {
  verificationStatus = 'cancelled';
} else if (prescription.status === 'dispensed') {
  verificationStatus = 'already_dispensed';
}
```

### ⚠️ 3. verificar.component.ts - **NECESITA CORRECCIÓN**

**Mismo problema**: Usa `'Cancelled'` y `'Dispensed'` con mayúsculas

```typescript
// ❌ INCORRECTO
if (prescription.status === 'Cancelled') {
  verificationStatus = 'cancelled';
} else if (prescription.status === 'Dispensed') {
  verificationStatus = 'already_dispensed';
}
```

### ⚠️ 4. borradores.component.ts - **NECESITA CORRECCIÓN**

**Problema**: Usa `'issued'` que no existe en el backend

```typescript
// ❌ INCORRECTO
firmaDigital: prescription.status === 'issued' || prescription.status === 'dispensed'
```

**Solución**: Usar `'active'`

```typescript
// ✅ CORRECTO
firmaDigital: prescription.status === 'active' || prescription.status === 'dispensed'
```

### ✅ 5. patient.service.ts - **YA ESTÁ CORRECTO**

Usa valores en minúsculas correctamente:
```typescript
const dispensedCount = patientPrescriptions.filter(p => p.status === 'dispensed').length;
const expiredCount = patientPrescriptions.filter(p => p.status === 'expired').length;
const cancelledCount = patientPrescriptions.filter(p => p.status === 'cancelled').length;
```

## 🛠️ Plan de Corrección

### Paso 1: Corregir registrar.component.ts
```typescript
// Líneas 421-436
if (prescription.status === 'cancelled') {  // minúscula
  verificationStatus = 'cancelled';
} else if (prescription.status === 'dispensed') {  // minúscula
  verificationStatus = 'already_dispensed';
}

let dispensationStatus: 'emitted' | 'fully_dispensed' | 'cancelled' = 'emitted';
if (prescription.status === 'dispensed') {  // minúscula
  dispensationStatus = 'fully_dispensed';
} else if (prescription.status === 'cancelled') {  // minúscula
  dispensationStatus = 'cancelled';
}
```

### Paso 2: Corregir verificar.component.ts
```typescript
// Líneas 296-313
if (prescription.status === 'cancelled') {  // minúscula
  verificationStatus = 'cancelled';
} else if (prescription.status === 'dispensed') {  // minúscula
  verificationStatus = 'already_dispensed';
}

let dispensationStatus: 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled' | 'expired' = 'emitted';
if (prescription.status === 'dispensed') {  // minúscula
  dispensationStatus = 'fully_dispensed';
} else if (prescription.status === 'cancelled') {  // minúscula
  dispensationStatus = 'cancelled';
}
```

### Paso 3: Corregir borradores.component.ts
```typescript
// Línea 918
firmaDigital: prescription.status === 'active' || prescription.status === 'dispensed'  // usar 'active' en vez de 'issued'
```

## 📝 Resumen de Cambios

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| emitidas.component.ts | 804, 935-950 | ✅ Corregido |
| registrar.component.ts | 421-436 | ⏳ Pendiente |
| verificar.component.ts | 296-313 | ⏳ Pendiente |
| borradores.component.ts | 918 | ⏳ Pendiente |

## ⚠️ Nota Importante

**Case Sensitivity**: El backend usa valores en **minúsculas**:
- ✅ `active`, `draft`, `dispensed`, `expired`, `cancelled`
- ❌ `Active`, `Draft`, `Dispensed`, `Expired`, `Cancelled`
- ❌ `Issued`, `PartiallyDispensed`

## 🧪 Pruebas Necesarias

Después de aplicar las correcciones, probar:

1. **Recetas Emitidas**: Debe cargar prescripciones con `status=active`
2. **Borradores**: Debe cargar prescripciones con `status=draft`
3. **Verificar Receta**: Debe validar correctamente los estados
4. **Registrar Dispensación**: Debe mapear correctamente los estados

## ✅ Checklist

- [x] Identificar todos los archivos con problemas
- [x] Documentar los cambios necesarios
- [ ] Aplicar correcciones en registrar.component.ts
- [ ] Aplicar correcciones en verificar.component.ts
- [ ] Aplicar correcciones en borradores.component.ts
- [ ] Probar cada vista
- [ ] Verificar que no hay errores 400

