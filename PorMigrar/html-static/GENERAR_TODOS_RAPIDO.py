#!/usr/bin/env python3
"""
GENERADOR MASIVO Y RÁPIDO DE COMPONENTES HTML
ePrescription - Sistema Hospitalario

Este script genera TODOS los componentes HTML faltantes en segundos.

INSTRUCCIONES:
1. python GENERAR_TODOS_RAPIDO.py
2. ¡Listo! Todos los archivos se crearán automáticamente

CARACTERÍSTICAS:
✅ Genera 111+ componentes en segundos
✅ No sobrescribe archivos existentes
✅ Crea carpetas automáticamente
✅ Muestra progreso en tiempo real
"""

import os
from pathlib import Path

# ==========================================
# PLANTILLA HTML OPTIMIZADA
# ==========================================

TEMPLATE_HTML = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - ePrescription</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚕️</text></svg>">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        :root {{
            --primary: #2b6cb0;
            --primary-dark: #2c5282;
            --success: #48bb78;
            --warning: #ed8936;
            --danger: #e53e3e;
            --gray-50: #f7fafc;
            --gray-100: #edf2f7;
            --gray-200: #e2e8f0;
            --gray-500: #718096;
            --gray-600: #4a5568;
            --gray-700: #2d3748;
            --gray-800: #1a202c;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
            color: var(--gray-700);
        }}

        .demo-container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            padding: 2.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }}

        .header {{
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid var(--gray-200);
        }}

        h1 {{
            color: var(--gray-800);
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }}

        .subtitle {{
            color: var(--gray-500);
            font-size: 1.125rem;
        }}

        .back-link {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary);
            text-decoration: none;
            margin-bottom: 1.5rem;
            font-weight: 500;
            transition: all 0.2s;
        }}

        .back-link:hover {{
            color: var(--primary-dark);
            text-decoration: underline;
        }}

        .section {{
            margin-bottom: 2.5rem;
        }}

        .section-title {{
            color: var(--gray-700);
            font-size: 1.25rem;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid var(--gray-200);
        }}

        .component-preview {{
            background: var(--gray-50);
            border: 2px dashed var(--gray-200);
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
        }}

        .preview-content {{
            max-width: 500px;
        }}

        .preview-icon {{
            font-size: 4rem;
            margin-bottom: 1rem;
        }}

        .preview-title {{
            font-size: 1.5rem;
            color: var(--gray-700);
            margin-bottom: 0.5rem;
        }}

        .preview-type {{
            color: var(--primary);
            font-weight: 600;
            margin-bottom: 1rem;
        }}

        .preview-desc {{
            color: var(--gray-600);
            line-height: 1.6;
        }}

        .info-box {{
            background: #ebf8ff;
            border-left: 4px solid var(--primary);
            padding: 1.25rem;
            border-radius: 6px;
            margin: 1.5rem 0;
        }}

        .info-box-title {{
            color: var(--primary-dark);
            font-weight: 600;
            margin-bottom: 0.5rem;
        }}

        .info-box-text {{
            color: var(--gray-600);
            font-size: 0.9375rem;
            line-height: 1.5;
        }}

        .features-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }}

        .feature-item {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 8px;
            transition: all 0.2s;
        }}

        .feature-item:hover {{
            border-color: var(--primary);
            box-shadow: 0 4px 12px rgba(43, 108, 176, 0.1);
        }}

        .feature-icon {{
            font-size: 1.5rem;
        }}

        .feature-text {{
            color: var(--gray-700);
            font-size: 0.9375rem;
        }}

        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.875rem 1.75rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            font-size: 1rem;
        }}

        .btn:hover {{
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(43, 108, 176, 0.3);
        }}

        .code-block {{
            background: var(--gray-800);
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
        }}

        .footer {{
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid var(--gray-200);
            text-align: center;
            color: var(--gray-500);
            font-size: 0.875rem;
        }}
    </style>
