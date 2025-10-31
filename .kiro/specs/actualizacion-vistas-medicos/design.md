# Design Document

## Overview

Este documento describe el diseño técnico para actualizar las vistas del área de médicos en Angular, basándose en la funcionalidad y diseño visual del archivo React existente. La implementación se enfoca en crear una experiencia de usuario moderna y eficiente, manteniendo la consistencia visual con el resto de la aplicación.

## Architecture

### Component Structure

```
src/app/pages/medicos/
├── lista/
│   ├── lista.component.ts
│   ├── lista.component.html
│   └── lista.component.css
├── editar/
│   ├── editar.component.ts
│   ├── editar.component.html
│   └── editar.component.css
└── medicos.component.ts (router outlet)

src/app/components/
├── page-banner/
├── doctor-stats-cards/
├── doctor-search-tabs/
├── doctor-table/
├── doctor-detail-panel/
└── doctor-form/
```

### Data Flow

1. **Mock Data Service**: Servicio que proporciona datos mock estructurados
2. **Search Service**: Manejo de búsquedas y filtros
3. **Component State**: Estado local para UI y interacciones
4. **Event Handling**: Comunicación entre componentes padre e hijo

## Components and Interfaces

### 1. Doctor Interface

```typescript
interface Doctor {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  specialty: string;
  subspecialties: string[];
  licenseNumber: string;
  licenseExpiry: string;
  email: string;
  phone: string;
  officePhone?: string;
  address: string;
  city: string;
  country: string;
  university: string;
  graduationYear: number;
  yearsOfExperience: number;
  certifications: string[];
  totalPrescriptions: number;
  monthlyPrescriptions: number;
  totalPatients: number;
  averageMonthlyPrescriptions: number;
  registrationDate: string;
  lastActivity: string;
  status: 'active' | 'inactive';
  certificationStatus: 'verified' | 'expired' | 'pending';
  isOnDuty: boolean;
  schedule: Array<{
    days: string;
    hours: string;
  }>;
  notes?: string;
}
```

### 2. PageBanner Component

Componente reutilizable para headers visuales con:
- Icono principal
- Título y descripción
- Gradiente de fondo personalizable
- Botón de acción opcional

### 3. DoctorStatsCards Component

Tarjetas de estadísticas que muestran:
- Total de médicos
- Médicos activos/inactivos
- Médicos verificados
- Médicos en turno
- Licencias por vencer

### 4. DoctorSearchTabs Component

Sistema de búsqueda con dos modos:
- **Búsqueda Rápida**: Campo único para búsqueda general
- **Búsqueda Avanzada**: Múltiples filtros específicos

### 5. DoctorTable Component

Tabla responsive con:
- Columnas: Médico, Especialidad, Licencia, Contacto, Experiencia, Recetas, Estado, Acciones
- Doble clic para ver detalles
- Hover effects y estados visuales
- Paginación integrada

### 6. DoctorDetailPanel Component

Panel lateral/modal con información completa:
- Información personal y profesional
- Certificaciones y horarios
- Estadísticas de prescripciones
- Historial de actividad

### 7. DoctorForm Component

Formulario para alta/edición con secciones:
- Información Personal
- Información Profesional
- Certificaciones
- Horarios de Atención
- Permisos y Accesos

## Data Models

### Mock Data Structure

```typescript
const mockDoctors: Doctor[] = [
  {
    id: "DOC-001",
    fullName: "Dr. Carlos Andrés Martínez López",
    firstName: "Carlos Andrés",
    lastName: "Martínez López",
    specialty: "Cardiología",
    subspecialties: ["Electrofisiología", "Cardiopatía isquémica"],
    licenseNumber: "MSP-2015-045678",
    licenseExpiry: "15/06/2026",
    email: "carlos.martinez@hospital.com",
    phone: "+57 310 456-7890",
    // ... resto de propiedades
  },
  // ... más médicos
];
```

### Search and Filter Models

