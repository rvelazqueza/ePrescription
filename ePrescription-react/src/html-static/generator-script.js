/**
 * Script Generador de Componentes HTML
 * ePrescription - Sistema Hospitalario
 * 
 * Este script genera automáticamente todos los componentes HTML faltantes
 * basándose en plantillas predefinidas.
 * 
 * INSTRUCCIONES DE USO:
 * 1. Ejecutar este script en Node.js: node generator-script.js
 * 2. Los archivos se generarán en las carpetas correspondientes
 * 3. Revisar y personalizar cada componente generado
 */

const fs = require('fs');
const path = require('path');

// ===============================================
// PLANTILLAS BASE
// ===============================================

const getBasicTemplate = (componentName, description, category) => `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} - ePrescription</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f7fafc;
            padding: 2rem;
        }

        .demo-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #2d3748;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: #718096;
            margin-bottom: 2rem;
        }

        .section {
            margin-bottom: 2rem;
        }

        .section-title {
            color: #2d3748;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #2b6cb0;
            text-decoration: none;
            margin-bottom: 1rem;
        }

        .back-link:hover {
            text-decoration: underline;
        }

        /* Estilos específicos del componente ${componentName} */
        .component-demo {
            padding: 2rem;
            background: #f7fafc;
            border-radius: 8px;
            border: 2px dashed #e2e8f0;
        }

        .placeholder {
            text-align: center;
            color: #a0aec0;
            padding: 3rem;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <a href="../../index.html" class="back-link">
            ← Volver al índice
        </a>

        <h1>${componentName}</h1>
        <p class="subtitle">${description}</p>

        <div class="section">
            <h2 class="section-title">Vista Previa</h2>
            <div class="component-demo">
                <div class="placeholder">
                    <h3>Componente: ${componentName}</h3>
                    <p>Categoría: ${category}</p>
                    <p style="margin-top: 1rem;">Este componente está pendiente de implementación completa.</p>
                    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Consulta el componente React original en /components/${componentName}.tsx</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Características</h2>
            <ul style="list-style: none; padding-left: 0;">
                <li style="padding: 0.5rem 0; color: #4a5568;">✅ Diseño responsive</li>
                <li style="padding: 0.5rem 0; color: #4a5568;">✅ Accesible</li>
                <li style="padding: 0.5rem 0; color: #4a5568;">✅ Estilo profesional hospitalario</li>
                <li style="padding: 0.5rem 0; color: #4a5568;">⏳ Funcionalidad completa pendiente</li>
            </ul>
        </div>
    </div>

    <script>
        console.log('Componente ${componentName} cargado');
        // TODO: Agregar funcionalidad JavaScript específica del componente
    </script>
</body>
</html>`;

const getUITemplate = (componentName, description) => getBasicTemplate(componentName, description, 'UI Component');
const getAppTemplate = (componentName, description) => getBasicTemplate(componentName, description, 'Application Component');
const getPageTemplate = (componentName, description) => getBasicTemplate(componentName, description, 'Page');

// ===============================================
// DEFINICIÓN DE COMPONENTES
// ===============================================

const uiComponents = [
    { name: 'accordion', desc: 'Componente accordion expandible' },
    { name: 'alert-dialog', desc: 'Diálogo de alerta modal' },
    { name: 'alert', desc: 'Componente de alerta contextual' },
    { name: 'aspect-ratio', desc: 'Mantiene proporciones de aspecto' },
    { name: 'avatar', desc: 'Avatar de usuario con fallback' },
    { name: 'badge', desc: 'Insignia para estados y categorías' },
    { name: 'breadcrumb', desc: 'Migas de pan de navegación' },
    { name: 'calendar', desc: 'Calendario para selección de fechas' },
    { name: 'carousel', desc: 'Carrusel de contenido' },
    { name: 'chart', desc: 'Gráficos y visualizaciones' },
    { name: 'checkbox', desc: 'Casilla de verificación' },
    { name: 'collapsible', desc: 'Contenido colapsable' },
    { name: 'command', desc: 'Paleta de comandos' },
    { name: 'context-menu', desc: 'Menú contextual' },
    { name: 'dialog', desc: 'Modal/Diálogo' },
    { name: 'drawer', desc: 'Panel lateral deslizable' },
    { name: 'dropdown-menu', desc: 'Menú desplegable' },
    { name: 'form', desc: 'Formularios con validación' },
    { name: 'hover-card', desc: 'Tarjeta al pasar el mouse' },
    { name: 'input-otp', desc: 'Input de código OTP' },
    { name: 'label', desc: 'Etiqueta de formulario' },
    { name: 'menubar', desc: 'Barra de menú principal' },
    { name: 'navigation-menu', desc: 'Menú de navegación' },
    { name: 'pagination', desc: 'Paginación de tablas' },
    { name: 'popover', desc: 'Contenido flotante' },
    { name: 'progress', desc: 'Barra de progreso' },
    { name: 'radio-group', desc: 'Grupo de radio buttons' },
    { name: 'resizable', desc: 'Paneles redimensionables' },
    { name: 'scroll-area', desc: 'Área de scroll personalizada' },
    { name: 'select', desc: 'Select dropdown' },
    { name: 'separator', desc: 'Separador visual' },
    { name: 'sheet', desc: 'Hoja modal lateral' },
    { name: 'sidebar', desc: 'Barra lateral de navegación' },
    { name: 'skeleton', desc: 'Placeholder de carga' },
    { name: 'slider', desc: 'Control deslizante' },
    { name: 'sonner', desc: 'Notificaciones toast' },
    { name: 'switch', desc: 'Interruptor on/off' },
    { name: 'table', desc: 'Tabla de datos' },
    { name: 'tabs', desc: 'Pestañas de contenido' },
    { name: 'textarea', desc: 'Área de texto multilínea' },
    { name: 'toggle-group', desc: 'Grupo de toggles' },
    { name: 'toggle', desc: 'Toggle button' },
    { name: 'tooltip', desc: 'Descripción emergente' }
];

