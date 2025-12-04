import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type RecoveryStep = 'request' | 'sent' | 'reset' | 'success';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {
  step: RecoveryStep = 'request';
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  // Formularios
  requestForm: FormGroup;
  resetForm: FormGroup;
  
  // Estados de visibilidad de contraseñas
  showNewPassword = false;
  showConfirmPassword = false;
  
  // Token de recuperación (simulado)
  resetToken = '';
  
  // Email para mostrar en confirmación
  emailSent = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Si viene con token en la URL, ir directamente al reset
    // En una implementación real, obtendrías el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.resetToken = token;
      this.step = 'reset';
    }
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Solicitar recuperación de contraseña
   */
  onRequestRecovery() {
    if (this.requestForm.invalid) return;
    
    this.error = null;
    this.success = null;
    this.loading = true;
    
    const email = this.requestForm.value.email;
    this.emailSent = email;
    
    // Simular llamada al servicio
    this.authService.requestPasswordRecovery(email).subscribe({
      next: (result: { success: boolean; error?: string }) => {
        if (result.success) {
          this.step = 'sent';
        } else {
          this.error = result.error || 'Error al enviar el enlace de recuperación';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error de conexión. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  /**
   * Simular clic en enlace del email (para demo)
   */
  simulateEmailLink() {
    // Generar token mock
    const mockToken = `recovery_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    this.resetToken = mockToken;
    this.step = 'reset';
  }

  /**
   * Resetear contraseña
   */
  onResetPassword() {
    if (this.resetForm.invalid) return;
    
    this.error = null;
    this.success = null;
    this.loading = true;
    
    const { newPassword } = this.resetForm.value;
    
    // Validar fortaleza de contraseña
    const validation = this.validatePasswordStrength(newPassword);
    if (!validation.valid) {
      this.error = validation.message || 'Contraseña no válida';
      this.loading = false;
      return;
    }
    
    // Simular llamada al servicio
    this.authService.resetPassword(this.resetToken, newPassword).subscribe({
      next: (result: { success: boolean; error?: string }) => {
        if (result.success) {
          this.step = 'success';
        } else {
          this.error = result.error || 'Error al actualizar contraseña';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error de conexión. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  /**
   * Validar fortaleza de contraseña
   */
  validatePasswordStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 12) {
      return { valid: false, message: 'La contraseña debe tener al menos 12 caracteres' };
    }

    let characterTypes = 0;
    if (/[a-z]/.test(password)) characterTypes++;
    if (/[A-Z]/.test(password)) characterTypes++;
    if (/[0-9]/.test(password)) characterTypes++;
    if (/[^a-zA-Z0-9]/.test(password)) characterTypes++;

    if (characterTypes < 3) {
      return { 
        valid: false, 
        message: 'Debe incluir al menos 3 tipos: minúsculas, mayúsculas, números y símbolos' 
      };
    }

    // Verificar contraseñas comunes (mock)
    const commonPasswords = ['password123', 'qwerty123456', 'admin123456'];
    if (commonPasswords.some(cp => password.toLowerCase().includes(cp.toLowerCase()))) {
      return { 
        valid: false, 
        message: 'Esta contraseña es demasiado común. Elige una más segura.' 
      };
    }

    return { valid: true };
  }

  /**
   * Calcular fortaleza visual de la contraseña
   */
  getPasswordStrength(password: string): { strength: number; label: string; color: string } {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 8) return { strength: 25, label: 'Muy débil', color: 'bg-red-500' };
    if (password.length < 12) return { strength: 50, label: 'Débil', color: 'bg-yellow-500' };
    
    let score = 50;
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;
    if (password.length >= 16) score += 10;
    
    if (score < 70) return { strength: score, label: 'Regular', color: 'bg-yellow-500' };
    if (score < 90) return { strength: score, label: 'Buena', color: 'bg-green-500' };
    return { strength: 100, label: 'Excelente', color: 'bg-green-500' };
  }

  /**
   * Verificar si un requisito de contraseña se cumple
   */
  checkPasswordRequirement(password: string, requirement: string): boolean {
    switch (requirement) {
      case 'length':
        return password.length >= 12;
      case 'mixed':
        return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password);
      case 'special':
        return /[^a-zA-Z0-9]/.test(password);
      default:
        return false;
    }
  }

  /**
   * Alternar visibilidad de contraseña
   */
  togglePasswordVisibility(field: 'new' | 'confirm') {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  /**
   * Volver al login
   */
  goBackToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Solicitar otro enlace
   */
  requestAnotherLink() {
    this.step = 'request';
    this.error = null;
    this.success = null;
  }
}