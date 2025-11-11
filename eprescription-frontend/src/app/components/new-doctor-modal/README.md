# New Doctor Modal Component

## Descripción

Componente modal completo para crear nuevos médicos con toda la información necesaria. Este modal incluye múltiples tabs organizados para capturar información personal, contacto, formación, licencias, horarios y configuración de permisos.

## Características

### Información Capturada por Tabs

#### 1. **Información Personal**
- Nombres y apellidos (obligatorios)
- Tipo y número de documento (obligatorio)
- Fecha de nacimiento
- Género

#### 2. **Información de Contacto**
- Correo electrónico (obligatorio)
- Teléfono personal (obligatorio)
- Teléfono de oficina
- Dirección del consultorio
- Ciudad y país

#### 3. **Formación Académica**
- Especialidad principal (obligatoria)
- Subespecialidades (dinámicas)
- Universidad
- Año de graduación

#### 4. **Licencias y Certificaciones**
- Número de licencia médica (obligatorio)
- Fecha de vencimiento
- Entidad emisora
- Certificaciones adicionales (dinámicas)

#### 5. **Horarios de Atención**
- Horarios configurables por días
- Múltiples horarios por médico
- Gestión dinámica de horarios

#### 6. **Configuración y Permisos**
- Permisos de prescripción
- Permisos administrativos
- Estado del usuario (activo/inactivo, en turno)

### Funcionalidades
- **Navegación por tabs**: 6 tabs organizados con indicadores visuales de validación
- **Validación en tiempo real**: Campos obligatorios con feedback visual inmediato
- **Gestión dinámica**: Agregar/quitar subespecialidades, certificaciones y horarios
- **Interfaz responsive**: Optimizada para móvil y desktop
- **Navegación inteligente**: Botones anterior/siguiente con validación automática
- **Estados visuales**: Indicadores de éxito/error en cada tab
- **Animaciones suaves**: Transiciones entre tabs y estados de carga
- **Cierre seguro**: Por backdrop, botón X o navegación
- **Integración completa**: Con sistema de toast y servicios

## Uso

```typescript
// En el componente padre
import { NewDoctorModalComponent } from './components/new-doctor-modal/new-doctor-modal.component';

// En el template
<app-new-doctor-modal
  *ngIf="isNewDoctorModalVisible"
  (close)="onCloseNewDoctorModal()"
  (doctorCreated)="onDoctorCreated($event)">
</app-new-doctor-modal>

// En el componente
isNewDoctorModalVisible = false;

onNewDoctor() {
  this.isNewDoctorModalVisible = true;
}

onCloseNewDoctorModal() {
  this.isNewDoctorModalVisible = false;
}

onDoctorCreated(doctorData: any) {
  // Manejar el nuevo médico creado
  console.log('Nuevo médico:', doctorData);
}
```

## Eventos

### Outputs
- `close`: Se emite cuando el usuario cierra el modal
- `doctorCreated`: Se emite cuando se crea exitosamente un médico, incluye los datos del médico

## Arquitectura del Modal

### Estructura de Tabs
1. **Personal** → **Contacto** → **Formación** → **Licencias** → **Horarios** → **Config**
2. Cada tab tiene validación independiente con indicadores visuales
3. Navegación secuencial con botones anterior/siguiente
4. Validación automática al intentar enviar el formulario

### Gestión de Estado
- **FormGroup reactivo** con validaciones integradas
- **Arrays dinámicos** para subespecialidades, certificaciones y horarios
- **Estados visuales** para cada tab (none/success/error)
- **Navegación inteligente** que lleva al primer tab con errores

## Validaciones por Tab

### Tab Personal (Obligatorios)
- **Nombres**: Requerido, mínimo 2 caracteres
- **Apellidos**: Requerido, mínimo 2 caracteres  
- **Número de Documento**: Requerido

### Tab Contacto (Obligatorios)
- **Email**: Requerido, formato de email válido
- **Teléfono**: Requerido

### Tab Formación (Obligatorios)
- **Especialidad**: Requerido, selección de lista predefinida

### Tab Licencias (Obligatorios)
- **Número de Licencia**: Requerido

### Validaciones Adicionales
- **Año de Graduación**: Entre 1950 y año actual
- **Campos dinámicos**: No duplicados en arrays
- **Navegación**: No permite avanzar con errores críticos

## Estilos

El componente utiliza:
- Tailwind CSS para estilos base
- Animaciones CSS personalizadas
- Sistema de colores médico consistente
- Responsive design con breakpoints móviles

## Integración

Este componente está integrado en:
- `ListaMedicosComponent` - Para crear nuevos médicos desde la lista
- Sistema de toast para notificaciones de éxito/error
- Servicio de médicos para persistencia de datos

## Flujo Completo

1. **Inicio**: Usuario hace clic en "Nuevo Médico" desde la lista
2. **Tab Personal**: Completa información básica de identificación
3. **Tab Contacto**: Agrega información de contacto y ubicación
4. **Tab Formación**: Selecciona especialidad y agrega subespecialidades
5. **Tab Licencias**: Ingresa licencia médica y certificaciones
6. **Tab Horarios**: Configura horarios de atención (opcional)
7. **Tab Config**: Establece permisos y configuración del usuario
8. **Envío**: Validación completa y creación del médico
9. **Finalización**: Notificación de éxito, cierre del modal y actualización de lista

### Navegación Inteligente
- **Indicadores visuales**: Cada tab muestra su estado de validación
- **Navegación automática**: Al enviar, va al primer tab con errores
- **Botones contextuales**: Anterior/Siguiente adaptativos por tab
- **Validación progresiva**: Permite guardar con información mínima completa

## Notas de Implementación

### Rendimiento
- Modal se monta/desmonta dinámicamente
- Validación reactiva optimizada
- Arrays dinámicos con gestión eficiente de memoria

### Datos y Persistencia
- Validación completa en frontend
- Preparación de datos para backend
- Generación automática de avatar basado en nombre
- Permisos básicos asignados por defecto
- ID temporal hasta persistencia real

### Experiencia de Usuario
- Navegación fluida entre tabs
- Feedback visual inmediato
- Estados de carga durante operaciones
- Gestión inteligente de errores
- Responsive design completo

### Integración
- Compatible con sistema de toast existente
- Integración con servicios de médicos
- Preparado para futuras extensiones
- Arquitectura modular y mantenible