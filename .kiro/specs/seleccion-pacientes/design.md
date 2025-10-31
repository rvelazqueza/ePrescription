# Design Document

## Overview

Esta funcionalidad actualiza la vista de Nueva Receta para incluir un sistema completo de selección de pacientes. El diseño se basa en los patrones existentes del proyecto Angular 18, reutilizando componentes UI establecidos y manteniendo consistencia con la arquitectura actual de Angular/TypeScript.

La implementación se integrará con el componente de prescripciones existente y utilizará los componentes de UI ya disponibles. El modal de nuevo paciente reutilizará el componente `new-patient-dialog` existente con modificaciones menores para hacerlo más flexible.

## Architecture

### Component Structure

```
prescripciones.component (modificado)
├── patient-selection-section.component (nuevo)
│   ├── patient-selector.component (nuevo)
│   └── selected-patient-info.component (nuevo)
├── patient-selection-modal.component (nuevo)
│   ├── recent-patients-tab.component (nuevo)
│   ├── advanced-search-tab.component (nuevo)
│   └── new-patient-dialog.component (reutilizado/modificado)
└── [componentes existentes...]
```

### Data Flow

1. **Estado inicial**: No hay paciente seleccionado
2. **Selección**: Usuario abre modal → busca/selecciona paciente → modal se cierra → información se muestra
3. **Cambio**: Usuario puede cambiar paciente → modal se reabre → nueva selección
4. **Nuevo paciente**: Modal de nuevo paciente → registro exitoso → selección automática → cierre de modales

### Integration Points

- **prescripciones.component**: Componente principal que maneja el estado del paciente seleccionado
- **new-patient-dialog.component**: Componente existente que se modificará para ser más reutilizable
- **PatientData Interface**: Se utilizará la estructura existente en `src/app/interfaces/patient.interface.ts`
- **UI Components**: Reutilización de componentes existentes del sistema de diseño Angular
- **Services**: Integración con servicios Angular existentes para manejo de datos

## Components and Interfaces

### 1. PatientSelectionSectionComponent

**Propósito**: Sección principal que muestra el estado de selección de paciente

**Inputs**:
```typescript
@Input() selectedPatient: PatientData | null = null;
```

**Outputs**:
```typescript
@Output() selectPatient = new EventEmitter<void>();
@Output() changePatient = new EventEmitter<void>();
```

**Estados**:
- Sin paciente: Muestra mensaje y botón "Seleccionar Paciente"
- Con paciente: Muestra información del paciente y botón "Cambiar paciente"

### 2. PatientSelectionModalComponent

**Propósito**: Modal principal con pestañas para búsqueda de pacientes

**Inputs**:
```typescript
@Input() isOpen: boolean = false;
```

**Outputs**:
```typescript
@Output() closeModal = new EventEmitter<void>();
@Output() patientSelected = new EventEmitter<PatientData>();
```

**Características**:
- Dos pestañas: "Pacientes Recientes" y "Búsqueda Avanzada"
- Botón "Nuevo Paciente" en footer
- Manejo de estado interno para pestañas activas usando Angular reactive forms

### 3. RecentPatientsTabComponent

**Propósito**: Pestaña que muestra pacientes atendidos recientemente

**Funcionalidades**:
- Lista de últimos 10-15 pacientes usando Angular *ngFor
- Información básica: nombre, ID, edad, última visita
- Indicadores visuales de alergias/condiciones
- Botón "Seleccionar" por paciente con event binding

### 4. AdvancedSearchTabComponent

**Propósito**: Pestaña con búsqueda avanzada de pacientes

**Funcionalidades**:
- Campo de búsqueda con filtros usando Angular Reactive Forms
- Búsqueda por: nombre, cédula, código, teléfono
- Resultados en tiempo real con debounceTime operator
- Paginación si hay muchos resultados
- Mensaje de "mínimo 2 caracteres" con form validation

### 5. SelectedPatientInfoComponent

**Propósito**: Componente que muestra información del paciente seleccionado

**Inputs**:
```typescript
@Input() patient: PatientData | null = null;
```

**Información mostrada**:
- Datos básicos: nombre, cédula, edad, sexo, tipo de sangre
- Alertas médicas destacadas
- Alergias con iconos de advertencia
- Condiciones crónicas
- Medicación actual

### 6. NewPatientDialogComponent (Modificado)

**Modificaciones necesarias**:
- Agregar Output `patientCreated` para callback cuando se crea paciente
- Hacer el componente más reutilizable con dependency injection
- Mantener funcionalidad existente de múltiples tabs
- Integrar con Angular services para persistencia

## Data Models

### PatientData Interface

```typescript
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
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  lastVisit?: string;
  registrationDate: string;
  status: "active" | "inactive";
}
```

### PatientSearchResult Interface

```typescript
interface PatientSearchResult {
  patients: PatientData[];
  totalCount: number;
  hasMore: boolean;
}
```

### RecentPatient Interface

```typescript
interface RecentPatient extends PatientData {
  lastVisitDate: string;
  lastPrescriptionId?: string;
  visitCount: number;
}
```

## Error Handling

### Validation Rules

1. **Selección requerida**: No se puede agregar medicamentos sin paciente seleccionado
2. **Búsqueda mínima**: Mínimo 2 caracteres para búsqueda avanzada
3. **Paciente activo**: Solo se pueden seleccionar pacientes con status "active"
4. **Datos completos**: Validar que el paciente tenga información mínima requerida

