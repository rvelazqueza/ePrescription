import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pharmacy } from '../interfaces/pharmacy.interface';

@Injectable({
  providedIn: 'root'
})
export class PharmacyMockService {

  private mockPharmacies: Pharmacy[] = [
    {
      id: "1",
      codigo: "FARM-001",
      nombre: "Farmacia Central",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10103",
      direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
      telefono: "2222-3344",
      email: "central@farmacia.cr",
      responsable: "Dr. Carlos Méndez Rojas",
      cedulaResponsable: "1-0234-0567",
      estado: "activa",
      fechaRegistro: "2023-01-15",
      horario: "Lunes a Viernes: 7:00 AM - 8:00 PM, Sábados: 8:00 AM - 6:00 PM",
      observaciones: "Farmacia principal del sistema"
    },
    {
      id: "2",
      codigo: "FARM-002",
      nombre: "Farmacia San José",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10102",
      direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
      telefono: "2233-4455",
      email: "sanjose@farmacia.cr",
      responsable: "Dra. María González Castro",
      cedulaResponsable: "1-0456-0789",
      estado: "activa",
      fechaRegistro: "2023-02-20",
      horario: "Lunes a Domingo: 24 horas",
      observaciones: "Servicio 24/7"
    },
    {
      id: "3",
      codigo: "FARM-003",
      nombre: "Farmacia Escazú",
      provinciaId: "1",
      cantonId: "102",
      distritoId: "10201",
      direccionEspecifica: "Multiplaza Escazú, local 205",
      telefono: "2201-5566",
      email: "escazu@farmacia.cr",
      responsable: "Dr. Roberto Jiménez Salas",
      cedulaResponsable: "1-0678-0901",
      estado: "activa",
      fechaRegistro: "2023-03-10",
      horario: "Lunes a Domingo: 9:00 AM - 9:00 PM",
      observaciones: ""
    },
    {
      id: "4",
      codigo: "FARM-004",
      nombre: "Farmacia Desamparados",
      provinciaId: "1",
      cantonId: "103",
      distritoId: "10301",
      direccionEspecifica: "200 metros sur de la Iglesia, esquina opuesta al Banco Nacional",
      telefono: "2259-7788",
      email: "desamparados@farmacia.cr",
      responsable: "Dra. Ana Soto Vargas",
      cedulaResponsable: "1-0890-1234",
      estado: "activa",
      fechaRegistro: "2023-04-05",
      horario: "Lunes a Sábado: 8:00 AM - 7:00 PM",
      observaciones: ""
    },
    {
      id: "5",
      codigo: "FARM-005",
      nombre: "Farmacia Alajuela Centro",
      provinciaId: "2",
      cantonId: "201",
      distritoId: "20101",
      direccionEspecifica: "Avenida 3, entre calles 2 y 4, casa esquinera blanca",
      telefono: "2440-2233",
      email: "alajuela@farmacia.cr",
      responsable: "Dr. Luis Fernández Mora",
      cedulaResponsable: "2-0123-4567",
      estado: "activa",
      fechaRegistro: "2023-05-12",
      horario: "Lunes a Viernes: 7:30 AM - 7:30 PM, Sábados: 8:00 AM - 5:00 PM",
      observaciones: ""
    },
    {
      id: "6",
      codigo: "FARM-006",
      nombre: "Farmacia Cartago",
      provinciaId: "3",
      cantonId: "301",
      distritoId: "30101",
      direccionEspecifica: "Costado este de las Ruinas, edificio colonial restaurado",
      telefono: "2591-3344",
      email: "cartago@farmacia.cr",
      responsable: "Dra. Patricia Ramírez Solano",
      cedulaResponsable: "3-0234-5678",
      estado: "activa",
      fechaRegistro: "2023-06-20",
      horario: "Lunes a Sábado: 8:00 AM - 6:00 PM",
      observaciones: ""
    },
    {
      id: "7",
      codigo: "FARM-007",
      nombre: "Farmacia Heredia",
      provinciaId: "4",
      cantonId: "401",
      distritoId: "40101",
      direccionEspecifica: "Frente al Parque Central, segundo local a mano derecha",
      telefono: "2237-5566",
      email: "heredia@farmacia.cr",
      responsable: "Dr. Sergio Villalobos Chaves",
      cedulaResponsable: "4-0345-6789",
      estado: "activa",
      fechaRegistro: "2023-07-08",
      horario: "Lunes a Viernes: 7:00 AM - 8:00 PM, Sábados: 8:00 AM - 6:00 PM, Domingos: 9:00 AM - 2:00 PM",
      observaciones: ""
    },
    {
      id: "8",
      codigo: "FARM-008",
      nombre: "Farmacia Liberia",
      provinciaId: "5",
      cantonId: "501",
      distritoId: "50101",
      direccionEspecifica: "Diagonal a la Catedral, 50 metros norte",
      telefono: "2666-4477",
      email: "liberia@farmacia.cr",
      responsable: "Dra. Carmen Araya Bolaños",
      cedulaResponsable: "5-0456-7890",
      estado: "activa",
      fechaRegistro: "2023-08-15",
      horario: "Lunes a Sábado: 8:00 AM - 7:00 PM",
      observaciones: ""
    },
    {
      id: "9",
      codigo: "FARM-009",
      nombre: "Farmacia Puntarenas",
      provinciaId: "6",
      cantonId: "601",
      distritoId: "60101",
      direccionEspecifica: "Paseo de los Turistas, local 12-A",
      telefono: "2661-5588",
      email: "puntarenas@farmacia.cr",
      responsable: "Dr. Fernando Mora Alfaro",
      cedulaResponsable: "6-0567-8901",
      estado: "activa",
      fechaRegistro: "2023-09-22",
      horario: "Lunes a Domingo: 8:00 AM - 8:00 PM",
      observaciones: ""
    },
    {
      id: "10",
      codigo: "FARM-010",
      nombre: "Farmacia Limón Puerto",
      provinciaId: "7",
      cantonId: "701",
      distritoId: "70101",
      direccionEspecifica: "Avenida 2, frente al Mercado Municipal",
      telefono: "2758-6699",
      email: "limon@farmacia.cr",
      responsable: "Dra. Gabriela Quesada Torres",
      cedulaResponsable: "7-0678-9012",
      estado: "activa",
      fechaRegistro: "2023-10-10",
      horario: "Lunes a Sábado: 7:00 AM - 6:00 PM",
      observaciones: ""
    },
    {
      id: "11",
      codigo: "FARM-011",
      nombre: "Farmacia Santa Ana",
      provinciaId: "1",
      cantonId: "108",
      distritoId: "10801",
      direccionEspecifica: "Lindora, Forum II, planta baja",
      telefono: "2282-7700",
      email: "santaana@farmacia.cr",
      responsable: "Dr. Andrés Solís Campos",
      cedulaResponsable: "1-0789-0123",
      estado: "suspendida",
      fechaRegistro: "2023-11-05",
      horario: "Lunes a Viernes: 8:00 AM - 6:00 PM",
      observaciones: "Suspendida temporalmente por inventario"
    }
  ];

