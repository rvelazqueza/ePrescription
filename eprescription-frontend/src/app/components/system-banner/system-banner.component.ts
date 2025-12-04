import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Shield, CheckCircle, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-system-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <lucide-icon [img]="shieldIcon" class="w-5 h-5"></lucide-icon>
              <span class="font-medium">Sistema Certificado HL7 FHIR</span>
            </div>
            <div class="hidden md:flex items-center space-x-4 text-sm">
              <div class="flex items-center space-x-1">
                <lucide-icon [img]="checkCircleIcon" class="w-4 h-4 text-green-300"></lucide-icon>
                <span>Conectado</span>
              </div>
              <div class="flex items-center space-x-1">
                <lucide-icon [img]="checkCircleIcon" class="w-4 h-4 text-green-300"></lucide-icon>
                <span>Firma Digital Activa</span>
              </div>
              <div class="flex items-center space-x-1">
                <lucide-icon [img]="checkCircleIcon" class="w-4 h-4 text-green-300"></lucide-icon>
                <span>Sincronización OK</span>
              </div>
            </div>
          </div>
          <div class="text-sm">
            <span class="opacity-90">Versión 2.1.0 • {{ currentDate }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SystemBannerComponent {
  shieldIcon = Shield;
  checkCircleIcon = CheckCircle;
  alertTriangleIcon = AlertTriangle;

  currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}