```typescript
interface SearchFilters {
  quickSearch: string;
  nameFilter: string;
  specialtyFilter: string;
  statusFilter: 'all' | 'active' | 'inactive';
  certificationFilter: 'all' | 'verified' | 'expired' | 'pending';
  licenseFilter: string;
  universityFilter: string;
  minExperience: number | null;
  maxExperience: number | null;
}

interface SearchMode {
  mode: 'quick' | 'advanced';
}
```

## Error Handling

### Validation Rules

1. **Campos Requeridos**: Nombre, email, especialidad, licencia
2. **Formato de Email**: Validación de formato válido
3. **Formato de Teléfono**: Validación de formato local
4. **Fechas**: Validación de fechas de vencimiento futuras
5. **Experiencia**: Números positivos y rangos lógicos

### Error Display

- Mensajes de error específicos por campo
- Toast notifications para operaciones
- Estados de error visual en formularios
- Mensajes informativos para búsquedas sin resultados

## Testing Strategy

### Unit Testing

1. **Component Testing**:
   - Renderizado correcto de componentes
   - Manejo de props y eventos
   - Estados de carga y error

2. **Service Testing**:
   - Filtrado y búsqueda de datos
   - Validaciones de formulario
   - Transformación de datos

3. **Integration Testing**:
   - Flujo completo de búsqueda
   - Creación y edición de médicos
   - Navegación entre vistas

### Test Data

```typescript
const testDoctors = [
  {
    id: "TEST-001",
    fullName: "Dr. Test Médico",
    specialty: "Medicina General",
    status: "active",
    // ... propiedades mínimas para testing
  }
];
```

## UI/UX Design Patterns

### Visual Hierarchy

1. **Header Banner**: Gradiente azul-verde con información principal
2. **Stats Cards**: Tarjetas con bordes de color y iconos específicos
3. **Search Section**: Tabs claros con formularios bien organizados
4. **Data Table**: Filas hover, avatares, badges de estado
5. **Forms**: Secciones agrupadas con labels claros

### Color Scheme

- **Primary**: Azul (#2563eb) para acciones principales
- **Success**: Verde (#16a34a) para estados activos
- **Warning**: Naranja (#ea580c) para alertas
- **Error**: Rojo (#dc2626) para errores
- **Gray**: Escala de grises para texto y bordes

### Typography

- **Headers**: font-bold, tamaños escalados (text-2xl, text-lg)
- **Body**: font-medium para labels, font-normal para contenido
- **Small Text**: text-sm para información secundaria

### Spacing and Layout

- **Container**: max-width con padding responsive
- **Grid**: CSS Grid para layouts complejos
- **Flexbox**: Para alineación y distribución
- **Spacing**: Sistema de espaciado consistente (space-y-6, gap-4)

## Responsive Design

### Breakpoints

- **Mobile**: < 768px - Stack vertical, menús colapsados
- **Tablet**: 768px - 1024px - Grid 2 columnas, navegación adaptada
- **Desktop**: > 1024px - Grid completo, todas las funcionalidades

### Mobile Adaptations

1. **Stats Cards**: Stack vertical en mobile
2. **Search**: Tabs apilados, filtros en modal
3. **Table**: Scroll horizontal con columnas prioritarias
4. **Forms**: Campos apilados, botones full-width

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Componentes cargados bajo demanda
2. **Virtual Scrolling**: Para listas grandes de médicos
3. **Debounced Search**: Búsqueda con delay para reducir llamadas
4. **Memoization**: Cache de resultados de búsqueda
5. **Image Optimization**: Avatares optimizados y lazy loading

### Bundle Size

- Componentes standalone para tree-shaking
- Imports específicos de Lucide icons
- CSS purging para Tailwind

## Accessibility

### WCAG Compliance

1. **Keyboard Navigation**: Tab order lógico
2. **Screen Readers**: Labels y aria-labels apropiados
3. **Color Contrast**: Cumplimiento de ratios mínimos
4. **Focus Management**: Indicadores visuales claros
5. **Semantic HTML**: Estructura semántica correcta

### Implementation Details

- `role` attributes para componentes complejos
- `aria-label` para iconos y botones
- `aria-describedby` para mensajes de error
- `tabindex` para navegación personalizada