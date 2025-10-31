import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  fullName: string;
  idType: "Cédula" | "DIMEX" | "Pasaporte";
  idNumber: string;
  phone?: string;
  status: "pending" | "approved" | "rejected" | "active" | "blocked";
  mfaEnabled: boolean;
  mfaMethods: Array<"webauthn" | "totp" | "sms" | "email">;
  preferredAuthMethod: "password" | "digital_signature";
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  lastLogin?: string;
  digitalSignatureLinked: boolean;
}

export interface Session {
  id: string;
  userId: string;
  deviceFingerprint: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  createdAt: string;
  lastActivity: string;
  trusted: boolean;
  expiresAt: string;
}

export interface RegistrationRequest {
  id: string;
  fullName: string;
  idType: "Cédula" | "DIMEX" | "Pasaporte";
  idNumber: string;
  email: string;
  phone?: string;
  preferredAuthMethod: "password" | "digital_signature";
  emailVerified: boolean;
  phoneVerified: boolean;
  status: "pending" | "approved" | "rejected";
  riskScore: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users database
  private mockUsers: User[] = [
    {
      id: "user-001",
      email: "dr.martinez@hospital.cr",
      fullName: "Dr. Carlos Martínez Solís",
      idType: "Cédula",
      idNumber: "1-0234-0567",
      phone: "+506 8888-7777",
      status: "active",
      mfaEnabled: false,
      mfaMethods: ["totp", "webauthn"],
      preferredAuthMethod: "password",
      createdAt: "2024-01-15T10:00:00Z",
      approvedAt: "2024-01-15T14:30:00Z",
      approvedBy: "admin-001",
      lastLogin: "2025-10-06T08:15:00Z",
      digitalSignatureLinked: false
    },
    {
      id: "user-002",
      email: "dra.rojas@clinica.cr",
      fullName: "Dra. Ana Rojas Campos",
      idType: "Cédula",
      idNumber: "1-0456-0789",
      phone: "+506 8777-6666",
      status: "active",
      mfaEnabled: false,
      mfaMethods: ["totp"],
      preferredAuthMethod: "digital_signature",
      createdAt: "2024-02-10T09:00:00Z",
      approvedAt: "2024-02-10T11:00:00Z",
      approvedBy: "admin-001",
      lastLogin: "2025-10-05T14:30:00Z",
      digitalSignatureLinked: true
    }
  ];

  constructor() {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Validate that the user object has required properties
        if (user && user.id && user.email) {
          this.currentUserSubject.next(user);
        } else {
          // Clear invalid session data
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        // Clear invalid session data
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Login con usuario y contraseña
  login(email: string, password: string): Observable<{ success: boolean; requiresMFA?: boolean; userId?: string; error?: string }> {
    return new Observable(observer => {
      // Simular delay de red
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user || password !== "Demo123!") {
          observer.next({ 
            success: false, 
            error: "No pudimos autenticarte. Verifica tus datos. Si no tienes cuenta, puedes solicitar registro." 
          });
          observer.complete();
          return;
        }
        
        if (user.status === "blocked") {
          observer.next({ 
            success: false, 
            error: "Tu cuenta ha sido bloqueada. Contacta al administrador." 
          });
          observer.complete();
          return;
        }
        
        if (user.status === "pending") {
          observer.next({ 
            success: false, 
            error: "Tu cuenta está pendiente de aprobación. Te notificaremos por correo cuando sea aprobada." 
          });
          observer.complete();
          return;
        }
        
        if (user.mfaEnabled) {
          observer.next({ success: true, requiresMFA: true, userId: user.id });
        } else {
          // Login exitoso sin MFA
          this.setCurrentUser(user);
          observer.next({ success: true, requiresMFA: false, userId: user.id });
        }
        observer.complete();
      }, 800);
    });
  }

  // Verificar MFA
  verifyMFA(userId: string, code: string, method: string): Observable<{ success: boolean; error?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Mock: acepta código "123456" o cualquier código de 6 dígitos para demo
        if (code === "123456" || /^\d{6}$/.test(code)) {
          const user = this.mockUsers.find(u => u.id === userId);
          if (user) {
            this.setCurrentUser(user);
          }
          observer.next({ success: true });
        } else {
          observer.next({ 
            success: false, 
            error: "Código incorrecto o vencido. Intenta nuevamente." 
          });
        }
        observer.complete();
      }, 600);
    });
  }

  // Validar firma digital GAUDI
  validateGaudiSignature(idNumber: string, signatureData: string): Observable<{ 
    success: boolean; 
    userId?: string; 
    error?: string;
    certificateInfo?: {
      subject: string;
      issuer: string;
      validFrom: string;
      validUntil: string;
      serialNumber: string;
    };
  }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Validar formato de cédula
        if (!/^\d-\d{4}-\d{4}$/.test(idNumber)) {
          observer.next({ 
            success: false, 
            error: "Formato de cédula inválido. Usa el formato: 0-0000-0000" 
          });
          observer.complete();
          return;
        }
        
        // Mock: buscar usuario con firma digital vinculada
        const user = this.mockUsers.find(u => u.idNumber === idNumber && u.digitalSignatureLinked);
        
        if (!user) {
          observer.next({ 
            success: false, 
            error: "No se pudo validar tu certificado digital. Verifica que esté vigente y no revocado." 
          });
          observer.complete();
          return;
        }
        
        this.setCurrentUser(user);
        observer.next({ 
          success: true,
          userId: user.id,
          certificateInfo: {
            subject: `CN=${user.fullName}, SERIALNUMBER=${idNumber}, C=CR`,
            issuer: "CN=CA RAIZ NACIONAL - COSTA RICA v2, O=BANCO CENTRAL DE COSTA RICA, C=CR",
            validFrom: "2024-01-15T00:00:00Z",
            validUntil: "2026-01-14T23:59:59Z",
            serialNumber: "3A2F1B9C8D7E6F5A4B3C2D1E0F9A8B7C"
          }
        });
        observer.complete();
      }, 1500);
    });
  }

  // Solicitar recuperación de contraseña
  requestPasswordRecovery(email: string): Observable<{ success: boolean; error?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Siempre retorna success para no revelar existencia de cuenta
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  // Iniciar recuperación de contraseña (alias para compatibilidad)
  initiatePasswordRecovery(email: string): Observable<{ success: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Siempre retorna success para no revelar existencia de cuenta
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  // Resetear contraseña
  resetPassword(token: string, newPassword: string): Observable<{ success: boolean; error?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        if (token.length < 20) {
          observer.next({ 
            success: false, 
            error: "Este enlace ha expirado o no es válido. Solicita uno nuevo." 
          });
          observer.complete();
          return;
        }
        
        if (newPassword.length < 12) {
          observer.next({ 
            success: false, 
            error: "La contraseña debe tener al menos 12 caracteres." 
          });
          observer.complete();
          return;
        }
        
        observer.next({ success: true });
        observer.complete();
      }, 800);
    });
  }

  private setCurrentUser(user: User): void {
    // Actualizar lastLogin
    user.lastLogin = new Date().toISOString();
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    // Clear any other session-related data if needed
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('refreshToken');
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUsers(): User[] {
    return [...this.mockUsers];
  }
}