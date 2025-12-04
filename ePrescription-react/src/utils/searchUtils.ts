/**
 * Normaliza texto para búsquedas insensibles a mayúsculas/minúsculas y tildes
 * @param text - Texto a normalizar
 * @returns Texto normalizado (minúsculas, sin tildes)
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, '') // Remueve las marcas diacríticas (tildes)
    .trim();
}

/**
 * Compara dos textos de forma normalizada
 * @param text1 - Primer texto
 * @param text2 - Segundo texto
 * @returns true si los textos son iguales después de normalizar
 */
export function normalizedEquals(text1: string, text2: string): boolean {
  return normalizeSearchText(text1) === normalizeSearchText(text2);
}

/**
 * Verifica si un texto contiene otro de forma normalizada
 * @param text - Texto donde buscar
 * @param searchTerm - Término a buscar
 * @returns true si el texto contiene el término de búsqueda
 */
export function normalizedIncludes(text: string, searchTerm: string): boolean {
  return normalizeSearchText(text).includes(normalizeSearchText(searchTerm));
}
