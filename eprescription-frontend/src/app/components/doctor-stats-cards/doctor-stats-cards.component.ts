import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, UserCheck, UserX, ShieldCheck, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-angular';

interface Doctor {
  id: string;
  status: 'active' | 'inactive';
  certificationStatus: 'verified' | 'expired' | 'pending';
  isOnDuty: boolean;
  licenseExpiry: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

@Component({
  selector: 'app-doctor-stats-cards',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div 
        *ngFor="let stat of stats; let i = index" 
        class="bg-white rounded-lg shadow border-l-4 p-6 hover-lift transition-smooth stagger-item"
        [ngClass]="stat.borderColor"
        [style.animation-delay]="(i * 0.1) + 's'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">{{ stat.title }}</p>
            <p class="text-3xl font-bold text-gray-900">{{ stat.value | number }}</p>
            <div *ngIf="stat.change" class="flex items-center mt-2">
              <lucide-icon 
                [img]="stat.change.type === 'increase' ? trendingUpIcon : trendingDownIcon"
                class="w-4 h-4 mr-1"
                [ngClass]="stat.change.type === 'increase' ? 'text-green-500' : 'text-red-500'"
                [strokeWidth]="2">
              </lucide-icon>
              <span 
                class="text-sm font-medium"
                [ngClass]="stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'">
                {{ stat.change.value }}%
              </span>
            </div>
          </div>
          <div class="p-3 rounded-lg" [ngClass]="stat.bgColor">
            <lucide-icon 
              [img]="stat.icon" 
              class="w-8 h-8"
              [ngClass]="stat.color"
              [strokeWidth]="2">
            </lucide-icon>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DoctorStatsCardsComponent implements OnInit {
  @Input() doctors: Doctor[] = [];
  
  stats: StatCard[] = [];
  
  // Icons
  trendingUpIcon = TrendingUp;
  trendingDownIcon = TrendingDown;

  ngOnInit(): void {
    this.calculateStats();
  }

  ngOnChanges(): void {
    this.calculateStats();
  }

  private calculateStats(): void {
    const total = this.doctors.length;
    const active = this.doctors.filter(d => d.status === 'active').length;
    const inactive = this.doctors.filter(d => d.status === 'inactive').length;
    const verified = this.doctors.filter(d => d.certificationStatus === 'verified').length;
    const onDuty = this.doctors.filter(d => d.isOnDuty).length;
    const expiringSoon = this.getExpiringSoonCount();

    this.stats = [
      {
        title: 'Total Médicos',
        value: total,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-l-blue-500',
        change: {
          value: 12,
          type: 'increase'
        }
      },
      {
        title: 'Activos',
        value: active,
        icon: UserCheck,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-l-green-500',
        change: {
          value: 8,
          type: 'increase'
        }
      },
      {
        title: 'Inactivos',
        value: inactive,
        icon: UserX,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-l-red-500'
      },
      {
        title: 'Verificados',
        value: verified,
        icon: ShieldCheck,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-l-green-500'
      },
      {
        title: 'En Turno',
        value: onDuty,
        icon: Clock,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        borderColor: 'border-l-purple-500'
      },
      {
        title: 'Licencias por Vencer',
        value: expiringSoon,
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-l-orange-500'
      }
    ];
  }

  private getExpiringSoonCount(): number {
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    return this.doctors.filter(doctor => {
      if (!doctor.licenseExpiry) return false;
      
      // Parse date in DD/MM/YYYY format
      const [day, month, year] = doctor.licenseExpiry.split('/').map(Number);
      const expiryDate = new Date(year, month - 1, day);
      
      return expiryDate <= threeMonthsFromNow && expiryDate > now;
    }).length;
  }
}