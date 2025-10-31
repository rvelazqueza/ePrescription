export interface Doctor {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  specialty: string;
  subspecialties: string[];
  licenseNumber: string;
  licenseExpiry: string;
  email: string;
  phone: string;
  officePhone?: string;
  address: string;
  city: string;
  country: string;
  university: string;
  graduationYear: number;
  yearsOfExperience: number;
  certifications: string[];
  totalPrescriptions: number;
  monthlyPrescriptions: number;
  totalPatients: number;
  averageMonthlyPrescriptions: number;
  registrationDate: string;
  lastActivity: string;
  status: 'active' | 'inactive';
  certificationStatus: 'verified' | 'expired' | 'pending';
  isOnDuty: boolean;
  schedule: Array<{
    days: string;
    hours: string;
  }>;
  notes?: string;
}

export interface SearchFilters {
  quickSearch: string;
  nameFilter: string;
  specialtyFilter: string;
  statusFilter: 'all' | 'active' | 'inactive';
  certificationFilter: 'all' | 'verified' | 'expired' | 'pending';
  licenseFilter: string;
  universityFilter: string;
  minExperience: number | null;
  maxExperience: number | null;
}

export interface SearchMode {
  mode: 'quick' | 'advanced';
}

export interface DoctorStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  onDuty: number;
  licenseExpiring: number;
}