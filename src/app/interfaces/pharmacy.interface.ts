export interface Pharmacy {
  id: string;
  codigo: string;
  nombre: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  email: string;
  responsable: string;
  cedulaResponsable: string;
  estado: 'activa' | 'inactiva' | 'suspendida';
  fechaRegistro: string;
  horario: string;
  observaciones: string;
}