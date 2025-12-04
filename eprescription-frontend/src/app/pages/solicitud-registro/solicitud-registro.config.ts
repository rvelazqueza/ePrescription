// Configuración para el componente de solicitud de registro

export interface PerfilUsuario {
  value: string;
  label: string;
  colegio: string;
  requiereColegio?: boolean;
}

export interface ConfiguracionSolicitud {
  perfilesUsuario: PerfilUsuario[];
  tiempoExpiracionCodigo: number; // en minutos
  longitudMinimaCodigo: number;
  formatosArchivoPermitidos: string[];
  tamañoMaximoArchivo: number; // en MB
}

export const CONFIGURACION_DEFAULT: ConfiguracionSolicitud = {
  perfilesUsuario: [
    { 
      value: "medico", 
      label: "Médico", 
      colegio: "Colegio de Médicos y Cirujanos de Costa Rica",
      requiereColegio: true
    },
    { 
      value: "farmaceutico", 
      label: "Farmacéutico / Regente Farmacéutico", 
      colegio: "Colegio de Farmacéuticos de Costa Rica",
      requiereColegio: true
    },
    { 
      value: "odontologo", 
      label: "Odontólogo", 
      colegio: "Colegio de Cirujanos Dentistas de Costa Rica",
      requiereColegio: true
    },
    { 
      value: "enfermero", 
      label: "Enfermero / Obstetra", 
      colegio: "Colegio de Enfermeros de Costa Rica",
      requiereColegio: true
    },
    { 
      value: "veterinario", 
      label: "Médico Veterinario", 
      colegio: "Colegio de Médicos Veterinarios de Costa Rica",
      requiereColegio: true
    },
    { 
      value: "farmacia", 
      label: "Farmacia", 
      colegio: "N/A",
      requiereColegio: false
    },
    { 
      value: "centro_medico", 
      label: "Centro Médico", 
      colegio: "N/A",
      requiereColegio: false
    },
    { 
      value: "drogueria", 
      label: "Droguería", 
      colegio: "N/A",
      requiereColegio: false
    },
    { 
      value: "laboratorio", 
      label: "Laboratorio", 
      colegio: "N/A",
      requiereColegio: false
    },
    { 
      value: "funcionario", 
      label: "Funcionario de Salud", 
      colegio: "N/A",
      requiereColegio: false
    }
  ],
  tiempoExpiracionCodigo: 5, // 5 minutos
  longitudMinimaCodigo: 4,
  formatosArchivoPermitidos: ['.p12', '.pfx'],
  tamañoMaximoArchivo: 5 // 5 MB
};

export type TipoMedicamentoControlado = "estupefacientes" | "psicotropicos" | "antimicrobianos" | "ninguno";

export const MEDICAMENTOS_CONTROLADOS = {
  ninguno: {
    label: "No, solo medicamentos de libre venta",
    descripcion: "Sin restricciones especiales",
    requiereFirmaDigital: false,
    color: "green"
  },
  antimicrobianos: {
    label: "Antimicrobianos (Antibióticos)",
    descripcion: "Requiere registro especial",
    requiereFirmaDigital: false,
    color: "blue"
  },
  psicotropicos: {
    label: "Psicotrópicos",
    descripcion: "Requiere Firma Digital obligatoria",
    requiereFirmaDigital: true,
    color: "orange"
  },
  estupefacientes: {
    label: "Estupefacientes",
    descripcion: "Requiere Firma Digital obligatoria",
    requiereFirmaDigital: true,
    color: "red"
  }
};

export const PASOS_SOLICITUD = [
  {
    numero: 1,
    titulo: "Perfil y medicamentos controlados",
    descripcion: "Define tu perfil y los medicamentos que prescribirás o dispensarás",
    icono: "user"
  },
  {
    numero: 2,
    titulo: "Validación profesional",
    descripcion: "Valida tu código profesional con el colegio correspondiente",
    icono: "building"
  },
  {
    numero: 3,
    titulo: "Datos básicos y credenciales",
    descripcion: "Proporciona tu información personal y crea tus credenciales",
    icono: "file-text"
  },
  {
    numero: 4,
    titulo: "Verificación de contacto",
    descripcion: "Verifica tu correo y teléfono para continuar",
    icono: "shield"
  },
  {
    numero: 5,
    titulo: "Configuración de autenticación",
    descripcion: "Configura tu método de autenticación segura",
    icono: "lock"
  },
  {
    numero: 6,
    titulo: "Confirmación",
    descripcion: "Tu solicitud será revisada por un administrador",
    icono: "check"
  }
];

// Validaciones
export const VALIDACIONES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^\+?[1-9]\d{1,14}$/,
  cedula: /^\d{1}-\d{4}-\d{4}$/,
  codigoProfesional: /^[A-Z]{2,4}-\d{3,6}$/
};

// Mensajes de error
export const MENSAJES_ERROR = {
  campoRequerido: 'Este campo es requerido',
  emailInvalido: 'Ingrese un correo electrónico válido',
  telefonoInvalido: 'Ingrese un número de teléfono válido',
  cedulaInvalida: 'Ingrese una cédula válida (formato: 1-2345-6789)',
  codigoProfesionalInvalido: 'Ingrese un código profesional válido',
  archivoInvalido: 'Seleccione un archivo válido (.p12 o .pfx)',
  archivoMuyGrande: 'El archivo es demasiado grande (máximo 5MB)',
  codigoVerificacionIncorrecto: 'Código de verificación incorrecto',
  codigoExpirado: 'El código ha expirado, solicite uno nuevo'
};

// Mensajes de éxito
export const MENSAJES_EXITO = {
  codigoProfesionalValidado: 'Código profesional validado correctamente',
  codigoCorreoEnviado: 'Código de verificación enviado al correo',
  codigoTelefonoEnviado: 'Código de verificación enviado por SMS',
  correoVerificado: 'Correo electrónico verificado',
  telefonoVerificado: 'Teléfono verificado',
  solicitudEnviada: '¡Solicitud enviada exitosamente!'
};