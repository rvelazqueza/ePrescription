// Datos de Costa Rica para cascada de ubicación

export interface Provincia {
  id: string;
  nombre: string;
}

export interface Canton {
  id: string;
  provinciaId: string;
  nombre: string;
}

export interface Distrito {
  id: string;
  cantonId: string;
  nombre: string;
}

// Provincias de Costa Rica
export const provinciasCostaRica: Provincia[] = [
  { id: "1", nombre: "San José" },
  { id: "2", nombre: "Alajuela" },
  { id: "3", nombre: "Cartago" },
  { id: "4", nombre: "Heredia" },
  { id: "5", nombre: "Guanacaste" },
  { id: "6", nombre: "Puntarenas" },
  { id: "7", nombre: "Limón" }
];

// Cantones por provincia (muestra representativa)
export const cantones: Canton[] = [
  // San José
  { id: "101", provinciaId: "1", nombre: "San José" },
  { id: "102", provinciaId: "1", nombre: "Escazú" },
  { id: "103", provinciaId: "1", nombre: "Desamparados" },
  { id: "104", provinciaId: "1", nombre: "Puriscal" },
  { id: "105", provinciaId: "1", nombre: "Aserrí" },
  { id: "106", provinciaId: "1", nombre: "Mora" },
  { id: "107", provinciaId: "1", nombre: "Goicoechea" },
  { id: "108", provinciaId: "1", nombre: "Santa Ana" },
  { id: "109", provinciaId: "1", nombre: "Alajuelita" },
  { id: "110", provinciaId: "1", nombre: "Vázquez de Coronado" },
  { id: "111", provinciaId: "1", nombre: "Tibás" },
  { id: "112", provinciaId: "1", nombre: "Moravia" },
  { id: "113", provinciaId: "1", nombre: "Montes de Oca" },
  { id: "114", provinciaId: "1", nombre: "Curridabat" },
  
  // Alajuela
  { id: "201", provinciaId: "2", nombre: "Alajuela" },
  { id: "202", provinciaId: "2", nombre: "San Ramón" },
  { id: "203", provinciaId: "2", nombre: "Grecia" },
  { id: "204", provinciaId: "2", nombre: "Naranjo" },
  { id: "205", provinciaId: "2", nombre: "Palmares" },
  { id: "206", provinciaId: "2", nombre: "Poás" },
  { id: "207", provinciaId: "2", nombre: "Atenas" },
  
  // Cartago
  { id: "301", provinciaId: "3", nombre: "Cartago" },
  { id: "302", provinciaId: "3", nombre: "Paraíso" },
  { id: "303", provinciaId: "3", nombre: "La Unión" },
  { id: "304", provinciaId: "3", nombre: "Turrialba" },
  
  // Heredia
  { id: "401", provinciaId: "4", nombre: "Heredia" },
  { id: "402", provinciaId: "4", nombre: "Barva" },
  { id: "403", provinciaId: "4", nombre: "Santo Domingo" },
  { id: "404", provinciaId: "4", nombre: "Santa Bárbara" },
  
  // Guanacaste
  { id: "501", provinciaId: "5", nombre: "Liberia" },
  { id: "502", provinciaId: "5", nombre: "Nicoya" },
  { id: "503", provinciaId: "5", nombre: "Santa Cruz" },
  
  // Puntarenas
  { id: "601", provinciaId: "6", nombre: "Puntarenas" },
  { id: "602", provinciaId: "6", nombre: "Esparza" },
  { id: "603", provinciaId: "6", nombre: "Montes de Oro" },
  
  // Limón
  { id: "701", provinciaId: "7", nombre: "Limón" },
  { id: "702", provinciaId: "7", nombre: "Pococí" },
  { id: "703", provinciaId: "7", nombre: "Siquirres" }
];

