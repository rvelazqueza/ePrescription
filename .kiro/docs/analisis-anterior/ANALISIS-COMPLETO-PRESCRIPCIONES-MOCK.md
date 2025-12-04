# Análisis Completo - Datos Mock en Vistas de Prescripciones

## Problema Identificado

Después de revisar el código, encontré que **MÚLTIPLES vistas de prescripciones** todavía tienen datos mock hardcodeados. El arreglo que hice solo corrigió errores de compilación en `nueva.component.ts`, pero NO eliminó los datos mock de otras vistas.

## Vistas con Datos Mock

### 1. **borradores.component.ts** ❌ CON MOCK
**Ubicación:** `eprescription-frontend/src/app/pages/prescripciones/borradores/borradores.component.ts`

**Datos Mock:**
```typescript
borradores: Borrador[] = [
  {
    id: 'BR-2025-001234',
    paciente: { nombre: 'María Elena González Rodríguez', ... },
    diagnostico: 'Hipertensión arterial esencial (I10)',
    medicamentos: [ ... ],
    fechaCreacion: '27/09/2025',
    ...
  },
  // 2 borradores más hardcodeados
]
```

**Problema:** 
- Array de 3 borradores hardcodeados
- NO usa `PrescripcionesService`
- Datos completamente ficticios

### 2. **prescripciones.component.ts** ❌ CON MOCK
**Ubicación:** `eprescription-frontend/src/app/pages/prescripciones/prescripciones.component.ts`

**Datos Mock:**
```typescript
prescripciones = [
  {
    id: 'RX-2025-009847',
    // ... datos hardcodeados
  }
]
```

**Problema:**
- Array de prescripciones hardcodeado
- NO usa `PrescripcionesService`

### 3. **nueva.component.ts** ⚠️ PARCIALMENTE ARREGLADO
**Ubicación:** `eprescription-frontend/src/app/pages/prescripciones/nueva/nueva.component.ts`

**Estado:**
- ✅ Errores de compilación corregidos
- ✅ Servicios inyectados
- ⚠️ Método `cargarDatosBorrador()` implementado pero NO completo
- ❌ NO convierte medications del API al formato del componente
- ❌ Todavía tiene lógica mock en otros métodos

### 4. **emitidas.component.ts** ❓ SIN REVISAR
**Ubicación:** `eprescription-frontend/src/app/pages/prescripciones/emitidas/emitidas.component.ts`

**Estado:** Necesita revisión

### 5. **buscar.component.ts** ❓ SIN REVISAR
**Ubicación:** `eprescription-frontend/src/app/pages/prescripciones/buscar/buscar.component.ts`

**Estado:** Necesita revisión

## Impacto en la Aplicación

### Lo que el usuario ve:
1. **Vista de Borradores:** Muestra 3 borradores ficticios siempre
2. **Vista de Prescripciones:** Muestra datos hardcodeados
3. **Nueva Prescripción:** Compila pero no carga datos reales de borradores
4. **Otras vistas:** Estado desconocido

### Lo que NO funciona:
- ❌ No se cargan borradores reales desde el backend
- ❌ No se cargan prescripciones emitidas desde el backend
- ❌ Los datos mostrados son completamente ficticios
- ❌ Crear/editar prescripciones no persiste en el backend

## Plan de Corrección Completo

### Fase 1: Borradores Component ⭐ PRIORIDAD ALTA
```typescript
// Eliminar:
borradores: Borrador[] = [ ... datos hardcodeados ... ]

// Implementar:
ngOnInit() {
  this.loadDrafts();
}

loadDrafts() {
  this.prescripcionesService.getPrescripciones({ status: 'draft' })
    .subscribe({
      next: (drafts) => {
        this.borradores = this.mapPrescriptionsToBorradores(drafts);
        this.borradoresFiltrados = [...this.borradores];
        this.calcularEstadisticas();
        this.actualizarPaginacion();
      },
      error: (error) => {
        console.error('Error loading drafts:', error);
        this.notificationService.showError('Error al cargar borradores');
      }
    });
}
```

### Fase 2: Prescripciones Component
```typescript
// Eliminar datos mock
// Implementar carga desde servicio
```

### Fase 3: Nueva Prescripción Component
```typescript
// Completar método cargarDatosBorrador()
// Implementar conversión de medications
// Implementar guardado real
```

### Fase 4: Emitidas Component
```typescript
// Revisar y eliminar mock si existe
// Implementar carga desde servicio
```

### Fase 5: Buscar Component
```typescript
// Revisar y eliminar mock si existe
// Implementar búsqueda real
```

## Servicios Necesarios

### PrescripcionesService (Ya existe)
```typescript
✅ getPrescripciones(params?: SearchPrescriptionsParams)
✅ getPrescriptionById(id: string)
✅ createPrescripcion(prescription: CreatePrescriptionDto)
✅ updatePrescripcion(id: string, updates: Partial<CreatePrescriptionDto>)
✅ deletePrescripcion(id: string)
```

### PatientService (Ya existe)
```typescript
✅ getPatientById(id: string)
✅ searchPatients(query: string)
```

## Mapeo de Datos Necesario

### Backend → Frontend
```typescript
interface PrescriptionDto {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  status: string; // 'draft', 'issued', 'dispensed'
  medications: Array<{
    medicationId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: number;
  }>;
}

// Mapear a:
interface Borrador {
  id: string;
  paciente: { nombre, cedula, edad, genero };
  medicamentos: Array<{ nombre, dosis, cantidad, frecuencia, duracion }>;
  fechaCreacion: string;
  medico: { nombre, especialidad };
}
```

## Recomendación Inmediata

**DETENER** y hacer un análisis completo antes de continuar:

1. ✅ Revisar TODAS las vistas de prescripciones
2. ✅ Identificar TODOS los datos mock
3. ⏳ Crear un plan de migración completo
4. ⏳ Implementar vista por vista
5. ⏳ Probar cada vista con el backend real

## Próximos Pasos Sugeridos

**Opción A: Enfoque Incremental (Recomendado)**
1. Arreglar `borradores.component.ts` primero (más usado)
2. Arreglar `nueva.component.ts` completamente
3. Arreglar `emitidas.component.ts`
4. Arreglar `prescripciones.component.ts`
5. Arreglar `buscar.component.ts`

**Opción B: Enfoque Completo**
1. Revisar TODAS las vistas primero
2. Crear mappers centralizados
3. Implementar todo de una vez

## Conclusión

El problema es **MUCHO MÁS GRANDE** de lo que parecía inicialmente. No es solo un error de compilación, sino que **TODA la sección de prescripciones** está usando datos mock y NO se conecta al backend real.

**Estado Actual:**
- ❌ Borradores: 100% mock
- ❌ Prescripciones: 100% mock  
- ⚠️ Nueva: Compilación OK, funcionalidad incompleta
- ❓ Emitidas: Sin revisar
- ❓ Buscar: Sin revisar

**Trabajo Pendiente:** ~5-8 horas de desarrollo para migrar completamente a servicios reales.
