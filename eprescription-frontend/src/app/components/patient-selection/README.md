# Patient Selection Component

Este componente implementa la funcionalidad de selección de pacientes para el sistema de prescripciones médicas.

## Archivos creados

- `patient-selection-section.component.ts` - Componente principal
- `patient-selection-section.component.css` - Estilos del componente
- `../../interfaces/patient.interface.ts` - Interfaces TypeScript

## Uso del componente

### 1. Importar en tu módulo o componente

```typescript
import { PatientSelectionSectionComponent } from './components/patient-selection/patient-selection-section.component';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [PatientSelectionSectionComponent],
  // ...
})
```

### 2. Usar en el template

```html
<app-patient-selection-section
  [selectedPatient]="selectedPatient"
  (selectPatient)="onSelectPatient()"
  (changePatient)="onChangePatient()">
</app-patient-selection-section>
```

### 3. Implementar en el componente padre

```typescript
export class PrescriptionComponent {
  selectedPatient: PatientData | null = null;

  onSelectPatient(): void {
    // Abrir modal de selección de paciente
    // this.openPatientSelectionModal();
  }

  onChangePatient(): void {
    // Cambiar paciente seleccionado
    this.selectedPatient = null;
    // this.openPatientSelectionModal();
  }
}
```

## Funcionalidades implementadas

### ✅ Estado vacío (Sub-tarea 2.1)
- Muestra mensaje "Seleccione un paciente" cuando no hay paciente seleccionado
- Botón "Seleccionar Paciente" que emite evento `selectPatient`
- Estilo con borde punteado e ícono informativo
- **Requisitos cumplidos:** 1.1, 1.2, 1.3

### ✅ Información del paciente seleccionado (Sub-tarea 2.2)
- Muestra información completa del paciente cuando está seleccionado
- Datos básicos: nombre, ID, edad, sexo, tipo de sangre
- Información de contacto: teléfono, email, dirección
- Botón "Cambiar paciente" que emite evento `changePatient`
- **Requisitos cumplidos:** 4.1, 4.2, 5.1

### ✅ Alertas médicas (Sub-tarea 2.3)
- **Alergias:** Sección roja con íconos de advertencia
- **Condiciones crónicas:** Sección naranja con íconos de corazón
- **Medicación actual:** Sección azul con íconos de pastillas
- Badges con colores apropiados y efectos hover
- **Requisitos cumplidos:** 4.3, 4.4, 4.5, 4.6

## Características técnicas

- **Framework:** Angular 18+ standalone component
- **Estilos:** CSS puro con diseño responsive
- **Íconos:** SVG inline (compatible con Lucide React icons)
- **Accesibilidad:** Estructura semántica y colores contrastantes
- **Responsive:** Adaptable a dispositivos móviles

## Ejemplo de datos de paciente

```typescript
const mockPatient: PatientData = {
  id: "1",
  fullName: "María Elena González Rodríguez",
  firstName: "María Elena",
  firstLastName: "González",
  secondLastName: "Rodríguez",
  idType: "CC",
  idNumber: "52.841.963",
  birthDate: "1978-03-15",
  age: 45,
  gender: "F",
  bloodType: "O+",
  phone: "+506 8888-9999",
  email: "maria.gonzalez@email.com",
  address: "San José, Costa Rica",
  city: "San José",
  country: "Costa Rica",
  allergies: ["Penicilina", "Mariscos"],
  chronicConditions: ["Hipertensión", "Diabetes Tipo 2"],
  currentMedications: ["Losartán 50mg", "Metformina 850mg"],
  registrationDate: "2023-01-15",
  status: "active"
};
```

## Integración con el sistema

Este componente está diseñado para integrarse con:

1. **Modal de selección de pacientes** (próxima tarea)
2. **Sistema de prescripciones médicas**
3. **Base de datos de pacientes**
4. **Sistema de alertas médicas**

## PatientSelectionModalComponent

### ✅ Modal de selección de pacientes (Tarea 3)
- **Archivo:** `patient-selection-modal.component.ts`
- **Propósito:** Modal con pestañas para búsqueda y selección de pacientes

#### Funcionalidades implementadas:

**Sub-tarea 3.1 - Modal shell:**
- Modal usando componentes UI existentes del proyecto
- Navegación por pestañas: "Pacientes Recientes" y "Búsqueda Avanzada"
- Header con título e ícono descriptivo
- Manejo de estado de apertura/cierre con @Input() y @Output()
- **Requisitos cumplidos:** 2.1, 2.2

**Sub-tarea 3.2 - Footer con "Nuevo Paciente":**
- Footer con contador de pacientes totales
- Botón "Nuevo Paciente" que abre NewPatientDialogComponent
- Manejo de estado entre modales padre e hijo
- Selección automática del paciente recién creado
- Cierre automático de ambos modales tras creación exitosa
- **Requisitos cumplidos:** 3.1, 3.2

#### Uso del componente:

