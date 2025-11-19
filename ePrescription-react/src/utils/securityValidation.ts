/**
 * Security Validation - Validaciones centralizadas de seguridad
 * 
 * Unifica las validaciones de contraseñas, datos de usuario y seguridad
 * que se aplican en todas las páginas del sistema.
 * 
 * Cumplimiento: NIST 800-63B, HIPAA, FDA 21 CFR Part 11, ISO 27001
 */

// ============================================
// VALIDACIONES DE CONTRASEÑA
// ============================================

export interface PasswordValidationResult {
  valid: boolean;
  message?: string;
  errors?: string[];
}

export interface PasswordStrengthResult {
  strength: number; // 0-100
  label: string;
  color: string;
  score: number; // Puntuación interna
}

/**
 * Políticas de contraseña según NIST 800-63B y estándares médicos
 */
export const PASSWORD_POLICIES = {
  MIN_LENGTH: 12,
  MIN_CHAR_TYPES: 3,
  REQUIRE_LOWERCASE: true,
  REQUIRE_UPPERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: false, // Al menos 3 de 4 tipos
  MAX_REPEATED_CHARS: 3,
  CHECK_COMMON_PASSWORDS: true,
  CHECK_USER_DATA: true,
  HISTORY_COUNT: 5, // No reusar últimas 5 contraseñas
} as const;

/**
 * Contraseñas comunes prohibidas (lista parcial)
 */
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty',
  'abc123', 'monkey', '1234567', 'letmein', 'trustno1',
  'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123',
  'hospital', 'medico', 'doctor', 'enfermera', 'farmacia',
  'admin', 'administrador', 'sistema', 'eprescription'
];

/**
 * Valida la fortaleza de una contraseña según políticas de seguridad
 * NIST 800-63B, HIPAA, FDA 21 CFR Part 11
 */
export function validatePasswordStrength(
  password: string,
  userData?: {
    username?: string;
    email?: string;
    fullName?: string;
    phone?: string;
  }
): PasswordValidationResult {
  const errors: string[] = [];

  // 1. Longitud mínima
  if (password.length < PASSWORD_POLICIES.MIN_LENGTH) {
    errors.push(`La contraseña debe tener al menos ${PASSWORD_POLICIES.MIN_LENGTH} caracteres`);
  }

  // 2. Tipos de caracteres
  let characterTypes = 0;
  const checks = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password)
  };

  if (checks.lowercase) characterTypes++;
  if (checks.uppercase) characterTypes++;
  if (checks.number) characterTypes++;
  if (checks.special) characterTypes++;

  if (characterTypes < PASSWORD_POLICIES.MIN_CHAR_TYPES) {
    errors.push(
      `Debe incluir al menos ${PASSWORD_POLICIES.MIN_CHAR_TYPES} tipos de caracteres: ` +
      `minúsculas, mayúsculas, números y símbolos especiales`
    );
  }

  // 3. Caracteres repetidos
  const repeatedPattern = new RegExp(`(.)\\1{${PASSWORD_POLICIES.MAX_REPEATED_CHARS},}`);
  if (repeatedPattern.test(password)) {
    errors.push(`No puede contener más de ${PASSWORD_POLICIES.MAX_REPEATED_CHARS} caracteres repetidos consecutivos`);
  }

  // 4. Contraseñas comunes prohibidas
  if (PASSWORD_POLICIES.CHECK_COMMON_PASSWORDS) {
    const lowerPassword = password.toLowerCase();
    if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common))) {
      errors.push('La contraseña es muy común o predecible. Usa una combinación más segura');
    }
  }

  // 5. No debe contener datos del usuario
  if (PASSWORD_POLICIES.CHECK_USER_DATA && userData) {
    const lowerPassword = password.toLowerCase();
    const userDataValues = [
      userData.username,
      userData.email?.split('@')[0],
      ...( userData.fullName?.split(' ') || []),
      userData.phone?.replace(/[^0-9]/g, '')
    ].filter(Boolean);

    for (const value of userDataValues) {
      if (value && value.length >= 4 && lowerPassword.includes(value.toLowerCase())) {
        errors.push('La contraseña no debe contener tu nombre de usuario, correo o datos personales');
        break;
      }
    }
  }

  // 6. Secuencias prohibidas
  const sequences = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'qwe', 'wer', 'ert'];
  const lowerPassword = password.toLowerCase();
  if (sequences.some(seq => lowerPassword.includes(seq))) {
    errors.push('La contraseña no debe contener secuencias simples (123, abc, qwe, etc.)');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: errors[0],
      errors
    };
  }

  return { valid: true };
}

