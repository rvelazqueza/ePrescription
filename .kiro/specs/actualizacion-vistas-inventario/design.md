# Design Document

## Overview

Este documento describe el diseño para la actualización de las 6 vistas principales de farmacia e inventario en la aplicación Angular: Stock, Alertas, Ajustes, Lotes, Farmacias y Consulta de Inventario. El diseño se basa en los archivos React `InventarioPage.tsx`, `FarmaciasPage.tsx` y `ConsultaInventarioPage.tsx`, manteniendo consistencia visual con el resto de la aplicación, especialmente con el estilo de tablas implementado en la vista de recetas.

## Architecture

### Component Structure

```
src/app/pages/inventario/
├── stock/
│   ├── stock.component.ts
│   ├── stock.component.html
│   └── stock.component.css
├── alertas/
│   ├── alertas.component.ts
│   ├── alertas.component.html
│   └── alertas.component.css
├── ajustes/
│   ├── ajustes.component.ts
│   ├── ajustes.component.html
│   └── ajustes.component.css
├── lotes/
│   ├── lotes.component.ts
│   ├── lotes.component.html
│   └── lotes.component.css
├── consulta/
│   ├── consulta.component.ts
│   ├── consulta.component.html
│   └── consulta.component.css
└── shared/
    ├── inventory-mock.service.ts
    ├── pharmacy-mock.service.ts
    └── inventory.interfaces.ts

src/app/pages/farmacias/
├── lista/
│   ├── lista.component.ts
│   ├── lista.component.html
│   └── lista.component.css
└── shared/
    └── pharmacy.interfaces.ts
```

### Shared Services

- **InventoryMockService**: Servicio que proporciona los datos mock del archivo InventarioPage.tsx
- **PharmacyMockService**: Servicio que proporciona los datos mock del archivo FarmaciasPage.tsx
- **Interfaces**: Definiciones de tipos TypeScript para los datos de inventario y farmacias

## Components and Interfaces

### 1. Stock Component

**Funcionalidad Principal:**
- Visualización de inventario completo de medicamentos
- Filtros por estado, categoría y búsqueda de texto
- Cards de estadísticas por estado
- Tabla responsive con información detallada
- Panel de detalles al hacer doble clic

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Header Banner (Gradient Purple)         │
├─────────────────────────────────────────┤
│ Stats Cards (6 cards in grid)          │
├─────────────────────────────────────────┤
│ Search & Filters Bar                    │
├─────────────────────────────────────────┤
│ Inventory Table                         │
│ - Medicamento | Ubicación | Stock       │
│ - Min/Max | Estado | Días | Valor       │
│ - Último movimiento | Acciones          │
└─────────────────────────────────────────┘
```

### 2. Alertas Component

**Funcionalidad Principal:**
- Lista de alertas de stock bajo ordenadas por prioridad
- Filtros por prioridad, estado, farmacia y fecha
- Cards de estadísticas de alertas
- Acciones para resolver o ignorar alertas

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Header Banner (Gradient Red)            │
├─────────────────────────────────────────┤
│ Stats Cards (4 cards)                   │
├─────────────────────────────────────────┤
│ Filters Bar                             │
├─────────────────────────────────────────┤
│ Alerts List                             │
│ - Priority badges                       │
│ - Medicine info                         │
│ - Action buttons                        │
└─────────────────────────────────────────┘
```

### 3. Ajustes Component

**Funcionalidad Principal:**
- Historial de todos los movimientos de stock
- Filtros por tipo, fecha, medicamento y responsable
- Cards de estadísticas de movimientos
- Información detallada de cada ajuste

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Header Banner (Gradient Orange)         │
├─────────────────────────────────────────┤
│ Stats Cards (4 cards)                   │
├─────────────────────────────────────────┤
│ Filters Bar                             │
├─────────────────────────────────────────┤
│ Adjustments Table                       │
│ - Fecha | Tipo | Medicamento            │
│ - Cantidad | Motivo | Responsable       │
│ - Estado | Acciones                     │
└─────────────────────────────────────────┘
```

### 4. Lotes Component

**Funcionalidad Principal:**
- Gestión de lotes y fechas de vencimiento
- Filtros por estado, medicamento y fechas
- Cards de estadísticas de lotes
- Alertas visuales para lotes próximos a vencer

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Header Banner (Gradient Green)          │
├─────────────────────────────────────────┤
│ Stats Cards (4 cards)                   │
├─────────────────────────────────────────┤
│ Filters Bar                             │
├─────────────────────────────────────────┤
│ Batches Table                           │
│ - Lote | Medicamento | Proveedor        │
│ - Fechas | Cantidades | Estado          │
│ - Ubicación | Acciones                  │
└─────────────────────────────────────────┘
```

