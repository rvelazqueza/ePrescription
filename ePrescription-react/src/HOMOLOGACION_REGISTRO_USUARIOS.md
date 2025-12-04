# Homologación de Registro de Usuarios - ePrescription

## Resumen de la Implementación

Se ha completado exitosamente la **homologación del registro de usuarios** entre el flujo de auto-registro (onboarding desde login) y el flujo de registro por administrador dentro de la aplicación.

## 📋 Cambios Principales

### 1. **OnboardingPage.tsx** (Auto-registro desde Login)

**Flujo actualizado (5-6 pasos según perfil):**

1. **Tipo de Perfil y Medicamentos Controlados**
   - Selección de perfil de usuario (médico, farmacéutico, etc.)
   - Declaración de tipo de medicamentos controlados que prescribirá
   - Método de autenticación se define según tipo de medicamentos
   - RESTRICCIÓN: Estupefacientes/Psicotrópicos = Solo Firma Digital obligatoria

2. **Validación Profesional** *(solo si requiere colegio)*
   - Validación del código profesional con el colegio correspondiente
   - Recuperación automática de datos (nombre, cédula, estado)

3. **Datos Básicos y Credenciales**
   - Información personal
   - Creación inmediata de usuario/contraseña (si aplica)
   - Aceptación de términos y condiciones

4. **Verificación de Contacto**
   - Verificación obligatoria de correo electrónico
   - Verificación de teléfono (obligatoria)

5. **Configuración de Autenticación**
   - Si es Firma Digital: Carga de archivo .p12 y PIN
   - Si es Password + MFA: Configuración de TOTP o decisión de configurar después

6. **Confirmación**
   - Resumen de datos
   - Envío de solicitud
   - **El usuario queda pendiente de aprobación por administrador**

### 2. **RegistroUsuariosPage.tsx** (Registro por Administrador)

**Flujo optimizado (3-4 pasos según perfil):**

1. **Selección de Perfil y Autenticación**
   - Tipo de perfil de usuario
   - Tipo de medicamentos controlados
   - Método de autenticación requerido (según medicamentos controlados)
   - RESTRICCIÓN: Estupefacientes/Psicotrópicos = Solo Firma Digital obligatoria

2. **Validación Profesional** *(solo si requiere colegio)*
   - Validación del código profesional
   - Recuperación automática de datos del colegio

3. **Datos de Contacto y Ubicación**
   - Correo electrónico y teléfono
   - Ubicación completa con mapa interactivo
   - Geocodificación bidireccional

4. **Confirmación y Registro**
   - Resumen de datos
   - **NO se configuran credenciales aquí**
   - Se envía notificación automática al usuario para que complete su configuración

## 🔐 Lógica de Medicamentos Controlados

### Restricciones de Autenticación

| Tipo de Medicamento | Métodos Permitidos |
|---------------------|-------------------|
| **Ninguno** (Libre venta) | Firma Digital o Usuario/Contraseña + MFA |
| **Antimicrobianos** | Firma Digital o Usuario/Contraseña + MFA |
| **Psicotrópicos** | **Solo Firma Digital BCCR (OBLIGATORIO)** |
| **Estupefacientes** | **Solo Firma Digital BCCR (OBLIGATORIO)** |

### Auto-selección de Método

- Cuando se selecciona **Estupefacientes** o **Psicotrópicos**, el sistema automáticamente selecciona "Firma Digital" y no permite cambiarlo
- Se muestra una alerta visual indicando el requisito obligatorio

## 🔄 Diferencias Clave Entre Flujos

### Auto-registro (Onboarding)

✅ **El usuario:**
- Crea su propio usuario y contraseña inmediatamente
- Configura su método de autenticación (MFA o Firma Digital) en el mismo proceso
- Queda en estado "pendiente" hasta aprobación de administrador
- Recibe notificación cuando es aprobado

### Registro por Administrador