</head>
<body>
    <div class="demo-container">
        <a href="../../index.html" class="back-link">
            ← Volver al índice principal
        </a>

        <div class="header">
            <h1>{name}</h1>
            <p class="subtitle">{description}</p>
        </div>

        <div class="section">
            <h2 class="section-title">Vista Previa del Componente</h2>
            <div class="component-preview">
                <div class="preview-content">
                    <div class="preview-icon">{icon}</div>
                    <h3 class="preview-title">{name}</h3>
                    <p class="preview-type">{component_type}</p>
                    <p class="preview-desc">{description}</p>
                    <div style="margin-top: 1.5rem;">
                        <button class="btn" onclick="alert('Componente: {name}')">
                            Acción de Ejemplo
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-box">
            <div class="info-box-title">ℹ️ Sobre este componente</div>
            <div class="info-box-text">
                Este componente ha sido generado automáticamente como plantilla base.
                Para la implementación completa, consulta el componente React original en
                <code style="background: #2d3748; color: #e2e8f0; padding: 0.25rem 0.5rem; border-radius: 4px;">/components/{tsx_path}</code>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Características del Sistema</h2>
            <div class="features-grid">
                <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span class="feature-text">Diseño Responsive</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">♿</span>
                    <span class="feature-text">Accesible (WCAG 2.1 AA)</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🎨</span>
                    <span class="feature-text">Estilo Profesional Hospitalario</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <span class="feature-text">Rendimiento Optimizado</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🔒</span>
                    <span class="feature-text">Seguro y Confiable</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🌐</span>
                    <span class="feature-text">Compatible Multi-navegador</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Personalización</h2>
            <div class="info-box">
                <div class="info-box-text">
                    <strong>Para personalizar este componente:</strong><br><br>
                    1. Edita el HTML dentro de <code>.component-preview</code><br>
                    2. Modifica los estilos CSS en la sección <code><style></code><br>
                    3. Agrega funcionalidad JavaScript en la sección <code><script></code><br>
                    4. Consulta el componente React original para ver la implementación completa
                </div>
            </div>
        </div>

        <div class="footer">
            <p>ePrescription - Sistema Hospitalario Profesional</p>
            <p style="margin-top: 0.5rem;">Componente generado automáticamente • Versión HTML Estática</p>
        </div>
    </div>

    <script>
        console.log('Componente {name} cargado correctamente');
        console.log('Tipo: {component_type}');
        console.log('Descripción: {description}');
        
        // Funcionalidad de ejemplo
        document.addEventListener('DOMContentLoaded', function() {{
            console.log('DOM cargado - Componente listo para interacción');
        }});
    </script>
