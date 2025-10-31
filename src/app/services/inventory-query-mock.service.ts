import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InventoryQuery } from '../interfaces/inventory.interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryQueryMockService {

  private mockInventoryQueries: InventoryQuery[] = [
    {
      id: "1",
      medicamentoId: "MED001",
      medicamentoNombre: "Paracetamol",
      medicamentoCodigo: "PAR-500MG",
      presentacion: "500mg Tabletas x 100",
      farmaciaId: "1",
      farmaciaNombre: "Farmacia Central",
      farmaciaCode: "FARM-001",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10103",
      direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
      telefono: "2222-3344",
      stock: 5420,
      stockMinimo: 1000,
      stockMaximo: 10000,
      lote: "LOT-2024-0456",
      fechaVencimiento: "2025-12-31",
      ultimaActualizacion: "2024-10-05 14:30:00"
    },
    {
      id: "2",
      medicamentoId: "MED002",
      medicamentoNombre: "Ibuprofeno",
      medicamentoCodigo: "IBU-400MG",
      presentacion: "400mg Tabletas x 50",
      farmaciaId: "1",
      farmaciaNombre: "Farmacia Central",
      farmaciaCode: "FARM-001",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10103",
      direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
      telefono: "2222-3344",
      stock: 750,
      stockMinimo: 500,
      stockMaximo: 5000,
      lote: "LOT-2024-0789",
      fechaVencimiento: "2025-08-15",
      ultimaActualizacion: "2024-10-05 15:20:00"
    },
    {
      id: "3",
      medicamentoId: "MED003",
      medicamentoNombre: "Amoxicilina",
      medicamentoCodigo: "AMX-500MG",
      presentacion: "500mg Cápsulas x 21",
      farmaciaId: "2",
      farmaciaNombre: "Farmacia San José",
      farmaciaCode: "FARM-002",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10102",
      direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
      telefono: "2233-4455",
      stock: 320,
      stockMinimo: 200,
      stockMaximo: 2000,
      lote: "LOT-2024-1023",
      fechaVencimiento: "2025-06-30",
      ultimaActualizacion: "2024-10-05 16:45:00"
    },
    {
      id: "4",
      medicamentoId: "MED001",
      medicamentoNombre: "Paracetamol",
      medicamentoCodigo: "PAR-500MG",
      presentacion: "500mg Tabletas x 100",
      farmaciaId: "3",
      farmaciaNombre: "Farmacia Escazú",
      farmaciaCode: "FARM-003",
      provinciaId: "1",
      cantonId: "102",
      distritoId: "10201",
      direccionEspecifica: "Multiplaza Escazú, local 205",
      telefono: "2201-5566",
      stock: 2100,
      stockMinimo: 800,
      stockMaximo: 8000,
      lote: "LOT-2024-0456",
      fechaVencimiento: "2025-12-31",
      ultimaActualizacion: "2024-10-05 09:15:00"
    },
    {
      id: "5",
      medicamentoId: "MED004",
      medicamentoNombre: "Metformina",
      medicamentoCodigo: "MET-850MG",
      presentacion: "850mg Tabletas x 60",
      farmaciaId: "1",
      farmaciaNombre: "Farmacia Central",
      farmaciaCode: "FARM-001",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10103",
      direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
      telefono: "2222-3344",
      stock: 150,
      stockMinimo: 300,
      stockMaximo: 3000,
      lote: "LOT-2024-1156",
      fechaVencimiento: "2025-10-20",
      ultimaActualizacion: "2024-10-05 11:00:00"
    },
    {
      id: "6",
      medicamentoId: "MED005",
      medicamentoNombre: "Losartán",
      medicamentoCodigo: "LOS-50MG",
      presentacion: "50mg Tabletas x 30",
      farmaciaId: "2",
      farmaciaNombre: "Farmacia San José",
      farmaciaCode: "FARM-002",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10102",
      direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
      telefono: "2233-4455",
      stock: 890,
      stockMinimo: 400,
      stockMaximo: 4000,
      lote: "LOT-2024-1287",
      fechaVencimiento: "2025-11-15",
      ultimaActualizacion: "2024-10-05 13:30:00"
    },
    {
      id: "7",
      medicamentoId: "MED002",
      medicamentoNombre: "Ibuprofeno",
      medicamentoCodigo: "IBU-400MG",
      presentacion: "400mg Tabletas x 50",
      farmaciaId: "4",
      farmaciaNombre: "Farmacia Desamparados",
      farmaciaCode: "FARM-004",
      provinciaId: "1",
      cantonId: "103",
      distritoId: "10301",
      direccionEspecifica: "200 metros sur de la Iglesia, esquina opuesta al Banco Nacional",
      telefono: "2259-7788",
      stock: 45,
      stockMinimo: 500,
      stockMaximo: 5000,
      lote: "LOT-2024-0789",
      fechaVencimiento: "2025-08-15",
      ultimaActualizacion: "2024-10-05 10:20:00"
    },
    {
      id: "8",
      medicamentoId: "MED006",
      medicamentoNombre: "Atorvastatina",
      medicamentoCodigo: "ATO-20MG",
      presentacion: "20mg Tabletas x 30",
      farmaciaId: "5",
      farmaciaNombre: "Farmacia Alajuela Centro",
      farmaciaCode: "FARM-005",
      provinciaId: "2",
      cantonId: "201",
      distritoId: "20101",
      direccionEspecifica: "Avenida 3, entre calles 2 y 4, casa esquinera blanca",
      telefono: "2440-2233",
      stock: 1250,
      stockMinimo: 600,
      stockMaximo: 6000,
      lote: "LOT-2024-1398",
      fechaVencimiento: "2025-09-30",
      ultimaActualizacion: "2024-10-05 08:45:00"
    },
    {
      id: "9",
      medicamentoId: "MED003",
      medicamentoNombre: "Amoxicilina",
      medicamentoCodigo: "AMX-500MG",
      presentacion: "500mg Cápsulas x 21",
      farmaciaId: "6",
      farmaciaNombre: "Farmacia Cartago",
      farmaciaCode: "FARM-006",
      provinciaId: "3",
      cantonId: "301",
      distritoId: "30101",
      direccionEspecifica: "Costado este de las Ruinas, edificio colonial restaurado",
      telefono: "2591-3344",
      stock: 580,
      stockMinimo: 200,
      stockMaximo: 2000,
      lote: "LOT-2024-1023",
      fechaVencimiento: "2025-06-30",
      ultimaActualizacion: "2024-10-05 12:10:00"
    },
    {
      id: "10",
      medicamentoId: "MED007",
      medicamentoNombre: "Omeprazol",
      medicamentoCodigo: "OME-20MG",
      presentacion: "20mg Cápsulas x 30",
      farmaciaId: "7",
      farmaciaNombre: "Farmacia Heredia",
      farmaciaCode: "FARM-007",
      provinciaId: "4",
      cantonId: "401",
      distritoId: "40101",
      direccionEspecifica: "Frente al Parque Central, segundo local a mano derecha",
      telefono: "2237-5566",
      stock: 1820,
      stockMinimo: 800,
      stockMaximo: 8000,
      lote: "LOT-2024-1445",
      fechaVencimiento: "2025-12-15",
      ultimaActualizacion: "2024-10-05 14:55:00"
    },
    {
      id: "11",
      medicamentoId: "MED001",
      medicamentoNombre: "Paracetamol",
      medicamentoCodigo: "PAR-500MG",
      presentacion: "500mg Tabletas x 100",
      farmaciaId: "8",
      farmaciaNombre: "Farmacia Liberia",
      farmaciaCode: "FARM-008",
      provinciaId: "5",
      cantonId: "501",
      distritoId: "50101",
      direccionEspecifica: "Diagonal a la Catedral, 50 metros norte",
      telefono: "2666-4477",
      stock: 3200,
      stockMinimo: 1000,
      stockMaximo: 10000,
      lote: "LOT-2024-0456",
      fechaVencimiento: "2025-12-31",
      ultimaActualizacion: "2024-10-05 15:40:00"
    },
    {
      id: "12",
      medicamentoId: "MED008",
      medicamentoNombre: "Salbutamol Inhalador",
      medicamentoCodigo: "SAL-100MCG",
      presentacion: "100mcg Inhalador 200 dosis",
      farmaciaId: "9",
      farmaciaNombre: "Farmacia Puntarenas",
      farmaciaCode: "FARM-009",
      provinciaId: "6",
      cantonId: "601",
      distritoId: "60101",
      direccionEspecifica: "Paseo de los Turistas, local 12-A",
      telefono: "2661-5588",
      stock: 85,
      stockMinimo: 100,
      stockMaximo: 1000,
      lote: "LOT-2024-1567",
      fechaVencimiento: "2025-07-22",
      ultimaActualizacion: "2024-10-05 09:30:00"
    },
    {
      id: "13",
      medicamentoId: "MED004",
      medicamentoNombre: "Metformina",
      medicamentoCodigo: "MET-850MG",
      presentacion: "850mg Tabletas x 60",
      farmaciaId: "10",
      farmaciaNombre: "Farmacia Limón Puerto",
      farmaciaCode: "FARM-010",
      provinciaId: "7",
      cantonId: "701",
      distritoId: "70101",
      direccionEspecifica: "Avenida 2, frente al Mercado Municipal",
      telefono: "2758-6699",
      stock: 440,
      stockMinimo: 300,
      stockMaximo: 3000,
      lote: "LOT-2024-1156",
      fechaVencimiento: "2025-10-20",
      ultimaActualizacion: "2024-10-05 11:25:00"
    },
    {
      id: "14",
      medicamentoId: "MED005",
      medicamentoNombre: "Losartán",
      medicamentoCodigo: "LOS-50MG",
      presentacion: "50mg Tabletas x 30",
      farmaciaId: "3",
      farmaciaNombre: "Farmacia Escazú",
      farmaciaCode: "FARM-003",
      provinciaId: "1",
      cantonId: "102",
      distritoId: "10201",
      direccionEspecifica: "Multiplaza Escazú, local 205",
      telefono: "2201-5566",
      stock: 1550,
      stockMinimo: 400,
      stockMaximo: 4000,
      lote: "LOT-2024-1287",
      fechaVencimiento: "2025-11-15",
      ultimaActualizacion: "2024-10-05 16:00:00"
    },
    {
      id: "15",
      medicamentoId: "MED009",
      medicamentoNombre: "Insulina Glargina",
      medicamentoCodigo: "INS-100UI",
      presentacion: "100 UI/mL Pluma precargada",
      farmaciaId: "2",
      farmaciaNombre: "Farmacia San José",
      farmaciaCode: "FARM-002",
      provinciaId: "1",
      cantonId: "101",
      distritoId: "10102",
      direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
      telefono: "2233-4455",
      stock: 125,
      stockMinimo: 50,
      stockMaximo: 500,
      lote: "LOT-2024-1678",
      fechaVencimiento: "2025-05-10",
      ultimaActualizacion: "2024-10-05 14:20:00"
    }
  ];

  getInventoryQueries(): Observable<InventoryQuery[]> {
    return of(this.mockInventoryQueries);
  }

  getInventoryQueryById(id: string): Observable<InventoryQuery | undefined> {
    const query = this.mockInventoryQueries.find(query => query.id === id);
    return of(query);
  }

  getInventoryQueriesByPharmacy(farmaciaId: string): Observable<InventoryQuery[]> {
    const queries = this.mockInventoryQueries.filter(query => query.farmaciaId === farmaciaId);
    return of(queries);
  }

  getInventoryQueriesByMedicine(medicamentoId: string): Observable<InventoryQuery[]> {
    const queries = this.mockInventoryQueries.filter(query => query.medicamentoId === medicamentoId);
    return of(queries);
  }

  getInventoryQueriesByProvince(provinciaId: string): Observable<InventoryQuery[]> {
    const queries = this.mockInventoryQueries.filter(query => query.provinciaId === provinciaId);
    return of(queries);
  }

  getCriticalStockQueries(): Observable<InventoryQuery[]> {
    const queries = this.mockInventoryQueries.filter(query => query.stock < query.stockMinimo);
    return of(queries);
  }

  getLowStockQueries(): Observable<InventoryQuery[]> {
    const queries = this.mockInventoryQueries.filter(query => 
      query.stock >= query.stockMinimo && query.stock < (query.stockMinimo * 1.5)
    );
    return of(queries);
  }

  getNormalStockQueries(): Observable<InventoryQuery[]> {
    const queries = this.mockInventoryQueries.filter(query => query.stock >= (query.stockMinimo * 1.5));
    return of(queries);
  }
}