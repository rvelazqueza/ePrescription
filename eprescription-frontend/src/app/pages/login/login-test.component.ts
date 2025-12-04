import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 max-w-md mx-auto mt-8">
      <h2 class="text-xl font-bold mb-4">Test de Login</h2>
      
      <div class="space-y-4">
        <div>
          <p><strong>Estado de autenticación:</strong> {{ isAuthenticated ? 'Autenticado' : 'No autenticado' }}</p>
          <p><strong>Usuario actual:</strong> {{ currentUser?.email || 'Ninguno' }}</p>
        </div>

        <button 
          (click)="testLogin()"
          [disabled]="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Probando...' : 'Probar Login' }}
        </button>

        <button 
          (click)="testGaudi()"
          [disabled]="loading"
          class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {{ loading ? 'Probando...' : 'Probar GAUDI' }}
        </button>

        <button 
          (click)="logout()"
          class="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>

        <button 
          (click)="goToDashboard()"
          class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Ir al Dashboard
        </button>

        <div *ngIf="message" class="p-3 rounded" [class]="messageClass">
          {{ message }}
        </div>
      </div>
    </div>
  `
})
export class LoginTestComponent {
  loading = false;
  message = '';
  messageClass = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  testLogin() {
    this.loading = true;
    this.message = '';

    this.authService.login('dr.martinez@hospital.cr', 'Demo123!').subscribe({
      next: (result) => {
        console.log('Resultado del login:', result);
        
        if (result.success) {
          this.message = `Login exitoso! Usuario: ${result.userId}, MFA: ${result.requiresMFA}`;
          this.messageClass = 'bg-green-100 text-green-800';
          
          if (!result.requiresMFA) {
            setTimeout(() => {
              console.log('Navegando al dashboard...');
              this.router.navigate(['/dashboard']);
            }, 1000);
          }
        } else {
          this.message = `Error: ${result.error}`;
          this.messageClass = 'bg-red-100 text-red-800';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.message = 'Error de conexión';
        this.messageClass = 'bg-red-100 text-red-800';
        this.loading = false;
      }
    });
  }

  testGaudi() {
    this.loading = true;
    this.message = '';

    this.authService.validateGaudiSignature('1-0456-0789', 'mock-signature').subscribe({
      next: (result) => {
        console.log('Resultado GAUDI:', result);
        
        if (result.success) {
          this.message = `GAUDI exitoso! Usuario: ${result.userId}`;
          this.messageClass = 'bg-green-100 text-green-800';
          
          setTimeout(() => {
            console.log('Navegando al dashboard...');
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.message = `Error: ${result.error}`;
          this.messageClass = 'bg-red-100 text-red-800';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en GAUDI:', err);
        this.message = 'Error de conexión';
        this.messageClass = 'bg-red-100 text-red-800';
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.message = 'Logout exitoso';
    this.messageClass = 'bg-blue-100 text-blue-800';
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}