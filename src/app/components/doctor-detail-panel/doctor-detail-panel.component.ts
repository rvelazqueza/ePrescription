import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Doctor } from '../../interfaces/doctor.interface';

@Component({
  selector: 'app-doctor-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './doctor-detail-panel.component.html',
  styleUrls: ['./doctor-detail-panel.component.css']
})
export class DoctorDetailPanelComponent implements OnInit, OnDestroy {
  @Input() doctor: Doctor | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    // Handle escape key to close panel
    document.addEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
  }

  private handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isVisible) {
      this.closePanel();
    }
  }

  closePanel() {
    this.close.emit();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getCertificationStatusColor(status: string): string {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getCertificationStatusIcon(status: string): string {
    switch (status) {
      case 'verified':
        return 'check-circle';
      case 'expired':
        return 'x-circle';
      case 'pending':
        return 'alert-circle';
      default:
        return 'alert-circle';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  isLicenseExpiringSoon(expiryDate: string): boolean {
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow;
  }

  editDoctor(): void {
    if (this.doctor) {
      // Emit event to parent component to handle navigation
      // For now, we'll just close the panel
      this.closePanel();
    }
  }

  viewPrescriptions(): void {
    if (this.doctor) {
      // Emit event to parent component to handle navigation to prescriptions
      // For now, we'll just close the panel
      this.closePanel();
    }
  }
}