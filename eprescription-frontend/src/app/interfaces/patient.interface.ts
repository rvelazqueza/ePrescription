// Core patient data interface based on existing NewPatientDialog structure
export interface PatientData {
  id: string;
  fullName: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  age: number;
  gender: "M" | "F";
  bloodType?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  country: string;
  occupation?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceType?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  clinicalNotes?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  registrationDate: string;
  status: "active" | "inactive";
  lastVisit?: string;
}

// Medical alert interface for enhanced patient information
export interface MedicalAlert {
  name: string;
  severity: 'high' | 'medium' | 'low';
  dateAdded: string;
  notes?: string;
}

// Emergency contact interface for enhanced patient data
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Enhanced patient data interface with statistics and medical alerts
export interface EnhancedPatientData extends PatientData {
  // Calculated statistics
  statistics: {
    totalPrescriptions: number;
    activePrescriptions: number;
    lastVisitDays: number;
    averageVisitsPerMonth: number;
  };
  
  // Organized medical alerts
  medicalAlerts: {
    allergies: MedicalAlert[];
    chronicConditions: MedicalAlert[];
    criticalNotes: string[];
  };
  
  // Enhanced contact information
  contactInfo: {
    primaryPhone: string;
    secondaryPhone?: string;
    email?: string;
    emergencyContact?: EmergencyContact;
  };
  
  // Enhanced insurance information
  insurance: {
    provider: string;
    number: string;
    type: string;
    validUntil?: string;
  };
}

// Interface for patient search results
export interface PatientSearchResult {
  patients: PatientData[];
  totalCount: number;
  hasMore: boolean;
}

// Interface for recent patients with additional visit information
export interface RecentPatient extends PatientData {
  lastVisitDate: string;
  lastPrescriptionId?: string;
  visitCount: number;
}

// Search criteria type for advanced search
export type SearchCriteria = "name" | "idNumber" | "phone" | "email";

// Search filters interface
export interface SearchFilters {
  criteria: SearchCriteria;
  query: string;
  minLength: number;
}

// Patient card display interface for lists
export interface PatientCardData {
  id: string;
  fullName: string;
  idNumber: string;
  age: number;
  gender: "M" | "F";
  lastVisit?: string;
  hasAllergies: boolean;
  hasChronicConditions: boolean;
  medicationCount: number;
}

// Prescription status types
export type PrescriptionStatus = 'dispensed' | 'pending' | 'expired' | 'cancelled';

// Medication summary interface for prescriptions
export interface MedicationSummary {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// Doctor information interface for prescriptions
export interface DoctorInfo {
  name: string;
  specialty: string;
  licenseNumber?: string;
  institution?: string;
}

// Prescription summary interface for patient history
export interface PrescriptionSummary {
  id: string;
  prescriptionNumber: string;
  date: string;
  doctor: DoctorInfo;
  medications: MedicationSummary[];
  status: PrescriptionStatus;
  diagnosis: string;
  notes?: string;
  dispensedDate?: string;
  expirationDate?: string;
  pharmacyInfo?: {
    name: string;
    address: string;
  };
}

// Date range interface for filtering
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Prescription filters interface
export interface PrescriptionFilters {
  dateRange?: DateRange;
  status?: PrescriptionStatus[];
  doctors?: string[];
  medications?: string[];
  searchTerm?: string;
}

// Prescription history interface with statistics
export interface PrescriptionHistory {
  prescriptions: PrescriptionSummary[];
  totalCount: number;
  statistics: {
    totalPrescriptions: number;
    dispensedCount: number;
    pendingCount: number;
    expiredCount: number;
    cancelledCount: number;
    averagePerMonth: number;
  };
  filters: PrescriptionFilters;
}

// Patient profile data interface combining patient data with prescriptions
export interface PatientProfileData extends EnhancedPatientData {
  totalPrescriptions: number;
  activePrescriptions: number;
  recentPrescriptions: PrescriptionSummary[];
  prescriptionHistory?: PrescriptionHistory;
}