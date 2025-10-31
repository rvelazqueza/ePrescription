# Componente de Solicitud de Registro

Este componente implementa el flujo completo de solicitud de registro para nuevos usuarios del sistema ePrescription, siguiendo un proceso de 6 pasos con validaciones y verificaciones.

## Características

### Flujo de 6 Pasos

1. **Paso 1: Perfil y Medicamentos Controlados**
   - Selección del tipo de perfil profesional (médico, farmacéutico, etc.)
   - Configuración del tipo de medicamentos controlados que manejará
   - Validación automática de requisitos de Firma Digital para estupefacientes y psicotrópicos

2. **Paso 2: Validación Profesional**
   - Validación del código profesional con el colegio correspondiente
   - Integración simulada con colegios profesionales
   - Verificación en tiempo real del estado profesional

3. **Paso 3: Datos Básicos y Credenciales**
   - Captura de información personal (nombre, identificación, contacto)
   - Aceptación de términos y condiciones
   - Validación de formato de correo electrónico

4. **Paso 4: Verificación de Contacto**
   - Verificación de correo electrónico mediante código
   - Verificación de teléfono móvil mediante SMS
   - Ambas verificaciones son obligatorias para continuar

5. **Paso 5: Configuración de Autenticación**
   - Configuración opcional o obligatoria según tipo de medicamentos
   - Soporte para Firma Digital BCCR (GAUDI) para medicamentos controlados
   - Opción de configurar MFA más tarde para otros casos

6. **Paso 6: Confirmación y Envío**
   - Resumen de todos los datos ingresados
   - Envío de solicitud para revisión administrativa
   - Pantalla de confirmación con próximos pasos

### Características Técnicas

- **Componente Angular Standalone**: No requiere módulos adicionales
- **Formularios Reactivos**: Validación robusta con Angular Reactive Forms
- **Responsive Design**: Adaptado para dispositivos móviles y desktop
- **Accesibilidad**: Cumple con estándares WCAG
- **Internacionalización**: Preparado para múltiples idiomas

## Uso

### Integración en Rutas

```typescript
// app.routes.ts
{
  path: 'solicitud-registro',
  loadComponent: () => import('./pages/solicitud-registro/solicitud-registro.component').then(m => m.SolicitudRegistroComponent),
  canActivate: [LoginGuard]
}
```

### Navegación desde Login

```typescript
// login-page.component.ts
onNavigateToRegister() {
  this.router.navigate(['/solicitud-registro']);
}
```

### Eventos del Componente

```typescript
@Output() navigateToLogin = new EventEmitter<void>();
```

## Configuración

### Perfiles de Usuario Soportados

- Médico
- Farmacéutico / Regente Farmacéutico
- Odontólogo
- Enfermero / Obstetra
- Médico Veterinario
- Farmacia
- Centro Médico
- Droguería
- Laboratorio
- Funcionario de Salud

### Tipos de Medicamentos Controlados

- **Ninguno**: Solo medicamentos de libre venta
- **Antimicrobianos**: Requiere registro especial
- **Psicotrópicos**: Requiere Firma Digital obligatoria
- **Estupefacientes**: Requiere Firma Digital obligatoria

## Validaciones

### Paso 1
- Perfil de usuario requerido
- Tipo de medicamentos controlados requerido
- Validación automática de requisitos de Firma Digital

### Paso 2
- Código profesional requerido
- Validación con colegio profesional (simulada)
- Estado profesional activo requerido

### Paso 3
- Nombre completo requerido
- Identificación requerida
- Correo electrónico requerido y con formato válido
- Teléfono móvil requerido
- Aceptación de términos y condiciones requerida

### Paso 4
- Verificación de correo electrónico obligatoria
- Verificación de teléfono móvil obligatoria
- Códigos de verificación con expiración de 5 minutos

### Paso 5
- Para medicamentos controlados: archivo de Firma Digital y PIN requeridos
- Para otros casos: configuración opcional

## Estilos y Diseño

### Paleta de Colores
- **Primario**: Azul (#3B82F6)
- **Secundario**: Cian (#06B6D4)
- **Éxito**: Verde (#22C55E)
- **Advertencia**: Amarillo (#F59E0B)
- **Error**: Rojo (#EF4444)

### Componentes UI
- Stepper horizontal con indicadores de progreso
- Panel lateral informativo con contexto del paso actual
- Formularios con validación en tiempo real
- Botones con estados de carga
- Alertas contextuales

## Integración con Servicios

### Servicios Requeridos (para implementación completa)

```typescript
// Servicio de validación profesional
interface ProfessionalValidationService {
  validateProfessionalCode(code: string, profile: string): Observable<ValidationResult>;
}

// Servicio de verificación
interface VerificationService {
  sendEmailCode(email: string): Observable<boolean>;
  sendSmsCode(phone: string): Observable<boolean>;
  verifyEmailCode(email: string, code: string): Observable<boolean>;
  verifySmsCode(phone: string, code: string): Observable<boolean>;
}

// Servicio de registro
interface RegistrationService {
  submitRegistrationRequest(data: SolicitudFormData): Observable<RegistrationResult>;
}
```

## Próximos Pasos

1. **Integración con APIs Reales**
   - Conectar con servicios de colegios profesionales
   - Implementar envío real de códigos de verificación
   - Conectar con sistema de gestión de usuarios

2. **Mejoras de UX**
   - Guardado automático de progreso
   - Navegación con URL state
   - Modo offline básico

3. **Seguridad**
   - Validación de archivos de Firma Digital
   - Encriptación de datos sensibles
   - Rate limiting para códigos de verificación

4. **Internacionalización**
   - Soporte para inglés
   - Localización de formatos de fecha/hora
   - Adaptación cultural de formularios

## Dependencias

- Angular 17+
- Angular Reactive Forms
- Angular Router
- Tailwind CSS (para estilos)
- Lucide Angular (para iconos)

## Estructura de Archivos

```
src/app/pages/solicitud-registro/
├── solicitud-registro.component.ts     # Lógica del componente
├── solicitud-registro.component.html   # Template HTML
├── solicitud-registro.component.css    # Estilos específicos
└── README.md                          # Documentación
```

## Contribución

Para contribuir al desarrollo de este componente:

1. Seguir las convenciones de código Angular
2. Mantener la accesibilidad (WCAG 2.1 AA)
3. Escribir tests unitarios para nueva funcionalidad
4. Documentar cambios en este README

## Licencia

Este componente es parte del sistema ePrescription y está sujeto a las mismas condiciones de licencia del proyecto principal.