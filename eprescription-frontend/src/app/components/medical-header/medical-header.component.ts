import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, MapPin, Phone, Mail, Award } from 'lucide-angular';

@Component({
  selector: 'app-medical-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="userIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ doctor.name }}</h2>
              <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div class="flex items-center space-x-1">
                  <lucide-icon [img]="awardIcon" class="w-4 h-4"></lucide-icon>
                  <span>{{ doctor.specialty }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <lucide-icon [img]="mapPinIcon" class="w-4 h-4"></lucide-icon>
                  <span>{{ doctor.department }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                <span>Licencia: {{ doctor.license }}</span>
                <div class="flex items-center space-x-1">
                  <lucide-icon [img]="phoneIcon" class="w-3 h-3"></lucide-icon>
                  <span>{{ doctor.phone }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <lucide-icon [img]="mailIcon" class="w-3 h-3"></lucide-icon>
                  <span>{{ doctor.email }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">{{ currentDateTime }}</p>
            <p class="text-xs text-gray-500 mt-1">Sesión iniciada: {{ sessionTime }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MedicalHeaderComponent {
  userIcon = User;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  mailIcon = Mail;
  awardIcon = Award;

  doctor = {
    name: "Dr. Ana María López Ruiz",
    specialty: "Medicina Interna",
    license: "12345-COL",
    department: "Unidad de Hospitalización 3A",
    phone: "+506 2222-3333",
    email: "ana.lopez@hospital.cr"
  };

  currentDateTime = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  sessionTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}