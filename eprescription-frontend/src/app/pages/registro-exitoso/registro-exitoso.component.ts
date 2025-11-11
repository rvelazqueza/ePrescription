import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-exitoso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro-exitoso.component.html',
  styleUrls: ['./registro-exitoso.component.css']
})
export class RegistroExitosoComponent implements OnInit {

  // Información del usuario (simulada)
  userEmail = 'carlosmonti1993@gmail.com';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Componente inicializado
  }

  // Volver al inicio de sesión
  volverAlLogin(): void {
    this.router.navigate(['/login']);
  }
}