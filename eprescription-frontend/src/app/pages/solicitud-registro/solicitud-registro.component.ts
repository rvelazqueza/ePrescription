import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Tipos de perfil de usuario
const PERFILES_USUARIO = [
    { value: "medico", label: "Médico", colegio: "Colegio de Médicos y Cirujanos de Costa Rica" },
    { value: "farmaceutico", label: "Farmacéutico / Regente Farmacéutico", colegio: "Colegio de Farmacéuticos de Costa Rica" },
    { value: "odontologo", label: "Odontólogo", colegio: "Colegio de Cirujanos Dentistas de Costa Rica" },
    { value: "enfermero", label: "Enfermero / Obstetra", colegio: "Colegio de Enfermeros de Costa Rica" },
    { value: "veterinario", label: "Médico Veterinario", colegio: "Colegio de Médicos Veterinarios de Costa Rica" },
    { value: "farmacia", label: "Farmacia", colegio: "N/A" },
    { value: "centro_medico", label: "Centro Médico", colegio: "N/A" },
    { value: "drogueria", label: "Droguería", colegio: "N/A" },
    { value: "laboratorio", label: "Laboratorio", colegio: "N/A" },
    { value: "funcionario", label: "Funcionario de Salud", colegio: "N/A" }
];

type TipoControlado = "estupefacientes" | "psicotropicos" | "antimicrobianos" | "ninguno";

interface SolicitudFormData {
    // Paso 1: Perfil y medicamentos
    perfilUsuario: string;
    tipoMedicamentosControlados: TipoControlado;
    metodoAutenticacion: string;

    // Paso 2: Validación profesional
    codigoProfesional: string;

    // Paso 3: Datos personales
    nombreCompleto: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    correoElectronico: string;
    telefonoMovil: string;
    aceptaTerminos: boolean;
    aceptaPrivacidad: boolean;

    // Paso 4: Verificación de contacto
    codigoCorreo: string;
    codigoTelefono: string;

    // Paso 5: Configuración MFA
    configurarMfaAhora: boolean;
    archivoFirmaDigital: File | null;
    pinCertificado: string;
    configureMFA: 'now' | 'later';
    mfaMethod: 'totp' | 'sms' | 'email' | 'none';
    totpSecret: string;
    totpCode: string;
}

@Component({
    selector: 'app-solicitud-registro',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './solicitud-registro.component.html',
    styleUrls: ['./solicitud-registro.component.css']
})
export class SolicitudRegistroComponent {
    @Output() navigateToLogin = new EventEmitter<void>();

    // Constantes públicas para el template
    readonly PERFILES_USUARIO = PERFILES_USUARIO;

    // Estado del componente
    currentStep = 0;
    steps = [
        { title: 'Paso 1', key: 'perfil' },
        { title: 'Paso 2', key: 'validacion' },
        { title: 'Paso 3', key: 'datos' },
        { title: 'Paso 4', key: 'verificacion' },
        { title: 'Paso 5', key: 'autenticacion' },
        { title: 'Paso 6', key: 'confirmacion' }
    ];
    solicitudEnviada = false;

    // Resultado de validación profesional
    validationResult: any = null;

    // Estados de validación y verificación
    validandoProfesional = false;
    profesionalValidado = false;
    enviandoCodigoCorreo = false;
    enviandoCodigoTelefono = false;
    codigoCorreoEnviado = false;
    codigoTelefonoEnviado = false;
    verificandoCorreo = false;
    verificandoTelefono = false;
    correoVerificado = false;
    telefonoVerificado = false;
    enviandoSolicitud = false;
    showMostrarPin = false;
    mfaConfigured = false;
    generandoQR = false;

    // Mensajes de estado
    errorMessage = '';
    successMessage = '';

    // Formularios reactivos
    paso1Form!: FormGroup;
    paso2Form!: FormGroup;
    paso3Form!: FormGroup;
    paso4Form!: FormGroup;
    paso5Form!: FormGroup;