### Error States

1. **Sin resultados de búsqueda**: Mensaje informativo con sugerencias
2. **Error de carga**: Mensaje de error con opción de reintentar
3. **Paciente inactivo**: Advertencia con opción de reactivar
4. **Datos incompletos**: Advertencia con opción de completar perfil

### Error Messages

```typescript
const ERROR_MESSAGES = {
  NO_PATIENT_SELECTED: "Debe seleccionar un paciente antes de agregar medicamentos",
  SEARCH_MIN_CHARS: "Ingrese al menos 2 caracteres para buscar",
  NO_RESULTS: "No se encontraron pacientes con los criterios de búsqueda",
  LOAD_ERROR: "Error al cargar la información del paciente",
  INACTIVE_PATIENT: "Este paciente está inactivo en el sistema",
  INCOMPLETE_DATA: "El perfil del paciente tiene información incompleta"
};
```

## Testing Strategy

### Unit Tests

1. **PatientSelectionSection**:
   - Renderizado correcto sin paciente
   - Renderizado correcto con paciente
   - Llamadas correctas a callbacks

2. **PatientSelectionModal**:
   - Apertura y cierre del modal
   - Cambio entre pestañas
   - Selección de paciente

3. **RecentPatientsTab**:
   - Carga de pacientes recientes
   - Selección de paciente de la lista

4. **AdvancedSearchTab**:
   - Búsqueda con diferentes criterios
   - Manejo de resultados vacíos
   - Validación de caracteres mínimos

### Integration Tests

1. **Flujo completo de selección**:
   - Abrir modal → seleccionar paciente → cerrar modal → verificar estado

2. **Flujo de nuevo paciente**:
   - Abrir modal → crear nuevo paciente → selección automática → verificar datos

3. **Flujo de cambio de paciente**:
   - Seleccionar paciente → cambiar paciente → nueva selección → verificar cambio

### E2E Tests

1. **Selección desde pacientes recientes**
2. **Búsqueda avanzada y selección**
3. **Creación de nuevo paciente**
4. **Validación de botón de medicamentos deshabilitado**

## UI/UX Considerations

### Visual Design

1. **Consistencia**: Usar los mismos patrones visuales del sistema existente
2. **Jerarquía**: Clara diferenciación entre estados (sin paciente vs con paciente)
3. **Alertas médicas**: Uso de colores y iconos para destacar información crítica
4. **Accesibilidad**: Contraste adecuado y navegación por teclado

### User Experience

1. **Flujo intuitivo**: Pasos claros y lógicos para selección
2. **Feedback inmediato**: Indicadores de carga y confirmaciones
3. **Búsqueda eficiente**: Resultados en tiempo real y filtros útiles
4. **Información relevante**: Mostrar solo datos necesarios para la decisión

### Responsive Design

1. **Modal adaptativo**: Ajuste de tamaño según dispositivo
2. **Pestañas responsivas**: Iconos en pantallas pequeñas
3. **Información compacta**: Layout optimizado para diferentes tamaños

## Performance Considerations

### Data Loading

1. **Lazy loading**: Cargar pacientes recientes solo cuando se abre el modal
2. **Debounced search**: Evitar búsquedas excesivas durante escritura
3. **Caching**: Mantener resultados de búsqueda en memoria temporal
4. **Pagination**: Limitar resultados por página para mejor rendimiento

### Memory Management

1. **Cleanup**: Limpiar listeners y timers al desmontar componentes
2. **Memoization**: Usar React.memo para componentes que no cambian frecuentemente
3. **State optimization**: Minimizar re-renders innecesarios

## Security Considerations

### Data Protection

1. **Información sensible**: No mostrar datos médicos completos en listas
2. **Validación**: Validar permisos antes de mostrar información de pacientes
3. **Logging**: No registrar información médica en logs del cliente

### Access Control

1. **Autorización**: Verificar permisos del usuario para acceder a pacientes
2. **Filtrado**: Mostrar solo pacientes que el usuario tiene autorización para ver
3. **Audit trail**: Registrar accesos a información de pacientes

## Implementation Notes

### Phase 1: Core Functionality
- Implementar PatientSelectionSection básica
- Modal con pestaña de pacientes recientes
- Integración con PrescriptionPage

### Phase 2: Advanced Features
- Búsqueda avanzada con filtros
- Optimizaciones de rendimiento
- Tests completos

### Phase 3: Enhancements
- Mejoras de UX basadas en feedback
- Funcionalidades adicionales
- Optimizaciones finales

### Dependencies

- Angular 18+
- TypeScript
- RxJS (ya disponible)
- Lucide Angular icons (ya disponible)
- TailwindCSS (ya disponible)
- Angular Reactive Forms

### File Structure

```
src/app/components/patient-selection/
├── patient-selection-section.component.ts
├── patient-selection-section.component.html
├── patient-selection-section.component.css
├── patient-selection-modal.component.ts
├── patient-selection-modal.component.html
├── patient-selection-modal.component.css
├── recent-patients-tab.component.ts
├── recent-patients-tab.component.html
├── advanced-search-tab.component.ts
├── advanced-search-tab.component.html
├── selected-patient-info.component.ts
├── selected-patient-info.component.html
└── selected-patient-info.component.css

src/app/components/new-patient-dialog/ (modificado)
src/app/pages/prescripciones/ (modificado)
src/app/services/
├── patient.service.ts (nuevo)
└── patient-search.service.ts (nuevo)
```