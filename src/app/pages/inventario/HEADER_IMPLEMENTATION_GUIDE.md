# Guía de Implementación de Headers Homologados

## Resumen de Cambios

Se han actualizado los headers de las vistas de inventario para homologarlos con el diseño del resto de la aplicación, siguiendo exactamente el patrón establecido en las vistas de pacientes y médicos.

## Problemas Resueltos

1. **Cuadro rojo eliminado**: Se actualizó el modal de batch detail para usar un header con gradiente verde consistente
2. **Headers homologados**: Todos los headers de inventario ahora siguen el mismo patrón visual que pacientes y médicos

## Estructura del Nuevo Header (Patrón Homologado)

### HTML Template

```html
<!-- Main Header -->
<div class="bg-gradient-to-r from-[color]-600 to-[color]-700 rounded-lg p-6 text-white mb-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="bg-white/20 p-3 rounded-lg">
        <lucide-icon [img]="iconoVista" class="w-8 h-8"></lucide-icon>
      </div>
      <div>
        <h1 class="text-2xl font-bold">Título de la Vista</h1>
        <p class="text-[color]-100">Descripción de la funcionalidad</p>
      </div>
    </div>
    <div class="flex gap-4">
      <div class="bg-white/20 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold">{{ estadistica }}</div>
        <div class="text-sm text-[color]-100">Etiqueta Estadística</div>
      </div>
      <button 
        (click)="accionPrincipal()"
        class="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/30">
        <lucide-icon [img]="iconoAccion" class="w-4 h-4"></lucide-icon>
        Texto del Botón
      </button>
    </div>
  </div>
</div>
```

### Clases CSS Disponibles

#### Headers por Vista
- `header-stock` - Gradiente púrpura para Stock
- `header-alertas` - Gradiente rojo para Alertas  
- `header-ajustes` - Gradiente naranja para Ajustes
- `header-lotes` - Gradiente verde para Lotes
- `header-farmacias` - Gradiente azul para Farmacias
- `header-consulta` - Gradiente teal para Consulta

#### Elementos del Header
- `header-gradient` - Fondo con gradiente
- `header-content` - Contenedor principal
- `header-info` - Información del lado izquierdo
- `header-icon-container` - Contenedor del ícono
- `header-icon-bg` - Fondo del ícono con blur
- `header-icon` - Ícono principal
- `header-text` - Contenedor de texto
- `header-actions` - Contenedor de acciones
- `header-button` - Botón de acción principal
- `header-decoration-1` y `header-decoration-2` - Elementos decorativos

## Implementación por Vista

### 1. Stock de Medicamentos

```html
<!-- Main Header -->
<div class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white mb-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="bg-white/20 p-3 rounded-lg">
        <lucide-icon [img]="packageIcon" class="w-8 h-8"></lucide-icon>
      </div>
      <div>
        <h1 class="text-2xl font-bold">Stock de Medicamentos</h1>
        <p class="text-purple-100">Control y gestión completa del inventario de medicamentos</p>
      </div>
    </div>
    <div class="flex gap-4">
      <div class="bg-white/20 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold">{{ stockStats().total }}</div>
        <div class="text-sm text-purple-100">Total Medicamentos</div>
      </div>
      <button 
        (click)="openNewMedicineModal()"
        class="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/30">
        <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
        Nuevo Medicamento
      </button>
    </div>
  </div>
</div>
```

### 2. Alertas de Stock

```html
<div class="inventory-header-banner header-alertas">
  <div class="header-gradient"></div>
  <div class="header-content">
    <div class="header-info">
      <div class="header-icon-container">
        <div class="header-icon-bg">
          <lucide-icon [img]="AlertTriangleIcon" class="header-icon"></lucide-icon>
        </div>
      </div>
      <div class="header-text">
        <h1>Alertas de Stock</h1>
        <p>Gestión de alertas de medicamentos con stock bajo o agotado</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="header-button" (click)="markAllAsRead()">
        <lucide-icon [img]="PackageCheckIcon" class="w-5 h-5"></lucide-icon>
        Procesar todas
      </button>
    </div>
  </div>
  <div class="header-decoration-1"></div>
  <div class="header-decoration-2"></div>
</div>
```

### 3. Ajustes de Inventario

```html
<div class="inventory-header-banner header-ajustes">
  <div class="header-gradient"></div>
  <div class="header-content">
    <div class="header-info">
      <div class="header-icon-container">
        <div class="header-icon-bg">
          <lucide-icon [img]="editIcon" class="header-icon"></lucide-icon>
        </div>
      </div>
      <div class="header-text">
        <h1>Ajustes de Inventario</h1>
        <p>Registro y control de movimientos de inventario</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="header-button" (click)="openNewAdjustmentModal()">
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nuevo Ajuste
      </button>
    </div>
  </div>
  <div class="header-decoration-1"></div>
  <div class="header-decoration-2"></div>
</div>
```