const appComponents = [
    { name: 'AddMedicineDialog', desc: 'Diálogo para agregar medicamentos' },
    { name: 'Breadcrumbs', desc: 'Navegación de migas de pan' },
    { name: 'ClinicalDocumentsDialog', desc: 'Gestión de documentos clínicos' },
    { name: 'ContactPatientDialog', desc: 'Formulario de contacto con paciente' },
    { name: 'Dashboard', desc: 'Panel principal del sistema' },
    { name: 'DigitalSignatureDialog', desc: 'Firma digital de prescripciones' },
    { name: 'DoctorDetailPanel', desc: 'Panel de detalles del médico' },
    { name: 'DraftPreviewPanel', desc: 'Vista previa de borradores' },
    { name: 'EditDoctorDialog', desc: 'Edición de información de médicos' },
    { name: 'EditPatientProfileDialog', desc: 'Edición de perfil de paciente' },
    { name: 'EmailInput', desc: 'Input de email con validación' },
    { name: 'EmittedPrescriptionPanel', desc: 'Panel de prescripciones emitidas' },
    { name: 'EnhancedMedicinePanel', desc: 'Panel mejorado de medicamentos' },
    { name: 'ExportButtons', desc: 'Botones de exportación PDF/CSV/Excel' },
    { name: 'Layout', desc: 'Layout principal de aplicación' },
    { name: 'LocationMap', desc: 'Mapa de ubicación de centros' },
    { name: 'MedicalHeader', desc: 'Cabecera médica con estadísticas' },
    { name: 'MedicalTimeline', desc: 'Línea de tiempo médica' },
    { name: 'MedicinePanel', desc: 'Panel de gestión de medicamentos' },
    { name: 'MedicineTable', desc: 'Tabla principal de medicamentos' },
    { name: 'MultiEmailInput', desc: 'Input para múltiples emails' },
    { name: 'Navigation', desc: 'Sistema de navegación principal' },
    { name: 'NewDoctorDialog', desc: 'Registro de nuevos médicos' },
    { name: 'NewInventoryOrderDialog', desc: 'Creación de órdenes de inventario' },
    { name: 'NewLayout', desc: 'Nuevo layout con sidebar' },
    { name: 'NewPatientDialog', desc: 'Registro de nuevos pacientes' },
    { name: 'PageBanner', desc: 'Banner informativo de página' },
    { name: 'PageHeader', desc: 'Encabezado estándar de página' },
    { name: 'PatientDetailPanel', desc: 'Panel de detalles del paciente' },
    { name: 'PrescriptionHeader', desc: 'Encabezado de prescripción' },
    { name: 'PrescriptionManager', desc: 'Gestor completo de prescripciones' },
    { name: 'PrescriptionPage', desc: 'Página completa de prescripción' },
    { name: 'RejectionDetailPanel', desc: 'Detalles de rechazos de dispensación' },
    { name: 'RoleSelector', desc: 'Selector de roles multi-rol' },
    { name: 'Sidebar', desc: 'Barra lateral de navegación' },
    { name: 'SystemBanner', desc: 'Banner de sistema con alertas' },
    { name: 'TablePagination', desc: 'Paginación universal de tablas' },
    { name: 'TopBar', desc: 'Barra superior con usuario' },
    { name: 'UniversalPrescriptionPanel', desc: 'Panel universal de prescripciones' },
    { name: 'UserEditDialog', desc: 'Edición de usuarios del sistema' },
    { name: 'VerificationResultPanel', desc: 'Resultados de verificación' }
];

