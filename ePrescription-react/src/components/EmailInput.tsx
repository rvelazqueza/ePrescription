/**
 * Componente EmailInput con validación completa
 * Sistema profesional de validación de correos electrónicos con feedback visual
 */

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateEmail } from '../utils/emailValidation';

interface EmailInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showSuccessIndicator?: boolean;
  className?: string;
}

export function EmailInput({
  id = 'email',
  label = 'Correo electrónico',
  value,
  onChange,
  onValidationChange,
  placeholder = 'ejemplo@correo.com',
  required = false,
  disabled = false,
  showSuccessIndicator = true,
  className = ''
}: EmailInputProps) {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState({ isValid: true, error: undefined as string | undefined });

  // Validar en tiempo real cuando el valor cambia
  useEffect(() => {
    const result = validateEmail(value);
    setValidationResult(result);
    
    // Notificar al componente padre sobre el estado de validación
    if (onValidationChange) {
      // Si el campo es requerido y está vacío, es inválido
      if (required && !value.trim()) {
        onValidationChange(false);
      } else {
        onValidationChange(result.isValid);
      }
    }
  }, [value, required, onValidationChange]);

  const handleBlur = () => {
    setTouched(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Determinar si mostrar el error
  const showError = touched && !validationResult.isValid && value.trim() !== '';
  
  // Determinar si mostrar el indicador de éxito
  const showSuccess = 
    showSuccessIndicator && 
    touched && 
    validationResult.isValid && 
    value.trim() !== '';

  // Determinar el estilo del borde
  const getBorderStyle = () => {
    if (showError) {
      return 'border-destructive focus-visible:ring-destructive';
    }
    if (showSuccess) {
      return 'border-green-500 focus-visible:ring-green-500';
    }
    return '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Etiqueta */}
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Input con indicador visual */}
      <div className="relative">
        <Input
          id={id}
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${getBorderStyle()}`}
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-error` : undefined}
        />
        
        {/* Icono de estado */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {showError && (
            <AlertCircle className="w-5 h-5 text-destructive" />
          )}
          {showSuccess && (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {showError && validationResult.error && (
        <p 
          id={`${id}-error`}
          className="text-sm text-destructive flex items-center gap-1.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {validationResult.error}
        </p>
      )}

      {/* Mensaje cuando es requerido pero está vacío */}
      {required && touched && value.trim() === '' && (
        <p 
          id={`${id}-error`}
          className="text-sm text-destructive flex items-center gap-1.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Este campo es obligatorio
        </p>
      )}
    </div>
  );
}
