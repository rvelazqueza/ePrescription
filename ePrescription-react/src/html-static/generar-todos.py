#!/usr/bin/env python3
"""
Generador Masivo de Componentes HTML
ePrescription - Sistema Hospitalario

Este script genera automáticamente TODOS los componentes HTML faltantes.
Ejecutar con: python generar-todos.py
"""

import os
from pathlib import Path

# Template base
TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - ePrescription</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f7fafc;
            padding: 2rem;
        }}

        .demo-container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}

        h1 {{
            color: #2d3748;
            margin-bottom: 0.5rem;
        }}

        .subtitle {{
            color: #718096;
            margin-bottom: 2rem;
        }}

        .section {{
            margin-bottom: 2rem;
        }}

        .section-title {{
            color: #2d3748;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
        }}

        .back-link {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #2b6cb0;
            text-decoration: none;
            margin-bottom: 1rem;
        }}

        .back-link:hover {{
            text-decoration: underline;
        }}

        .component-demo {{
            padding: 2rem;
            background: #f7fafc;
            border-radius: 8px;
            border: 2px dashed #e2e8f0;
            text-align: center;
        }}

        .placeholder {{
            color: #a0aec0;
            padding: 3rem;
        }}

        .btn {{
            padding: 0.75rem 1.5rem;
            background: #2b6cb0;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background 0.2s;
        }}

        .btn:hover {{
            background: #2c5282;
        }}
    </style>
</head>
<body>
    <div class="demo-container">
        <a href="../../index.html" class="back-link">
            ← Volver al índice
        </a>

        <h1>{name}</h1>
        <p class="subtitle">{description}</p>

        <div class="section">
            <h2 class="section-title">Vista Previa</h2>
            <div class="component-demo">
                <div class="placeholder">
                    <h3>Componente: {name}</h3>
                    <p>Tipo: {component_type}</p>
                    <p style="margin-top: 1rem;">Este componente está listo para ser personalizado.</p>
                    <p style="margin-top: 0.5rem; font-size: 0.875rem;">
                        Consulta el componente React original en /components/{tsx_path} para más detalles.
                    </p>
                    <div style="margin-top: 2rem;">
                        <button class="btn">Acción de Ejemplo</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Características</h2>
            <ul style="list-style: none; padding-left: 0;">
                <li style="padding: 0.5rem 0; color: #4a5568;">✅ Diseño responsive</li>
                <li style="padding: 0.5rem 0; color: #4a5568;">✅ Accesible (WCAG 2.1)</li>
                <li style="padding: 0.5rem 0; color: #4a5568;">✅ Estilo profesional hospitalario</li>
                <li style="padding: 0.5rem 0; color: #4a5568;">✅ Compatible con todos los navegadores</li>
                <li style="padding: 0.5rem 0; color: #a0aec0;">⏳ Funcionalidad completa: personalizar según necesidad</li>
            </ul>
        </div>
    </div>

    <script>
        console.log('Componente {name} cargado');
        console.log('Tipo: {component_type}');
        
        // Ejemplo de interactividad básica
        document.querySelectorAll('.btn').forEach(btn => {{
            btn.addEventListener('click', function() {{
                alert('Botón presionado en componente {name}');
            }});
        }});
    </script>
