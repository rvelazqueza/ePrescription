/**
 * Store para Datos de Profesionales de Salud
 * Gestiona la información de doctores/médicos del sistema
 * 
 * Actualizado: 03/12/2025 - v3.0 - Simplificado a un solo médico
 */

export interface DoctorProfile {
  id: string;
  name: string;
  license: string;
  specialty: string;
  email: string;
  phone: string;
  medicalCenter: string;
  signature?: string; // URL o base64 de firma digital
}

const doctorsStore: Record<string, DoctorProfile> = {
  "DOC-007": {
    id: "DOC-007",
    name: "Dr. Miguel Ángel Torres Jiménez",
    license: "RM-78901-COL",
    specialty: "Medicina General",
    email: "mtorres@hospital.com",
    phone: "+57 314 567 8901",
    medicalCenter: "Hospital San Juan de Dios"
  }
};

export const DoctorsAPI = {
  getDoctor: (doctorId: string): DoctorProfile | null => {
    return doctorsStore[doctorId] || null;
  },

  getAllDoctors: (): DoctorProfile[] => {
    return Object.values(doctorsStore);
  },

  getDoctorByLicense: (license: string): DoctorProfile | null => {
    return Object.values(doctorsStore).find(d => d.license === license) || null;
  }
};

// Store de sesión actual (profesional activo)
let currentDoctorId: string = "DOC-007"; // Dr. Miguel Ángel Torres Jiménez

export const SessionAPI = {
  getCurrentDoctor: (): DoctorProfile | null => {
    return DoctorsAPI.getDoctor(currentDoctorId);
  },

  setCurrentDoctor: (doctorId: string): boolean => {
    if (doctorsStore[doctorId]) {
      currentDoctorId = doctorId;
      // Disparar evento para actualizar UI
      window.dispatchEvent(new CustomEvent('doctor-changed', { 
        detail: { doctorId } 
      }));
      return true;
    }
    return false;
  },

  getCurrentDoctorId: (): string => {
    return currentDoctorId;
  }
};

// Log de inicialización
const timestamp = new Date().toLocaleTimeString('es-ES');
console.log(`👨‍⚕️ [${timestamp}] Doctores cargados - Versión 3.0 SIMPLIFICADA`);
console.log(`   ✅ Dr. Miguel Ángel Torres Jiménez (DOC-007)`);
console.log(`   📌 Médico activo por defecto: DOC-007`);