const pages = [
    { name: 'LoginPage', desc: 'Página de inicio de sesión' },
    { name: 'DashboardPage', desc: 'Dashboard principal' },
    { name: 'PrescripcionesPage', desc: 'Gestión de prescripciones' },
    { name: 'PacientesPage', desc: 'Gestión de pacientes' },
    { name: 'MedicosPage', desc: 'Gestión de médicos' },
    { name: 'InventarioPage', desc: 'Control de inventario' },
    { name: 'DispensacionPage', desc: 'Dispensación de recetas' },
    { name: 'ReportesPage', desc: 'Reportes y analítica' },
    { name: 'InteropPage', desc: 'Interoperabilidad HL7 FHIR' },
    { name: 'SeguridadPage', desc: 'Gestión de seguridad' },
    { name: 'MFAVerificationPage', desc: 'Verificación MFA' },
    { name: 'PasswordRecoveryPage', desc: 'Recuperación de contraseña' },
    { name: 'OnboardingPage', desc: 'Registro de nuevos usuarios' },
    { name: 'RegistrationSuccessPage', desc: 'Confirmación de registro' },
    { name: 'UserApprovalsPage', desc: 'Aprobación de usuarios' },
    { name: 'SessionManagementPage', desc: 'Gestión de sesiones' },
    { name: 'AlertasPage', desc: 'Alertas clínicas' },
    { name: 'AuditoriaPage', desc: 'Log de auditoría' },
    { name: 'CatalogosPage', desc: 'Catálogos clínicos' },
    { name: 'CentrosMedicosPage', desc: 'Centros médicos' },
    { name: 'ConfigPage', desc: 'Configuración del sistema' },
    { name: 'ConsultaInventarioPage', desc: 'Consulta de inventario' },
    { name: 'FarmaciasPage', desc: 'Farmacias registradas' },
    { name: 'FirmaPage', desc: 'Firma y verificación' },
    { name: 'HistorialInteraccionesPage', desc: 'Historial de interacciones' },
    { name: 'NotificacionesConfigPage', desc: 'Configuración de notificaciones' },
    { name: 'NotificacionesListPage', desc: 'Listado de notificaciones' },
    { name: 'NotificacionesPage', desc: 'Centro de notificaciones' },
    { name: 'RegistroUsuariosPage', desc: 'Registro de usuarios' },
    { name: 'TalonariosPage', desc: 'Gestión de talonarios' },
    { name: 'MultiRoleDemoPage', desc: 'Demo de multi-rol' }
];

// ===============================================
// FUNCIONES DE GENERACIÓN
// ===============================================

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function generateUIComponents() {
    console.log('📦 Generando componentes UI...');
    const uiDir = path.join(__dirname, 'components', 'ui');
    ensureDirectoryExists(uiDir);
    
    uiComponents.forEach(component => {
        const fileName = `${component.name}.html`;
        const filePath = path.join(uiDir, fileName);
        
        if (!fs.existsSync(filePath)) {
            const content = getUITemplate(component.name, component.desc);
            fs.writeFileSync(filePath, content);
            console.log(`✅ Creado: ${fileName}`);
        } else {
            console.log(`⏭️  Ya existe: ${fileName}`);
        }
    });
}

function generateAppComponents() {
    console.log('\n🧩 Generando componentes de aplicación...');
    const appDir = path.join(__dirname, 'components');
    ensureDirectoryExists(appDir);
    
    appComponents.forEach(component => {
        const fileName = `${component.name}.html`;
        const filePath = path.join(appDir, fileName);
        
        if (!fs.existsSync(filePath)) {
            const content = getAppTemplate(component.name, component.desc);
            fs.writeFileSync(filePath, content);
            console.log(`✅ Creado: ${fileName}`);
        } else {
            console.log(`⏭️  Ya existe: ${fileName}`);
        }
    });
}

function generatePages() {
    console.log('\n📄 Generando páginas...');
    const pagesDir = path.join(__dirname, 'pages');
    ensureDirectoryExists(pagesDir);
    
    pages.forEach(page => {
        const fileName = `${page.name}.html`;
        const filePath = path.join(pagesDir, fileName);
        
        if (!fs.existsSync(filePath)) {
            const content = getPageTemplate(page.name, page.desc);
            fs.writeFileSync(filePath, content);
            console.log(`✅ Creado: ${fileName}`);
        } else {
            console.log(`⏭️  Ya existe: ${fileName}`);
        }
    });
}

function generateStats() {
    console.log('\n📊 Estadísticas de Generación:');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Componentes UI:           ${uiComponents.length}`);
    console.log(`Componentes Aplicación:   ${appComponents.length}`);
    console.log(`Páginas:                  ${pages.length}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`TOTAL:                    ${uiComponents.length + appComponents.length + pages.length}`);
    console.log(`\n✨ Generación completada!`);
}

// ===============================================
// EJECUCIÓN PRINCIPAL
// ===============================================

console.log('🏗️  Generador de Componentes HTML - ePrescription');
console.log('═══════════════════════════════════════════════════\n');

generateUIComponents();
generateAppComponents();
generatePages();
generateStats();

console.log('\n📝 Próximos pasos:');
console.log('1. Revisa los archivos generados en /html-static/');
console.log('2. Personaliza cada componente según necesites');
console.log('3. Actualiza el archivo index.html con los nuevos componentes');
console.log('4. Prueba cada componente en el navegador');

module.exports = {
    generateUIComponents,
    generateAppComponents,
    generatePages
};