/**
 * Calcula la fortaleza visual de una contraseña (0-100)
 */
export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (password.length === 0) {
    return { strength: 0, label: '', color: '', score: 0 };
  }

  let score = 0;

  // Longitud (40 puntos máximo)
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;

  // Tipos de caracteres (40 puntos máximo)
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;

  // Complejidad adicional (20 puntos máximo)
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 10;
  if (uniqueChars >= 12) score += 10;

  // Normalizar a 0-100
  const strength = Math.min(100, score);

  // Determinar label y color
  if (strength < 40) {
    return { strength, label: 'Muy débil', color: 'bg-destructive', score };
  } else if (strength < 60) {
    return { strength, label: 'Débil', color: 'bg-warning', score };
  } else if (strength < 80) {
    return { strength, label: 'Regular', color: 'bg-yellow-500', score };
  } else if (strength < 90) {
    return { strength, label: 'Buena', color: 'bg-success', score };
  } else {
    return { strength, label: 'Excelente', color: 'bg-success', score };
  }
}

/**
 * Verifica si dos contraseñas son iguales
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): PasswordValidationResult {
  if (password !== confirmPassword) {
    return {
      valid: false,
      message: 'Las contraseñas no coinciden'
    };
  }

  return { valid: true };
}

/**
 * Verifica que la nueva contraseña sea diferente de la actual
 */
export function validatePasswordDifferent(
  currentPassword: string,
  newPassword: string
): PasswordValidationResult {
  if (currentPassword === newPassword) {
    return {
      valid: false,
      message: 'La nueva contraseña debe ser diferente a la actual'
    };
  }

  return { valid: true };
}

// ============================================
// VALIDACIONES DE DATOS DE USUARIO
// ============================================

export interface UserDataValidationResult {
  valid: boolean;
  message?: string;
  field?: string;
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): UserDataValidationResult {
  if (!email) {
    return { valid: false, message: 'El correo electrónico es obligatorio', field: 'email' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'El formato del correo electrónico no es válido', field: 'email' };
  }

  // Longitud máxima
  if (email.length > 100) {
    return { valid: false, message: 'El correo electrónico es demasiado largo', field: 'email' };
  }

  return { valid: true };
}

/**
 * Valida formato de teléfono
 */
export function validatePhone(phone: string): UserDataValidationResult {
  if (!phone) {
    return { valid: false, message: 'El teléfono es obligatorio', field: 'phone' };
  }

  // Permitir formatos: +506 1234-5678, (506) 1234-5678, 1234-5678, etc.
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, message: 'El formato del teléfono no es válido', field: 'phone' };
  }

  // Extraer solo números
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return { valid: false, message: 'El teléfono debe tener entre 8 y 15 dígitos', field: 'phone' };
  }

  return { valid: true };
}

/**
 * Valida nombre completo
 */
export function validateFullName(fullName: string): UserDataValidationResult {
  if (!fullName || fullName.trim().length === 0) {
    return { valid: false, message: 'El nombre completo es obligatorio', field: 'fullName' };
  }

  if (fullName.trim().length < 3) {
    return { valid: false, message: 'El nombre completo debe tener al menos 3 caracteres', field: 'fullName' };
  }

  if (fullName.length > 100) {
    return { valid: false, message: 'El nombre completo es demasiado largo', field: 'fullName' };
  }

  // Debe contener al menos un espacio (nombre y apellido)
  if (!fullName.includes(' ')) {
    return { valid: false, message: 'Debe incluir nombre y apellido', field: 'fullName' };
  }

  // Solo letras, espacios, guiones y apóstrofes
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!nameRegex.test(fullName)) {
    return { valid: false, message: 'El nombre solo puede contener letras, espacios y guiones', field: 'fullName' };
  }

  return { valid: true };
}

/**
 * Valida especialidad médica
 */
export function validateSpecialty(specialty: string): UserDataValidationResult {
  if (!specialty || specialty.trim().length === 0) {
    return { valid: false, message: 'La especialidad es obligatoria', field: 'specialty' };
  }

  if (specialty.trim().length < 3) {
    return { valid: false, message: 'La especialidad debe tener al menos 3 caracteres', field: 'specialty' };
  }

  if (specialty.length > 100) {
    return { valid: false, message: 'La especialidad es demasiado larga', field: 'specialty' };
  }

  return { valid: true };
}

/**
 * Valida departamento
 */
