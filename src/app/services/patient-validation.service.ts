import { Injectable } from '@angular/core';
import { PatientData, MedicalAlert } from '../interfaces/patient.interface';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface PatientDataCompleteness {
  completionPercentage: number;
  missingFields: string[];
  criticalMissing: string[];
  recommendedFields: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PatientValidationService {

  /**
   * Validate patient data for profile view
   * Requirements: 3.4, 5.4
   */
  validatePatientForProfile(patient: PatientData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Critical field validations
    if (!patient.fullName || patient.fullName.trim().length === 0) {
      errors.push({
        field: 'fullName',
        message: 'El nombre completo es requerido',
        severity: 'error'
      });
    }

    if (!patient.idNumber || patient.idNumber.trim().length === 0) {
      errors.push({
        field: 'idNumber',
        message: 'El número de identificación es requerido',
        severity: 'error'
      });
    }

    if (!patient.birthDate) {
      errors.push({
        field: 'birthDate',
        message: 'La fecha de nacimiento es requerida',
        severity: 'error'
      });
    } else {
      // Validate birth date format and logic
      const birthDate = new Date(patient.birthDate);
      const today = new Date();
      
      if (isNaN(birthDate.getTime())) {
        errors.push({
          field: 'birthDate',
          message: 'La fecha de nacimiento no es válida',
          severity: 'error'
        });
      } else if (birthDate > today) {
        errors.push({
          field: 'birthDate',
          message: 'La fecha de nacimiento no puede ser futura',
          severity: 'error'
        });
      } else if (this.calculateAge(patient.birthDate) > 150) {
        warnings.push({
          field: 'birthDate',
          message: 'La edad calculada parece inusualmente alta',
          suggestion: 'Verifique la fecha de nacimiento'
        });
      }
    }

    if (!patient.phone || patient.phone.trim().length === 0) {
      errors.push({
        field: 'phone',
        message: 'El número de teléfono es requerido',
        severity: 'error'
      });
    } else if (!this.isValidPhoneNumber(patient.phone)) {
      warnings.push({
        field: 'phone',
        message: 'El formato del teléfono puede no ser válido',
        suggestion: 'Verifique que incluya código de área'
      });
    }

    // Email validation (if provided)
    if (patient.email && !this.isValidEmail(patient.email)) {
      errors.push({
        field: 'email',
        message: 'El formato del email no es válido',
        severity: 'error'
      });
    }

    // Gender validation
    if (!patient.gender || !['M', 'F'].includes(patient.gender)) {
      errors.push({
        field: 'gender',
        message: 'El género debe ser especificado (M o F)',
        severity: 'error'
      });
    }

    // ID type validation
    if (!patient.idType || patient.idType.trim().length === 0) {
      errors.push({
        field: 'idType',
        message: 'El tipo de identificación es requerido',
        severity: 'error'
      });
    }

    // Medical data warnings
    if (!patient.bloodType) {
      warnings.push({
        field: 'bloodType',
        message: 'Tipo de sangre no especificado',
        suggestion: 'Considere agregar esta información médica importante'
      });
    }

    if (!patient.allergies || patient.allergies.length === 0) {
      warnings.push({
        field: 'allergies',
        message: 'No se han registrado alergias',
        suggestion: 'Confirme con el paciente si tiene alergias conocidas'
      });
    }

    // Emergency contact validation
    if (!patient.emergencyContact) {
      warnings.push({
        field: 'emergencyContact',
        message: 'No hay contacto de emergencia registrado',
        suggestion: 'Es recomendable tener un contacto de emergencia'
      });
    } else {
      if (!patient.emergencyContact.name || !patient.emergencyContact.phone) {
        errors.push({
          field: 'emergencyContact',
          message: 'El contacto de emergencia debe incluir nombre y teléfono',
          severity: 'error'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate medical alerts data
   * Requirements: 3.4, 5.4
   */
  validateMedicalAlerts(alerts: MedicalAlert[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    alerts.forEach((alert, index) => {
      if (!alert.name || alert.name.trim().length === 0) {
        errors.push({
          field: `medicalAlert_${index}`,
          message: `La alerta médica #${index + 1} debe tener un nombre`,
          severity: 'error'
        });
      }

      if (!alert.severity || !['high', 'medium', 'low'].includes(alert.severity)) {
        errors.push({
          field: `medicalAlert_${index}`,
          message: `La alerta médica "${alert.name}" debe tener una severidad válida`,
          severity: 'error'
        });
      }

      if (!alert.dateAdded) {
        warnings.push({
          field: `medicalAlert_${index}`,
          message: `La alerta médica "${alert.name}" no tiene fecha de registro`,
          suggestion: 'Considere agregar la fecha cuando se identificó esta condición'
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Calculate patient data completeness
   * Requirements: 3.4, 5.4
   */
  calculateDataCompleteness(patient: PatientData): PatientDataCompleteness {
    const requiredFields = [
      'fullName', 'idNumber', 'idType', 'birthDate', 'gender', 'phone'
    ];
    
    const recommendedFields = [
      'email', 'address', 'city', 'bloodType', 'emergencyContact',
      'insuranceProvider', 'insuranceNumber'
    ];

    const medicalFields = [
      'allergies', 'chronicConditions', 'currentMedications'
    ];

    const allFields = [...requiredFields, ...recommendedFields, ...medicalFields];
    
    let completedFields = 0;
    const missingFields: string[] = [];
    const criticalMissing: string[] = [];
    const recommendedMissing: string[] = [];

    // Check required fields
    requiredFields.forEach(field => {
      const value = patient[field as keyof PatientData];
      if (this.isFieldComplete(value)) {
        completedFields++;
      } else {
        missingFields.push(field);
        criticalMissing.push(field);
      }
    });

    // Check recommended fields
    recommendedFields.forEach(field => {
      const value = patient[field as keyof PatientData];
      if (this.isFieldComplete(value)) {
        completedFields++;
      } else {
        missingFields.push(field);
        recommendedMissing.push(field);
      }
    });

    // Check medical fields (arrays)
    medicalFields.forEach(field => {
      const value = patient[field as keyof PatientData] as string[];
      if (value && Array.isArray(value) && value.length > 0) {
        completedFields++;
      } else {
        missingFields.push(field);
        recommendedMissing.push(field);
      }
    });

    const completionPercentage = Math.round((completedFields / allFields.length) * 100);

    return {
      completionPercentage,
      missingFields,
      criticalMissing,
      recommendedFields: recommendedMissing
    };
  }

  /**
   * Validate patient data for specific operations
   * Requirements: 3.4, 5.4
   */
  validateForOperation(patient: PatientData, operation: 'prescription' | 'appointment' | 'export'): ValidationResult {
    const baseValidation = this.validatePatientForProfile(patient);
    const errors = [...baseValidation.errors];
    const warnings = [...baseValidation.warnings];

    switch (operation) {
      case 'prescription':
        // Additional validations for prescription creation
        if (!patient.allergies || patient.allergies.length === 0) {
          warnings.push({
            field: 'allergies',
            message: 'No se han registrado alergias',
            suggestion: 'Confirme alergias antes de prescribir medicamentos'
          });
        }

        if (!patient.currentMedications || patient.currentMedications.length === 0) {
          warnings.push({
            field: 'currentMedications',
            message: 'No se han registrado medicamentos actuales',
            suggestion: 'Verifique medicamentos actuales para evitar interacciones'
          });
        }
        break;

      case 'appointment':
        // Additional validations for appointments
        if (!patient.phone) {
          errors.push({
            field: 'phone',
            message: 'El teléfono es requerido para programar citas',
            severity: 'error'
          });
        }
        break;

      case 'export':
        // Additional validations for data export
        if (!patient.address) {
          warnings.push({
            field: 'address',
            message: 'La dirección no está registrada',
            suggestion: 'La dirección puede ser requerida en algunos reportes'
          });
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if a field value is considered complete
   */
  private isFieldComplete(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (basic validation)
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Colombian phone numbers are typically 10 digits (mobile) or 7-8 digits (landline)
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  }

  /**
   * Calculate age from birth date
   */
  private calculateAge(birthDate: string): number {
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  }

  /**
   * Get field display name for user-friendly error messages
   */
  getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      'fullName': 'Nombre completo',
      'idNumber': 'Número de identificación',
      'idType': 'Tipo de identificación',
      'birthDate': 'Fecha de nacimiento',
      'gender': 'Género',
      'phone': 'Teléfono',
      'email': 'Correo electrónico',
      'address': 'Dirección',
      'city': 'Ciudad',
      'bloodType': 'Tipo de sangre',
      'allergies': 'Alergias',
      'chronicConditions': 'Condiciones crónicas',
      'currentMedications': 'Medicamentos actuales',
      'emergencyContact': 'Contacto de emergencia',
      'insuranceProvider': 'Proveedor de seguro',
      'insuranceNumber': 'Número de seguro'
    };

    return fieldNames[field] || field;
  }

  /**
   * Get validation summary for display
   */
  getValidationSummary(validation: ValidationResult): string {
    if (validation.isValid && validation.warnings.length === 0) {
      return 'Todos los datos del paciente están completos y válidos';
    }

    const parts: string[] = [];
    
    if (validation.errors.length > 0) {
      parts.push(`${validation.errors.length} error(es) crítico(s)`);
    }
    
    if (validation.warnings.length > 0) {
      parts.push(`${validation.warnings.length} advertencia(s)`);
    }

    return parts.join(' y ');
  }
}