// Distritos por cantón (muestra representativa)
export const distritos: Distrito[] = [
  // San José - Cantón San José
  { id: "10101", cantonId: "101", nombre: "Carmen" },
  { id: "10102", cantonId: "101", nombre: "Merced" },
  { id: "10103", cantonId: "101", nombre: "Hospital" },
  { id: "10104", cantonId: "101", nombre: "Catedral" },
  { id: "10105", cantonId: "101", nombre: "Zapote" },
  { id: "10106", cantonId: "101", nombre: "San Francisco de Dos Ríos" },
  { id: "10107", cantonId: "101", nombre: "Uruca" },
  { id: "10108", cantonId: "101", nombre: "Mata Redonda" },
  { id: "10109", cantonId: "101", nombre: "Pavas" },
  { id: "10110", cantonId: "101", nombre: "Hatillo" },
  { id: "10111", cantonId: "101", nombre: "San Sebastián" },
  
  // Escazú
  { id: "10201", cantonId: "102", nombre: "Escazú" },
  { id: "10202", cantonId: "102", nombre: "San Antonio" },
  { id: "10203", cantonId: "102", nombre: "San Rafael" },
  
  // Desamparados
  { id: "10301", cantonId: "103", nombre: "Desamparados" },
  { id: "10302", cantonId: "103", nombre: "San Miguel" },
  { id: "10303", cantonId: "103", nombre: "San Juan de Dios" },
  { id: "10304", cantonId: "103", nombre: "San Rafael Arriba" },
  { id: "10305", cantonId: "103", nombre: "San Antonio" },
  
  // Mora
  { id: "10601", cantonId: "106", nombre: "Colón" },
  { id: "10602", cantonId: "106", nombre: "Guayabo" },
  { id: "10603", cantonId: "106", nombre: "Tabarcia" },
  { id: "10604", cantonId: "106", nombre: "Piedras Negras" },
  
  // Goicoechea
  { id: "10701", cantonId: "107", nombre: "Guadalupe" },
  { id: "10702", cantonId: "107", nombre: "San Francisco" },
  { id: "10703", cantonId: "107", nombre: "Calle Blancos" },
  { id: "10704", cantonId: "107", nombre: "Mata de Plátano" },
  { id: "10705", cantonId: "107", nombre: "Ipís" },
  
  // Santa Ana
  { id: "10801", cantonId: "108", nombre: "Santa Ana" },
  { id: "10802", cantonId: "108", nombre: "Salitral" },
  { id: "10803", cantonId: "108", nombre: "Pozos" },
  { id: "10804", cantonId: "108", nombre: "Uruca" },
  { id: "10805", cantonId: "108", nombre: "Piedades" },
  { id: "10806", cantonId: "108", nombre: "Brasil" },
  
  // Moravia
  { id: "11201", cantonId: "112", nombre: "San Vicente" },
  { id: "11202", cantonId: "112", nombre: "San Jerónimo" },
  { id: "11203", cantonId: "112", nombre: "La Trinidad" },
  
  // Montes de Oca
  { id: "11301", cantonId: "113", nombre: "San Pedro" },
  { id: "11302", cantonId: "113", nombre: "Sabanilla" },
  { id: "11303", cantonId: "113", nombre: "Mercedes" },
  { id: "11304", cantonId: "113", nombre: "San Rafael" },
  
  // Curridabat
  { id: "11401", cantonId: "114", nombre: "Curridabat" },
  { id: "11402", cantonId: "114", nombre: "Granadilla" },
  { id: "11403", cantonId: "114", nombre: "Sánchez" },
  { id: "11404", cantonId: "114", nombre: "Tirrases" },
  
  // Alajuela - Cantón Alajuela
  { id: "20101", cantonId: "201", nombre: "Alajuela" },
  { id: "20102", cantonId: "201", nombre: "San José" },
  { id: "20103", cantonId: "201", nombre: "Carrizal" },
  { id: "20104", cantonId: "201", nombre: "San Antonio" },
  
  // Cartago - Cantón Cartago
  { id: "30101", cantonId: "301", nombre: "Oriental" },
  { id: "30102", cantonId: "301", nombre: "Occidental" },
  { id: "30103", cantonId: "301", nombre: "Carmen" },
  { id: "30104", cantonId: "301", nombre: "San Nicolás" },
  
  // Heredia - Cantón Heredia
  { id: "40101", cantonId: "401", nombre: "Heredia" },
  { id: "40102", cantonId: "401", nombre: "Mercedes" },
  { id: "40103", cantonId: "401", nombre: "San Francisco" },
  { id: "40104", cantonId: "401", nombre: "Ulloa" },
  
  // Liberia
  { id: "50101", cantonId: "501", nombre: "Liberia" },
  { id: "50102", cantonId: "501", nombre: "Cañas Dulces" },
  { id: "50103", cantonId: "501", nombre: "Mayorga" },
  
  // Puntarenas
  { id: "60101", cantonId: "601", nombre: "Puntarenas" },
  { id: "60102", cantonId: "601", nombre: "Pitahaya" },
  { id: "60103", cantonId: "601", nombre: "Chomes" },
  
  // Limón
  { id: "70101", cantonId: "701", nombre: "Limón" },
  { id: "70102", cantonId: "701", nombre: "Valle La Estrella" },
  { id: "70103", cantonId: "701", nombre: "Río Blanco" }
];

// Funciones helper
export function getCantonesByProvincia(provinciaId: string): Canton[] {
  return cantones.filter(c => c.provinciaId === provinciaId);
}

export function getDistritosByCanton(provinciaId: string, cantonId: string): Distrito[] {
  return distritos.filter(d => d.cantonId === cantonId);
}

export function getProvinciaById(id: string): Provincia | undefined {
  return provinciasCostaRica.find(p => p.id === id);
}

export function getCantonById(id: string): Canton | undefined {
  return cantones.find(c => c.id === id);
}

export function getDistritoById(id: string): Distrito | undefined {
  return distritos.find(d => d.id === id);
}

// Función para obtener la ubicación completa formateada
export function getFullLocation(provinciaId: string, cantonId: string, distritoId: string): string {
  const provincia = getProvinciaById(provinciaId);
  const canton = getCantonById(cantonId);
  const distrito = getDistritoById(distritoId);
  
  if (!provincia || !canton || !distrito) {
    return "Ubicación no especificada";
  }
  
  return `${distrito.nombre}, ${canton.nombre}, ${provincia.nombre}`;
}
