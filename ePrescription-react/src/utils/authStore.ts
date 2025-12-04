/**
 * Mock Authentication Store
 * En producción: integrar con Supabase Auth + MFA
 */

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
  perfilUsuario?: string;
  tipoMedicamentosControlados?: "estupefacientes" | "psicotropicos" | "antimicrobianos" | "ninguno";
  codigoProfesional?: string;
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

// Mock users database
const mockUsers: User[] = [
  {
    id: "USR-7890",
    email: "juan.perez@hospital.com",
    fullName: "Dr. Juan Pérez",
    idType: "Cédula",
    idNumber: "1-1234-5678",
    phone: "+506 8888-9999",
    status: "active",
    mfaEnabled: true,
    mfaMethods: ["totp", "webauthn"],
    preferredAuthMethod: "password",
    createdAt: "2023-02-10T08:00:00Z",
    approvedAt: "2023-02-10T10:00:00Z",
    approvedBy: "admin-001",
    lastLogin: "2025-10-08T09:30:00Z",
    digitalSignatureLinked: false
  },
  {
    id: "user-001",
    email: "dr.martinez@hospital.cr",
    fullName: "Dr. Carlos Martínez Solís",
    idType: "Cédula",
    idNumber: "1-0234-0567",
    phone: "+506 8888-7777",
    status: "active",
    mfaEnabled: true,
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
    mfaEnabled: true,
    mfaMethods: ["totp"],
    preferredAuthMethod: "digital_signature",
    createdAt: "2024-02-10T09:00:00Z",
    approvedAt: "2024-02-10T11:00:00Z",
    approvedBy: "admin-001",
    lastLogin: "2025-10-05T14:30:00Z",
    digitalSignatureLinked: true
  }
];

// Mock registration requests
const mockRegistrationRequests: RegistrationRequest[] = [
  {
    id: "req-001",
    fullName: "Dr. Luis Hernández Quesada",
    idType: "Cédula",
    idNumber: "1-0678-0901",
    email: "luis.hernandez@medico.cr",
    phone: "+506 8666-5555",
    preferredAuthMethod: "password",
    emailVerified: true,
    phoneVerified: true,
    status: "pending",
    riskScore: 0.15,
    submittedAt: "2025-10-05T16:45:00Z",
    termsAccepted: true,
    privacyAccepted: true
  },
  {
    id: "req-002",
    fullName: "Dra. María Céspedes Mora",
    idType: "Cédula",
    idNumber: "1-0789-0123",
    email: "maria.cespedes@clinica.cr",
    phone: "+506 8555-4444",
    preferredAuthMethod: "digital_signature",
    emailVerified: true,
    phoneVerified: false,
    status: "pending",
    riskScore: 0.08,
    submittedAt: "2025-10-06T09:30:00Z",
    termsAccepted: true,
    privacyAccepted: true
  },
  {
    id: "req-003",
    fullName: "Dr. Roberto Alvarado Soto",
    idType: "Cédula",
    idNumber: "1-0890-0234",
    email: "roberto.alvarado@hospital.cr",
    preferredAuthMethod: "password",
    emailVerified: true,
    phoneVerified: false,
    status: "rejected",
    riskScore: 0.75,
    submittedAt: "2025-10-04T11:20:00Z",
    reviewedAt: "2025-10-04T15:00:00Z",
    reviewedBy: "admin-001",
    rejectionReason: "Documentación incompleta - No se pudo verificar número de colegiado",
    termsAccepted: true,
    privacyAccepted: true
  }
];

// Mock active sessions
const mockSessions: Session[] = [
  {
    id: "session-001",
    userId: "user-001",
    deviceFingerprint: "fp-chrome-desktop-001",
    deviceName: "Chrome en Windows 11",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0",
    location: "San José, Costa Rica",
    createdAt: "2025-10-06T08:15:00Z",
    lastActivity: "2025-10-06T10:30:00Z",
    trusted: true,
    expiresAt: "2025-10-13T08:15:00Z"
  },
  {
    id: "session-002",
    userId: "user-001",
    deviceFingerprint: "fp-safari-iphone-001",
    deviceName: "Safari en iPhone 14",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1",
    location: "San José, Costa Rica",
    createdAt: "2025-10-05T14:20:00Z",
    lastActivity: "2025-10-06T07:45:00Z",
    trusted: true,
    expiresAt: "2025-11-04T14:20:00Z"
  },
  {
    id: "session-003",
    userId: "user-001",
    deviceFingerprint: "fp-firefox-linux-001",
    deviceName: "Firefox en Ubuntu 22.04",
    ipAddress: "201.194.23.45",
    userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64) Firefox/120.0",
    location: "Heredia, Costa Rica",
    createdAt: "2025-10-06T06:00:00Z",
    lastActivity: "2025-10-06T09:15:00Z",
    trusted: false,
    expiresAt: "2025-10-06T18:00:00Z"
  }
];

