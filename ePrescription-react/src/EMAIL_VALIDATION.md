# Sistema de Validación de Emails - ePrescription

## Descripción General

El sistema ePrescription cuenta con un sistema completo de validación de correos electrónicos que se aplica de manera consistente en toda la aplicación. Este sistema garantiza que todos los correos ingresados cumplan con estándares profesionales y formatos válidos.

## Reglas de Validación

### Formato Básico
- **Exactamente un "@"**: El correo debe contener un único símbolo arroba
- **Nombre de usuario**: Debe existir texto antes del "@"
- **Caracteres permitidos en parte local**: Solo letras (a-z, A-Z), números (0-9), puntos (.), guiones (-) y guiones bajos (_)
- **Restricciones de puntos**:
  - No puede comenzar con un punto
  - No puede terminar con un punto
  - No puede tener puntos consecutivos (..)
- **Dominio válido**: 
  - Debe existir texto después del "@"
  - Debe contener al menos un punto
  - Cada parte del dominio solo puede contener letras, números y guiones
  - No puede comenzar ni terminar con guión
- **Extensión del dominio**: 
  - Entre 2 y 63 caracteres
  - Solo caracteres alfabéticos (a-z, A-Z)

### Ejemplos Válidos
✅ `usuario@ejemplo.com`
✅ `juan.perez@hospital.mx`
✅ `doctor_123@clinica-central.com.ar`
✅ `admin@eprescription.health`

### Ejemplos Inválidos
❌ `usuario@ejemplo` (falta extensión de dominio)
❌ `.usuario@ejemplo.com` (comienza con punto)
❌ `usuario..nombre@ejemplo.com` (puntos consecutivos)
❌ `usuario@ejemplo..com` (puntos consecutivos en dominio)
❌ `usuario@@ejemplo.com` (doble @)
❌ `usuario@ejemplo.123` (extensión no alfabética)

## Componentes Implementados

### 1. EmailInput
Componente para un solo correo electrónico con validación en tiempo real.

**Ubicación**: `/components/EmailInput.tsx`

**Uso**:
```tsx
import { EmailInput } from './components/EmailInput';

<EmailInput
  id="email"
  label="Correo electrónico"
  value={email}
  onChange={setEmail}
  placeholder="ejemplo@correo.com"
  required
  showSuccessIndicator
/>
```

**Características**:
- Validación en tiempo real mientras el usuario escribe
- Indicador visual de error (borde rojo + icono de alerta)
- Indicador visual de éxito (borde verde + icono de check)
- Mensaje de error descriptivo debajo del campo
- Soporte para campos obligatorios
- Auto layout vertical (etiqueta → input → mensaje)

### 2. MultiEmailInput
Componente para múltiples correos separados por comas.

**Ubicación**: `/components/MultiEmailInput.tsx`

**Uso**:
```tsx
import { MultiEmailInput } from './components/MultiEmailInput';

<MultiEmailInput
  id="cc"
  label="Copias CC"
  value={ccEmails}
  onChange={setCcEmails}
  placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
/>
```

**Características**:
- Valida múltiples correos separados por comas
- Todas las características de EmailInput
- Mensaje de ayuda: "Separe múltiples correos con comas"

## Utilidades de Validación

### validateEmail(email: string)
Función principal de validación de un solo correo.

**Ubicación**: `/utils/emailValidation.ts`

**Retorna**: 
```typescript
{
  isValid: boolean;
  error?: string;
}
```

**Uso**:
```typescript
import { validateEmail } from './utils/emailValidation';

const result = validateEmail('usuario@ejemplo.com');
if (result.isValid) {
  // Email válido
} else {
  console.log(result.error); // "Ingrese un correo electrónico válido"
}
```

### validateMultipleEmails(emails: string)
Función para validar múltiples correos separados por comas.

**Ubicación**: `/utils/emailValidation.ts`

**Uso**:
```typescript
import { validateMultipleEmails } from './utils/emailValidation';

const result = validateMultipleEmails('correo1@ejemplo.com, correo2@ejemplo.com');
```

## Páginas Actualizadas

