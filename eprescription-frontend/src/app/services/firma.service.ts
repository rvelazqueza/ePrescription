import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface PrescriptionToSign {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  createdDate: string;
  createdTime: string;
  medicinesCount: number;
  medicines: string[];
  status: string;
  diagnosis: string;
}

export interface SignedPrescription {
  id: string;
  patientName: string;
  doctorName: string;
  signedDate: string;
  signedTime: string;
  qrCode: string;
  qrUrl: string;
  token: string;
  certificateId: string;
  signatureHash: string;
  status: string;
  validUntil: string;
}

export interface SignatureTrailItem {
  id: string;
  prescriptionId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  action: string;
  actionLabel: string;
  timestamp: string;
  certificateId: string | null;
  certificateIssuer: string | null;
  certificateValidFrom: string | null;
  certificateValidTo: string | null;
  signatureMethod: string;
  ipAddress: string;
  deviceInfo: string;
  qrGenerated: boolean;
  tokenGenerated: boolean;
  status: string;
}

export interface VerificationResult {
  valid: boolean;
  prescriptionId: string;
  patientName: string;
  doctorName: string;
  signedDate: string;
  medicines: string[];
  status: string;
  certificateId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirmaService {
  // Cache para evitar recargas innecesarias
  private prescriptionsCache: PrescriptionToSign[] | null = null;
  private signedPrescriptionsCache: SignedPrescription[] | null = null;
  private trailCache: SignatureTrailItem[] | null = null;

  private mockPrescriptionsToSign: PrescriptionToSign[] = [
    {
      id: "RX-2024-0198",
      patientId: "PAT-0012",
      patientName: "María González",
      doctorId: "DOC-003",
      doctorName: "Dra. Isabel Moreno",
      createdDate: "2024-10-01",
      createdTime: "14:35",
      medicinesCount: 3,
      medicines: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Omeprazol 20mg"],
      status: "pending_signature",
      diagnosis: "Gastritis aguda con cefalea tensional"
    },
    {
      id: "RX-2024-0199",
      patientId: "PAT-0045",
      patientName: "Carlos Ramírez",
      doctorId: "DOC-001",
      doctorName: "Dr. Carlos Martínez",
      createdDate: "2024-10-01",
      createdTime: "15:12",
      medicinesCount: 2,
      medicines: ["Losartán 50mg", "Atorvastatina 20mg"],
      status: "pending_signature",
      diagnosis: "Hipertensión arterial esencial"
    },
    {
      id: "RX-2024-0200",
      patientId: "PAT-0089",
      patientName: "Ana Herrera",
      doctorId: "DOC-005",
      doctorName: "Dr. Miguel Ruiz",
      createdDate: "2024-10-01",
      createdTime: "15:45",
      medicinesCount: 1,
      medicines: ["Paracetamol 500mg"],
      status: "pending_signature",
      diagnosis: "Dolor lumbar agudo"
    }
  ];

  private mockSignedPrescriptions: SignedPrescription[] = [
    {
      id: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorName: "Dr. Carlos Martínez",
      signedDate: "2024-10-01",
      signedTime: "08:30",
      qrCode: "QR-2024-0192-A3B5C7D9E1F2",
      qrUrl: "https://eprescription.hospital.com/verify/QR-2024-0192-A3B5C7D9E1F2",
      token: "VERIFY-0192-2024",
      certificateId: "CERT-DR-MARTINEZ-2024",
      signatureHash: "SHA256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      status: "signed",
      validUntil: "2024-11-01"
    },
    {
      id: "RX-2024-0195",
      patientName: "Roberto Sánchez",
      doctorName: "Farmacéutica Ana García",
      signedDate: "2024-10-01",
      signedTime: "11:20",
      qrCode: "QR-2024-0195-B4C6D8E0F2G4",
      qrUrl: "https://eprescription.hospital.com/verify/QR-2024-0195-B4C6D8E0F2G4",
      token: "VERIFY-0195-2024",
      certificateId: "CERT-FARMACIA-2024",
      signatureHash: "SHA256:p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
      status: "signed",
      validUntil: "2024-10-15"
    }
  ];

  private mockSignatureTrail: SignatureTrailItem[] = [
    {
      id: "SIGN-001",
      prescriptionId: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorId: "DOC-001",
      doctorName: "Dr. Carlos Martínez",
      action: "signature_created",
      actionLabel: "Firma digital aplicada",
      timestamp: "2024-10-01 08:30:05",
      certificateId: "CERT-DR-MARTINEZ-2024",
      certificateIssuer: "Autoridad Certificadora Médica",
      certificateValidFrom: "2024-01-01",
      certificateValidTo: "2025-12-31",
      signatureMethod: "Digital Certificate RSA 2048",
      ipAddress: "192.168.1.45",
      deviceInfo: "Windows PC - Chrome 118.0",
      qrGenerated: true,
      tokenGenerated: true,
      status: "valid"
    },
    {
      id: "SIGN-002",
      prescriptionId: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorId: "PHARM-001",
      doctorName: "Farmacéutica Ana García",
      action: "verification",
      actionLabel: "Verificación en farmacia",
      timestamp: "2024-10-01 10:15:30",
      certificateId: null,
      certificateIssuer: null,
      certificateValidFrom: null,
      certificateValidTo: null,
      signatureMethod: "QR Code Verification",
      ipAddress: "192.168.1.78",
      deviceInfo: "Scanner QR - Farmacia Central",
      qrGenerated: false,
      tokenGenerated: false,
      status: "verified"
    },
    {
      id: "SIGN-003",
      prescriptionId: "RX-2024-0195",
      patientName: "Roberto Sánchez",
      doctorId: "DOC-002",
      doctorName: "Dra. Laura Ramírez",
      action: "signature_created",
      actionLabel: "Firma digital aplicada",
      timestamp: "2024-10-01 11:20:15",
      certificateId: "CERT-DRA-RAMIREZ-2024",
      certificateIssuer: "Autoridad Certificadora Médica",
      certificateValidFrom: "2024-01-01",
      certificateValidTo: "2025-12-31",
      signatureMethod: "Digital Certificate RSA 2048",
      ipAddress: "192.168.1.67",
      deviceInfo: "Windows PC - Edge 118.0",
      qrGenerated: true,
      tokenGenerated: true,
      status: "valid"
    },
    {
      id: "SIGN-004",
      prescriptionId: "RX-2024-0178",
      patientName: "Carlos Ramírez",
      doctorId: "DOC-001",
      doctorName: "Dr. Carlos Martínez",
      action: "signature_revoked",
      actionLabel: "Firma revocada",
      timestamp: "2024-09-30 16:45:00",
      certificateId: "CERT-DR-MARTINEZ-2024",
      certificateIssuer: "Autoridad Certificadora Médica",
      certificateValidFrom: "2024-01-01",
      certificateValidTo: "2025-12-31",
      signatureMethod: "Digital Certificate RSA 2048",
      ipAddress: "192.168.1.45",
      deviceInfo: "Windows PC - Chrome 118.0",
      qrGenerated: false,
      tokenGenerated: false,
      status: "revoked"
    }
  ];

  constructor() { }

  // Obtener recetas pendientes de firma
  getPrescriptionsToSign(): Observable<PrescriptionToSign[]> {
    if (this.prescriptionsCache) {
      return of(this.prescriptionsCache);
    }
    this.prescriptionsCache = [...this.mockPrescriptionsToSign];
    return of(this.prescriptionsCache);
  }

  // Obtener recetas firmadas con QR
  getSignedPrescriptions(): Observable<SignedPrescription[]> {
    if (this.signedPrescriptionsCache) {
      return of(this.signedPrescriptionsCache);
    }
    this.signedPrescriptionsCache = [...this.mockSignedPrescriptions];
    return of(this.signedPrescriptionsCache);
  }

  // Obtener trazabilidad de firmas
  getSignatureTrail(): Observable<SignatureTrailItem[]> {
    if (this.trailCache) {
      return of(this.trailCache);
    }
    this.trailCache = [...this.mockSignatureTrail];
    return of(this.trailCache);
  }

  // Firmar una receta
  signPrescription(prescriptionId: string, pin: string, certificatePassword: string): Observable<{success: boolean, message: string}> {
    return new Observable(observer => {
      setTimeout(() => {
        if (!pin || !certificatePassword) {
          observer.next({
            success: false,
            message: 'PIN y contraseña del certificado son requeridos'
          });
        } else {
          // Actualizar cache local
          if (this.prescriptionsCache) {
            this.prescriptionsCache = this.prescriptionsCache.filter(p => p.id !== prescriptionId);
          }
          // Actualizar datos mock
          this.mockPrescriptionsToSign = this.mockPrescriptionsToSign.filter(p => p.id !== prescriptionId);
          
          observer.next({
            success: true,
            message: `Receta ${prescriptionId} firmada digitalmente. QR generado.`
          });
        }
        observer.complete();
      }, 500); // Reducir tiempo de simulación
    });
  }

  // Verificar QR o Token
  verifyPrescription(input: string, method: 'qr' | 'token'): Observable<VerificationResult> {
    return new Observable(observer => {
      setTimeout(() => {
        // Simulación de verificación exitosa
        observer.next({
          valid: true,
          prescriptionId: "RX-2024-0192",
          patientName: "Elena Martínez",
          doctorName: "Dr. Carlos Martínez",
          signedDate: "2024-10-01 08:30",
          medicines: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Omeprazol 20mg"],
          status: "Válida y no dispensada",
          certificateId: "CERT-DR-MARTINEZ-2024"
        });
        observer.complete();
      }, 800); // Reducir tiempo de simulación
    });
  }

  // Estadísticas de firma (calculadas en tiempo real)
  getSignatureStats(): Observable<{pendingSignatures: number, signedToday: number, certificateValidDays: number}> {
    return of({
      pendingSignatures: this.mockPrescriptionsToSign.length,
      signedToday: 12,
      certificateValidDays: 365
    });
  }

  // Estadísticas de QR (calculadas en tiempo real)
  getQRStats(): Observable<{qrGenerated: number, verified: number, pending: number}> {
    return of({
      qrGenerated: this.mockSignedPrescriptions.length,
      verified: 45,
      pending: 3
    });
  }

  // Estadísticas de trazabilidad (calculadas en tiempo real)
  getTrailStats(): Observable<{total: number, valid: number, verified: number, revoked: number}> {
    const trail = this.trailCache || this.mockSignatureTrail;
    return of({
      total: trail.length,
      valid: trail.filter(t => t.status === 'valid').length,
      verified: trail.filter(t => t.status === 'verified').length,
      revoked: trail.filter(t => t.status === 'revoked').length
    });
  }

  // Limpiar cache (útil para refrescar datos)
  clearCache(): void {
    this.prescriptionsCache = null;
    this.signedPrescriptionsCache = null;
    this.trailCache = null;
  }
}