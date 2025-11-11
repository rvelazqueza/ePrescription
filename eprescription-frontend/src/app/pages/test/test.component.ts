import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-green-100 p-8 rounded-lg border-2 border-green-500">
      <h1 class="text-3xl font-bold text-green-800">PÁGINA DE PRUEBA</h1>
      <p class="text-green-700 mt-4">Si puedes ver esto, las páginas están funcionando correctamente.</p>
      <div class="mt-4 p-4 bg-white rounded">
        <p>Esta es una página de prueba simple sin dependencias complejas.</p>
        <p class="mt-2">Fecha actual: {{ currentDate }}</p>
      </div>
    </div>
  `
})
export class TestComponent {
  currentDate = new Date().toLocaleDateString();
}