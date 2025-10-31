/**
 * Utilidad de validación de correos electrónicos
 * Implementa las reglas profesionales para validación de emails en el sistema ePrescription
 */

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida un correo electrónico según las reglas del sistema
 * 
 * Reglas:
 * - Debe contener exactamente un "@"
 * - Debe tener un nombre de usuario antes del "@"
 * - Solo letras, números, puntos, guiones y guiones bajos en la parte local
 * - No puede comenzar ni terminar con un punto
 * - No puede tener puntos consecutivos
 * - Debe tener un dominio válido después del "@", con al menos un punto
 * - Extensión del dominio de 2 a 63 caracteres alfabéticos
 */
export function validateEmail(email: string): EmailValidationResult {
  // Si está vacío, no validar (permite campos opcionales)
  if (!email || email.trim() === '') {
    return { isValid: true };
  }

  const trimmedEmail = email.trim();

  // Verificar que contenga exactamente un "@"
  const atCount = (trimmedEmail.match(/@/g) || []).length;
  if (atCount !== 1) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  const [localPart, domainPart] = trimmedEmail.split('@');

  // Verificar que exista la parte local (antes del @)
  if (!localPart || localPart.length === 0) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // Verificar que exista el dominio (después del @)
  if (!domainPart || domainPart.length === 0) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // Validar parte local: solo letras, números, puntos, guiones y guiones bajos
  const localPartRegex = /^[a-zA-Z0-9._-]+$/;
  if (!localPartRegex.test(localPart)) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // No puede comenzar ni terminar con un punto
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // No puede tener puntos consecutivos
  if (localPart.includes('..')) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // Verificar que el dominio tenga al menos un punto
  if (!domainPart.includes('.')) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // Validar estructura del dominio
  const domainParts = domainPart.split('.');
  
  // Debe tener al menos 2 partes (ej: ejemplo.com)
  if (domainParts.length < 2) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // Validar cada parte del dominio
  for (const part of domainParts) {
    if (part.length === 0) {
      return {
        isValid: false,
        error: 'Ingrese un correo electrónico válido'
      };
    }

    // Cada parte del dominio debe contener solo letras, números y guiones
    if (!/^[a-zA-Z0-9-]+$/.test(part)) {
      return {
        isValid: false,
        error: 'Ingrese un correo electrónico válido'
      };
    }

    // No puede comenzar ni terminar con guión
    if (part.startsWith('-') || part.endsWith('-')) {
      return {
        isValid: false,
        error: 'Ingrese un correo electrónico válido'
      };
    }
  }

  // Validar la extensión del dominio (última parte)
  const extension = domainParts[domainParts.length - 1];
  
  // La extensión debe tener entre 2 y 63 caracteres alfabéticos
  if (extension.length < 2 || extension.length > 63) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  // La extensión solo debe contener letras
  if (!/^[a-zA-Z]+$/.test(extension)) {
    return {
      isValid: false,
      error: 'Ingrese un correo electrónico válido'
    };
  }

  return { isValid: true };
}

/**
 * Valida múltiples correos electrónicos separados por comas
 */
export function validateMultipleEmails(emails: string): EmailValidationResult {
  if (!emails || emails.trim() === '') {
    return { isValid: true };
  }

  const emailList = emails.split(',').map(e => e.trim()).filter(e => e.length > 0);
  
  for (const email of emailList) {
    const result = validateEmail(email);
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
}
