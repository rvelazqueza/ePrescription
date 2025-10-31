import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface SolicitudRegistroData {
  perfilUsuario: string;
  tipoMedicamentosControlados: string;
  codigoProfesional: string;
  nombreCompleto: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  correoElectronico: string;
  telefonoMovil: string;
  aceptaTerminos: boolean;
  aceptaPrivacidad: boolean;
  configurarMfaAhora: boolean;
  archivoFirmaDigital?: File;
  pinCertificado?: string;
}

export interface ValidationResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  expiresIn?: number; // minutos
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudRegistroService {

  constructor() { }

  /**
   * Valida el código profesional con el colegio correspondiente
   */
  validarCodigoProfesional(codigo: string, perfil: string): Observable<ValidationResult> {
    // Simulación de validación con colegio profesional
    return of({ success: true, message: 'Código profesional validado correctamente' }).pipe(
      delay(2000), // Simular tiempo de respuesta de API
      map(result => {
        // Simular algunos casos de error para testing
        if (codigo === 'ERROR-123') {
          return { success: false, message: 'Código profesional no encontrado' };
        }
        if (codigo === 'INACTIVE-456') {
          return { success: false, message: 'El profesional no está activo en el colegio' };
        }
        return result;
      })
    );
  }

  /**
   * Envía código de verificación por correo electrónico
   */
  enviarCodigoVerificacionCorreo(email: string): Observable<VerificationResult> {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return throwError(() => new Error('Formato de correo electrónico inválido'));
    }

    return of({
      success: true,
      message: 'Código de verificación enviado al correo',
      expiresIn: 5
    }).pipe(delay(1500));
  }

  /**
   * Envía código de verificación por SMS
   */
  enviarCodigoVerificacionSMS(telefono: string): Observable<VerificationResult> {
    // Validar formato de teléfono básico
    const telefonoRegex = /^\+?[1-9]\d{1,14}$/;
    if (!telefonoRegex.test(telefono.replace(/\s/g, ''))) {
      return throwError(() => new Error('Formato de teléfono inválido'));
    }

    return of({
      success: true,
      message: 'Código de verificación enviado por SMS',
      expiresIn: 5
    }).pipe(delay(1500));
  }

  /**
   * Verifica el código de correo electrónico
   */
  verificarCodigoCorreo(email: string, codigo: string): Observable<ValidationResult> {
    return of({ success: true, message: 'Correo electrónico verificado' }).pipe(
      delay(1000),
      map(result => {
        // Simular validación de código
        if (codigo === '0000') {
          return { success: false, message: 'Código de verificación incorrecto' };
        }
        if (codigo === '9999') {
          return { success: false, message: 'El código ha expirado' };
        }
        return result;
      })
    );
  }

  /**
   * Verifica el código de SMS
   */
  verificarCodigoSMS(telefono: string, codigo: string): Observable<ValidationResult> {
    return of({ success: true, message: 'Teléfono verificado' }).pipe(
      delay(1000),
      map(result => {
        // Simular validación de código
        if (codigo === '0000') {
          return { success: false, message: 'Código de verificación incorrecto' };
        }
        if (codigo === '9999') {
          return { success: false, message: 'El código ha expirado' };
        }
        return result;
      })
    );
  }

  /**
   * Valida archivo de firma digital
   */
  validarArchivoFirmaDigital(archivo: File): Observable<ValidationResult> {
    return new Observable(observer => {
      // Validar extensión
      const extensionesPermitidas = ['.p12', '.pfx'];
      const extension = archivo.name.toLowerCase().substring(archivo.name.lastIndexOf('.'));
      
      if (!extensionesPermitidas.includes(extension)) {
        observer.next({
          success: false,
          message: 'Formato de archivo no válido. Use archivos .p12 o .pfx'
        });
        observer.complete();
        return;
      }

      // Validar tamaño (máximo 5MB)
      const tamañoMaximo = 5 * 1024 * 1024; // 5MB en bytes
      if (archivo.size > tamañoMaximo) {
        observer.next({
          success: false,
          message: 'El archivo es demasiado grande. Máximo 5MB permitido'
        });
        observer.complete();
        return;
      }

      // Simular validación del certificado
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Archivo de firma digital válido'
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Envía la solicitud de registro completa
   */
  enviarSolicitudRegistro(data: SolicitudRegistroData): Observable<ValidationResult> {
    return of({
      success: true,
      message: 'Solicitud de registro enviada exitosamente',
      data: {
        solicitudId: this.generateSolicitudId(),
        fechaEnvio: new Date().toISOString(),
        estado: 'PENDIENTE_REVISION'
      }
    }).pipe(delay(2000));
  }

  /**
   * Obtiene la lista de perfiles de usuario disponibles
   */
  getPerfilesUsuario(): Observable<any[]> {
    const perfiles = [
      { value: "medico", label: "Médico", colegio: "Colegio de Médicos y Cirujanos de Costa Rica" },
      { value: "farmaceutico", label: "Farmacéutico / Regente Farmacéutico", colegio: "Colegio de Farmacéuticos de Costa Rica" },
      { value: "odontologo", label: "Odontólogo", colegio: "Colegio de Cirujanos Dentistas de Costa Rica" },
      { value: "enfermero", label: "Enfermero / Obstetra", colegio: "Colegio de Enfermeros de Costa Rica" },
      { value: "veterinario", label: "Médico Veterinario", colegio: "Colegio de Médicos Veterinarios de Costa Rica" },
      { value: "farmacia", label: "Farmacia", colegio: "N/A" },
      { value: "centro_medico", label: "Centro Médico", colegio: "N/A" },
      { value: "drogueria", label: "Droguería", colegio: "N/A" },
      { value: "laboratorio", label: "Laboratorio", colegio: "N/A" },
      { value: "funcionario", label: "Funcionario de Salud", colegio: "N/A" }
    ];

    return of(perfiles);
  }

  /**
   * Verifica si un tipo de medicamento requiere firma digital obligatoria
   */
  requiereFirmaDigitalObligatoria(tipoMedicamento: string): boolean {
    return tipoMedicamento === 'estupefacientes' || tipoMedicamento === 'psicotropicos';
  }

  /**
   * Genera un ID único para la solicitud
   */
  private generateSolicitudId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `SOL-${timestamp}-${randomStr}`.toUpperCase();
  }

  /**
   * Obtiene el estado de una solicitud por ID
   */
  getEstadoSolicitud(solicitudId: string): Observable<any> {
    return of({
      id: solicitudId,
      estado: 'PENDIENTE_REVISION',
      fechaEnvio: new Date().toISOString(),
      tiempoEstimadoRevision: '1-2 días hábiles',
      proximoPaso: 'Esperar notificación de aprobación'
    }).pipe(delay(500));
  }
}