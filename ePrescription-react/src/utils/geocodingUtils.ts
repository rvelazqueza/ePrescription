/**
 * geocodingUtils.ts
 * 
 * Utilidades para geocodificación y geocodificación inversa
 * usando la API de OpenStreetMap Nominatim
 */

interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    town?: string;
    neighbourhood?: string;
    village?: string;
    hamlet?: string;
    quarter?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
    province?: string;
    state_district?: string;
  };
}

interface ReverseGeocodeResult {
  success: boolean;
  provincia?: string;
  canton?: string;
  distrito?: string;
  direccionCompleta?: string;
  error?: string;
}

/**
 * Mapeo de nombres de provincias de OpenStreetMap a IDs del sistema
 */
const PROVINCIAS_MAP: Record<string, string> = {
  "san josé": "1",
  "san jose": "1",
  "alajuela": "2",
  "cartago": "3",
  "heredia": "4",
  "guanacaste": "5",
  "puntarenas": "6",
  "limón": "7",
  "limon": "7"
};

/**
 * Normaliza un nombre de lugar removiendo acentos y convirtiendo a minúsculas
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Realiza reverse geocoding de coordenadas a dirección
 * @param lat Latitud
 * @param lon Longitud
 * @returns Información de ubicación estructurada
 */
export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult> {
  try {
    // Validar coordenadas
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      return {
        success: false,
        error: "Coordenadas inválidas"
      };
    }

    // Verificar que esté dentro de Costa Rica (aproximadamente)
    if (lat < 8 || lat > 11.5 || lon < -86 || lon > -82) {
      return {
        success: false,
        error: "Las coordenadas están fuera de Costa Rica"
      };
    }

    // Hacer la petición a Nominatim con español
    const url = `https://nominatim.openstreetmap.org/reverse?` +
      `format=json&` +
      `lat=${lat}&` +
      `lon=${lon}&` +
      `zoom=18&` +
      `addressdetails=1&` +
      `accept-language=es`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ePrescription-CostaRica/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeocodingResult = await response.json();

    if (!data || !data.address) {
      return {
        success: false,
        error: "No se encontró información de la ubicación"
      };
    }

    // Extraer información de la dirección
    const address = data.address;
    
    // Log para debugging
    console.log("🗺️ Datos de OpenStreetMap recibidos:", address);
    
    // Intentar obtener la provincia
    let provincia = address.state || address.province || address.state_district || "";
    provincia = normalizeText(provincia);
    console.log("📍 Provincia detectada:", provincia);
    
    // Intentar obtener el cantón (ciudad o municipio)
    let canton = address.city || address.municipality || address.county || "";
    canton = normalizeText(canton);
    console.log("📍 Cantón detectado:", canton);
    
    // Intentar obtener el distrito (suburb, town, neighbourhood, village, hamlet, road)
    let distrito = address.suburb || 
                   address.town || 
                   address.neighbourhood || 
                   address.village || 
                   address.hamlet ||
                   address.quarter ||
                   address.road || "";
    distrito = normalizeText(distrito);
    console.log("📍 Distrito detectado:", distrito);

    // Mapear provincia a ID del sistema
    const provinciaId = PROVINCIAS_MAP[provincia];
    console.log("📍 ID de provincia mapeado:", provinciaId);

    return {
      success: true,
      provincia: provinciaId || "",
      canton: canton,
      distrito: distrito,
      direccionCompleta: data.display_name
    };

  } catch (error) {
    console.error("❌ Error en reverse geocoding:");
    console.error("  • Tipo:", error instanceof Error ? "Error" : typeof error);
    console.error("  • Mensaje:", error instanceof Error ? error.message : String(error));
    console.error("  • Objeto completo:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al obtener la dirección"
    };
  }
}

/**
 * Busca la ubicación más cercana basada en texto
 * @param query Texto de búsqueda (dirección, lugar, etc.)
 * @param countryCode Código de país (default: "cr" para Costa Rica)
 * @returns Coordenadas de la ubicación encontrada
 */
export async function forwardGeocode(
  query: string,
  countryCode: string = "cr"
): Promise<{ lat: number; lon: number; display_name: string } | null> {
  try {
    if (!query || query.trim().length < 3) {
      return null;
    }

    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&` +
      `format=json&` +
      `countrycodes=${countryCode}&` +
      `limit=1&` +
      `accept-language=es`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ePrescription-CostaRica/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeocodingResult[] = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      display_name: result.display_name
    };

  } catch (error) {
    console.error("❌ Error en forward geocoding:");
    console.error("  • Tipo:", error instanceof Error ? "Error" : typeof error);
    console.error("  • Mensaje:", error instanceof Error ? error.message : String(error));
    console.error("  • Objeto completo:", error);
    
    return null;
  }
}

/**
 * Busca coincidencia aproximada de cantón en lista de cantones
 */
export function findBestCantonMatch(searchText: string, cantones: Array<{ id: string; nombre: string }>): string | null {
  if (!searchText || !cantones || cantones.length === 0) {
    return null;
  }

  const normalized = normalizeText(searchText);

  // Primero buscar coincidencia exacta
  for (const canton of cantones) {
    if (normalizeText(canton.nombre) === normalized) {
      return canton.id;
    }
  }

  // Luego buscar coincidencia parcial
  for (const canton of cantones) {
    const cantonNormalized = normalizeText(canton.nombre);
    if (cantonNormalized.includes(normalized) || normalized.includes(cantonNormalized)) {
      return canton.id;
    }
  }

  // Si no se encuentra, intentar con las primeras palabras
  const firstWord = normalized.split(' ')[0];
  if (firstWord.length >= 3) {
    for (const canton of cantones) {
      if (normalizeText(canton.nombre).startsWith(firstWord)) {
        return canton.id;
      }
    }
  }

  return null;
}

/**
 * Busca coincidencia aproximada de distrito en lista de distritos
 */
export function findBestDistritoMatch(searchText: string, distritos: Array<{ id: string; nombre: string }>): string | null {
  if (!searchText || !distritos || distritos.length === 0) {
    return null;
  }

  const normalized = normalizeText(searchText);

  // Primero buscar coincidencia exacta
  for (const distrito of distritos) {
    if (normalizeText(distrito.nombre) === normalized) {
      return distrito.id;
    }
  }

  // Luego buscar coincidencia parcial
  for (const distrito of distritos) {
    const distritoNormalized = normalizeText(distrito.nombre);
    if (distritoNormalized.includes(normalized) || normalized.includes(distritoNormalized)) {
      return distrito.id;
    }
  }

  // Intentar con las primeras palabras
  const firstWord = normalized.split(' ')[0];
  if (firstWord.length >= 3) {
    for (const distrito of distritos) {
      const distritoFirstWord = normalizeText(distrito.nombre).split(' ')[0];
      if (distritoFirstWord === firstWord) {
        return distrito.id;
      }
    }
  }

  // Buscar palabras clave comunes
  for (const distrito of distritos) {
    const distritoWords = normalizeText(distrito.nombre).split(' ');
    const searchWords = normalized.split(' ');
    
    for (const searchWord of searchWords) {
      if (searchWord.length >= 4) {
        for (const distritoWord of distritoWords) {
          if (distritoWord.includes(searchWord) || searchWord.includes(distritoWord)) {
            return distrito.id;
          }
        }
      }
    }
  }

  return null;
}
