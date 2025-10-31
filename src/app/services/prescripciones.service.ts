import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Prescripcion {
  id: string;
  fecha: string;
  paciente: {
    id: string;
    nombre: string;
    cedula: string;
  };
  medico: {
    id: string;
    nombre: string;
    especialidad: string;
  };
  medicamentos: Array<{
    id: string;
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
  }>;
  estado: 'borrador' | 'firmada' | 'dispensada' | 'cancelada';
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrescripcionesService {
  private prescripcionesSubject = new BehaviorSubject<Prescripcion[]>([]);
  public prescripciones$ = this.prescripcionesSubject.asObservable();

  constructor() {
    // Datos mock
    const mockPrescripciones: Prescripcion[] = [
      {
        id: 'RX001',
        fecha: '2024-01-15',
        paciente: {
          id: '1',
          nombre: 'María González',
          cedula: '1-1234-5678'
        },
        medico: {
          id: '1',
          nombre: 'Dr. Carlos Rodríguez',
          especialidad: 'Medicina General'
        },
        medicamentos: [
          {
            id: '1',
            nombre: 'Ibuprofeno 400mg',
            dosis: '400mg',
            frecuencia: 'Cada 8 horas',
            duracion: '7 días'
          }
        ],
        estado: 'firmada'
      }
    ];
    this.prescripcionesSubject.next(mockPrescripciones);
  }

  getPrescripciones(): Observable<Prescripcion[]> {
    return this.prescripciones$;
  }

  createPrescripcion(prescripcion: Omit<Prescripcion, 'id'>): Observable<Prescripcion> {
    return new Observable(observer => {
      const newPrescripcion: Prescripcion = {
        ...prescripcion,
        id: `RX${Date.now()}`
      };
      
      const current = this.prescripcionesSubject.value;
      this.prescripcionesSubject.next([...current, newPrescripcion]);
      
      observer.next(newPrescripcion);
      observer.complete();
    });
  }

  updatePrescripcion(id: string, updates: Partial<Prescripcion>): Observable<Prescripcion> {
    return new Observable(observer => {
      const current = this.prescripcionesSubject.value;
      const index = current.findIndex(p => p.id === id);
      
      if (index !== -1) {
        const updated = { ...current[index], ...updates };
        current[index] = updated;
        this.prescripcionesSubject.next([...current]);
        observer.next(updated);
      }
      
      observer.complete();
    });
  }
}