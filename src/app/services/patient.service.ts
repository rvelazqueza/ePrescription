import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, tap, switchMap } from 'rxjs/operators';
import { 
  PatientData, 
  RecentPatient, 
  PatientSearchResult, 
  PrescriptionSummary, 
  PrescriptionHistory, 
  PrescriptionFilters, 
  PrescriptionStatus,
  PatientProfileData,
  EnhancedPatientData
} from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private selectedPatientSubject = new BehaviorSubject<PatientData | null>(null);
  public selectedPatient$ = this.selectedPatientSubject.asObservable();

  // Mock data for recent patients (10-15 patients)
  private mockPatients: PatientData[] = [
    {
      id: '1',
      fullName: 'María Isabel López García',
      firstName: 'María Isabel',
      firstLastName: 'López',
      secondLastName: 'García',
      idType: 'Cédula Nacional',
      idNumber: '1-0234-0567',
      birthDate: '1985-03-15',
      age: 40,
      gender: 'F',
      bloodType: 'O+',
      phone: '3001234567',
      email: 'maria.lopez@email.com',
      address: 'Calle 123 #45-67',
      city: 'San José',
      country: 'Costa Rica',
      allergies: ['Penicilina', 'Mariscos'],
      chronicConditions: ['Hipertensión arterial'],
      currentMedications: ['Losartán 50mg', 'Hidroclorotiazida 12.5mg'],
      registrationDate: '2023-01-15',
      status: 'active',
      lastVisit: '2024-10-10'
    },
    {
      id: '2',
      fullName: 'Carlos Alberto Mendoza Silva',
      firstName: 'Carlos Alberto',
      firstLastName: 'Mendoza',
      secondLastName: 'Silva',
      idType: 'CC',
      idNumber: '80987654',
      birthDate: '1978-07-22',
      age: 46,
      gender: 'M',
      bloodType: 'A+',
      phone: '3109876543',
      email: 'carlos.mendoza@email.com',
      address: 'Carrera 45 #12-34',
      city: 'Medellín',
      country: 'Colombia',
      allergies: [],
      chronicConditions: ['Diabetes Tipo 2'],
      currentMedications: ['Metformina 850mg', 'Glibenclamida 5mg'],
      registrationDate: '2023-02-20',
      status: 'active',
      lastVisit: '2024-10-08'
    },
    {
      id: '3',
      fullName: 'Ana Sofía Herrera López',
      firstName: 'Ana Sofía',
      firstLastName: 'Herrera',
      secondLastName: 'López',
      idType: 'CC',
      idNumber: '63456789',
      birthDate: '1992-11-08',
      age: 31,
      gender: 'F',
      bloodType: 'B+',
      phone: '3156789012',
      email: 'ana.herrera@email.com',
      address: 'Avenida 68 #89-12',
      city: 'Cali',
      country: 'Colombia',
      allergies: ['Ibuprofeno'],
      chronicConditions: [],
      currentMedications: [],
      registrationDate: '2023-03-10',
      status: 'active',
      lastVisit: '2024-10-05'
    },
    {
      id: '4',
      fullName: 'Roberto José Vargas Castro',
      firstName: 'Roberto José',
      firstLastName: 'Vargas',
      secondLastName: 'Castro',
      idType: 'CC',
      idNumber: '71234567',
      birthDate: '1965-05-30',
      age: 59,
      gender: 'M',
      bloodType: 'AB+',
      phone: '3023456789',
      email: 'roberto.vargas@email.com',
      address: 'Calle 50 #23-45',
      city: 'Barranquilla',
      country: 'Colombia',
      allergies: ['Sulfonamidas'],
      chronicConditions: ['Hipertensión', 'Colesterol Alto'],
      currentMedications: ['Enalapril 10mg', 'Atorvastatina 20mg'],
      registrationDate: '2023-04-05',
      status: 'active',
      lastVisit: '2024-10-03'
    },
    {
      id: '5',
      fullName: 'Lucía Patricia Ramírez Torres',
      firstName: 'Lucía Patricia',
      firstLastName: 'Ramírez',
      secondLastName: 'Torres',
      idType: 'CC',
      idNumber: '55678901',
      birthDate: '1988-12-12',
      age: 35,
      gender: 'F',
      bloodType: 'O-',
      phone: '3187890123',
      email: 'lucia.ramirez@email.com',
      address: 'Transversal 15 #67-89',
      city: 'Bucaramanga',
      country: 'Colombia',
      allergies: [],
      chronicConditions: ['Asma'],
      currentMedications: ['Salbutamol inhalador'],
      registrationDate: '2023-05-18',
      status: 'active',
      lastVisit: '2024-09-28'
    },
    {
      id: '6',
      fullName: 'Diego Fernando Morales Pérez',
      firstName: 'Diego Fernando',
      firstLastName: 'Morales',
      secondLastName: 'Pérez',
      idType: 'CC',
      idNumber: '79345612',
      birthDate: '1990-04-18',
      age: 34,
      gender: 'M',
      bloodType: 'A-',
      phone: '3201234567',
      email: 'diego.morales@email.com',
      address: 'Calle 72 #34-56',
      city: 'Bogotá',
      country: 'Colombia',
      allergies: ['Aspirina'],
      chronicConditions: [],
      currentMedications: [],
      registrationDate: '2023-06-22',
      status: 'active',
      lastVisit: '2024-09-25'
    },
    {
      id: '7',
      fullName: 'Carmen Rosa Jiménez Vega',
      firstName: 'Carmen Rosa',
      firstLastName: 'Jiménez',
      secondLastName: 'Vega',
      idType: 'CC',
      idNumber: '41567890',
      birthDate: '1975-09-03',
      age: 49,
      gender: 'F',
      bloodType: 'B-',
      phone: '3134567890',
      email: 'carmen.jimenez@email.com',
      address: 'Carrera 30 #78-90',
      city: 'Medellín',
      country: 'Colombia',
      allergies: [],
      chronicConditions: ['Artritis Reumatoide'],
      currentMedications: ['Metotrexato 15mg', 'Ácido Fólico 5mg'],
      registrationDate: '2023-07-10',
      status: 'active',
      lastVisit: '2024-09-20'
    },
    {
      id: '8',
      fullName: 'Andrés Felipe Ruiz Gómez',
      firstName: 'Andrés Felipe',
      firstLastName: 'Ruiz',
      secondLastName: 'Gómez',
      idType: 'CC',
      idNumber: '98765432',
      birthDate: '1995-01-25',
      age: 29,
      gender: 'M',
      bloodType: 'O+',
      phone: '3167890123',
      email: 'andres.ruiz@email.com',
      address: 'Diagonal 45 #23-67',
      city: 'Cali',
      country: 'Colombia',
      allergies: ['Látex'],
      chronicConditions: [],
      currentMedications: [],
      registrationDate: '2023-08-15',
      status: 'active',
      lastVisit: '2024-09-18'
    },
    {
      id: '9',
      fullName: 'Patricia Isabel Delgado Moreno',
      firstName: 'Patricia Isabel',
      firstLastName: 'Delgado',
      secondLastName: 'Moreno',
      idType: 'CC',
      idNumber: '36789012',
      birthDate: '1982-06-14',
      age: 42,
      gender: 'F',
      bloodType: 'AB-',
      phone: '3045678901',
      email: 'patricia.delgado@email.com',
      address: 'Avenida 19 #56-78',
      city: 'Cartagena',
      country: 'Colombia',
      allergies: ['Contraste Yodado'],
      chronicConditions: ['Hipotiroidismo'],
      currentMedications: ['Levotiroxina 100mcg'],
      registrationDate: '2023-09-05',
      status: 'active',
      lastVisit: '2024-09-15'
    },
    {
      id: '10',
      fullName: 'Javier Eduardo Sánchez Ortiz',
      firstName: 'Javier Eduardo',
      firstLastName: 'Sánchez',
      secondLastName: 'Ortiz',
      idType: 'CC',
      idNumber: '85432109',
      birthDate: '1987-10-07',
      age: 37,
      gender: 'M',
      bloodType: 'A+',
      phone: '3198765432',
      email: 'javier.sanchez@email.com',
      address: 'Calle 85 #12-34',
      city: 'Pereira',
      country: 'Colombia',
      allergies: [],
      chronicConditions: ['Migraña Crónica'],
      currentMedications: ['Sumatriptán 50mg'],
      registrationDate: '2023-10-12',
      status: 'active',
      lastVisit: '2024-09-12'
    },
    {
      id: '11',
      fullName: 'Mónica Alejandra Castro Restrepo',
      firstName: 'Mónica Alejandra',
      firstLastName: 'Castro',
      secondLastName: 'Restrepo',
      idType: 'CC',
      idNumber: '47890123',
      birthDate: '1993-08-29',
      age: 31,
      gender: 'F',
      bloodType: 'O-',
      phone: '3112345678',
      email: 'monica.castro@email.com',
      address: 'Transversal 25 #67-89',
      city: 'Manizales',
      country: 'Colombia',
      allergies: ['Amoxicilina'],
      chronicConditions: [],
      currentMedications: [],
      registrationDate: '2023-11-20',
      status: 'active',
      lastVisit: '2024-09-10'
    },
    {
      id: '12',
      fullName: 'Fernando José Aguilar Rojas',
      firstName: 'Fernando José',
      firstLastName: 'Aguilar',
      secondLastName: 'Rojas',
      idType: 'CC',
      idNumber: '92345678',
      birthDate: '1970-02-16',
      age: 54,
      gender: 'M',
      bloodType: 'B+',
      phone: '3076543210',
      email: 'fernando.aguilar@email.com',
      address: 'Carrera 15 #89-01',
      city: 'Santa Marta',
      country: 'Colombia',
      allergies: [],
      chronicConditions: ['EPOC', 'Hipertensión'],
      currentMedications: ['Salbutamol', 'Amlodipino 5mg'],
      registrationDate: '2023-12-08',
      status: 'active',
      lastVisit: '2024-09-08'
    },
    {
      id: '13',
      fullName: 'Claudia Marcela Ospina Vargas',
      firstName: 'Claudia Marcela',
      firstLastName: 'Ospina',
      secondLastName: 'Vargas',
      idType: 'CC',
      idNumber: '58901234',
      birthDate: '1986-12-05',
      age: 37,
      gender: 'F',
      bloodType: 'A-',
      phone: '3089012345',
      email: 'claudia.ospina@email.com',
      address: 'Avenida 68 #45-23',
      city: 'Ibagué',
      country: 'Colombia',
      allergies: ['Diclofenaco'],
      chronicConditions: ['Fibromialgia'],
      currentMedications: ['Pregabalina 150mg', 'Duloxetina 60mg'],
      registrationDate: '2024-01-15',
      status: 'active',
      lastVisit: '2024-09-05'
    },
    {
      id: '14',
      fullName: 'Ricardo Alejandro Herrera Muñoz',
      firstName: 'Ricardo Alejandro',
      firstLastName: 'Herrera',
      secondLastName: 'Muñoz',
      idType: 'CC',
      idNumber: '73456789',
      birthDate: '1991-07-11',
      age: 33,
      gender: 'M',
      bloodType: 'AB+',
      phone: '3156789012',
      email: 'ricardo.herrera@email.com',
      address: 'Calle 45 #78-90',
      city: 'Villavicencio',
      country: 'Colombia',
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      registrationDate: '2024-02-28',
      status: 'active',
      lastVisit: '2024-09-02'
    },
    {
      id: '15',
      fullName: 'Esperanza del Carmen Moreno Silva',
      firstName: 'Esperanza del Carmen',
      firstLastName: 'Moreno',
      secondLastName: 'Silva',
      idType: 'CC',
      idNumber: '29876543',
      birthDate: '1968-11-23',
      age: 55,
      gender: 'F',
      bloodType: 'O+',
      phone: '3023456789',
      email: 'esperanza.moreno@email.com',
      address: 'Diagonal 78 #34-56',
      city: 'Pasto',
      country: 'Colombia',
      allergies: ['Morfina'],
      chronicConditions: ['Osteoporosis', 'Hipertensión'],
      currentMedications: ['Alendronato 70mg', 'Losartán 100mg', 'Calcio + Vitamina D'],
      registrationDate: '2024-03-10',
      status: 'active',
      lastVisit: '2024-08-30'
    }
  ];

  // Mock prescription data for testing
  private mockPrescriptions: PrescriptionSummary[] = [
    {
      id: 'RX001',
      prescriptionNumber: 'RX-2024-001',
      date: '2024-10-10',
      doctor: {
        name: 'Dr. Ana María López',
        specialty: 'Medicina Interna',
        licenseNumber: 'ML-12345',
        institution: 'Hospital San José'
      },
      medications: [
        {
          name: 'Losartán',
          dosage: '50mg',
          frequency: '1 vez al día',
          duration: '30 días',
          instructions: 'Tomar en ayunas'
        },
        {
          name: 'Aspirina',
          dosage: '100mg',
          frequency: '1 vez al día',
          duration: '30 días',
          instructions: 'Tomar con alimentos'
        }
      ],
      status: 'dispensed',
      diagnosis: 'Hipertensión arterial',
      notes: 'Control en 30 días',
      dispensedDate: '2024-10-11',
      expirationDate: '2024-11-10',
      pharmacyInfo: {
        name: 'Farmacia Central',
        address: 'Calle 123 #45-67'
      }
    },
    {
      id: 'RX002',
      prescriptionNumber: 'RX-2024-002',
      date: '2024-10-08',
      doctor: {
        name: 'Dr. Carlos Mendoza',
        specialty: 'Endocrinología',
        licenseNumber: 'EN-67890'
      },
      medications: [
        {
          name: 'Metformina',
          dosage: '850mg',
          frequency: '2 veces al día',
          duration: '60 días',
          instructions: 'Tomar con las comidas principales'
        }
      ],
      status: 'dispensed',
      diagnosis: 'Diabetes Mellitus Tipo 2',
      dispensedDate: '2024-10-09',
      expirationDate: '2024-12-08'
    },
    {
      id: 'RX003',
      prescriptionNumber: 'RX-2024-003',
      date: '2024-10-05',
      doctor: {
        name: 'Dr. Patricia Herrera',
        specialty: 'Medicina General'
      },
      medications: [
        {
          name: 'Ibuprofeno',
          dosage: '400mg',
          frequency: 'Cada 8 horas',
          duration: '5 días',
          instructions: 'Solo si hay dolor'
        }
      ],
      status: 'expired',
      diagnosis: 'Dolor muscular',
      expirationDate: '2024-10-12'
    },
    {
      id: 'RX004',
      prescriptionNumber: 'RX-2024-004',
      date: '2024-10-15',
      doctor: {
        name: 'Dr. Roberto Vargas',
        specialty: 'Cardiología'
      },
      medications: [
        {
          name: 'Enalapril',
          dosage: '10mg',
          frequency: '2 veces al día',
          duration: '30 días'
        },
        {
          name: 'Atorvastatina',
          dosage: '20mg',
          frequency: '1 vez al día por la noche',
          duration: '30 días'
        }
      ],
      status: 'pending',
      diagnosis: 'Hipertensión y dislipidemia',
      expirationDate: '2024-11-15'
    },
    {
      id: 'RX005',
      prescriptionNumber: 'RX-2024-005',
      date: '2024-09-28',
      doctor: {
        name: 'Dr. Lucía Ramírez',
        specialty: 'Neumología'
      },
      medications: [
        {
          name: 'Salbutamol',
          dosage: '100mcg/puff',
          frequency: '2 puffs cada 6 horas',
          duration: '30 días',
          instructions: 'Usar inhalador con espaciador'
        }
      ],
      status: 'dispensed',
      diagnosis: 'Asma bronquial',
      dispensedDate: '2024-09-29',
      expirationDate: '2024-10-28'
    }
  ];

  // Map prescriptions to patients (patientId -> prescriptionIds)
  private patientPrescriptions: { [patientId: string]: string[] } = {
    '1': ['RX001', 'RX002', 'RX003', 'RX004', 'RX005'], // María Elena González - Multiple prescriptions for testing
    '2': ['RX002'], // Carlos Alberto Mendoza - Diabetes
    '3': ['RX003'], // Ana Sofía Herrera - Dolor muscular
    '4': ['RX004'], // Roberto José Vargas - Hipertensión y dislipidemia
    '5': ['RX005'], // Lucía Patricia Ramírez - Asma
    '6': [], // Diego Fernando Morales
    '7': [], // Carmen Rosa Jiménez
    '8': [], // Andrés Felipe Ruiz
    '9': [], // Patricia Isabel Delgado
    '10': [], // Javier Eduardo Sánchez
    '11': [], // Mónica Alejandra Castro
    '12': [], // Fernando José Aguilar
    '13': [], // Claudia Marcela Ospina
    '14': [], // Ricardo Alejandro Herrera
    '15': [] // Esperanza del Carmen Moreno
  };

  constructor() {}

  /**
   * Get recent patients with visit information
   * Returns Observable<RecentPatient[]> with RxJS operators for data transformation
   */
  getRecentPatients(): Observable<RecentPatient[]> {
    return of(this.mockPatients).pipe(
      map(patients => patients.map(patient => ({
        ...patient,
        lastVisitDate: patient.lastVisit || '2024-09-15',
        visitCount: Math.floor(Math.random() * 20) + 1,
        lastPrescriptionId: `RX-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
      }))),
      map(recentPatients => 
        recentPatients.sort((a, b) => 
          new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime()
        )
      ),
      delay(300), // Simulate API delay
      tap(patients => console.log(`Loaded ${patients.length} recent patients`))
    );
  }

  /**
   * Search patients by different criteria with filtering logic
   * Uses RxJS operators for data transformation
   */
  searchPatients(query: string, criteria: string = 'name'): Observable<PatientSearchResult> {
    if (!query || query.length < 2) {
      return of({
        patients: [],
        totalCount: 0,
        hasMore: false
      });
    }

    return of(this.mockPatients).pipe(
      map(patients => patients.filter(patient => {
        const searchQuery = query.toLowerCase().trim();
        
        switch (criteria) {
          case 'name':
            return patient.fullName.toLowerCase().includes(searchQuery) ||
                   patient.firstName.toLowerCase().includes(searchQuery) ||
                   patient.firstLastName.toLowerCase().includes(searchQuery) ||
                   (patient.secondLastName && patient.secondLastName.toLowerCase().includes(searchQuery));
          case 'idNumber':
            return patient.idNumber.includes(query.trim());
          case 'phone':
            return patient.phone.includes(query.trim());
          case 'email':
            return patient.email?.toLowerCase().includes(searchQuery) || false;
          default:
            return patient.fullName.toLowerCase().includes(searchQuery);
        }
      })),
      map(filteredPatients => ({
        patients: filteredPatients,
        totalCount: filteredPatients.length,
        hasMore: false
      })),
      delay(500), // Simulate API delay
      tap(result => console.log(`Search for "${query}" (${criteria}) returned ${result.totalCount} results`))
    );
  }

  /**
   * Get patient by ID
   */
  getPatientById(id: string): Observable<PatientData | null> {
    const patient = this.mockPatients.find(p => p.id === id);
    return of(patient || null).pipe(delay(200));
  }

  /**
   * Select a patient with validation
   * Handles patient data validation before selection
   */
  selectPatient(patient: PatientData): Observable<PatientData> {
    return new Observable<PatientData>(observer => {
      try {
        // Validate patient data before selection
        const validationResult = this.validatePatientData(patient);
        
        if (!validationResult.isValid) {
          observer.error(new Error(`Invalid patient data: ${validationResult.errors.join(', ')}`));
          return;
        }

        // Ensure selected patient data is properly formatted
        const formattedPatient = this.formatPatientData(patient);
        
        this.selectedPatientSubject.next(formattedPatient);
        observer.next(formattedPatient);
        observer.complete();
        
        console.log(`Patient selected: ${formattedPatient.fullName} (ID: ${formattedPatient.id})`);
      } catch (error) {
        observer.error(error);
      }
    }).pipe(delay(100)); // Small delay to simulate processing
  }

  /**
   * Get currently selected patient
   */
  getSelectedPatient(): PatientData | null {
    return this.selectedPatientSubject.value;
  }

  /**
   * Clear patient selection
   */
  clearSelection(): void {
    this.selectedPatientSubject.next(null);
  }

  /**
   * Add a new patient (for integration with NewPatientDialog)
   */
  addPatient(patientData: Partial<PatientData>): Observable<PatientData> {
    const newPatient: PatientData = {
      id: (this.mockPatients.length + 1).toString(),
      fullName: `${patientData.firstName} ${patientData.firstLastName}`,
      firstName: patientData.firstName || '',
      firstLastName: patientData.firstLastName || '',
      secondLastName: patientData.secondLastName,
      idType: patientData.idType || 'CC',
      idNumber: patientData.idNumber || '',
      birthDate: patientData.birthDate || '',
      age: patientData.age || 0,
      gender: patientData.gender || 'M',
      bloodType: patientData.bloodType,
      phone: patientData.phone || '',
      email: patientData.email,
      address: patientData.address,
      city: patientData.city,
      country: patientData.country || 'Colombia',
      allergies: patientData.allergies || [],
      chronicConditions: patientData.chronicConditions || [],
      currentMedications: patientData.currentMedications || [],
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    // Add to mock data
    this.mockPatients.push(newPatient);

    return of(newPatient).pipe(delay(800)); // Simulate API delay
  }

  /**
   * Update patient information
   */
  updatePatient(id: string, updates: Partial<PatientData>): Observable<PatientData | null> {
    const patientIndex = this.mockPatients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      return of(null);
    }

    this.mockPatients[patientIndex] = {
      ...this.mockPatients[patientIndex],
      ...updates
    };

    return of(this.mockPatients[patientIndex]).pipe(delay(600));
  }

  /**
   * Get all patients (for admin purposes)
   */
  getAllPatients(): Observable<PatientData[]> {
    return of([...this.mockPatients]).pipe(delay(400));
  }

  /**
   * Validate patient data before selection
   */
  private validatePatientData(patient: PatientData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!patient.id || patient.id.trim() === '') {
      errors.push('Patient ID is required');
    }

    if (!patient.fullName || patient.fullName.trim() === '') {
      errors.push('Patient full name is required');
    }

    if (!patient.firstName || patient.firstName.trim() === '') {
      errors.push('Patient first name is required');
    }

    if (!patient.firstLastName || patient.firstLastName.trim() === '') {
      errors.push('Patient last name is required');
    }

    if (!patient.idNumber || patient.idNumber.trim() === '') {
      errors.push('Patient ID number is required');
    }

    if (!patient.birthDate || patient.birthDate.trim() === '') {
      errors.push('Patient birth date is required');
    }

    if (!patient.gender || (patient.gender !== 'M' && patient.gender !== 'F')) {
      errors.push('Valid patient gender is required');
    }

    if (patient.status !== 'active' && patient.status !== 'inactive') {
      errors.push('Valid patient status is required');
    }

    // Check if patient is active
    if (patient.status === 'inactive') {
      errors.push('Cannot select inactive patient');
    }

    // Age validation
    if (patient.age < 0 || patient.age > 150) {
      errors.push('Patient age must be between 0 and 150');
    }

    // Arrays should be defined (can be empty)
    if (!Array.isArray(patient.allergies)) {
      errors.push('Patient allergies must be an array');
    }

    if (!Array.isArray(patient.chronicConditions)) {
      errors.push('Patient chronic conditions must be an array');
    }

    if (!Array.isArray(patient.currentMedications)) {
      errors.push('Patient current medications must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format patient data to ensure consistency
   */
  private formatPatientData(patient: PatientData): PatientData {
    return {
      ...patient,
      fullName: patient.fullName.trim(),
      firstName: patient.firstName.trim(),
      firstLastName: patient.firstLastName.trim(),
      secondLastName: patient.secondLastName?.trim(),
      idNumber: patient.idNumber.trim(),
      phone: patient.phone.trim(),
      email: patient.email?.trim().toLowerCase(),
      address: patient.address?.trim(),
      city: patient.city?.trim(),
      country: patient.country.trim(),
      allergies: patient.allergies.map(allergy => allergy.trim()).filter(allergy => allergy.length > 0),
      chronicConditions: patient.chronicConditions.map(condition => condition.trim()).filter(condition => condition.length > 0),
      currentMedications: patient.currentMedications.map(medication => medication.trim()).filter(medication => medication.length > 0)
    };
  }

  /**
   * Select patient from recent patients tab
   */
  selectPatientFromRecentList(patientId: string): Observable<PatientData> {
    return this.getPatientById(patientId).pipe(
      switchMap(patient => {
        if (!patient) {
          throw new Error(`Patient with ID ${patientId} not found`);
        }
        return this.selectPatient(patient);
      })
    );
  }

  /**
   * Select patient from search results
   */
  selectPatientFromSearch(patient: PatientData): Observable<PatientData> {
    return this.selectPatient(patient);
  }

  /**
   * Quick select patient (for immediate selection without validation delay)
   */
  quickSelectPatient(patient: PatientData): void {
    const validationResult = this.validatePatientData(patient);
    
    if (!validationResult.isValid) {
      console.error('Cannot select patient:', validationResult.errors);
      return;
    }

    const formattedPatient = this.formatPatientData(patient);
    this.selectedPatientSubject.next(formattedPatient);
    console.log(`Quick selected patient: ${formattedPatient.fullName}`);
  }

  /**
   * Check if a patient can be selected
   */
  canSelectPatient(patient: PatientData): boolean {
    const validationResult = this.validatePatientData(patient);
    return validationResult.isValid;
  }

  /**
   * Get patient selection errors
   */
  getPatientSelectionErrors(patient: PatientData): string[] {
    const validationResult = this.validatePatientData(patient);
    return validationResult.errors;
  }

  /**
   * Calculate patient statistics (total and active prescriptions)
   * Requirements: 2.6, 5.3
   */
  calculatePatientStatistics(patientId: string): Observable<{ totalPrescriptions: number; activePrescriptions: number }> {
    return of(this.patientPrescriptions[patientId] || []).pipe(
      map(prescriptionIds => {
        const patientPrescriptions = prescriptionIds.map(id => 
          this.mockPrescriptions.find(p => p.id === id)
        ).filter(p => p !== undefined) as PrescriptionSummary[];

        const totalPrescriptions = patientPrescriptions.length;
        const activePrescriptions = patientPrescriptions.filter(p => 
          p.status === 'pending' || p.status === 'dispensed'
        ).length;

        return {
          totalPrescriptions,
          activePrescriptions
        };
      }),
      delay(200),
      tap(stats => console.log(`Patient ${patientId} statistics:`, stats))
    );
  }

  /**
   * Get prescription history for a patient
   * Requirements: 2.6, 3.3, 5.3
   */
  getPatientPrescriptionHistory(patientId: string, filters?: PrescriptionFilters): Observable<PrescriptionHistory> {
    return of(this.patientPrescriptions[patientId] || []).pipe(
      map(prescriptionIds => {
        let patientPrescriptions = prescriptionIds.map(id => 
          this.mockPrescriptions.find(p => p.id === id)
        ).filter(p => p !== undefined) as PrescriptionSummary[];

        // Apply filters if provided
        if (filters) {
          patientPrescriptions = this.applyPrescriptionFilters(patientPrescriptions, filters);
        }

        // Calculate statistics
        const totalPrescriptions = patientPrescriptions.length;
        const dispensedCount = patientPrescriptions.filter(p => p.status === 'dispensed').length;
        const pendingCount = patientPrescriptions.filter(p => p.status === 'pending').length;
        const expiredCount = patientPrescriptions.filter(p => p.status === 'expired').length;
        const cancelledCount = patientPrescriptions.filter(p => p.status === 'cancelled').length;

        // Calculate average prescriptions per month (simplified calculation)
        const averagePerMonth = totalPrescriptions > 0 ? Math.round((totalPrescriptions / 12) * 10) / 10 : 0;

        // Sort by date (most recent first)
        patientPrescriptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return {
          prescriptions: patientPrescriptions,
          totalCount: totalPrescriptions,
          statistics: {
            totalPrescriptions,
            dispensedCount,
            pendingCount,
            expiredCount,
            cancelledCount,
            averagePerMonth
          },
          filters: filters || {}
        };
      }),
      delay(300),
      tap(history => console.log(`Loaded prescription history for patient ${patientId}:`, history.totalCount, 'prescriptions'))
    );
  }

  /**
   * Filter prescriptions by status and date
   * Requirements: 2.6, 3.3
   */
  filterPrescriptionsByStatusAndDate(
    patientId: string, 
    statuses?: PrescriptionStatus[], 
    startDate?: string, 
    endDate?: string
  ): Observable<PrescriptionSummary[]> {
    const filters: PrescriptionFilters = {};
    
    if (statuses && statuses.length > 0) {
      filters.status = statuses;
    }
    
    if (startDate || endDate) {
      filters.dateRange = {
        startDate: startDate || '1900-01-01',
        endDate: endDate || '2099-12-31'
      };
    }

    return this.getPatientPrescriptionHistory(patientId, filters).pipe(
      map(history => history.prescriptions),
      tap(prescriptions => console.log(`Filtered prescriptions for patient ${patientId}:`, prescriptions.length, 'results'))
    );
  }

  /**
   * Get enhanced patient data with statistics and prescription information
   * Requirements: 2.6, 5.3
   */
  getEnhancedPatientData(patientId: string): Observable<PatientProfileData | null> {
    const patient = this.mockPatients.find(p => p.id === patientId);
    
    if (!patient) {
      return of(null);
    }

    return this.calculatePatientStatistics(patientId).pipe(
      switchMap(stats => 
        this.getPatientPrescriptionHistory(patientId).pipe(
          map(history => {
            // Convert basic patient data to enhanced format
            const enhancedPatient: PatientProfileData = {
              ...patient,
              statistics: {
                totalPrescriptions: stats.totalPrescriptions,
                activePrescriptions: stats.activePrescriptions,
                lastVisitDays: this.calculateDaysSinceLastVisit(patient.lastVisit || ''),
                averageVisitsPerMonth: 2.5 // Mock calculation
              },
              medicalAlerts: {
                allergies: patient.allergies.map(allergy => ({
                  name: allergy,
                  severity: 'high' as const,
                  dateAdded: patient.registrationDate
                })),
                chronicConditions: patient.chronicConditions.map(condition => ({
                  name: condition,
                  severity: 'medium' as const,
                  dateAdded: patient.registrationDate
                })),
                criticalNotes: []
              },
              contactInfo: {
                primaryPhone: patient.phone,
                email: patient.email,
                emergencyContact: patient.emergencyContact
              },
              insurance: {
                provider: patient.insuranceProvider || 'No especificado',
                number: patient.insuranceNumber || '',
                type: patient.insuranceType || 'Básico'
              },
              totalPrescriptions: stats.totalPrescriptions,
              activePrescriptions: stats.activePrescriptions,
              recentPrescriptions: history.prescriptions.slice(0, 5), // Last 5 prescriptions
              prescriptionHistory: history
            };

            return enhancedPatient;
          })
        )
      ),
      delay(400),
      tap(data => console.log(`Enhanced patient data loaded for ${data?.fullName}`))
    );
  }

  /**
   * Apply filters to prescription list
   * Private helper method for filtering prescriptions
   */
  private applyPrescriptionFilters(prescriptions: PrescriptionSummary[], filters: PrescriptionFilters): PrescriptionSummary[] {
    let filtered = [...prescriptions];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(p => filters.status!.includes(p.status));
    }

    // Filter by date range
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      
      filtered = filtered.filter(p => {
        const prescriptionDate = new Date(p.date);
        return prescriptionDate >= startDate && prescriptionDate <= endDate;
      });
    }

    // Filter by doctor name
    if (filters.doctors && filters.doctors.length > 0) {
      filtered = filtered.filter(p => 
        filters.doctors!.some(doctorName => 
          p.doctor.name.toLowerCase().includes(doctorName.toLowerCase())
        )
      );
    }

    // Filter by medication name
    if (filters.medications && filters.medications.length > 0) {
      filtered = filtered.filter(p => 
        p.medications.some(med => 
          filters.medications!.some(filterMed => 
            med.name.toLowerCase().includes(filterMed.toLowerCase())
          )
        )
      );
    }

    // Filter by search term (searches in diagnosis, notes, and medication names)
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.diagnosis.toLowerCase().includes(searchTerm) ||
        (p.notes && p.notes.toLowerCase().includes(searchTerm)) ||
        p.medications.some(med => med.name.toLowerCase().includes(searchTerm)) ||
        p.doctor.name.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Calculate days since last visit
   * Private helper method for date calculations
   */
  private calculateDaysSinceLastVisit(lastVisitDate: string): number {
    if (!lastVisitDate) return 0;
    
    const lastVisit = new Date(lastVisitDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
}