</body>
</html>
"""

# Definiciones
UI_COMPONENTS = [
    ('accordion', 'Componente accordion expandible'),
    ('alert-dialog', 'Diálogo de alerta modal'),
    ('alert', 'Mensajes de alerta contextuales'),
    ('aspect-ratio', 'Mantiene proporciones de aspecto'),
    ('avatar', 'Avatar de usuario con fallback'),
    ('badge', 'Insignia para estados y categorías'),
    ('breadcrumb', 'Migas de pan de navegación'),
    ('calendar', 'Calendario para selección de fechas'),
    ('carousel', 'Carrusel de contenido'),
    ('chart', 'Gráficos y visualizaciones'),
    ('checkbox', 'Casilla de verificación'),
    ('collapsible', 'Contenido colapsable'),
    ('command', 'Paleta de comandos'),
    ('context-menu', 'Menú contextual'),
    ('dialog', 'Modal/Diálogo'),
    ('drawer', 'Panel lateral deslizable'),
    ('dropdown-menu', 'Menú desplegable'),
    ('form', 'Formularios con validación'),
    ('hover-card', 'Tarjeta al pasar el mouse'),
    ('input-otp', 'Input de código OTP'),
    ('label', 'Etiqueta de formulario'),
    ('menubar', 'Barra de menú principal'),
    ('navigation-menu', 'Menú de navegación'),
    ('pagination', 'Paginación de tablas'),
    ('popover', 'Contenido flotante'),
    ('progress', 'Barra de progreso'),
    ('radio-group', 'Grupo de radio buttons'),
    ('resizable', 'Paneles redimensionables'),
    ('scroll-area', 'Área de scroll personalizada'),
    ('select', 'Select dropdown'),
    ('separator', 'Separador visual'),
    ('sheet', 'Hoja modal lateral'),
    ('sidebar', 'Barra lateral de navegación'),
    ('skeleton', 'Placeholder de carga'),
    ('slider', 'Control deslizante'),
    ('sonner', 'Notificaciones toast'),
    ('switch', 'Interruptor on/off'),
    ('table', 'Tabla de datos'),
    ('tabs', 'Pestañas de contenido'),
    ('textarea', 'Área de texto multilínea'),
    ('toggle-group', 'Grupo de toggles'),
    ('toggle', 'Toggle button'),
    ('tooltip', 'Descripción emergente'),
]

APP_COMPONENTS = [
    ('AddMedicineDialog', 'Diálogo para agregar medicamentos a la prescripción'),
    ('Breadcrumbs', 'Navegación de migas de pan del sistema'),
    ('ClinicalDocumentsDialog', 'Gestión de documentos clínicos del paciente'),
    ('ContactPatientDialog', 'Formulario de contacto con pacientes'),
    ('Dashboard', 'Panel principal con métricas del sistema'),
    ('DigitalSignatureDialog', 'Firma digital de prescripciones con QR'),
    ('DoctorDetailPanel', 'Panel lateral con detalles del médico'),
    ('DraftPreviewPanel', 'Vista previa de borradores de prescripciones'),
    ('EditDoctorDialog', 'Edición de información de médicos'),
    ('EditPatientProfileDialog', 'Edición del perfil completo del paciente'),
    ('EmailInput', 'Input de email con validación en tiempo real'),
    ('EmittedPrescriptionPanel', 'Panel de prescripciones emitidas con acciones'),
    ('EnhancedMedicinePanel', 'Panel mejorado de medicamentos con validación farmacológica'),
    ('ExportButtons', 'Botones de exportación PDF, CSV y Excel'),
    ('Layout', 'Layout principal de la aplicación'),
    ('LocationMap', 'Mapa de ubicación de centros médicos'),
    ('MedicalHeader', 'Cabecera médica con estadísticas y certificaciones'),
    ('MedicalTimeline', 'Línea de tiempo de eventos médicos'),
    ('MedicinePanel', 'Panel de gestión de medicamentos'),
    ('MedicineTable', 'Tabla principal de medicamentos con doble clic'),
    ('MultiEmailInput', 'Input para múltiples correos electrónicos'),
    ('Navigation', 'Sistema de navegación principal'),
    ('NewDoctorDialog', 'Registro de nuevos médicos'),
    ('NewInventoryOrderDialog', 'Creación de órdenes de inventario'),
    ('NewLayout', 'Nuevo layout con sidebar profesional'),
    ('NewPatientDialog', 'Registro de nuevos pacientes'),
    ('PageBanner', 'Banner informativo de página'),
    ('PageHeader', 'Encabezado estándar de página'),
    ('PatientDetailPanel', 'Panel lateral con detalles del paciente'),
    ('PrescriptionHeader', 'Encabezado de prescripción con datos del paciente'),
    ('PrescriptionManager', 'Gestor completo de prescripciones'),
    ('PrescriptionPage', 'Página completa de prescripción'),
    ('RejectionDetailPanel', 'Detalles de rechazos de dispensación'),
    ('RoleSelector', 'Selector de roles multi-rol'),
    ('Sidebar', 'Barra lateral de navegación profesional'),
    ('SystemBanner', 'Banner de sistema con alertas importantes'),
    ('TablePagination', 'Paginación universal para tablas'),
    ('TopBar', 'Barra superior con usuario y notificaciones'),
    ('UniversalPrescriptionPanel', 'Panel universal para todas las prescripciones'),
    ('UserEditDialog', 'Edición de usuarios del sistema'),
    ('VerificationResultPanel', 'Resultados de verificación de recetas'),
]

PAGES = [
    ('LoginPage', 'Página de inicio de sesión con validación'),
    ('DashboardPage', 'Dashboard principal con estadísticas'),
    ('PrescripcionesPage', 'Gestión completa de prescripciones'),
    ('PacientesPage', 'Gestión de pacientes'),
    ('MedicosPage', 'Gestión de médicos'),
    ('InventarioPage', 'Control de inventario de medicamentos'),
    ('DispensacionPage', 'Dispensación y verificación de recetas'),
    ('ReportesPage', 'Generación de reportes y analítica'),
    ('InteropPage', 'Interoperabilidad HL7 FHIR'),
    ('SeguridadPage', 'Gestión de seguridad y usuarios'),
    ('MFAVerificationPage', 'Verificación de autenticación multifactor'),
    ('PasswordRecoveryPage', 'Recuperación de contraseña'),
    ('OnboardingPage', 'Registro de nuevos usuarios'),
    ('RegistrationSuccessPage', 'Confirmación de registro exitoso'),
    ('UserApprovalsPage', 'Aprobación de usuarios pendientes'),
    ('SessionManagementPage', 'Gestión de sesiones activas'),
    ('AlertasPage', 'Gestión de alertas clínicas'),
    ('AuditoriaPage', 'Log de auditoría del sistema'),
    ('CatalogosPage', 'Catálogos clínicos del sistema'),
    ('CentrosMedicosPage', 'Gestión de centros médicos'),
    ('ConfigPage', 'Configuración del sistema'),
    ('ConsultaInventarioPage', 'Consulta de inventario de medicamentos'),
    ('FarmaciasPage', 'Farmacias registradas en el sistema'),
    ('FirmaPage', 'Firma y verificación digital'),
    ('HistorialInteraccionesPage', 'Historial de interacciones medicamentosas'),
    ('NotificacionesConfigPage', 'Configuración de notificaciones'),
    ('NotificacionesListPage', 'Listado de notificaciones'),
    ('NotificacionesPage', 'Centro de notificaciones'),
    ('RegistroUsuariosPage', 'Registro de nuevos usuarios'),
    ('TalonariosPage', 'Gestión de talonarios de recetas'),
    ('MultiRoleDemoPage', 'Demostración de funcionalidad multi-rol'),
]

def create_component(name, description, folder, component_type, tsx_path):
    """Crea un archivo HTML de componente"""
    file_path = os.path.join(folder, f'{name}.html')
    
    # No sobrescribir archivos existentes
    if os.path.exists(file_path):
        print(f'⏭️  Ya existe: {name}.html')
        return False
    
    content = TEMPLATE.format(
        name=name,
        description=description,
        component_type=component_type,
        tsx_path=tsx_path
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✅ Creado: {name}.html ({len(content)} bytes)')
    return True

def main():
    print('🏗️  Generador Masivo de Componentes HTML')
    print('=' * 50)
    print()
    
    # Crear carpetas si no existen
    base_dir = os.path.dirname(os.path.abspath(__file__))
    ui_dir = os.path.join(base_dir, 'components', 'ui')
    components_dir = os.path.join(base_dir, 'components')
    pages_dir = os.path.join(base_dir, 'pages')
    
    os.makedirs(ui_dir, exist_ok=True)
    os.makedirs(components_dir, exist_ok=True)
    os.makedirs(pages_dir, exist_ok=True)
    
    # Contadores
    created_count = 0
    total_count = 0
    
    # Generar componentes UI
    print('🎨 Generando componentes UI...')
    for name, desc in UI_COMPONENTS:
        total_count += 1
        if create_component(name, desc, ui_dir, 'UI Component', f'ui/{name}.tsx'):
            created_count += 1
    print()
    
    # Generar componentes de aplicación
    print('🧩 Generando componentes de aplicación...')
    for name, desc in APP_COMPONENTS:
        total_count += 1
        if create_component(name, desc, components_dir, 'App Component', f'{name}.tsx'):
            created_count += 1
    print()
    
    # Generar páginas
    print('📄 Generando páginas...')
    for name, desc in PAGES:
        total_count += 1
        if create_component(name, desc, pages_dir, 'Page', f'pages/{name}.tsx'):
            created_count += 1
    print()
    
    # Resumen
    print('=' * 50)
    print('📊 Resumen de Generación:')
    print(f'   Total procesados:  {total_count}')
    print(f'   Nuevos creados:    {created_count}')
    print(f'   Ya existían:       {total_count - created_count}')
    print()
    print('✨ ¡Generación completada!')
    print()
    print('📝 Próximos pasos:')
    print('1. Revisa los archivos generados')
    print('2. Personaliza cada componente según necesites')
    print('3. Abre /html-static/index.html para verlos todos')

if __name__ == '__main__':
    main()
