import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Doctor, DoctorStats } from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorMockService {

  private mockDoctors: Doctor[] = [
    {
      id: "DOC-001",
      fullName: "Dr. Carlos Andrés Martínez López",
      firstName: "Carlos Andrés",
      lastName: "Martínez López",
      specialty: "Cardiología",
      subspecialties: ["Electrofisiología", "Cardiopatía isquémica"],
      licenseNumber: "MSP-2015-045678",
      licenseExpiry: "15/06/2026",
      email: "carlos.martinez@hospital.com",
      phone: "+57 310 456-7890",
      officePhone: "+57 1 234-5678",
      address: "Calle 93 #15-20, Consultorio 301",
      city: "Bogotá",
      country: "Colombia",
      university: "Universidad Nacional de Colombia",
      graduationYear: 2010,
      yearsOfExperience: 14,
      certifications: ["Cardiología Intervencionista", "Electrofisiología Cardíaca"],
      totalPrescriptions: 2847,
      monthlyPrescriptions: 156,
      totalPatients: 892,
      averageMonthlyPrescriptions: 145,
      registrationDate: "2015-03-15",
      lastActivity: "2024-10-15T14:30:00Z",
      status: "active",
      certificationStatus: "verified",
      isOnDuty: true,
      schedule: [
        { days: "Lunes - Miércoles", hours: "08:00 - 16:00" },
        { days: "Viernes", hours: "08:00 - 12:00" }
      ],
      notes: "Especialista en procedimientos de alta complejidad"
    },
    {
      id: "DOC-002",
      fullName: "Dra. María Elena Rodríguez Sánchez",
      firstName: "María Elena",
      lastName: "Rodríguez Sánchez",
      specialty: "Pediatría",
      subspecialties: ["Neonatología", "Cuidados Intensivos Pediátricos"],
      licenseNumber: "MSP-2018-067890",
      licenseExpiry: "22/11/2025",
      email: "maria.rodriguez@hospital.com",
      phone: "+57 315 789-0123",
      address: "Carrera 7 #45-67, Torre Médica, Piso 8",
      city: "Medellín",
      country: "Colombia",
      university: "Universidad de Antioquia",
      graduationYear: 2013,
      yearsOfExperience: 11,
      certifications: ["Neonatología", "Reanimación Neonatal"],
      totalPrescriptions: 1923,
      monthlyPrescriptions: 98,
      totalPatients: 567,
      averageMonthlyPrescriptions: 89,
      registrationDate: "2018-07-22",
      lastActivity: "2024-10-14T16:45:00Z",
      status: "active",
      certificationStatus: "verified",
      isOnDuty: false,
      schedule: [
        { days: "Martes - Jueves", hours: "07:00 - 15:00" },
        { days: "Sábado", hours: "08:00 - 12:00" }
      ]
    },
    {
      id: "DOC-003",
      fullName: "Dr. José Luis Hernández García",
      firstName: "José Luis",
      lastName: "Hernández García",
      specialty: "Ortopedia y Traumatología",
      subspecialties: ["Cirugía de Columna", "Artroscopia"],
      licenseNumber: "MSP-2012-034567",
      licenseExpiry: "08/03/2025",
      email: "jose.hernandez@hospital.com",
      phone: "+57 320 234-5678",
      address: "Avenida 68 #23-45, Centro Médico Norte",
      city: "Cali",
      country: "Colombia",
      university: "Universidad del Valle",
      graduationYear: 2007,
      yearsOfExperience: 17,
      certifications: ["Cirugía de Columna", "Artroscopia de Rodilla"],
      totalPrescriptions: 3456,
      monthlyPrescriptions: 189,
      totalPatients: 1234,
      averageMonthlyPrescriptions: 178,
      registrationDate: "2012-09-08",
      lastActivity: "2024-10-13T11:20:00Z",
      status: "active",
      certificationStatus: "expired",
      isOnDuty: true,
      schedule: [
        { days: "Lunes - Viernes", hours: "09:00 - 17:00" }
      ],
      notes: "Requiere renovación de certificación"
    },
    {
      id: "DOC-004",
      fullName: "Dra. Ana Patricia Morales Vega",
      firstName: "Ana Patricia",
      lastName: "Morales Vega",
      specialty: "Ginecología y Obstetricia",
      subspecialties: ["Medicina Materno-Fetal", "Ginecología Oncológica"],
      licenseNumber: "MSP-2020-078901",
      licenseExpiry: "30/09/2026",
      email: "ana.morales@hospital.com",
      phone: "+57 318 345-6789",
      address: "Calle 127 #9-34, Clínica del Norte",
      city: "Barranquilla",
      country: "Colombia",
      university: "Universidad del Norte",
      graduationYear: 2015,
      yearsOfExperience: 9,
      certifications: ["Medicina Materno-Fetal", "Ecografía Obstétrica"],
      totalPrescriptions: 1567,
      monthlyPrescriptions: 87,
      totalPatients: 445,
      averageMonthlyPrescriptions: 82,
      registrationDate: "2020-01-30",
      lastActivity: "2024-10-16T09:15:00Z",
      status: "active",
      certificationStatus: "verified",
      isOnDuty: true,
      schedule: [
        { days: "Lunes - Miércoles - Viernes", hours: "08:00 - 14:00" },
        { days: "Sábado", hours: "08:00 - 12:00" }
      ]
    },
    {
      id: "DOC-005",
      fullName: "Dr. Roberto Carlos Jiménez Torres",
      firstName: "Roberto Carlos",
      lastName: "Jiménez Torres",
      specialty: "Neurología",
      subspecialties: ["Epilepsia", "Trastornos del Movimiento"],
      licenseNumber: "MSP-2016-056789",
      licenseExpiry: "12/12/2024",
      email: "roberto.jimenez@hospital.com",
      phone: "+57 312 456-7890",
      address: "Carrera 15 #85-23, Consultorio 205",
      city: "Bucaramanga",
      country: "Colombia",
      university: "Universidad Industrial de Santander",
      graduationYear: 2011,
      yearsOfExperience: 13,
      certifications: ["Electroencefalografía", "Trastornos del Sueño"],
      totalPrescriptions: 2234,
      monthlyPrescriptions: 134,
      totalPatients: 678,
      averageMonthlyPrescriptions: 128,
      registrationDate: "2016-05-12",
      lastActivity: "2024-10-12T13:45:00Z",
      status: "inactive",
      certificationStatus: "pending",
      isOnDuty: false,
      schedule: [
        { days: "Martes - Jueves", hours: "14:00 - 18:00" }
      ],
      notes: "Licencia próxima a vencer - requiere renovación urgente"
    }
  ];

  getDoctors(): Observable<Doctor[]> {
    return of(this.mockDoctors);
  }

  getDoctorById(id: string): Observable<Doctor | undefined> {
    const doctor = this.mockDoctors.find(doc => doc.id === id);
    return of(doctor);
  }

  getDoctorStats(): Observable<DoctorStats> {
    const stats: DoctorStats = {
      total: this.mockDoctors.length,
      active: this.mockDoctors.filter(doc => doc.status === 'active').length,
      inactive: this.mockDoctors.filter(doc => doc.status === 'inactive').length,
      verified: this.mockDoctors.filter(doc => doc.certificationStatus === 'verified').length,
      onDuty: this.mockDoctors.filter(doc => doc.isOnDuty).length,
      licenseExpiring: this.mockDoctors.filter(doc => {
        const expiryDate = new Date(doc.licenseExpiry.split('/').reverse().join('-'));
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expiryDate <= threeMonthsFromNow;
      }).length
    };
    return of(stats);
  }

  createDoctor(doctor: Omit<Doctor, 'id'>): Observable<Doctor> {
    const newDoctor: Doctor = {
      ...doctor,
      id: `DOC-${String(this.mockDoctors.length + 1).padStart(3, '0')}`
    };
    this.mockDoctors.push(newDoctor);
    return of(newDoctor);
  }

  updateDoctor(id: string, updates: Partial<Doctor>): Observable<Doctor | null> {
    const index = this.mockDoctors.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.mockDoctors[index] = { ...this.mockDoctors[index], ...updates };
      return of(this.mockDoctors[index]);
    }
    return of(null);
  }

  deleteDoctor(id: string): Observable<boolean> {
    const index = this.mockDoctors.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.mockDoctors.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}