```typescript
// En el componente padre
@Component({
  template: `
    <app-patient-selection-modal
      [isOpen]="showPatientModal"
      (closeModal)="onCloseModal()"
      (patientSelected)="onPatientSelected($event)"
      (newPatientRequested)="onNewPatientRequested()">
    </app-patient-selection-modal>
  `
})
export class ParentComponent {
  showPatientModal = false;

  onCloseModal(): void {
    this.showPatientModal = false;
  }

  onPatientSelected(patient: PatientData): void {
    this.selectedPatient = patient;
    this.showPatientModal = false;
  }
}
```

#### Características técnicas:
- **Integración:** Usa NewPatientDialogComponent existente
- **Servicios:** Conectado con PatientService para conteo de pacientes
- **Estado:** Manejo completo del ciclo de vida de modales anidados
- **Responsive:** Adaptable a diferentes tamaños de pantalla

## Próximos pasos

- Implementar RecentPatientsTabComponent
- Implementar AdvancedSearchTabComponent  
- Conectar con servicios de datos reales
- Agregar funcionalidad de búsqueda en tiempo real
## Adv
ancedSearchTabComponent

### ✅ Búsqueda avanzada de pacientes (Tarea 5)
- **Archivo:** `advanced-search-tab.component.ts`
- **Propósito:** Pestaña de búsqueda avanzada con formularios reactivos y RxJS

#### Funcionalidades implementadas:

**Sub-tarea 5.1 - Interfaz de búsqueda con Reactive Forms:**
- Formulario reactivo usando Angular FormBuilder
- Dropdown para criterios de búsqueda (nombre, ID, teléfono, email)
- Validación de mínimo 2 caracteres con Validators
- Template HTML con controles de formulario y mensajes de validación
- **Requisitos cumplidos:** 2.4

**Sub-tarea 5.2 - Visualización de resultados con RxJS:**
- Resultados de búsqueda en formato de tarjetas similar a pacientes recientes
- Mensaje "No se encontraron pacientes" cuando corresponde
- Estado de carga durante búsqueda usando async pipe
- Búsqueda con debounce implementada usando operadores RxJS
- **Requisitos cumplidos:** 2.4

#### Características técnicas:

**Formularios reactivos:**
```typescript
searchForm = this.fb.group({
  searchCriteria: ['name', [Validators.required]],
  searchQuery: ['', [Validators.required, Validators.minLength(2)]]
});
```

**Integración con PatientSearchService:**
- Búsqueda reactiva con debounceTime(300ms) y distinctUntilChanged
- Manejo de estado de carga y resultados
- Validación de consultas y mensajes de error
- Placeholder dinámico según criterio seleccionado

**Estados de la interfaz:**
- **Estado inicial:** Mensaje informativo sobre búsqueda avanzada
- **Estado de carga:** Spinner animado durante búsqueda
- **Resultados encontrados:** Tarjetas de pacientes con información médica
- **Sin resultados:** Mensaje con sugerencias para mejorar búsqueda
- **Validación:** Mensajes de error para entrada inválida

**Indicadores de alertas médicas:**
- **Alergias:** Badge rojo con ícono de advertencia
- **Condiciones crónicas:** Badge naranja con ícono de información
- **Medicamentos actuales:** Badge azul con ícono de pastilla

#### Uso del componente:

```typescript
// Integrado en PatientSelectionModalComponent
<app-tabs-content value="search" [isActive]="activeTab === 'search'">
  <app-advanced-search-tab
    (patientSelected)="onSearchPatientSelected($event)">
  </app-advanced-search-tab>
</app-tabs-content>
```

#### Criterios de búsqueda disponibles:
- **Nombre:** Búsqueda por nombre completo del paciente
- **Número de Identificación:** Búsqueda por cédula o documento
- **Teléfono:** Búsqueda por número de teléfono
- **Correo Electrónico:** Búsqueda por dirección de email

#### Validaciones implementadas:
- Campo requerido para criterio de búsqueda
- Mínimo 2 caracteres para término de búsqueda
- Mensajes de error contextuales
- Texto de ayuda dinámico

#### Integración con servicios:
- **PatientSearchService:** Manejo reactivo de búsquedas
- **PatientService:** Acceso a datos de pacientes con filtrado
- **Conversión de tipos:** Manejo de interfaces PatientData compatibles

## Estado actual del proyecto

### ✅ Componentes completados:
1. **PatientSelectionSectionComponent** - Sección principal de selección
2. **PatientSelectionModalComponent** - Modal con pestañas
3. **RecentPatientsTabComponent** - Pestaña de pacientes recientes  
4. **AdvancedSearchTabComponent** - Pestaña de búsqueda avanzada

### ✅ Servicios implementados:
1. **PatientService** - Gestión de datos de pacientes con mock data
2. **PatientSearchService** - Búsqueda reactiva con RxJS

### ✅ Funcionalidades principales:
- Selección de pacientes desde lista reciente
- Búsqueda avanzada con múltiples criterios
- Creación de nuevos pacientes integrada
- Visualización de alertas médicas
- Estados de carga y error
- Validación de formularios
- Diseño responsive con TailwindCSS

### 🔄 Próximas tareas:
- Integración con componente de prescripciones
- Control de botón "Agregar Medicamento"
- Pruebas de integración completas
- Optimizaciones de rendimiento