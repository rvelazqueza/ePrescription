import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full overflow-auto">
      <table [class]="getTableClasses()">
        <ng-content></ng-content>
      </table>
    </div>
  `
})
export class TableComponent {
  @Input() class = '';

  getTableClasses(): string {
    const baseClasses = 'w-full caption-bottom text-sm';
    return `${baseClasses} ${this.class}`;
  }
}

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <thead [class]="getHeaderClasses()">
      <ng-content></ng-content>
    </thead>
  `
})
export class TableHeaderComponent {
  @Input() class = '';

  getHeaderClasses(): string {
    const baseClasses = '[&_tr]:border-b';
    return `${baseClasses} ${this.class}`;
  }
}

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tbody [class]="getBodyClasses()">
      <ng-content></ng-content>
    </tbody>
  `
})
export class TableBodyComponent {
  @Input() class = '';

  getBodyClasses(): string {
    const baseClasses = '[&_tr:last-child]:border-0';
    return `${baseClasses} ${this.class}`;
  }
}

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tr [class]="getRowClasses()">
      <ng-content></ng-content>
    </tr>
  `
})
export class TableRowComponent {
  @Input() class = '';

  getRowClasses(): string {
    const baseClasses = 'border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100';
    return `${baseClasses} ${this.class}`;
  }
}

@Component({
  selector: 'app-table-head',
  standalone: true,
  imports: [CommonModule],
  template: `
    <th [class]="getHeadClasses()">
      <ng-content></ng-content>
    </th>
  `
})
export class TableHeadComponent {
  @Input() class = '';

  getHeadClasses(): string {
    const baseClasses = 'h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0';
    return `${baseClasses} ${this.class}`;
  }
}

@Component({
  selector: 'app-table-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td [class]="getCellClasses()">
      <ng-content></ng-content>
    </td>
  `
})
export class TableCellComponent {
  @Input() class = '';

  getCellClasses(): string {
    const baseClasses = 'p-2 align-middle [&:has([role=checkbox])]:pr-0';
    return `${baseClasses} ${this.class}`;
  }
}