### 5. Farmacias Component

**Funcionalidad Principal:**
- Gestión completa de farmacias registradas
- Filtros por provincia, estado y búsqueda de texto
- Información detallada con ubicación geográfica de Costa Rica
- Modales para ver detalles, crear y editar farmacias

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Header Banner (Gradient Blue)           │
├─────────────────────────────────────────┤
│ Search & Filters Bar                    │
├─────────────────────────────────────────┤
│ Pharmacies Table                        │
│ - Código | Nombre | Ubicación           │
│ - Dirección | Teléfono | Estado         │
│ - Acciones (Ver/Editar/Eliminar)        │
└─────────────────────────────────────────┘
```

### 6. Consulta Inventario Component

**Funcionalidad Principal:**
- Consulta de inventario por farmacia
- Filtros por farmacia, nivel de stock y búsqueda
- Cards de estadísticas por nivel de stock
- Comparación de stocks entre farmacias

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Header Banner (Gradient Teal)           │
├─────────────────────────────────────────┤
│ Search & Filters Bar                    │
├─────────────────────────────────────────┤
│ Inventory Query Table                   │
│ - Medicamento | Farmacia | Ubicación    │
│ - Stock | Estado | Información          │
├─────────────────────────────────────────┤
│ Stats Cards (4 cards)                   │
└─────────────────────────────────────────┘
```

## Data Models

### Inventory Item Interface
```typescript
interface InventoryItem {
  id: string;
  medicineId: string;
  medicineName: string;
  presentation: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  totalValue: number;
  location: string;
  supplier: string;
  lastRestockDate: string;
  lastMovementDate: string;
  status: 'adequate' | 'low' | 'critical' | 'out' | 'overstocked';
  activeSubstance: string;
  averageConsumption: number;
  daysOfStock: number;
  batches: number;
  nearestExpiry: string;
}
```

### Stock Alert Interface
```typescript
interface StockAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  presentation: string;
  currentStock: number;
  minStock: number;
  status: 'out' | 'critical' | 'low';
  priority: 'critical' | 'high' | 'medium';
  daysWithoutStock: number;
  affectedPrescriptions: number;
  estimatedDemand: number;
  suggestedOrder: number;
  lastRestockDate: string;
  supplier: string;
  location: string;
  category: string;
}
```

### Stock Adjustment Interface
```typescript
interface StockAdjustment {
  id: string;
  date: string;
  time: string;
  type: 'entry' | 'exit' | 'adjustment';
  medicineId: string;
  medicineName: string;
  presentation: string;
  quantity: number;
  reason: string;
  previousStock: number;
  newStock: number;
  unitCost: number;
  totalValue: number;
  responsible: string;
  documentNumber: string;
  supplier: string;
  batch: string;
  expiryDate: string;
  notes: string;
  status: 'approved' | 'pending' | 'rejected';
}
```

### Batch Interface
```typescript
interface Batch {
  id: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  presentation: string;
  supplier: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  remainingQuantity: number;
  location: string;
  status: 'active' | 'near_expiry' | 'expired';
  daysToExpiry: number;
  unitCost: number;
  totalValue: number;
  entryDate: string;
  documentNumber: string;
}
```

### Pharmacy Interface
```typescript
interface Pharmacy {
  id: string;
  codigo: string;
  nombre: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  email: string;
  responsable: string;
  cedulaResponsable: string;
  estado: 'activa' | 'inactiva' | 'suspendida';
  fechaRegistro: string;
  horario: string;
  observaciones: string;
}
```

