# Inventory Views - CSS Implementation Guide

## Overview

This directory contains the comprehensive CSS implementation for all inventory views, providing a homologated design system that ensures consistency across Stock, Alertas, Ajustes, Lotes, Farmacias, and Consulta de Inventario components.

## File Structure

```
shared/
├── index.css                    # Main entry point - imports all styles
├── inventory-styles.css         # Base styles, headers, tables, cards
├── inventory-badges.css         # Badge system and status indicators
├── inventory-accessibility.css  # Accessibility enhancements
├── inventory-utilities.css      # Utility classes and helpers
└── README.md                   # This documentation
```

## Usage

### Basic Import

In your component CSS file, simply import the main index:

```css
/* Import all shared inventory styles */
@import '../shared/index.css';
```

### Individual Imports (if needed)

```css
/* Import specific style modules */
@import '../shared/inventory-styles.css';
@import '../shared/inventory-badges.css';
@import '../shared/inventory-accessibility.css';
@import '../shared/inventory-utilities.css';
```

## Key Features

### 1. Header Banners with Gradients

Each inventory view has a distinctive gradient header:

```html
<div class="inventory-header-banner header-stock">
  <div class="header-content">
    <div class="header-info">
      <lucide-icon [img]="Package" class="header-icon"></lucide-icon>
      <div class="header-text">
        <h1>Stock de Medicamentos</h1>
        <p>Gestión completa del inventario</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="header-button">
        <lucide-icon [img]="Plus" class="w-5 h-5"></lucide-icon>
        Nuevo Medicamento
      </button>
    </div>
  </div>
</div>
```

Available header classes:
- `header-stock` - Purple gradient
- `header-alertas` - Red gradient  
- `header-ajustes` - Orange gradient
- `header-lotes` - Green gradient
- `header-farmacias` - Blue gradient
- `header-consulta` - Teal gradient

### 2. Statistics Cards

Responsive grid of statistics cards:

```html
<div class="stats-grid">
  <div class="stats-card">
    <div class="stats-card-icon icon-adequate">
      <lucide-icon [img]="CheckCircle" class="w-6 h-6"></lucide-icon>
    </div>
    <div class="stats-value">{{ adequateCount }}</div>
    <div class="stats-label">Stock Adecuado</div>
    <div class="stats-change positive">
      <lucide-icon [img]="TrendingUp" class="w-3 h-3"></lucide-icon>
      +5% vs mes anterior
    </div>
  </div>
</div>
```

### 3. Homologated Tables

Tables styled consistently with the recetas view:

```html
<div class="inventory-table-container">
  <table class="inventory-table" role="table">
    <thead>
      <tr>
        <th scope="col" class="table-header-sortable" (click)="sort('name')">
          <button class="sort-button" [class.active]="sortField === 'name'">
            Medicamento
            <lucide-icon [img]="ArrowUpDown" class="sort-icon w-4 h-4"></lucide-icon>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="focus-stock" tabindex="0" (dblclick)="openDetails(item)">
        <td>{{ item.name }}</td>
        <td>
          <span class="badge status-adequate">Adecuado</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 4. Badge System

Comprehensive badge system for status indicators:

```html
<!-- Stock Status Badges -->
<span class="badge status-adequate">Adecuado</span>
<span class="badge status-low">Bajo</span>
<span class="badge status-critical">Crítico</span>
<span class="badge status-out">Agotado</span>

<!-- Alert Priority Badges -->
<span class="badge priority-critical">Crítica</span>
<span class="badge priority-high">Alta</span>
<span class="badge priority-medium">Media</span>

<!-- Batch Status Badges -->
<span class="badge batch-active">Activo</span>
<span class="badge batch-near-expiry">Próximo a vencer</span>
<span class="badge batch-expired">Vencido</span>
```

### 5. Search and Filters

Consistent search and filter interface:

```html
<div class="search-filters-container">
  <div class="search-bar">
    <div class="search-input-container">
      <lucide-icon [img]="Search" class="search-icon"></lucide-icon>
      <input 
        type="text" 
        class="search-input focus-stock"
        placeholder="Buscar medicamentos..."
        [(ngModel)]="searchTerm">
    </div>
    <div class="filter-controls">
      <button class="filter-button" [class.active]="showFilters">
        <lucide-icon [img]="Filter" class="w-4 h-4"></lucide-icon>
        Filtros
      </button>
    </div>
  </div>
  
  <div class="filter-grid" *ngIf="showFilters">
    <select class="filter-select focus-stock">
      <option value="">Todos los estados</option>
      <option value="adequate">Adecuado</option>
      <option value="low">Bajo</option>
    </select>
  </div>