Los siguientes formularios y diálogos ya implementan el sistema de validación de emails:

### Módulo de Pacientes
- ✅ **NewPatientDialog**: Formulario de nuevo paciente
- ✅ **EditPatientProfileDialog**: Edición de perfil de paciente

### Módulo de Médicos
- ✅ **NewDoctorDialog**: Formulario de nuevo médico
- ✅ **EditDoctorDialog**: Edición de datos de médico

### Módulo de Notificaciones
- ✅ **NotificacionesConfigPage**: Configuración de notificaciones (campos CC y BCC)

## Características de UX

### Validación en Tiempo Real
- La validación se ejecuta automáticamente mientras el usuario escribe
- No requiere enviar el formulario para ver errores
- Feedback inmediato mejora la experiencia de usuario

### Indicadores Visuales
1. **Estado normal**: Borde gris estándar
2. **Estado de error**: 
   - Borde rojo
   - Icono de alerta (AlertCircle) en color rojo
   - Mensaje de error en texto rojo
3. **Estado de éxito** (opcional):
   - Borde verde
   - Icono de check (CheckCircle2) en color verde

### Mensajes de Error
- **Email inválido**: "Ingrese un correo electrónico válido"
- **Campo obligatorio vacío**: "Este campo es obligatorio"

### Accesibilidad
- Uso de atributos ARIA (`aria-invalid`, `aria-describedby`)
- Roles semánticos (`role="alert"`)
- Asociación correcta entre label e input
- Indicadores visuales complementados con texto

## Integración con Formularios

### Callback de Validación
Los componentes pueden notificar al formulario padre sobre el estado de validación:

```typescript
<EmailInput
  value={email}
  onChange={setEmail}
  onValidationChange={(isValid) => {
    // Actualizar estado del formulario
    setIsEmailValid(isValid);
  }}
/>
```

### Campos Opcionales vs Obligatorios
- **Campos opcionales**: Si el campo está vacío, se considera válido
- **Campos obligatorios** (`required={true}`): El campo vacío se marca como error

## Mejores Prácticas

### Para Desarrolladores
1. **Siempre usar los componentes de validación** en lugar de `<Input type="email">`
2. **Especificar si el campo es obligatorio** con la prop `required`
3. **Manejar el callback de validación** si necesitas validar el formulario completo
4. **Usar MultiEmailInput** para campos que aceptan múltiples correos

### Para Diseño
1. Los componentes ya incluyen todo el diseño necesario (etiqueta, input, mensaje)
2. No agregar estilos de borde personalizados que interfieran con los indicadores visuales
3. Respetar el espacio vertical para los mensajes de error

## Mantenimiento

### Agregar Nuevas Reglas de Validación
Modificar la función `validateEmail` en `/utils/emailValidation.ts`

### Personalizar Mensajes de Error
Los mensajes se retornan en la propiedad `error` del resultado de validación

### Extender Funcionalidad
Los componentes aceptan todas las props estándar de Input más las personalizadas documentadas

## Testing

### Casos de Prueba Cubiertos
- ✅ Email vacío en campo opcional
- ✅ Email vacío en campo obligatorio
- ✅ Email con formato válido
- ✅ Email sin @
- ✅ Email con múltiples @
- ✅ Email sin dominio
- ✅ Email sin extensión
- ✅ Email con puntos al inicio/final
- ✅ Email con puntos consecutivos
- ✅ Email con caracteres inválidos
- ✅ Múltiples emails válidos
- ✅ Múltiples emails con uno inválido

## Cumplimiento de Normativas

Este sistema de validación ayuda a cumplir con:
- **HIPAA**: Asegura que las comunicaciones por email se envíen a direcciones válidas
- **Estándares de calidad de datos**: Garantiza integridad de información de contacto
- **UX profesional**: Proporciona feedback claro y en tiempo real

## Soporte

Para preguntas o mejoras al sistema de validación de emails, consultar:
- Documentación técnica en `/utils/emailValidation.ts`
- Implementación de componentes en `/components/EmailInput.tsx` y `/components/MultiEmailInput.tsx`
- Guía de implementación en este documento