export function validateDepartment(department: string): UserDataValidationResult {
  if (!department || department.trim().length === 0) {
    return { valid: false, message: 'El departamento es obligatorio', field: 'department' };
  }

  if (department.trim().length < 3) {
    return { valid: false, message: 'El departamento debe tener al menos 3 caracteres', field: 'department' };
  }

  if (department.length > 100) {
    return { valid: false, message: 'El departamento es demasiado largo', field: 'department' };
  }

  return { valid: true };
}

// ============================================
// VALIDACIÓN COMPLETA DE PERFIL
// ============================================

export interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
}

export interface ProfileValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  messages: string[];
}

/**
 * Valida todos los campos de un perfil de usuario
 */
export function validateUserProfile(data: UserProfileData): ProfileValidationResult {
  const errors: Record<string, string> = {};
  const messages: string[] = [];

  // Validar nombre
  const nameValidation = validateFullName(data.fullName);
  if (!nameValidation.valid) {
    errors.fullName = nameValidation.message || '';
    messages.push(nameValidation.message || '');
  }

  // Validar email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.message || '';
    messages.push(emailValidation.message || '');
  }

  // Validar teléfono
  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.message || '';
    messages.push(phoneValidation.message || '');
  }

  // Validar especialidad
  const specialtyValidation = validateSpecialty(data.specialty);
  if (!specialtyValidation.valid) {
    errors.specialty = specialtyValidation.message || '';
    messages.push(specialtyValidation.message || '');
  }

  // Validar departamento
  const departmentValidation = validateDepartment(data.department);
  if (!departmentValidation.valid) {
    errors.department = departmentValidation.message || '';
    messages.push(departmentValidation.message || '');
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    messages
  };
}

// ============================================
// VALIDACIONES DE SEGURIDAD ADICIONALES
// ============================================

/**
 * Valida que el usuario tenga permisos para actualizar su perfil
 */
export function validateProfileUpdatePermissions(
  userId: string,
  targetUserId: string,
  userRole: string
): UserDataValidationResult {
  // Un usuario solo puede actualizar su propio perfil
  if (userId !== targetUserId) {
    // A menos que sea administrador
    if (userRole !== 'Administrador') {
      return {
        valid: false,
        message: 'No tienes permisos para actualizar este perfil'
      };
    }
  }

  return { valid: true };
}

/**
 * Verifica rate limiting para cambios de contraseña
 * (Previene ataques de fuerza bruta)
 */
export function checkPasswordChangeRateLimit(
  userId: string,
  lastPasswordChange: Date,
  minHoursBetweenChanges: number = 1
): UserDataValidationResult {
  const now = new Date();
  const hoursSinceLastChange = (now.getTime() - lastPasswordChange.getTime()) / (1000 * 60 * 60);

  if (hoursSinceLastChange < minHoursBetweenChanges) {
    return {
      valid: false,
      message: `Debes esperar al menos ${minHoursBetweenChanges} hora(s) entre cambios de contraseña`
    };
  }

  return { valid: true };
}

/**
 * Verifica que los cambios de datos sensibles requieran autenticación adicional
 */
export function requiresAdditionalAuth(
  fieldChanged: string
): boolean {
  const sensitiveFields = ['email', 'phone', 'username', 'certifiedId'];
  return sensitiveFields.includes(fieldChanged);
}

/**
 * Genera un resumen de cambios para auditoría
 */
export function generateChangeAuditLog(
  oldData: Partial<UserProfileData>,
  newData: Partial<UserProfileData>,
  userId: string,
  changedBy: string
): {
  changes: Array<{ field: string; oldValue: any; newValue: any }>;
  requiresAuth: boolean;
  timestamp: string;
} {
  const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];
  let requiresAuth = false;

  for (const key in newData) {
    const field = key as keyof UserProfileData;
    if (oldData[field] !== newData[field]) {
      changes.push({
        field,
        oldValue: oldData[field],
        newValue: newData[field]
      });

      if (requiresAdditionalAuth(field)) {
        requiresAuth = true;
      }
    }
  }

  return {
    changes,
    requiresAuth,
    timestamp: new Date().toISOString()
  };
}

// ============================================
// EXPORTAR TODO
// ============================================

export const SecurityValidation = {
  // Contraseñas
  validatePasswordStrength,
  getPasswordStrength,
  validatePasswordMatch,
  validatePasswordDifferent,
  PASSWORD_POLICIES,
  
  // Datos de usuario
  validateEmail,
  validatePhone,
  validateFullName,
  validateSpecialty,
  validateDepartment,
  validateUserProfile,
  
  // Permisos y seguridad
  validateProfileUpdatePermissions,
  checkPasswordChangeRateLimit,
  requiresAdditionalAuth,
  generateChangeAuditLog
};

export default SecurityValidation;