</div>
```

## Accessibility Features

### Focus Management

All interactive elements have proper focus indicators:

```html
<!-- Focus classes for different views -->
<button class="btn-primary focus-stock">Stock Action</button>
<button class="btn-primary focus-alertas">Alert Action</button>
<input class="form-input focus-lotes" type="text">
```

### Screen Reader Support

```html
<!-- Proper ARIA labels and descriptions -->
<div class="badge status-critical" role="status" aria-label="Estado crítico">
  Crítico
</div>

<!-- Screen reader only text -->
<span class="sr-only">Estado del medicamento:</span>
<span class="badge status-low">Bajo</span>
```

### Keyboard Navigation

```html
<!-- Proper tabindex and keyboard handlers -->
<tr class="focus-stock" 
    tabindex="0" 
    (keydown.enter)="openDetails(item)"
    (keydown.space)="selectItem(item)">
```

## Responsive Design

### Breakpoints

- **Mobile**: < 768px - Single column layouts, stacked cards
- **Tablet**: 768px - 1024px - 2-column grids, adjusted spacing  
- **Desktop**: > 1024px - Full multi-column layouts

### Mobile Adaptations

```html
<!-- Responsive grid classes -->
<div class="stats-grid"> <!-- Automatically responsive -->
  <div class="stats-card">...</div>
</div>

<!-- Mobile-specific utilities -->
<div class="mobile-container">
  <div class="mobile-grid-1">...</div>
</div>
```

## Theme Integration

Each view can use theme-specific CSS custom properties:

```css
.inventory-theme-stock {
  --inventory-primary: theme('colors.purple.600');
  --inventory-primary-light: theme('colors.purple.100');
  --inventory-primary-dark: theme('colors.purple.700');
}
```

## Performance Optimizations

### CSS Containment

```css
.inventory-table {
  contain: layout style paint;
}

.stats-card {
  contain: layout style;
}
```

### Critical CSS

Header banners, stats grids, and search containers are optimized for above-the-fold rendering.

## Browser Support

- Modern browsers with CSS Grid support
- Fallbacks for older browsers using Flexbox
- Progressive enhancement for advanced features

## Customization

### Adding New Status Types

1. Add badge class in `inventory-badges.css`:

```css
.status-new-type {
  @apply bg-purple-100 text-purple-800 border-purple-200;
}
```

2. Add accessibility support:

```css
.colorblind-pattern-new-type::before {
  content: "◆";
  @apply mr-1 text-purple-600 font-bold;
}
```

### Creating Component-Specific Styles

In your component CSS file:

```css
/* Import shared styles first */
@import '../shared/index.css';

/* Component-specific overrides */
.my-component-specific-class {
  @apply bg-blue-50 border-blue-200;
}
```

## Testing

### Accessibility Testing

Uncomment debugging utilities in `inventory-utilities.css`:

```css
/* Uncomment for accessibility testing */
.a11y-test-landmark,
.a11y-test-heading,
.a11y-test-focus {
  display: block;
}
```

### Visual Debugging

```css
/* Uncomment for debugging */
.debug-grid,
.debug-outline,
.debug-spacing {
  display: block;
}
```

## Print Styles

All components include print-optimized styles:

- Removes backgrounds and shadows
- Converts colors to black/white
- Adds text labels for badges
- Optimizes table layouts

## Reduced Motion Support

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .stats-card:hover {
    @apply transform-none;
  }
}
```

## High Contrast Support

Enhanced contrast for accessibility:

```css
@media (prefers-contrast: high) {
  .badge {
    @apply border-2 font-bold;
  }
}
```

## Maintenance

### Adding New Components

1. Create component CSS file
2. Import shared styles: `@import '../shared/index.css';`
3. Add component-specific styles below
4. Test accessibility and responsiveness
5. Update this documentation

### Updating Shared Styles

1. Modify appropriate shared CSS file
2. Test across all inventory components
3. Update version in package.json
4. Document breaking changes

## Version History

- v1.0.0 - Initial implementation with all 6 inventory views
- Homologated with recetas view styling
- Full accessibility compliance
- Responsive design for all screen sizes