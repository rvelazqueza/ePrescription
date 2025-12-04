# Design Document

## Overview

Esta corrección actualiza todos los componentes del frontend Angular que aún referencian servicios mock eliminados. Los servicios mock fueron eliminados en Task 15 pero algunos componentes no se actualizaron, causando errores de compilación.

## Architecture

### Componentes Afectados

**Componentes de Farmacias:**
- `pages/farmacias/farmacias.component.ts` (DEPRECATED - no se usa)
- `pages/farmacias/lista/lista.component.ts` (DEPRECATED - no se usa)
- `pages/inventario/farmacias/farmacias.component.ts` (ACTIVO - se usa)

**Componentes de Inventario:**
- `pages/inventario/ajustes/ajustes.component.ts`
- `pages/inventario/alertas/alertas.component.ts`
- `pages/inventario/consulta/consulta.component.ts`
- `pages/inventario/lotes/lotes.component.ts`
- `pages/inventario/stock/stock.component.ts`

**Componentes de Médicos:**
- `pages/medicos/editar/editar.component.ts`
- `pages/medicos/lista/lista.component.ts`

### Servicios Reales Disponibles

Los siguientes servicios reales ya existen y deben usarse:
- `PharmacyService` → `services/pharmacy.service.ts`
- `InventoryService` → `services/inventory.service.ts`
- `DoctorService` → `services/doctor.service.ts` (ya existía)
- `PatientService` → `services/patient.service.ts`

## Components and Interfaces

### Cambios en Importaciones

**Antes:**
```typescript
import { PharmacyMockService } from '../../services/pharmacy-mock.service';
```

**Después:**
```typescript
import { PharmacyService } from '../../services/pharmacy.service';
```

### Cambios en Constructores

**Antes:**
```typescript
constructor(private pharmacyService: PharmacyMockService) {}
```

**Después:**
```typescript
constructor(private pharmacyService: PharmacyService) {}
```


## Data Models

Los modelos de datos (interfaces) no cambian, ya que los servicios reales usan las mismas interfaces que los servicios mock:
- `Pharmacy` interface
- `Inventory` interface  
- `Doctor` interface
- `Patient` interface

## Error Handling

### Manejo de Tipos Implícitos

**Problema:**
```typescript
.subscribe(pharmacies => {  // Error: Parameter 'pharmacies' implicitly has an 'any' type
```

**Solución:**
```typescript
.subscribe((pharmacies: Pharmacy[]) => {
```

### Manejo de Disabled en Formularios Reactivos

**Problema:**
```html
<input [disabled]="isLoading" formControlName="email">
```

**Solución:**
```typescript
// En el constructor del FormControl
this.form = new FormGroup({
  email: new FormControl({value: '', disabled: false}, Validators.required)
});

// Para cambiar el estado
this.form.get('email')?.disable();
this.form.get('email')?.enable();
```

## Testing Strategy

### Verificación de Compilación

1. Ejecutar `ng build` para verificar que no hay errores de compilación
2. Verificar que no hay warnings de tipos implícitos
3. Verificar que no hay warnings de Angular Forms

### Verificación Funcional

1. Probar que cada vista carga datos correctamente
2. Verificar que las operaciones CRUD funcionan
3. Confirmar que no hay errores 400 en la consola del navegador

## Implementation Notes

### Componentes Deprecated

Los componentes en `pages/farmacias/` están marcados como DEPRECATED porque la vista real está en `pages/inventario/farmacias/`. Opciones:

1. **Actualizar y mantener** - Actualizar las importaciones para que compilen
2. **Eliminar completamente** - Remover los archivos deprecated

**Recomendación:** Actualizar las importaciones para mantener compatibilidad, pero agregar comentarios claros indicando que no se usan.

### Orden de Corrección

1. Actualizar componentes de farmacias (3 archivos)
2. Actualizar componentes de inventario (5 archivos)
3. Actualizar componentes de médicos (2 archivos)
4. Verificar compilación
5. Probar funcionalidad básica
