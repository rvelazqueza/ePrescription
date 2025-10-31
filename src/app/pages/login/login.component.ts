import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<{userId: string, requiresMFA: boolean}>();
  @Output() navigateToRegister = new EventEmitter<void>();
  @Output() navigateToRecovery = new EventEmitter<void>();

  authMethod: 'password' | 'gaudi' = 'password';
  showPassword = false;
  capsLockOn = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  passwordForm: FormGroup;
  gaudiForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.gaudiForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d-\d{4}-\d{4}$/)]]
    });
  }

  onKeyPress(event: KeyboardEvent) {
    this.capsLockOn = event.getModifierState('CapsLock');
  }

  onPasswordLogin() {
    if (this.passwordForm.invalid) return;
    
    this.error = null;
    this.success = null;
    this.loading = true;

    const { username, password } = this.passwordForm.value;
    
    this.authService.login(username, password).subscribe({
      next: (result) => {
        if (result.success && result.userId) {
          this.success = 'Credenciales verificadas';
          setTimeout(() => {
            this.loginSuccess.emit({
              userId: result.userId!,
              requiresMFA: result.requiresMFA || false
            });
          }, 500);
        } else {
          this.error = result.error || 'Error al iniciar sesión';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  onGaudiLogin() {
    if (this.gaudiForm.invalid) return;

    this.error = null;
    this.success = null;
    this.loading = true;

    const { cedula } = this.gaudiForm.value;
    const mockSignatureData = "mock-signature-data";
    
    this.authService.validateGaudiSignature(cedula, mockSignatureData).subscribe({
      next: (result) => {
        if (result.success && result.userId) {
          this.success = 'Firma digital verificada exitosamente';
          setTimeout(() => {
            this.loginSuccess.emit({
              userId: result.userId!,
              requiresMFA: false
            });
          }, 800);
        } else {
          this.error = result.error || 'No se pudo verificar la firma digital';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al procesar la firma digital. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  formatCedula(event: any) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 1) value = value.slice(0, 1) + "-" + value.slice(1);
    if (value.length > 6) value = value.slice(0, 6) + "-" + value.slice(6);
    if (value.length > 11) value = value.slice(0, 11);
    
    this.gaudiForm.patchValue({ cedula: value });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  setAuthMethod(method: 'password' | 'gaudi') {
    this.authMethod = method;
    this.error = null;
    this.success = null;
  }

  onNavigateToRegister() {
    this.navigateToRegister.emit();
  }

  onNavigateToRecovery() {
    this.navigateToRecovery.emit();
  }
}