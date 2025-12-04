import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent],
  template: `
    <app-login
      (loginSuccess)="onLoginSuccess($event)"
      (navigateToRegister)="onNavigateToRegister()"
      (navigateToRecovery)="onNavigateToRecovery()"
    ></app-login>
  `
})
export class LoginPageComponent implements OnInit {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Maneja el evento de login exitoso y redirige según corresponda
   */
  onLoginSuccess(event: {userId: string, requiresMFA: boolean}) {
    console.log('Login exitoso:', event);
    
    if (event.requiresMFA) {
      // Redirigir a página de MFA si existe
      console.log('Requiere MFA, redirigiendo...');
      this.router.navigate(['/mfa'], { 
        queryParams: { userId: event.userId } 
      });
    } else {
      // Redirigir al dashboard
      console.log('Login completo, redirigiendo al dashboard...');
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Maneja la navegación al registro
   */
  onNavigateToRegister() {
    console.log('Navegando a solicitud de registro');
    this.router.navigate(['/solicitud-registro']);
  }

  /**
   * Maneja la navegación a recuperación de contraseña
   */
  onNavigateToRecovery() {
    console.log('Navegando a recuperación de contraseña');
    this.router.navigate(['/password-recovery']);
  }
}