    // Datos del formulario
    formData: SolicitudFormData = {
        perfilUsuario: "",
        tipoMedicamentosControlados: "ninguno",
        metodoAutenticacion: "",
        codigoProfesional: "",
        nombreCompleto: "",
        tipoIdentificacion: "cedula",
        numeroIdentificacion: "",
        correoElectronico: "",
        telefonoMovil: "",
        aceptaTerminos: false,
        aceptaPrivacidad: false,
        codigoCorreo: "",
        codigoTelefono: "",
        configurarMfaAhora: false,
        archivoFirmaDigital: null,
        pinCertificado: "",
        configureMFA: 'now',
        mfaMethod: 'totp',
        totpSecret: "",
        totpCode: "",
    };

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
        this.initializeForms();
    }

    private initializeForms() {
        this.paso1Form = this.fb.group({
            perfilUsuario: [this.formData.perfilUsuario, Validators.required],
            tipoMedicamentosControlados: [this.formData.tipoMedicamentosControlados, Validators.required]
        });

        this.paso2Form = this.fb.group({
            codigoProfesional: [this.formData.codigoProfesional, Validators.required]
        });

        this.paso3Form = this.fb.group({
            nombreCompleto: [this.formData.nombreCompleto, Validators.required],
            tipoIdentificacion: [this.formData.tipoIdentificacion, Validators.required],
            numeroIdentificacion: [this.formData.numeroIdentificacion, Validators.required],
            correoElectronico: [this.formData.correoElectronico, [Validators.required, Validators.email]],
            telefonoMovil: [this.formData.telefonoMovil, Validators.required],
            aceptaTerminos: [this.formData.aceptaTerminos, Validators.requiredTrue],
            aceptaPrivacidad: [this.formData.aceptaPrivacidad, Validators.requiredTrue]
        });

        this.paso4Form = this.fb.group({
            codigoCorreo: [this.formData.codigoCorreo],
            codigoTelefono: [this.formData.codigoTelefono]
        });

        this.paso5Form = this.fb.group({
            configurarMfaAhora: [this.formData.configurarMfaAhora],
            archivoFirmaDigital: [this.formData.archivoFirmaDigital],
            pinCertificado: [this.formData.pinCertificado]
        });

        // Suscribirse a cambios en los formularios
        this.setupFormSubscriptions();
    }

    private setupFormSubscriptions() {
        // Sincronizar paso 1
        this.paso1Form.valueChanges.subscribe(values => {
            this.formData.perfilUsuario = values.perfilUsuario || '';
            this.formData.tipoMedicamentosControlados = values.tipoMedicamentosControlados || 'ninguno';
        });

        // Sincronizar paso 2
        this.paso2Form.valueChanges.subscribe(values => {
            this.formData.codigoProfesional = values.codigoProfesional || '';
        });

        // Sincronizar paso 3
        this.paso3Form.valueChanges.subscribe(values => {
            this.formData.nombreCompleto = values.nombreCompleto || '';
            this.formData.tipoIdentificacion = values.tipoIdentificacion || 'cedula';
            this.formData.numeroIdentificacion = values.numeroIdentificacion || '';
            this.formData.correoElectronico = values.correoElectronico || '';
            this.formData.telefonoMovil = values.telefonoMovil || '';
            this.formData.aceptaTerminos = values.aceptaTerminos || false;
            this.formData.aceptaPrivacidad = values.aceptaPrivacidad || false;
        });

        // Sincronizar paso 4
        this.paso4Form.valueChanges.subscribe(values => {
            this.formData.codigoCorreo = values.codigoCorreo || '';
            this.formData.codigoTelefono = values.codigoTelefono || '';
        });

        // Sincronizar paso 5
        this.paso5Form.valueChanges.subscribe(values => {
            this.formData.configurarMfaAhora = values.configurarMfaAhora || false;
            this.formData.pinCertificado = values.pinCertificado || '';
        });
    }

    // Validar si necesita firma digital obligatoria
    necesitaFirmaDigitalObligatoria(): boolean {
        return this.formData.tipoMedicamentosControlados === "estupefacientes" ||
            this.formData.tipoMedicamentosControlados === "psicotropicos";
    }

    // Auto-seleccionar método de autenticación cuando sea obligatorio
    onTipoMedicamentosChange() {
        if (this.necesitaFirmaDigitalObligatoria()) {
            this.formData.metodoAutenticacion = "digital_signature";
        } else if (this.formData.tipoMedicamentosControlados === "ninguno") {
            this.formData.metodoAutenticacion = "";
        }
    }

    // Métodos para contenido dinámico del sidebar
    getSidebarTitle(): string {
        const titles = [
            'Únete al ecosistema de salud digital',
            'Validación profesional certificada',
            'Tus datos están seguros',
            'Verificación de identidad',
            'Seguridad de nivel hospitalario',
            'Estás a un paso de comenzar'
        ];
        return titles[this.currentStep] || titles[0];
    }

    getSidebarDescription(): string {
        const descriptions = [
            'Selecciona tu perfil profesional y define el tipo de medicamentos que prescribirás o dispensarás.',
            'Validamos tu código profesional con el colegio correspondiente para garantizar la autenticidad.',
            'Proporciona tu información personal. Cumplimos con HIPAA, GDPR y normativas de privacidad.',
            'Verificamos tu correo y teléfono para proteger tu cuenta contra accesos no autorizados.',
            'Configura tu método de autenticación: contraseña con MFA o Firma Digital BCCR.',
            'Un administrador revisará tu solicitud. Te notificaremos cuando sea aprobada.'
        ];
        return descriptions[this.currentStep] || descriptions[0];
    }

    getSidebarFeatures(): Array<{ icon: string, title: string, description: string }> {
        const features = [
            [
                { icon: '👥', title: '10+ perfiles profesionales', description: 'Médicos, farmacéuticos, odontólogos y más' },
                { icon: '🛡️', title: 'Control de medicamentos', description: 'Cumplimiento para estupefacientes y psicotrópicos' }
            ],
            [
                { icon: '🏢', title: 'Integración con colegios', description: 'Validación automática con colegios profesionales' },
                { icon: '⏱️', title: 'Verificación en tiempo real', description: 'Estado profesional validado instantáneamente' }
            ],
            [
                { icon: '🔒', title: 'Privacidad garantizada', description: 'Datos cifrados y protegidos' },
                { icon: '📋', title: 'Cumplimiento normativo', description: 'HIPAA, GDPR y normativas locales' }
            ],
            [
                { icon: '🔒', title: 'Privacidad garantizada', description: 'Datos cifrados y protegidos' },
                { icon: '📋', title: 'Cumplimiento normativo', description: 'HIPAA, GDPR y normativas locales' }
            ],
            [
                { icon: '🔐', title: 'MFA de nivel bancario', description: 'Autenticación de dos factores' },
                { icon: '📄', title: 'Firma Digital BCCR', description: 'Certificado BCCR para medicamentos controlados' }
            ],
            [
                { icon: '⏰', title: 'Revisión profesional', description: 'Revisión por equipo de seguridad' },
                { icon: '🚀', title: 'Acceso inmediato', description: 'Acceso completo una vez aprobado' }
            ]
        ];
        return features[this.currentStep] || features[0];
    }

    // Obtener título del paso actual
    getCurrentStepTitle(): string {
        const titles = [
            'Perfil y medicamentos controlados',
            'Validación profesional',
            'Datos básicos y credenciales',
            'Verificación de contacto',
            'Configuración de autenticación',
            'Confirmación'
        ];
        return titles[this.currentStep] || titles[0];
    }

    // Obtener descripción del paso actual
    getCurrentStepDescription(): string {
        const descriptions = [
            'Define tu perfil y los medicamentos que prescribirás o dispensarás',
            'Valida tu código profesional con el colegio correspondiente',
            'Proporciona tu información personal y crea tus credenciales',
            'Verifica tu correo y teléfono para continuar',
            'Configura tu método de autenticación segura',
            'Tu solicitud será revisada por un administrador'
        ];
        return descriptions[this.currentStep] || descriptions[0];
    }

    // Obtener subtítulo corto para móvil
    getCurrentStepSubtitle(): string {
        const subtitles = [
            'Selecciona tu perfil',
            'Valida tu código',
            'Datos básicos',
            'Verificación',
            'Autenticación',
            'Confirmación'
        ];
        return subtitles[this.currentStep] || subtitles[0];
    }

    // Validar código profesional
    async validarCodigoProfesional() {
        if (!this.formData.codigoProfesional) {
            this.showError("Ingrese el código profesional");
            return;
        }

        this.validandoProfesional = true;

        try {
            // Simulación de validación con colegio
            await this.delay(2000);

            // Simular respuesta exitosa
            this.validationResult = {
                nombre: 'Dr. Juan Carlos Pérez González',
                cedula: '1-0234-0567',
                estado: 'activo'
            };

            this.profesionalValidado = true;
            this.showSuccess("Código profesional validado correctamente");
        } catch (error) {
            this.showError("Error al validar el código profesional");
        } finally {
            this.validandoProfesional = false;
        }
    }

    // Métodos de navegación
    nextStep() {
        // Limpiar mensajes al cambiar de paso
        this.clearMessages();
        
        if (this.currentStep === 0) {
            // Desde el paso 1, determinar si necesita validación profesional
            const perfilSeleccionado = this.getPerfilSeleccionado();
            if (perfilSeleccionado && perfilSeleccionado.colegio !== 'N/A') {
                this.currentStep = 1; // Ir a validación profesional
            } else {
                this.currentStep = 2; // Saltar a datos básicos
            }
        } else if (this.currentStep === 3) {
            // Antes de ir al paso 5, asegurar que el método de autenticación esté definido
            this.asegurarMetodoAutenticacion();
            this.currentStep++;
        } else if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
        }
    }

    // Asegurar que el método de autenticación esté definido
    asegurarMetodoAutenticacion() {
        if (!this.formData.metodoAutenticacion) {
            if (this.necesitaFirmaDigitalObligatoria()) {
                this.formData.metodoAutenticacion = "digital_signature";
            } else if (this.formData.tipoMedicamentosControlados === "antimicrobianos") {
                // Para antimicrobianos, usar password por defecto si no se seleccionó
                this.formData.metodoAutenticacion = "password";
            } else {
                // Para medicamentos no controlados, usar password
                this.formData.metodoAutenticacion = "password";
            }
        }
    }

    previousStep() {
        // Limpiar mensajes al cambiar de paso
        this.clearMessages();
        
        if (this.currentStep === 2) {
            // Desde datos básicos, determinar si vino de validación profesional o del paso 1
            const perfilSeleccionado = this.getPerfilSeleccionado();
            if (perfilSeleccionado && perfilSeleccionado.colegio !== 'N/A') {
                this.currentStep = 1; // Volver a validación profesional
            } else {
                this.currentStep = 0; // Volver al paso 1
            }
        } else if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    // Validaciones por paso
    isCurrentStepValid(): boolean {
        switch (this.currentStep) {
            case 0: return this.isStep1Valid;
            case 1: return this.isStep2Valid;
            case 2: return this.isStep3Valid;
            case 3: return this.isStep4Valid;
            case 4: return this.isStep5Valid;
            case 5: return true;
            default: return false;
        }
    }

    get isStep1Valid(): boolean {
        // Validar que se haya seleccionado un perfil
        if (!this.formData.perfilUsuario) return false;
        
        // Validar que se haya seleccionado el tipo de medicamentos
        if (!this.formData.tipoMedicamentosControlados) return false;
        
        // Si seleccionó medicamentos controlados que no requieren firma digital obligatoria,
        // debe seleccionar un método de autenticación
        if (this.formData.tipoMedicamentosControlados === 'antimicrobianos' && !this.formData.metodoAutenticacion) {
            return false;
        }
        
        return true;
    }

    get isStep2Valid(): boolean {
        return this.profesionalValidado;
    }

    get isStep3Valid(): boolean {
        // Validar campos básicos
        if (!this.formData.nombreCompleto?.trim()) return false;
        if (!this.formData.numeroIdentificacion?.trim()) return false;
        if (!this.formData.correoElectronico?.trim()) return false;
        if (!this.isValidEmail(this.formData.correoElectronico)) return false;
        if (!this.formData.telefonoMovil?.trim()) return false;
        if (!this.formData.aceptaTerminos) return false;
        if (!this.formData.aceptaPrivacidad) return false;

        // Validar formato según tipo de identificación
        if (this.formData.tipoIdentificacion === 'cedula') {
            if (!this.isValidCedula(this.formData.numeroIdentificacion)) return false;
        }

        return true;
    }

    // Validar formato de email
    private isValidEmail(email: string): boolean {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar formato de cédula
    private isValidCedula(cedula: string): boolean {
        if (!cedula) return false;
        return /^\d-\d{4}-\d{4}$/.test(cedula);
    }

    get isStep4Valid(): boolean {
        // Inicialmente solo requiere que se hayan enviado los códigos
        // Después requiere que ambos estén verificados
        return this.correoVerificado && this.telefonoVerificado;
    }

    get isStep5Valid(): boolean {
        if (this.formData.metodoAutenticacion === "digital_signature") {
            // Para firma digital, requiere archivo y PIN
            return !!(this.formData.archivoFirmaDigital && 
                     this.formData.pinCertificado && 
                     this.formData.pinCertificado.length >= 4);
        } else {
            // Para contraseña, si eligió configurar MFA ahora, debe estar configurado
            if (this.formData.configureMFA === "now") {
                return this.mfaConfigured;
            }
            return true; // Si eligió configurar más tarde, puede continuar
        }
    }

    // Obtener perfil seleccionado
    getPerfilSeleccionado() {
        return PERFILES_USUARIO.find(p => p.value === this.formData.perfilUsuario);
    }

    // Obtener etiqueta de medicamentos
    getMedicamentosLabel(): string {
        const labels: Record<TipoControlado, string> = {
            'ninguno': 'No controlados',
            'antimicrobianos': 'Antimicrobianos (Antibióticos)',
            'psicotropicos': 'Psicotrópicos',
            'estupefacientes': 'Estupefacientes'
        };
        return labels[this.formData.tipoMedicamentosControlados] || 'No especificado';
    }

    // Enviar solicitud
    async enviarSolicitud() {
        this.enviandoSolicitud = true;
        try {
            await this.delay(2000);
            // Navegar a la página de éxito en lugar de mostrar modal
            this.router.navigate(['/registro-exitoso']);
        } catch (error) {
            this.showError("Error al enviar la solicitud");
        } finally {
            this.enviandoSolicitud = false;
        }
    }

    // Volver al login
    volverAlLogin() {
        this.router.navigate(['/login']);
    }

    // Cancelar registro
    cancelarRegistro() {
        this.navigateToLogin.emit();
    }

    // Enviar código de verificación por correo
    async enviarCodigoCorreo() {
        this.enviandoCodigoCorreo = true;
        try {
            await this.delay(1000);
            this.codigoCorreoEnviado = true;
            this.showSuccess("Código enviado a tu correo electrónico");
        } catch (error) {
            this.showError("Error al enviar código de verificación");
        } finally {
            this.enviandoCodigoCorreo = false;
        }
    }

    // Enviar código de verificación por SMS
    async enviarCodigoTelefono() {
        this.enviandoCodigoTelefono = true;
        try {
            await this.delay(1000);
            this.codigoTelefonoEnviado = true;
            this.showSuccess("Código enviado por SMS");
        } catch (error) {
            this.showError("Error al enviar código SMS");
        } finally {
            this.enviandoCodigoTelefono = false;
        }
    }

    // Verificar código de correo
    async verificarCodigoCorreo() {
        if (!this.formData.codigoCorreo || this.formData.codigoCorreo.length !== 6) {
            this.showError("Ingresa el código de 6 dígitos");
            return;
        }

        this.verificandoCorreo = true;
        try {
            await this.delay(1000);
            // Simular verificación exitosa
            this.correoVerificado = true;
            this.showSuccess("Correo verificado correctamente");
        } catch (error) {
            this.showError("Código incorrecto");
        } finally {
            this.verificandoCorreo = false;
        }
    }

    // Verificar código de teléfono
    async verificarCodigoTelefono() {
        if (!this.formData.codigoTelefono || this.formData.codigoTelefono.length !== 6) {
            this.showError("Ingresa el código de 6 dígitos");
            return;
        }

        this.verificandoTelefono = true;
        try {
            await this.delay(1000);
            // Simular verificación exitosa
            this.telefonoVerificado = true;
            this.showSuccess("Teléfono verificado correctamente");
        } catch (error) {
            this.showError("Código incorrecto");
        } finally {
            this.verificandoTelefono = false;
        }
    }

    // Generar código QR para MFA
    async generarCodigoQR() {
        this.generandoQR = true;
        try {
            await this.delay(1000);
            // Generar secret TOTP (mock)
            this.formData.totpSecret = "JBSWY3DPEHPK3PXP"; // Base32 secret
            this.showSuccess("Código QR generado. Escanea con tu app de autenticación");
        } catch (error) {
            this.showError("Error al generar código QR");
        } finally {
            this.generandoQR = false;
        }
    }

    // Verificar código TOTP
    async verificarTOTP() {
        if (!this.formData.totpCode || this.formData.totpCode.length !== 6) {
            this.showError("Ingresa el código de 6 dígitos");
            return;
        }

        this.verificandoCorreo = true; // Reutilizamos el estado
        try {
            await this.delay(1000);
            // Simular verificación exitosa
            if (this.formData.totpCode === "123456" || /^\d{6}$/.test(this.formData.totpCode)) {
                this.mfaConfigured = true;
                this.showSuccess("MFA configurado exitosamente");
            } else {
                this.showError("Código incorrecto");
            }
        } catch (error) {
            this.showError("Error al verificar código");
        } finally {
            this.verificandoCorreo = false;
        }
    }

    // Manejar carga de archivo de firma digital
    onFileSelected(event: any) {
        const file = event.target.files?.[0];
        if (file) {
            if (file.name.endsWith('.p12') || file.name.endsWith('.pfx')) {
                this.formData.archivoFirmaDigital = file;
                this.showSuccess(`Archivo "${file.name}" cargado correctamente`);
            } else {
                this.showError("Solo se permiten archivos .p12 o .pfx");
                event.target.value = '';
            }
        }
    }

    // Método para actualizar datos del formulario (compatibilidad)
    updateFormData(field: string, value: any) {
        (this.formData as any)[field] = value;
    }

    // Formatear número de cédula
    formatCedula(event: any) {
        let value = event.target.value.replace(/\D/g, "");
        if (value.length > 1) value = value.slice(0, 1) + "-" + value.slice(1);
        if (value.length > 6) value = value.slice(0, 6) + "-" + value.slice(6);
        if (value.length > 11) value = value.slice(0, 11);
        this.formData.numeroIdentificacion = value;
    }

    // Métodos de utilidad
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private showSuccess(message: string) {
        this.successMessage = message;
        this.errorMessage = ''; // Limpiar error anterior
        // Auto-limpiar después de 3 segundos
        setTimeout(() => {
            if (this.successMessage === message) { // Solo limpiar si es el mismo mensaje
                this.successMessage = '';
            }
        }, 3000);
    }

    private showError(message: string) {
        this.errorMessage = message;
        this.successMessage = ''; // Limpiar éxito anterior
        // Auto-limpiar después de 5 segundos
        setTimeout(() => {
            if (this.errorMessage === message) { // Solo limpiar si es el mismo mensaje
                this.errorMessage = '';
            }
        }, 5000);
    }

    // Limpiar mensajes manualmente
    clearMessages() {
        this.errorMessage = '';
        this.successMessage = '';
    }

}