### 4. Gestión de Lotes

```html
<div class="inventory-header-banner header-lotes">
  <div class="header-gradient"></div>
  <div class="header-content">
    <div class="header-info">
      <div class="header-icon-container">
        <div class="header-icon-bg">
          <lucide-icon [img]="packageIcon" class="header-icon"></lucide-icon>
        </div>
      </div>
      <div class="header-text">
        <h1>Gestión de Lotes</h1>
        <p>Control de lotes, fechas de vencimiento y trazabilidad</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="header-button" (click)="openNewBatchModal()">
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nuevo Lote
      </button>
    </div>
  </div>
  <div class="header-decoration-1"></div>
  <div class="header-decoration-2"></div>
</div>
```

### 5. Lista de Farmacias

```html
<div class="inventory-header-banner header-farmacias">
  <div class="header-gradient"></div>
  <div class="header-content">
    <div class="header-info">
      <div class="header-icon-container">
        <div class="header-icon-bg">
          <lucide-icon [img]="buildingIcon" class="header-icon"></lucide-icon>
        </div>
      </div>
      <div class="header-text">
        <h1>Lista de Farmacias</h1>
        <p>Gestión de farmacias y puntos de distribución</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="header-button" (click)="openNewPharmacyModal()">
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nueva Farmacia
      </button>
    </div>
  </div>
  <div class="header-decoration-1"></div>
  <div class="header-decoration-2"></div>
</div>
```

### 6. Consulta de Inventario

```html
<div class="inventory-header-banner header-consulta">
  <div class="header-gradient"></div>
  <div class="header-content">
    <div class="header-info">
      <div class="header-icon-container">
        <div class="header-icon-bg">
          <lucide-icon [img]="searchIcon" class="header-icon"></lucide-icon>
        </div>
      </div>
      <div class="header-text">
        <h1>Consulta de Inventario</h1>
        <p>Búsqueda y comparación de stock entre farmacias</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="header-button" (click)="exportReport()">
        <lucide-icon [img]="downloadIcon" class="w-5 h-5"></lucide-icon>
        Exportar Reporte
      </button>
    </div>
  </div>
  <div class="header-decoration-1"></div>
  <div class="header-decoration-2"></div>
</div>
```

## Características del Diseño

### Responsive Design
- **Mobile**: Layout vertical, botón de ancho completo
- **Tablet**: Layout horizontal, elementos ajustados
- **Desktop**: Layout completo con decoraciones

### Accesibilidad
- Contraste adecuado en todos los gradientes
- Elementos focusables con indicadores claros
- Texto legible sobre fondos con gradiente
- Soporte para lectores de pantalla

### Animaciones
- Transiciones suaves en hover
- Efectos de elevación en botones
- Elementos decorativos sutiles

## Migración de Headers Existentes

### Pasos para Actualizar

1. **Reemplazar el HTML del header existente** con la nueva estructura
2. **Agregar la clase CSS correspondiente** (`header-stock`, `header-alertas`, etc.)
3. **Importar los íconos necesarios** en el componente TypeScript
4. **Actualizar los métodos de acción** si es necesario
5. **Probar la responsividad** en diferentes tamaños de pantalla

### Ejemplo de Migración

**Antes:**
```html
<div class="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
  <h1 class="text-2xl font-bold">Stock de Medicamentos</h1>
</div>
```

**Después:**
```html
<div class="inventory-header-banner header-stock">
  <div class="header-gradient"></div>
  <div class="header-content">
    <!-- Estructura completa del nuevo header -->
  </div>
</div>
```

## Beneficios de la Homologación

1. **Consistencia Visual**: Todos los headers siguen el mismo patrón
2. **Mejor UX**: Navegación más intuitiva y familiar
3. **Mantenibilidad**: Estilos centralizados y reutilizables
4. **Accesibilidad**: Cumple con estándares de accesibilidad
5. **Responsive**: Funciona en todos los dispositivos
6. **Escalabilidad**: Fácil agregar nuevas vistas con el mismo patrón

## Notas de Implementación

- Los estilos están en `src/app/pages/inventario/shared/inventory-styles.css`
- Importar siempre `src/app/pages/inventario/shared/index.css` en los componentes
- Los gradientes están optimizados para legibilidad del texto
- Los elementos decorativos son opcionales y se pueden omitir si es necesario
- Todos los botones de acción deben seguir el patrón `header-button`