  getPharmacies(): Observable<Pharmacy[]> {
    return of(this.mockPharmacies);
  }

  getPharmacyById(id: string): Observable<Pharmacy | undefined> {
    const pharmacy = this.mockPharmacies.find(pharmacy => pharmacy.id === id);
    return of(pharmacy);
  }

  getPharmaciesByProvince(provinciaId: string): Observable<Pharmacy[]> {
    const pharmacies = this.mockPharmacies.filter(pharmacy => pharmacy.provinciaId === provinciaId);
    return of(pharmacies);
  }

  getPharmaciesByStatus(estado: 'activa' | 'inactiva' | 'suspendida'): Observable<Pharmacy[]> {
    const pharmacies = this.mockPharmacies.filter(pharmacy => pharmacy.estado === estado);
    return of(pharmacies);
  }

  createPharmacy(pharmacy: Omit<Pharmacy, 'id'>): Observable<Pharmacy> {
    const newPharmacy: Pharmacy = {
      ...pharmacy,
      id: (this.mockPharmacies.length + 1).toString()
    };
    this.mockPharmacies.push(newPharmacy);
    return of(newPharmacy);
  }

  updatePharmacy(id: string, pharmacy: Partial<Pharmacy>): Observable<Pharmacy | null> {
    const index = this.mockPharmacies.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPharmacies[index] = { ...this.mockPharmacies[index], ...pharmacy };
      return of(this.mockPharmacies[index]);
    }
    return of(null);
  }

  deletePharmacy(id: string): Observable<boolean> {
    const index = this.mockPharmacies.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPharmacies.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}