# NewPatientDialogComponent

Componente modal reutilizable para crear nuevos pacientes en el sistema de prescripciones médicas.

## Descripción

Este componente proporciona una interfaz completa para registrar nuevos pacientes con toda la información necesaria organizada en pestañas intuitivas.

## Características

- ✅ **Formularios reactivos** con validaciones en tiempo real
- ✅ **Interfaz por pestañas** para organizar la información
- ✅ **Campos dinámicos** para alergias y medicamentos
- ✅ **Cálculo automático** de edad e IMC
- ✅ **Validaciones completas** de todos los campos
- ✅ **Responsive design** adaptable a móviles
- ✅ **Completamente reutilizable**

## Pestañas incluidas

### 1. **Personal**
- Tipo y número de documento
- Nombres y apellidos
- Fecha de nacimiento (con cálculo automático de edad)
- Género y tipo de sangre

### 2. **Contacto**
- Teléfono y email
- Dirección completa
- Ciudad y país

### 3. **Médica**
- Peso y altura (con cálculo automático de IMC)
- Alergias conocidas (campo dinámico)
- Notas clínicas adicionales

### 4. **Emergencia**
- Contacto de emergencia
- Relación con el paciente
- Teléfono de contacto

## Uso del componente

### 1. Importar en tu módulo o componente

```typescript
import { NewPatientDialogComponent, PatientData } from '../../../components/new-patient-dialog/new-patient-dialog.component';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [NewPatientDialogComponent],
  // ...
})
```

### 2. Usar en el template

```html
<!-- Botón para abrir el modal -->
<button (click)="openNewPatientModal()" class="btn btn-primary">
  Nuevo Paciente
</button>

<!-- Modal de nuevo paciente -->
<app-new-patient-dialog
  [open]="showNewPatientModal"
  (openChange)="onNewPatientModalChange($event)"
  (patientCreated)="onPatientCreated($event)">
</app-new-patient-dialog>
```

### 3. Implementar en el componente padre

```typescript
export class MiComponente {
  showNewPatientModal = false;

  openNewPatientModal() {
    this.showNewPatientModal = true;
  }

  onNewPatientModalChange(open: boolean) {
    this.showNewPatientModal = open;
  }

  onPatientCreated(patient: PatientData) {
    console.log('Nuevo paciente creado:', patient);
    // Manejar el paciente recién creado
    this.showNewPatientModal = false;
    
    // Ejemplo: agregar a una lista
    this.patients.push(patient);
  }
}
```

## API del componente

### Propiedades (@Input)

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `open` | `boolean` | `false` | Controla la visibilidad del modal |

### Eventos (@Output)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `openChange` | `EventEmitter<boolean>` | Emite cuando cambia el estado del modal |
| `patientCreated` | `EventEmitter<PatientData>` | Emite cuando se crea un nuevo paciente |

## Interfaz PatientData

```typescript
interface PatientData {
  id?: string;
  idType: string;
  idNumber: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  fullName?: string;
  birthDate: string;
  age?: number;
  gender: string;
  bloodType?: string;
  occupation?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  country: string;
  weight?: string;
  height?: string;
  bmi?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  clinicalNotes?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceType?: string;
  emergencyContact: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  registrationDate?: string;
}
```

## Validaciones incluidas

### Campos obligatorios
- Tipo de documento
- Número de documento
- Primer nombre
- Primer apellido
- Fecha de nacimiento
- Género
- Teléfono

### Validaciones especiales
- **Email**: Formato válido de correo electrónico
- **Fecha de nacimiento**: Cálculo automático de edad
- **Peso y altura**: Cálculo automático de IMC
- **Teléfono**: Campo requerido para contacto

## Características técnicas

- **Framework**: Angular 18+ standalone component
- **Formularios**: Reactive Forms con FormBuilder
- **Validaciones**: Angular Validators
- **Estilos**: CSS personalizado con TailwindCSS
- **Íconos**: Lucide Angular
- **Accesibilidad**: Estructura semántica y navegación por teclado
- **Responsive**: Adaptable a dispositivos móviles

## Archivos del componente

```
src/app/components/new-patient-dialog/
├── new-patient-dialog.component.ts    # Componente principal
├── new-patient-dialog.component.css   # Estilos del componente
└── README.md                          # Documentación
```

## Dependencias

El componente requiere los siguientes componentes UI:

- `DialogComponent`
- `ButtonComponent`
- `InputComponent`
- `LabelComponent`
- `TextareaComponent`
- `SelectComponent`

## Ejemplo completo de uso

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPatientDialogComponent, PatientData } from '../../../components/new-patient-dialog/new-patient-dialog.component';

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [CommonModule, NewPatientDialogComponent],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Gestión de Pacientes</h1>
      
      <button 
        (click)="openNewPatientModal()" 
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Agregar Nuevo Paciente
      </button>

      <div *ngIf="patients.length > 0" class="mt-6">
        <h2 class="text-lg font-semibold mb-3">Pacientes Registrados</h2>
        <div class="space-y-2">
          <div *ngFor="let patient of patients" class="p-3 border rounded-lg">
            <h3 class="font-medium">{{ patient.fullName }}</h3>
            <p class="text-sm text-gray-600">{{ patient.idType }} {{ patient.idNumber }}</p>
          </div>
        </div>
      </div>

      <app-new-patient-dialog
        [open]="showNewPatientModal"
        (openChange)="onNewPatientModalChange($event)"
        (patientCreated)="onPatientCreated($event)">
      </app-new-patient-dialog>
    </div>
  `
})
export class PatientManagementComponent {
  showNewPatientModal = false;
  patients: PatientData[] = [];

  openNewPatientModal() {
    this.showNewPatientModal = true;
  }

  onNewPatientModalChange(open: boolean) {
    this.showNewPatientModal = open;
  }

  onPatientCreated(patient: PatientData) {
    console.log('Nuevo paciente creado:', patient);
    this.patients.push(patient);
    this.showNewPatientModal = false;
  }
}
```

## Notas importantes

1. **Reutilización**: Este componente puede ser usado en cualquier parte de la aplicación
2. **Validaciones**: Todos los campos tienen validaciones apropiadas
3. **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
4. **Accesibilidad**: Incluye navegación por teclado y etiquetas apropiadas
5. **Mantenimiento**: Código bien estructurado y documentado para fácil mantenimiento