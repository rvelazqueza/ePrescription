import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../ui/table/table.component';
import { Medicine } from '../add-medicine-dialog/add-medicine-dialog.component';

@Component({
  selector: 'app-medicine-table',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent
  ],
  template: `
    <div class="border rounded-lg">
      <app-table>
        <app-table-header>
          <app-table-row>
            <app-table-head>Medicamento</app-table-head>
            <app-table-head>Cantidad</app-table-head>
            <app-table-head>Dosis</app-table-head>
            <app-table-head>Frecuencia</app-table-head>
            <app-table-head>Vía de Administración</app-table-head>
            <app-table-head>Duración</app-table-head>
          </app-table-row>
        </app-table-header>
        <app-table-body>
          <app-table-row 
            *ngFor="let medicine of medicines"
            class="cursor-pointer hover:bg-gray-50 transition-colors"
            (dblclick)="onMedicineDoubleClick(medicine)"
            title="Doble clic para ver detalles"
          >
            <app-table-cell class="font-medium">{{ medicine.name }}</app-table-cell>
            <app-table-cell>{{ medicine.quantity }}</app-table-cell>
            <app-table-cell>{{ medicine.dose }}</app-table-cell>
            <app-table-cell>{{ medicine.frequency }}</app-table-cell>
            <app-table-cell>{{ medicine.administration }}</app-table-cell>
            <app-table-cell>{{ medicine.duration }}</app-table-cell>
          </app-table-row>
          <app-table-row *ngIf="medicines.length === 0">
            <app-table-cell colspan="6" class="text-center text-gray-500 py-8">
              No hay medicamentos agregados
            </app-table-cell>
          </app-table-row>
        </app-table-body>
      </app-table>
    </div>
  `
})
export class MedicineTableComponent {
  @Input() medicines: Medicine[] = [];
  @Output() medicineDoubleClick = new EventEmitter<Medicine>();

  onMedicineDoubleClick(medicine: Medicine) {
    this.medicineDoubleClick.emit(medicine);
  }
}