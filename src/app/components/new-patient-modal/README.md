# New Patient Modal Component

## Descripción

Componente modal completo para crear nuevos pacientes con toda la información necesaria. Este modal incluye múltiples tabs organizados para capturar información personal, contacto, médica y contacto de emergencia.

## Características

### Información Capturada por Tabs

#### 1. **Información Personal**
- Primer y segundo nombre (primer nombre obligatorio)
- Primer y segundo apellido (primer apellido obligatorio)
- Tipo y número de documento (obligatorios)
- Fecha de nacimiento (obligatoria) con cálculo automático de edad
- Género (obligatorio)
- Tipo de sangre

#### 2. **Información de Contacto**
- Teléfono (obligatorio)
- Correo electrónico con validación
- Dirección de residencia
- Ciudad y país

#### 3. **Información Médica**
- Peso y altura con cálculo automático de IMC
- Alergias conocidas (dinámicas)
- Condiciones crónicas (dinámicas)
- Medicación actual (dinámicas)
- Notas clínicas adicionales

#### 4. **Contacto de Emergencia**
- Nombre completo del contacto
- Relación con el paciente
- Teléfono de emergencia

### Funcionalidades
- **Navegación por tabs**: 4 tabs organizados con indicadores visuales de validación
- **Validación en tiempo real**: Campos obligatorios con feedback visual inmediato
- **Gestión dinámica**: Agregar/quitar alergias, condiciones crónicas y medicamentos
- **Cálculos automáticos**: Edad basada en fecha de nacimiento e IMC basado en peso/altura
- **Interfaz responsive**: Optimizada para móvil y desktop
- **Estados visuales**: Indicadores de éxito/error en cada tab
- **Navegación inteligente**: Botones anterior/siguiente con validación automática
- **Integración completa**: Con sistema de toast y servicios

## Uso

```typescript
// En el componente padre
import { NewPatientModalComponent } from './components/new-patient-modal/new-patient-modal.component';

// En el template
<app-new-patient-modal
  *ngIf="isNewPatientModalVisible"
  (close)="onCloseNewPatientModal()"
  (patientCreated)="onPatientCreated($event)">
</app-new-patient-modal>

// En el componente
isNewPatientModalVisible = false;

onNewPatient() {
  this.isNewPatientModalVisible = true;
}

onCloseNewPatientModal() {
  this.isNewPatientModalVisible = false;
}

onPatientCreated(patientData: PatientData) {
  // Manejar el nuevo paciente creado
  console.log('Nuevo paciente:', patientData);
}
```

## Eventos

### Outputs
- `close`: Se emite cuando el usuario cierra el modal
- `patientCreated`: Se emite cuando se crea exitosamente un paciente, incluye los datos del paciente

## Arquitectura del Modal

### Estructura de Tabs
1. **Personal** → **Contacto** → **Médica** → **Emergencia**
2. Cada tab tiene validación independiente con indicadores visuales
3. Navegación secuencial con botones anterior/siguiente
4. Validación automática al intentar enviar el formulario

### Gestión de Estado
- **FormGroup reactivo** con validaciones integradas
- **Arrays dinámicos** para alergias, condiciones crónicas y medicamentos
- **Estados visuales** para cada tab (none/success/error)
- **Navegación inteligente** que lleva al primer tab con errores

## Validaciones por Tab

### Tab Personal (Obligatorios)
- **Primer Nombre**: Requerido, mínimo 2 caracteres
- **Primer Apellido**: Requerido, mínimo 2 caracteres  
- **Número de Documento**: Requerido
- **Fecha de Nacimiento**: Requerida
- **Género**: Requerido

### Tab Contacto (Obligatorios)
- **Teléfono**: Requerido

### Validaciones Adicionales
- **Email**: Formato válido cuando se proporciona
- **Peso**: Entre 1 y 500 kg cuando se proporciona
- **Altura**: Entre 0.5 y 3 metros cuando se proporciona
- **Campos dinámicos**: No duplicados en arrays

## Funcionalidades Especiales

### Cálculos Automáticos
- **Edad**: Se calcula automáticamente basada en la fecha de nacimiento
- **IMC**: Se calcula automáticamente cuando se proporcionan peso y altura

### Gestión Dinámica
- **Alergias**: Agregar/quitar con validación de duplicados
- **Condiciones Crónicas**: Gestión similar a alergias
- **Medicamentos Actuales**: Lista dinámica con iconos

### Experiencia de Usuario
- **Navegación fluida**: Transiciones suaves entre tabs
- **Feedback visual**: Indicadores de estado en tiempo real
- **Responsive design**: Adaptado para móvil y desktop
- **Accesibilidad**: Labels apropiados y navegación por teclado

## Flujo Completo

1. **Inicio**: Usuario hace clic en "Nuevo Paciente" desde la lista
2. **Tab Personal**: Completa información básica de identificación
3. **Tab Contacto**: Agrega información de contacto y ubicación
4. **Tab Médica**: Registra información médica, alergias y medicamentos
5. **Tab Emergencia**: Configura contacto de emergencia (opcional)
6. **Envío**: Validación completa y creación del paciente
7. **Finalización**: Notificación de éxito, cierre del modal y actualización de lista

### Navegación Inteligente
- **Indicadores visuales**: Cada tab muestra su estado de validación
- **Navegación automática**: Al enviar, va al primer tab con errores
- **Botones contextuales**: Anterior/Siguiente adaptativos por tab
- **Validación progresiva**: Permite guardar con información mínima completa

## Integración

### Datos Generados
El modal genera un objeto `PatientData` completo con:
- ID único generado automáticamente
- Nombre completo construido automáticamente
- Edad calculada
- IMC calculado (si aplica)
- Arrays de alergias, condiciones y medicamentos
- Contacto de emergencia estructurado
- Fecha de registro automática
- Estado activo por defecto

### Compatibilidad
- Compatible con el sistema de interfaces existente
- Integración con servicios de pacientes
- Preparado para validaciones adicionales
- Arquitectura modular y extensible

## Notas de Implementación

### Rendimiento
- Modal se monta/desmonta dinámicamente
- Validación reactiva optimizada
- Arrays dinámicos con gestión eficiente de memoria

### Experiencia de Usuario
- Navegación fluida entre tabs
- Feedback visual inmediato
- Estados de carga durante operaciones
- Gestión inteligente de errores
- Responsive design completo

### Mantenibilidad
- Código modular y bien estructurado
- Separación clara de responsabilidades
- Fácil extensión para nuevos campos
- Documentación completa integrada