</body>
</html>
"""

# ==========================================
# DEFINICIÓN COMPLETA DE COMPONENTES
# ==========================================

UI_COMPONENTS = [
    ('accordion', 'Componente accordion expandible', '📑', 'ui/accordion.tsx'),
    ('alert-dialog', 'Diálogo de alerta modal', '⚠️', 'ui/alert-dialog.tsx'),
    ('alert', 'Mensajes de alerta contextuales', '🔔', 'ui/alert.tsx'),
    ('aspect-ratio', 'Mantiene proporciones de aspecto', '📐', 'ui/aspect-ratio.tsx'),
    ('avatar', 'Avatar de usuario con fallback', '👤', 'ui/avatar.tsx'),
    ('badge', 'Insignia para estados y categorías', '🏷️', 'ui/badge.tsx'),
    ('breadcrumb', 'Migas de pan de navegación', '🍞', 'ui/breadcrumb.tsx'),
    ('calendar', 'Calendario para selección de fechas', '📅', 'ui/calendar.tsx'),
    ('carousel', 'Carrusel de contenido', '🎠', 'ui/carousel.tsx'),
    ('chart', 'Gráficos y visualizaciones', '📊', 'ui/chart.tsx'),
    ('checkbox', 'Casilla de verificación', '☑️', 'ui/checkbox.tsx'),
    ('collapsible', 'Contenido colapsable', '🔽', 'ui/collapsible.tsx'),
    ('command', 'Paleta de comandos', '⌘', 'ui/command.tsx'),
    ('context-menu', 'Menú contextual', '📋', 'ui/context-menu.tsx'),
    ('drawer', 'Panel lateral deslizable', '🚪', 'ui/drawer.tsx'),
    ('dropdown-menu', 'Menú desplegable', '📜', 'ui/dropdown-menu.tsx'),
    ('form', 'Formularios con validación', '📝', 'ui/form.tsx'),
    ('hover-card', 'Tarjeta al pasar el mouse', '🎴', 'ui/hover-card.tsx'),
    ('input-otp', 'Input de código OTP', '🔢', 'ui/input-otp.tsx'),
    ('label', 'Etiqueta de formulario', '🏷️', 'ui/label.tsx'),
    ('menubar', 'Barra de menú principal', '📌', 'ui/menubar.tsx'),
    ('navigation-menu', 'Menú de navegación', '🧭', 'ui/navigation-menu.tsx'),
    ('pagination', 'Paginación de tablas', '📄', 'ui/pagination.tsx'),
    ('popover', 'Contenido flotante', '💬', 'ui/popover.tsx'),
    ('progress', 'Barra de progreso', '📈', 'ui/progress.tsx'),
    ('radio-group', 'Grupo de radio buttons', '🔘', 'ui/radio-group.tsx'),
    ('resizable', 'Paneles redimensionables', '↔️', 'ui/resizable.tsx'),
    ('scroll-area', 'Área de scroll personalizada', '📜', 'ui/scroll-area.tsx'),
    ('select', 'Select dropdown', '🎯', 'ui/select.tsx'),
    ('separator', 'Separador visual', '➖', 'ui/separator.tsx'),
    ('sheet', 'Hoja modal lateral', '📄', 'ui/sheet.tsx'),
    ('sidebar', 'Barra lateral de navegación', '◧', 'ui/sidebar.tsx'),
    ('skeleton', 'Placeholder de carga', '⏳', 'ui/skeleton.tsx'),
    ('slider', 'Control deslizante', '🎚️', 'ui/slider.tsx'),
    ('sonner', 'Notificaciones toast', '🔔', 'ui/sonner.tsx'),
    ('switch', 'Interruptor on/off', '🔄', 'ui/switch.tsx'),
    ('tabs', 'Pestañas de contenido', '📑', 'ui/tabs.tsx'),
    ('textarea', 'Área de texto multilínea', '📝', 'ui/textarea.tsx'),
    ('toggle-group', 'Grupo de toggles', '⚡', 'ui/toggle-group.tsx'),
    ('toggle', 'Toggle button', '🔘', 'ui/toggle.tsx'),
    ('tooltip', 'Descripción emergente', '💡', 'ui/tooltip.tsx'),
]

APP_COMPONENTS = [
    ('AddMedicineDialog', 'Diálogo para agregar medicamentos a la prescripción', '💊', 'AddMedicineDialog.tsx'),
    ('Breadcrumbs', 'Navegación de migas de pan del sistema', '🍞', 'Breadcrumbs.tsx'),
    ('ClinicalDocumentsDialog', 'Gestión de documentos clínicos del paciente', '📋', 'ClinicalDocumentsDialog.tsx'),
    ('ContactPatientDialog', 'Formulario de contacto con pacientes', '📧', 'ContactPatientDialog.tsx'),
    ('Dashboard', 'Panel principal con métricas del sistema', '📊', 'Dashboard.tsx'),
    ('DigitalSignatureDialog', 'Firma digital de prescripciones con QR', '✍️', 'DigitalSignatureDialog.tsx'),
    ('DoctorDetailPanel', 'Panel lateral con detalles del médico', '👨‍⚕️', 'DoctorDetailPanel.tsx'),
    ('DraftPreviewPanel', 'Vista previa de borradores de prescripciones', '📄', 'DraftPreviewPanel.tsx'),
    ('EditDoctorDialog', 'Edición de información de médicos', '✏️', 'EditDoctorDialog.tsx'),
    ('EditPatientProfileDialog', 'Edición del perfil completo del paciente', '👤', 'EditPatientProfileDialog.tsx'),
    ('EmailInput', 'Input de email con validación en tiempo real', '📧', 'EmailInput.tsx'),
    ('EmittedPrescriptionPanel', 'Panel de prescripciones emitidas con acciones', '📜', 'EmittedPrescriptionPanel.tsx'),
    ('EnhancedMedicinePanel', 'Panel mejorado de medicamentos con validación farmacológica', '💊', 'EnhancedMedicinePanel.tsx'),
    ('ExportButtons', 'Botones de exportación PDF, CSV y Excel', '📤', 'ExportButtons.tsx'),
    ('Layout', 'Layout principal de la aplicación', '🏗️', 'Layout.tsx'),
    ('LocationMap', 'Mapa de ubicación de centros médicos', '🗺️', 'LocationMap.tsx'),
    ('MedicalHeader', 'Cabecera médica con estadísticas y certificaciones', '🏥', 'MedicalHeader.tsx'),
    ('MedicalTimeline', 'Línea de tiempo de eventos médicos', '⏱️', 'MedicalTimeline.tsx'),
    ('MedicinePanel', 'Panel de gestión de medicamentos', '💊', 'MedicinePanel.tsx'),
    ('MedicineTable', 'Tabla principal de medicamentos con doble clic', '📋', 'MedicineTable.tsx'),
    ('MultiEmailInput', 'Input para múltiples correos electrónicos', '📧', 'MultiEmailInput.tsx'),
    ('Navigation', 'Sistema de navegación principal', '🧭', 'Navigation.tsx'),
    ('NewDoctorDialog', 'Registro de nuevos médicos', '👨‍⚕️', 'NewDoctorDialog.tsx'),
    ('NewInventoryOrderDialog', 'Creación de órdenes de inventario', '📦', 'NewInventoryOrderDialog.tsx'),
    ('NewLayout', 'Nuevo layout con sidebar profesional', '🏗️', 'NewLayout.tsx'),
    ('NewPatientDialog', 'Registro de nuevos pacientes', '👤', 'NewPatientDialog.tsx'),
    ('PageBanner', 'Banner informativo de página', '📢', 'PageBanner.tsx'),
    ('PageHeader', 'Encabezado estándar de página', '📌', 'PageHeader.tsx'),
    ('PatientDetailPanel', 'Panel lateral con detalles del paciente', '👤', 'PatientDetailPanel.tsx'),
    ('PrescriptionHeader', 'Encabezado de prescripción con datos del paciente', '📋', 'PrescriptionHeader.tsx'),
    ('PrescriptionManager', 'Gestor completo de prescripciones', '📝', 'PrescriptionManager.tsx'),
    ('PrescriptionPage', 'Página completa de prescripción', '📄', 'PrescriptionPage.tsx'),
    ('RejectionDetailPanel', 'Detalles de rechazos de dispensación', '❌', 'RejectionDetailPanel.tsx'),
    ('RoleSelector', 'Selector de roles multi-rol', '🎭', 'RoleSelector.tsx'),
    ('Sidebar', 'Barra lateral de navegación profesional', '◧', 'Sidebar.tsx'),
    ('SystemBanner', 'Banner de sistema con alertas importantes', '⚠️', 'SystemBanner.tsx'),
    ('TablePagination', 'Paginación universal para tablas', '📄', 'TablePagination.tsx'),
    ('TopBar', 'Barra superior con usuario y notificaciones', '🔝', 'TopBar.tsx'),
    ('UniversalPrescriptionPanel', 'Panel universal para todas las prescripciones', '📋', 'UniversalPrescriptionPanel.tsx'),
    ('UserEditDialog', 'Edición de usuarios del sistema', '👤', 'UserEditDialog.tsx'),
    ('VerificationResultPanel', 'Resultados de verificación de recetas', '✅', 'VerificationResultPanel.tsx'),
]

PAGES = [
    ('AlertasPage', 'Gestión de alertas clínicas', '🚨', 'pages/AlertasPage.tsx'),
    ('AuditoriaPage', 'Log de auditoría del sistema', '📝', 'pages/AuditoriaPage.tsx'),
    ('CatalogosPage', 'Catálogos clínicos del sistema', '📚', 'pages/CatalogosPage.tsx'),
    ('CentrosMedicosPage', 'Gestión de centros médicos', '🏥', 'pages/CentrosMedicosPage.tsx'),
    ('ConfigPage', 'Configuración del sistema', '⚙️', 'pages/ConfigPage.tsx'),
    ('ConsultaInventarioPage', 'Consulta de inventario de medicamentos', '📦', 'pages/ConsultaInventarioPage.tsx'),
    ('DashboardPage', 'Dashboard principal con estadísticas', '📊', 'pages/DashboardPage.tsx'),
    ('DispensacionPage', 'Dispensación y verificación de recetas', '💊', 'pages/DispensacionPage.tsx'),
    ('FarmaciasPage', 'Farmacias registradas en el sistema', '💊', 'pages/FarmaciasPage.tsx'),
    ('FirmaPage', 'Firma y verificación digital', '✍️', 'pages/FirmaPage.tsx'),
    ('HistorialInteraccionesPage', 'Historial de interacciones medicamentosas', '⚠️', 'pages/HistorialInteraccionesPage.tsx'),
    ('InteropPage', 'Interoperabilidad HL7 FHIR', '🔄', 'pages/InteropPage.tsx'),
    ('InventarioPage', 'Control de inventario de medicamentos', '📦', 'pages/InventarioPage.tsx'),
    ('LoginPage', 'Página de inicio de sesión con validación', '🔐', 'pages/LoginPage.tsx'),
    ('MedicosPage', 'Gestión de médicos', '👨‍⚕️', 'pages/MedicosPage.tsx'),
    ('MFAVerificationPage', 'Verificación de autenticación multifactor', '🔒', 'pages/MFAVerificationPage.tsx'),
    ('MultiRoleDemoPage', 'Demostración de funcionalidad multi-rol', '🎭', 'pages/MultiRoleDemoPage.tsx'),
    ('NotificacionesConfigPage', 'Configuración de notificaciones', '🔔', 'pages/NotificacionesConfigPage.tsx'),
    ('NotificacionesListPage', 'Listado de notificaciones', '📋', 'pages/NotificacionesListPage.tsx'),
    ('NotificacionesPage', 'Centro de notificaciones', '🔔', 'pages/NotificacionesPage.tsx'),
    ('OnboardingPage', 'Registro de nuevos usuarios', '👋', 'pages/OnboardingPage.tsx'),
    ('PacientesPage', 'Gestión de pacientes', '👤', 'pages/PacientesPage.tsx'),
    ('PasswordRecoveryPage', 'Recuperación de contraseña', '🔑', 'pages/PasswordRecoveryPage.tsx'),
    ('PrescripcionesPage', 'Gestión completa de prescripciones', '📋', 'pages/PrescripcionesPage.tsx'),
    ('RegistrationSuccessPage', 'Confirmación de registro exitoso', '✅', 'pages/RegistrationSuccessPage.tsx'),
    ('RegistroUsuariosPage', 'Registro de nuevos usuarios', '👥', 'pages/RegistroUsuariosPage.tsx'),
    ('ReportesPage', 'Generación de reportes y analítica', '📊', 'pages/ReportesPage.tsx'),
    ('SeguridadPage', 'Gestión de seguridad y usuarios', '🔒', 'pages/SeguridadPage.tsx'),
    ('SessionManagementPage', 'Gestión de sesiones activas', '⏱️', 'pages/SessionManagementPage.tsx'),
    ('TalonariosPage', 'Gestión de talonarios de recetas', '📝', 'pages/TalonariosPage.tsx'),
    ('UserApprovalsPage', 'Aprobación de usuarios pendientes', '✅', 'pages/UserApprovalsPage.tsx'),
]

# ==========================================
# FUNCIÓN DE GENERACIÓN
# ==========================================

def create_component(name, description, icon, tsx_path, folder, component_type):
    """Crea un archivo HTML de componente"""
    file_path = os.path.join(folder, f'{name}.html')
    
    # No sobrescribir archivos existentes
    if os.path.exists(file_path):
        return False, f'⏭️  Ya existe: {name}.html'
    
    content = TEMPLATE_HTML.format(
        name=name,
        description=description,
        icon=icon,
        component_type=component_type,
        tsx_path=tsx_path
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    file_size = len(content) / 1024  # KB
    return True, f'✅ {name}.html ({file_size:.1f} KB)'

# ==========================================
# FUNCIÓN PRINCIPAL
# ==========================================

def main():
    print('╔═══════════════════════════════════════════════════════════╗')
    print('║   🏗️  GENERADOR MASIVO DE COMPONENTES HTML              ║')
    print('║   ePrescription - Sistema Hospitalario                   ║')
    print('╚═══════════════════════════════════════════════════════════╝')
    print()
    
    # Obtener directorio base
    base_dir = os.path.dirname(os.path.abspath(__file__))
    ui_dir = os.path.join(base_dir, 'components', 'ui')
    components_dir = os.path.join(base_dir, 'components')
    pages_dir = os.path.join(base_dir, 'pages')
    
    # Crear carpetas
    os.makedirs(ui_dir, exist_ok=True)
    os.makedirs(components_dir, exist_ok=True)
    os.makedirs(pages_dir, exist_ok=True)
    
    # Contadores
    created = 0
    skipped = 0
    total = 0
    
    # Generar componentes UI
    print('🎨 COMPONENTES UI')
    print('─' * 60)
    for name, desc, icon, tsx_path in UI_COMPONENTS:
        total += 1
        success, msg = create_component(name, desc, icon, tsx_path, ui_dir, 'UI Component')
        if success:
            created += 1
        else:
            skipped += 1
        print(msg)
    print()
    
    # Generar componentes de aplicación
    print('🧩 COMPONENTES DE APLICACIÓN')
    print('─' * 60)
    for name, desc, icon, tsx_path in APP_COMPONENTS:
        total += 1
        success, msg = create_component(name, desc, icon, tsx_path, components_dir, 'Application Component')
        if success:
            created += 1
        else:
            skipped += 1
        print(msg)
    print()
    
    # Generar páginas
    print('📄 PÁGINAS')
    print('─' * 60)
    for name, desc, icon, tsx_path in PAGES:
        total += 1
        success, msg = create_component(name, desc, icon, tsx_path, pages_dir, 'Page')
        if success:
            created += 1
        else:
            skipped += 1
        print(msg)
    print()
    
    # Resumen final
    print('╔═══════════════════════════════════════════════════════════╗')
    print('║   📊 RESUMEN DE GENERACIÓN                               ║')
    print('╠═══════════════════════════════════════════════════════════╣')
    print(f'║   Total procesados:       {total:>3}                          ║')
    print(f'║   Nuevos creados:         {created:>3}                          ║')
    print(f'║   Ya existían:            {skipped:>3}                          ║')
    print('╠═══════════════════════════════════════════════════════════╣')
    print(f'║   Progreso:               {int((created/(total-skipped))*100) if total > skipped else 100}%                           ║')
    print('╚═══════════════════════════════════════════════════════════╝')
    print()
    print('✨ ¡Generación completada!')
    print()
    print('📝 Próximos pasos:')
    print('   1. Abre /html-static/index.html para ver todos los componentes')
    print('   2. Personaliza cada componente según tus necesidades')
    print('   3. Prueba los componentes en tu navegador')
    print()

if __name__ == '__main__':
    main()