### Inventory Query Interface
```typescript
interface InventoryQuery {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  medicamentoCodigo: string;
  presentacion: string;
  farmaciaId: string;
  farmaciaNombre: string;
  farmaciaCode: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  stock: number;
  stockMinimo: number;
  stockMaximo: number;
  lote: string;
  fechaVencimiento: string;
  ultimaActualizacion: string;
}
```

## Design System Integration

### Color Palette
- **Primary**: Medical Blue (#3b82f6) - Para elementos principales
- **Success**: Medical Green (#22c55e) - Para estados positivos
- **Warning**: Medical Orange (#f97316) - Para alertas y advertencias
- **Error**: Medical Red (#ef4444) - Para estados críticos y errores
- **Neutral**: Medical Gray - Para texto y elementos secundarios

### Status Badge Colors
```css
.status-adequate { @apply bg-green-100 text-green-700 border-green-300; }
.status-low { @apply bg-yellow-100 text-yellow-700 border-yellow-300; }
.status-critical { @apply bg-orange-100 text-orange-700 border-orange-300; }
.status-out { @apply bg-red-100 text-red-700 border-red-300; }
.status-overstocked { @apply bg-blue-100 text-blue-700 border-blue-300; }
```

### Table Styling
Basado en el estilo de la vista de recetas:
```css
.inventory-table {
  @apply w-full min-w-[1200px];
}

.inventory-table thead {
  @apply bg-gray-50 sticky top-0;
}

.inventory-table th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.inventory-table td {
  @apply px-6 py-4 whitespace-nowrap;
}

.inventory-table tr:hover {
  @apply bg-blue-50/50 cursor-pointer transition-all;
}
```

### Header Banners
Cada vista tendrá un header con gradiente distintivo:
- **Stock**: Purple gradient (`from-purple-600 via-purple-500 to-purple-700`)
- **Alertas**: Red gradient (`from-red-600 via-red-500 to-red-700`)
- **Ajustes**: Orange gradient (`from-orange-600 via-orange-500 to-orange-700`)
- **Lotes**: Green gradient (`from-green-600 via-green-500 to-green-700`)
- **Farmacias**: Blue gradient (`from-blue-600 via-blue-500 to-blue-700`)
- **Consulta**: Teal gradient (`from-teal-600 via-teal-500 to-teal-700`)

## Error Handling

### Empty States
Cada vista incluirá estados vacíos informativos:
```html
<div class="text-center py-12">
  <lucide-icon [img]="iconName" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
  <h3 class="font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
  <p class="text-sm text-gray-600">Mensaje específico del contexto</p>
</div>
```

### Loading States
Estados de carga consistentes:
```html
<div class="flex justify-center items-center py-12">
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  <span class="ml-2 text-gray-600">Cargando...</span>
</div>
```

## Testing Strategy

### Unit Testing
- Componentes individuales con datos mock
- Funciones de filtrado y búsqueda
- Cálculos de estadísticas
- Formateo de datos

### Integration Testing
- Navegación entre vistas
- Consistencia de datos entre componentes
- Responsive design en diferentes tamaños de pantalla

### Accessibility Testing
- Navegación por teclado
- Screen readers
- Contraste de colores
- ARIA labels apropiados

## Performance Considerations

### Optimization Strategies
- **Virtual Scrolling**: Para tablas con muchos registros
- **Lazy Loading**: Carga diferida de componentes
- **OnPush Change Detection**: Para mejor rendimiento
- **TrackBy Functions**: Para optimizar *ngFor

### Memory Management
- Unsubscribe de observables en ngOnDestroy
- Reutilización de componentes
- Minimización de DOM manipulations

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Stack cards, simplify tables
- **Tablet**: 768px - 1024px - Adjust grid layouts
- **Desktop**: > 1024px - Full layout

### Mobile Adaptations
- Cards apiladas verticalmente
- Tablas con scroll horizontal
- Filtros colapsables
- Botones de acción más grandes

## Accessibility Features

### Keyboard Navigation
- Tab order lógico
- Enter/Space para activar elementos
- Escape para cerrar modales

### Screen Reader Support
- ARIA labels descriptivos
- Role attributes apropiados
- Live regions para cambios dinámicos

### Visual Accessibility
- Alto contraste de colores
- Tamaños de fuente legibles
- Indicadores de foco claros