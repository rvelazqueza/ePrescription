# Batch Detail Modal Component

## Descripción
Componente modal que muestra los detalles completos de un lote de medicamentos, incluyendo información básica, fechas, stock, valores y estado.

## Características
- **Información completa del lote**: Número de lote, ID interno, ubicación
- **Detalles del medicamento**: Nombre, presentación, proveedor, documento de ingreso
- **Gestión de fechas**: Fabricación, vencimiento, ingreso al sistema con cálculo automático de días restantes
- **Stock y valores**: Cantidad inicial, stock actual, costo unitario, valor total con barra de progreso
- **Estado visual**: Badge de estado con colores distintivos
- **Exportación**: Funcionalidad para exportar trazabilidad del lote
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## Uso

```typescript
import { BatchDetailModalComponent } from './components/batch-detail-modal/batch-detail-modal.component';

@Component({
  imports: [BatchDetailModalComponent]
})
export class MyComponent {
  selectedBatch: Batch | null = null;
  isModalOpen = false;

  openModal(batch: Batch) {
    this.selectedBatch = batch;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedBatch = null;
  }
}
```

```html
<app-batch-detail-modal
  [batch]="selectedBatch"
  [isOpen]="isModalOpen"
  (closeModal)="closeModal()">
</app-batch-detail-modal>
```

## Inputs
- `batch: Batch | null` - Objeto con los datos del lote a mostrar
- `isOpen: boolean` - Controla la visibilidad del modal

## Outputs
- `closeModal: EventEmitter<void>` - Evento emitido cuando se cierra el modal

## Dependencias
- `@angular/common`
- `lucide-angular`
- `Batch` interface from `../../interfaces/inventory.interface`

## Estilos
- Utiliza Tailwind CSS para el diseño
- Animaciones suaves de entrada y salida
- Efectos de hover y focus para mejor UX
- Scrollbar personalizado para contenido largo

## Funcionalidades
- **Cierre del modal**: Click en backdrop, botón X, o botón Cerrar
- **Prevención de propagación**: Click en contenido del modal no lo cierra
- **Formateo de fechas**: Formato localizado para Costa Rica
- **Cálculo dinámico**: Días hasta vencimiento con colores indicativos
- **Barra de progreso**: Visualización del stock disponible vs inicial
- **Exportación**: Botón para exportar trazabilidad (funcionalidad pendiente)

## Estados del lote
- **Activo**: Verde - Lote en buen estado
- **Próximo a vencer**: Amarillo - Lote que vence en los próximos 90 días
- **Vencido**: Rojo - Lote que ya venció

## Responsive Design
- Desktop: Layout de 2-4 columnas según la sección
- Tablet: Ajuste automático de columnas
- Mobile: Layout de una columna para mejor legibilidad