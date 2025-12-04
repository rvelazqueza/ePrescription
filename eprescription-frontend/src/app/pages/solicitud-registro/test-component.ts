// Archivo de prueba para verificar que el componente funciona correctamente
import { Component } from '@angular/core';
import { SolicitudRegistroComponent } from './solicitud-registro.component';

@Component({
  selector: 'app-test-solicitud',
  standalone: true,
  imports: [SolicitudRegistroComponent],
  template: `
    <div class="p-4">
      <h1>Test del Componente de Solicitud de Registro</h1>
      <app-solicitud-registro></app-solicitud-registro>
    </div>
  `
})
export class TestSolicitudComponent {
  constructor() {
    console.log('TestSolicitudComponent inicializado correctamente');
  }
}