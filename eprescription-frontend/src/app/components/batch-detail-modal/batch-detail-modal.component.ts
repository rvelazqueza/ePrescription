import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Package, Calendar, MapPin, DollarSign, FileText, Download } from 'lucide-angular';
import { Batch } from '../../interfaces/inventory.interface';

@Component({
  selector: 'app-batch-detail-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './batch-detail-modal.component.html',
  styleUrls: ['./batch-detail-modal.component.css']
})
export class BatchDetailModalComponent {
  @Input() set batch(value: Batch | null) {
    this._batch = value;
  }
  get batch(): Batch | null {
    return this._batch;
  }
  private _batch: Batch | null = null;

  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
  }
  get isOpen(): boolean {
    return this._isOpen;
  }
  private _isOpen = false;

  @Output() closeModal = new EventEmitter<void>();

  // Icons
  xIcon = X;
  packageIcon = Package;
  calendarIcon = Calendar;
  mapPinIcon = MapPin;
  dollarSignIcon = DollarSign;
  fileTextIcon = FileText;
  downloadIcon = Download;

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  getDiasVencimientoTexto(diasVencimiento: number): string {
    if (diasVencimiento < 0) {
      return `${Math.abs(diasVencimiento)} días atrás`;
    } else if (diasVencimiento === 0) {
      return 'Vence hoy';
    } else {
      return `${diasVencimiento} días restantes`;
    }
  }

  getDiasVencimientoClass(diasVencimiento: number): string {
    if (diasVencimiento < 0) {
      return 'text-red-600 font-semibold';
    } else if (diasVencimiento <= 30) {
      return 'text-red-500 font-medium';
    } else if (diasVencimiento <= 90) {
      return 'text-yellow-600 font-medium';
    } else {
      return 'text-green-600 font-medium';
    }
  }

  getEstadoClass(estado: string): string {
    const classes = {
      'active': 'bg-green-100 text-green-800 border border-green-200',
      'near_expiry': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'expired': 'bg-red-100 text-red-800 border border-red-200'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'active': 'Activo',
      'near_expiry': 'Próximo a vencer',
      'expired': 'Vencido'
    };
    return textos[estado as keyof typeof textos] || estado;
  }

  exportarTrazabilidad() {
    // TODO: Implementar exportación de trazabilidad
  }
}