export const authStore = {
  // Simular login
  login: async (email: string, password: string): Promise<{ success: boolean; requiresMFA?: boolean; userId?: string; error?: string }> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || password !== "Demo123!") {
      return { 
        success: false, 
        error: "No pudimos autenticarte. Verifica tus datos. Si no tienes cuenta, puedes solicitar registro." 
      };
    }
    
    if (user.status === "blocked") {
      return { 
        success: false, 
        error: "Tu cuenta ha sido bloqueada. Contacta al administrador." 
      };
    }
    
    if (user.status === "pending") {
      return { 
        success: false, 
        error: "Tu cuenta está pendiente de aprobación. Te notificaremos por correo cuando sea aprobada." 
      };
    }
    
    if (user.mfaEnabled) {
      return { success: true, requiresMFA: true, userId: user.id };
    }
    
    return { success: true, requiresMFA: false, userId: user.id };
  },
  
  // Verificar MFA
  verifyMFA: async (userId: string, code: string, method: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock: acepta código "123456" o cualquier código de 6 dígitos para demo
    if (code === "123456" || /^\d{6}$/.test(code)) {
      return { success: true };
    }
    
    return { 
      success: false, 
      error: "Código incorrecto o vencido. Intenta nuevamente." 
    };
  },
  
  // Iniciar recuperación de contraseña
  initiatePasswordRecovery: async (email: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Siempre retorna success para no revelar existencia de cuenta
    return { success: true };
  },
  
  // Resetear contraseña
  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (token.length < 20) {
      return { 
        success: false, 
        error: "Este enlace ha expirado o no es válido. Solicita uno nuevo." 
      };
    }
    
    if (newPassword.length < 12) {
      return { 
        success: false, 
        error: "La contraseña debe tener al menos 12 caracteres." 
      };
    }
    
    return { success: true };
  },
  
  // Enviar solicitud de registro
  submitRegistration: async (data: Omit<RegistrationRequest, "id" | "status" | "submittedAt" | "riskScore">): Promise<{ success: boolean; requestId?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newRequest: RegistrationRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
      riskScore: Math.random() * 0.3 // Mock risk score
    };
    
    mockRegistrationRequests.unshift(newRequest);
    
    return { success: true, requestId: newRequest.id };
  },
  
  // Verificar email con código OTP
  verifyEmail: async (code: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock: acepta código "123456" o cualquier código de 6 dígitos para demo
    if (code === "123456" || /^\d{6}$/.test(code)) {
      return { success: true };
    }
    
    return { 
      success: false, 
      error: "Código incorrecto o vencido. Verifica e intenta nuevamente." 
    };
  },
  
  // Verificar teléfono con OTP
  verifyPhone: async (code: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (code === "123456" || /^\d{6}$/.test(code)) {
      return { success: true };
    }
    
    return { 
      success: false, 
      error: "Código incorrecto o vencido. Tienes 2 intentos restantes." 
    };
  },
  
  // Obtener usuarios
  getUsers: (): User[] => {
    return [...mockUsers];
  },
  
  // Obtener solicitudes de registro
  getRegistrationRequests: (status?: RegistrationRequest["status"]): RegistrationRequest[] => {
    if (status) {
      return mockRegistrationRequests.filter(r => r.status === status);
    }
    return [...mockRegistrationRequests];
  },
  
  // Aprobar solicitud
  approveRequest: async (requestId: string, adminId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const request = mockRegistrationRequests.find(r => r.id === requestId);
    if (request) {
      request.status = "approved";
      request.reviewedAt = new Date().toISOString();
      request.reviewedBy = adminId;
      
      // Crear usuario
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: request.email,
        fullName: request.fullName,
        idType: request.idType,
        idNumber: request.idNumber,
        phone: request.phone,
        status: "approved",
        mfaEnabled: false,
        mfaMethods: [],
        preferredAuthMethod: request.preferredAuthMethod,
        createdAt: request.submittedAt,
        approvedAt: request.reviewedAt,
        approvedBy: request.reviewedBy,
        digitalSignatureLinked: request.preferredAuthMethod === "digital_signature"
      };
      
      mockUsers.push(newUser);
    }
    
    return { success: true };
  },
  
  // Rechazar solicitud
  rejectRequest: async (requestId: string, adminId: string, reason: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const request = mockRegistrationRequests.find(r => r.id === requestId);
    if (request) {
      request.status = "rejected";
      request.reviewedAt = new Date().toISOString();
      request.reviewedBy = adminId;
      request.rejectionReason = reason;
    }
    
    return { success: true };
  },
  
  // Obtener sesiones activas
  getSessions: (userId: string): Session[] => {
    return mockSessions.filter(s => s.userId === userId);
  },
  
  // Cerrar sesión
  terminateSession: async (sessionId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockSessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      mockSessions.splice(index, 1);
    }
    return { success: true };
  },
  
  // Cerrar todas las sesiones
  terminateAllSessions: async (userId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const sessionsToRemove = mockSessions.filter(s => s.userId === userId);
    sessionsToRemove.forEach(session => {
      const index = mockSessions.indexOf(session);
      if (index !== -1) {
        mockSessions.splice(index, 1);
      }
    });
    return { success: true };
  },
  
  // Validar firma digital GAUDI
  validateGaudiSignature: async (idNumber: string, signatureData: string): Promise<{ 
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
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Validar formato de cédula
    if (!/^\d-\d{4}-\d{4}$/.test(idNumber)) {
      return { 
        success: false, 
        error: "Formato de cédula inválido. Usa el formato: 0-0000-0000" 
      };
    }
    
    // Mock: buscar usuario con firma digital vinculada
    const user = mockUsers.find(u => u.idNumber === idNumber && u.digitalSignatureLinked);
    
    if (!user) {
      return { 
        success: false, 
        error: "No se pudo validar tu certificado digital. Verifica que esté vigente y no revocado." 
      };
    }
    
    return { 
      success: true,
      userId: user.id,
      certificateInfo: {
        subject: `CN=${user.fullName}, SERIALNUMBER=${idNumber}, C=CR`,
        issuer: "CN=CA RAIZ NACIONAL - COSTA RICA v2, O=BANCO CENTRAL DE COSTA RICA, C=CR",
        validFrom: "2024-01-15T00:00:00Z",
        validUntil: "2026-01-14T23:59:59Z",
        serialNumber: "3A2F1B9C8D7E6F5A4B3C2D1E0F9A8B7C"
      }
    };
  }
};
