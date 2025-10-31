import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';

/**
 * Ejemplo de uso del componente LoginComponent migrado de React a Angular
 * 
 * Este componente demuestra cómo integrar el LoginComponent en una aplicación Angular
 * y manejar los eventos de navegación y autenticación.
 */
@Component({
  selector: 'app-login-example',
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
export class LoginExampleComponent {
  
  constructor(private router: Router) {}

  /**
   * Maneja el evento de login exitoso
   * @param event - Objeto con userId y requiresMFA
   */
  onLoginSuccess(event: {userId: string, requiresMFA: boolean}) {
    console.log('Login exitoso:', event);
    
    if (event.requiresMFA) {
      // Redirigir a página de MFA
      this.router.navigate(['/mfa'], { 
        queryParams: { userId: event.userId } 
      });
    } else {
      // Redirigir al dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Maneja la navegación al registro
   */
  onNavigateToRegister() {
    console.log('Navegando a registro');
    this.router.navigate(['/register']);
  }

  /**
   * Maneja la navegación a recuperación de contraseña
   */
  onNavigateToRecovery() {
    console.log('Navegando a recuperación');
    this.router.navigate(['/password-recovery']);
  }
}

/*
GUÍA DE MIGRACIÓN DE REACT A ANGULAR - LoginPage

## Cambios principales realizados:

### 1. Estructura del componente
- **React**: Función con hooks (useState, useEffect)
- **Angular**: Clase con decorador @Component

### 2. Manejo de estado
- **React**: useState hooks
- **Angular**: Propiedades de clase

### 3. Formularios
- **React**: Controlled components con onChange
- **Angular**: Reactive Forms con FormBuilder y FormGroup

### 4. Eventos
- **React**: Props como funciones (onLoginSuccess, onNavigateToRegister)
- **Angular**: @Output() EventEmitter

### 5. Servicios
- **React**: Import directo del authStore
- **Angular**: Inyección de dependencias con AuthService

### 6. Async/Await vs Observables
- **React**: async/await con promesas
- **Angular**: Observables con subscribe()

### 7. Estilos
- **React**: className con Tailwind CSS
- **Angular**: class con Tailwind CSS (sin cambios)

## Funcionalidades migradas:

✅ Autenticación con usuario/contraseña
✅ Autenticación con firma digital GAUDI
✅ Validación de formularios
✅ Manejo de errores y mensajes de éxito
✅ Detección de Caps Lock
✅ Formateo automático de cédula
✅ Estados de carga (loading)
✅ Diseño responsive idéntico
✅ Animaciones CSS
✅ Integración con AuthService

## Uso del componente:

```typescript
// En tu componente padre
import { LoginComponent } from './pages/login/login.component';

@Component({
  template: `
    <app-login
      (loginSuccess)="handleLogin($event)"
      (navigateToRegister)="goToRegister()"
      (navigateToRecovery)="goToRecovery()"
    ></app-login>
  `
})
export class MyComponent {
  handleLogin(event: {userId: string, requiresMFA: boolean}) {
    // Manejar login exitoso
  }
  
  goToRegister() {
    // Navegar a registro
  }
  
  goToRecovery() {
    // Navegar a recuperación
  }
}
```

## Datos de prueba:

### Usuario/Contraseña:
- Email: dr.martinez@hospital.cr
- Contraseña: Demo123!

### Firma Digital:
- Cédula: 1-0456-0789

*/