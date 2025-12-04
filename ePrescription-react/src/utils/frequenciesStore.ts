/**
 * Store de frecuencias de dosificación
 * Gestiona el almacenamiento y persistencia de las frecuencias de dosificación del sistema
 */

export interface Frequency {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  intervaloHoras: number; // Intervalo en horas entre dosis
  vecesAlDia: number; // Número de veces al día
  abreviatura: string; // Ej: "c/8h", "c/12h", "QD", "BID"
  instrucciones: string; // Instrucciones específicas para el paciente
  activa: boolean;
  categoria: "Frecuente" | "Especial" | "PRN" | "Única";
  orden: number; // Para ordenar en listas
  createdAt: string;
  updatedAt: string;
  usuarioModificacion: string;
}

// Datos iniciales con frecuencias comunes
const initialFrequencies: Frequency[] = [
  {
    id: "FREQ-001",
    codigo: "QD",
    nombre: "Una vez al día",
    descripcion: "Administrar una dosis cada 24 horas",
    intervaloHoras: 24,
    vecesAlDia: 1,
    abreviatura: "c/24h",
    instrucciones: "Tomar una vez al día, preferiblemente a la misma hora",
    activa: true,
    categoria: "Frecuente",
    orden: 1,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-002",
    codigo: "BID",
    nombre: "Dos veces al día",
    descripcion: "Administrar dos dosis diarias cada 12 horas",
    intervaloHoras: 12,
    vecesAlDia: 2,
    abreviatura: "c/12h",
    instrucciones: "Tomar cada 12 horas (mañana y noche)",
    activa: true,
    categoria: "Frecuente",
    orden: 2,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-003",
    codigo: "TID",
    nombre: "Tres veces al día",
    descripcion: "Administrar tres dosis diarias cada 8 horas",
    intervaloHoras: 8,
    vecesAlDia: 3,
    abreviatura: "c/8h",
    instrucciones: "Tomar cada 8 horas (desayuno, almuerzo, cena)",
    activa: true,
    categoria: "Frecuente",
    orden: 3,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-004",
    codigo: "QID",
    nombre: "Cuatro veces al día",
    descripcion: "Administrar cuatro dosis diarias cada 6 horas",
    intervaloHoras: 6,
    vecesAlDia: 4,
    abreviatura: "c/6h",
    instrucciones: "Tomar cada 6 horas",
    activa: true,
    categoria: "Frecuente",
    orden: 4,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-005",
    codigo: "Q4H",
    nombre: "Cada 4 horas",
    descripcion: "Administrar cada 4 horas (6 veces al día)",
    intervaloHoras: 4,
    vecesAlDia: 6,
    abreviatura: "c/4h",
    instrucciones: "Tomar cada 4 horas durante las horas de vigilia",
    activa: true,
    categoria: "Especial",
    orden: 5,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-006",
    codigo: "PRN",
    nombre: "Cuando sea necesario",
    descripcion: "Administrar según necesidad (PRN - Pro Re Nata)",
    intervaloHoras: 0,
    vecesAlDia: 0,
    abreviatura: "PRN",
    instrucciones: "Tomar sólo cuando sea necesario, según indicación médica",
    activa: true,
    categoria: "PRN",
    orden: 6,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-007",
    codigo: "STAT",
    nombre: "Dosis única inmediata",
    descripcion: "Administrar una sola dosis de forma inmediata",
    intervaloHoras: 0,
    vecesAlDia: 1,
    abreviatura: "STAT",
    instrucciones: "Tomar una sola dosis ahora",
    activa: true,
    categoria: "Única",
    orden: 7,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-008",
    codigo: "HS",
    nombre: "Al acostarse",
    descripcion: "Administrar una dosis antes de dormir",
    intervaloHoras: 24,
    vecesAlDia: 1,
    abreviatura: "HS",
    instrucciones: "Tomar al acostarse, antes de dormir",
    activa: true,
    categoria: "Especial",
    orden: 8,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-009",
    codigo: "AC",
    nombre: "Antes de las comidas",
    descripcion: "Administrar antes de cada comida principal",
    intervaloHoras: 8,
    vecesAlDia: 3,
    abreviatura: "AC",
    instrucciones: "Tomar 30 minutos antes de cada comida",
    activa: true,
    categoria: "Especial",
    orden: 9,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-010",
    codigo: "PC",
    nombre: "Después de las comidas",
    descripcion: "Administrar después de cada comida principal",
    intervaloHoras: 8,
    vecesAlDia: 3,
    abreviatura: "PC",
    instrucciones: "Tomar inmediatamente después de cada comida",
    activa: true,
    categoria: "Especial",
    orden: 10,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-011",
    codigo: "QWK",
    nombre: "Una vez a la semana",
    descripcion: "Administrar una dosis por semana",
    intervaloHoras: 168,
    vecesAlDia: 0,
    abreviatura: "1x/sem",
    instrucciones: "Tomar una vez por semana, el mismo día",
    activa: true,
    categoria: "Especial",
    orden: 11,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  },
  {
    id: "FREQ-012",
    codigo: "Q2WK",
    nombre: "Cada dos semanas",
    descripcion: "Administrar cada 14 días",
    intervaloHoras: 336,
    vecesAlDia: 0,
    abreviatura: "c/2sem",
    instrucciones: "Tomar cada dos semanas",
    activa: true,
    categoria: "Especial",
    orden: 12,
    createdAt: "2024-01-15 10:00",
    updatedAt: "2024-01-15 10:00",
    usuarioModificacion: "Admin Sistema"
  }
];

// Store en memoria
let frequencies: Frequency[] = [...initialFrequencies];

/**
 * Obtiene todas las frecuencias
 */
export function getAllFrequencies(): Frequency[] {
  return [...frequencies].sort((a, b) => a.orden - b.orden);
}

/**
 * Obtiene una frecuencia por ID
 */
export function getFrequencyById(id: string): Frequency | undefined {
  return frequencies.find(f => f.id === id);
}

/**
 * Obtiene frecuencias activas solamente
 */
export function getActiveFrequencies(): Frequency[] {
  return frequencies.filter(f => f.activa).sort((a, b) => a.orden - b.orden);
}

/**
 * Agrega una nueva frecuencia
 */
export function addFrequency(frequency: Omit<Frequency, 'id' | 'createdAt' | 'updatedAt'>): Frequency {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newFrequency: Frequency = {
    ...frequency,
    id: `FREQ-${String(frequencies.length + 1).padStart(3, '0')}`,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  frequencies = [...frequencies, newFrequency];
  return newFrequency;
}

/**
 * Actualiza una frecuencia existente
 */
export function updateFrequency(id: string, updates: Partial<Frequency>): Frequency | null {
  const index = frequencies.findIndex(f => f.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  frequencies[index] = {
    ...frequencies[index],
    ...updates,
    updatedAt: timestamp
  };
  
  return frequencies[index];
}

/**
 * Elimina una frecuencia
 */
export function deleteFrequency(id: string): boolean {
  const initialLength = frequencies.length;
  frequencies = frequencies.filter(f => f.id !== id);
  return frequencies.length < initialLength;
}

/**
 * Alterna el estado activo/inactivo de una frecuencia
 */
export function toggleFrequencyStatus(id: string): Frequency | null {
  const frequency = frequencies.find(f => f.id === id);
  
  if (!frequency) {
    return null;
  }
  
  return updateFrequency(id, { activa: !frequency.activa });
}
