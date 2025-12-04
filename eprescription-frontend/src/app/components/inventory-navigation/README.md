# Inventory Navigation Component

## Overview
The Inventory Navigation Component provides contextual navigation between inventory views, allowing users to seamlessly move between related sections with relevant context.

## Features
- **Quick Navigation**: Fast access to all inventory sections
- **Contextual Actions**: Smart suggestions based on current view and selected items
- **Context Preservation**: Maintains context when navigating between views
- **Responsive Design**: Adapts to different screen sizes

## Usage
```html
<app-inventory-navigation 
  currentView="stock"
  [context]="{ selectedItem: selectedItem() }"
  [showRelatedLinks]="true">
</app-inventory-navigation>
```

## Navigation Context
The component automatically handles navigation context through sessionStorage, allowing components to:
- Filter data based on navigation context
- Pre-select relevant items
- Show contextual information

## Contextual Actions
- **From Stock**: Navigate to alerts, adjustments, or batches for specific medicines
- **From Alerts**: View stock details, generate adjustments, or check other pharmacies
- **From Adjustments**: View current stock, related batches, or alerts
- **From Batches**: Check stock status, view related alerts or adjustments
- **From Pharmacies**: Query inventory or view stock details
- **From Consulta**: View detailed stock, manage pharmacies, or check alerts

## Implementation
The navigation service (`InventoryNavigationService`) provides:
- Contextual navigation suggestions
- Navigation with context preservation
- Quick navigation shortcuts