✅ **El administrador:**
- Define todos los datos del usuario excepto credenciales
- Establece qué método de autenticación debe usar el usuario
- NO crea usuario/contraseña
- El sistema envía notificación automática al usuario

✅ **El usuario:**
- Recibe correo electrónico + SMS con link de activación
- Completa la configuración de su método de autenticación:
  - Si es Firma Digital: Carga su archivo .p12
  - Si es Password + MFA: Crea su contraseña y configura MFA
- Queda activo inmediatamente después de completar configuración

## 📧 Sistema de Notificaciones

### Al registrar un usuario (por administrador)

**Se envía automáticamente:**
- ✉️ Correo electrónico al usuario
- 📱 SMS al teléfono registrado

**Contenido de la notificación:**
```
Asunto: Bienvenido a ePrescription - Completa tu registro

Hola [Nombre],

Un administrador te ha registrado en ePrescription.

Método de autenticación asignado: [Firma Digital / Usuario y Contraseña + MFA]

Para activar tu cuenta, haz clic aquí: [LINK]

Tienes 48 horas para completar tu registro.

---
ePrescription - Sistema de Prescripción Electrónica
```

## 🎯 Beneficios de la Homologación

1. **Consistencia**: Ambos flujos usan la misma lógica de validación y restricciones
2. **Seguridad**: Las reglas de medicamentos controlados se aplican uniformemente
3. **Flexibilidad**: Permite tanto auto-registro como registro asistido
4. **Cumplimiento**: Garantiza normativas de medicamentos controlados
5. **UX Mejorado**: Flujos claros y optimizados para cada caso de uso

## 📊 Perfiles de Usuario Soportados

| Perfil | Requiere Colegio | Puede Prescribir Controlados |
|--------|------------------|------------------------------|
| Médico | ✅ Sí | ✅ Sí |
| Farmacéutico | ✅ Sí | ✅ Sí |
| Odontólogo | ✅ Sí | ✅ Sí |
| Enfermero | ✅ Sí | ✅ Sí |
| Veterinario | ✅ Sí | ✅ Sí |
| Farmacia | ❌ No | ✅ Sí (dispensación) |
| Centro Médico | ❌ No | ❌ No |
| Droguería | ❌ No | ❌ No |
| Laboratorio | ❌ No | ❌ No |
| Funcionario de Salud | ❌ No | ❌ No |

## 🔧 Archivos Actualizados

1. `/pages/OnboardingPage.tsx` - Flujo de auto-registro homologado
2. `/pages/RegistroUsuariosPage.tsx` - Flujo de registro por admin homologado
3. `/utils/authStore.ts` - Soporte para campos adicionales de perfil

## ✅ Testing Recomendado

### Escenarios de Prueba

1. **Auto-registro de médico con estupefacientes**
   - ✓ Verifica que solo permita Firma Digital
   - ✓ Valida código profesional
   - ✓ Queda pendiente de aprobación

2. **Auto-registro de farmacia con antimicrobianos**
   - ✓ Permite elegir entre Firma Digital o Password + MFA
   - ✓ No requiere código profesional
   - ✓ Crea credenciales inmediatamente

3. **Registro por admin de médico con psicotrópicos**
   - ✓ Auto-selecciona Firma Digital
   - ✓ Valida código profesional
   - ✓ No crea credenciales
   - ✓ Envía notificación al usuario

4. **Registro por admin de funcionario sin controlados**
   - ✓ Permite cualquier método de autenticación
   - ✓ No requiere validación profesional
   - ✓ Flujo simplificado (3 pasos)

## 📝 Próximos Pasos Sugeridos

1. Integrar con servicio real de envío de correos (Resend, SendGrid, etc.)
2. Integrar con servicio de SMS (Twilio, etc.)
3. Implementar integración real con colegios profesionales
4. Añadir flujo de reenvío de notificación si expira
5. Implementar dashboard de seguimiento de registros pendientes

---

**Fecha de implementación**: Octubre 2025  
**Versión**: 1.0  
**Estado**: ✅ Completado
