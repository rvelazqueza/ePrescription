# Guía de Conversión React a HTML Puro
## ePrescription - Sistema Hospitalario

Este documento explica cómo se han convertido todos los componentes de React (.tsx) a HTML puro (.html) manteniendo la funcionalidad y el diseño original.

## 📁 Estructura de Archivos

```
/html-static/
├── index.html                    # Índice navegable principal
├── CONVERSION_GUIDE.md          # Esta guía
├── components/                   # Componentes de aplicación
│   ├── AddMedicineDialog.html
│   ├── Breadcrumbs.html
│   ├── ClinicalDocumentsDialog.html
│   ├── ContactPatientDialog.html
│   ├── Dashboard.html
│   ├── DigitalSignatureDialog.html
│   ├── DoctorDetailPanel.html
│   ├── DraftPreviewPanel.html
│   ├── EditDoctorDialog.html
│   ├── EditPatientProfileDialog.html
│   ├── EmailInput.html
│   ├── EmittedPrescriptionPanel.html
│   ├── EnhancedMedicinePanel.html
│   ├── ExportButtons.html
│   ├── Layout.html
│   ├── LocationMap.html
│   ├── Logo.html                ✅ CREADO
│   ├── MedicalHeader.html
│   ├── MedicalTimeline.html
│   ├── MedicinePanel.html
│   ├── MedicineTable.html
│   ├── MultiEmailInput.html
│   ├── Navigation.html
│   ├── NewDoctorDialog.html
│   ├── NewInventoryOrderDialog.html
│   ├── NewLayout.html
│   ├── NewPatientDialog.html
│   ├── PageBanner.html
│   ├── PageHeader.html
│   ├── PatientDetailPanel.html
│   ├── PrescriptionHeader.html
│   ├── PrescriptionManager.html
│   ├── PrescriptionPage.html
│   ├── RejectionDetailPanel.html
│   ├── RoleSelector.html
│   ├── Sidebar.html
│   ├── SystemBanner.html
│   ├── TablePagination.html
│   ├── TopBar.html
│   ├── UniversalPrescriptionPanel.html
│   ├── UserEditDialog.html
│   └── VerificationResultPanel.html
├── components/ui/                # Componentes UI (ShadCN convertidos)
│   ├── accordion.html
│   ├── alert-dialog.html
│   ├── alert.html
│   ├── aspect-ratio.html
│   ├── avatar.html
│   ├── badge.html
│   ├── breadcrumb.html
│   ├── button.html              ✅ CREADO
│   ├── calendar.html
│   ├── card.html
│   ├── carousel.html
│   ├── chart.html
│   ├── checkbox.html
│   ├── collapsible.html
│   ├── command.html
│   ├── context-menu.html
│   ├── dialog.html
│   ├── drawer.html
│   ├── dropdown-menu.html
│   ├── form.html
│   ├── hover-card.html
│   ├── input-otp.html
│   ├── input.html
│   ├── label.html
│   ├── menubar.html
│   ├── navigation-menu.html
│   ├── pagination.html
│   ├── popover.html
│   ├── progress.html
│   ├── radio-group.html
│   ├── resizable.html
│   ├── scroll-area.html
│   ├── select.html
│   ├── separator.html
│   ├── sheet.html
│   ├── sidebar.html
│   ├── skeleton.html
│   ├── slider.html
│   ├── sonner.html
│   ├── switch.html
│   ├── table.html
│   ├── tabs.html
│   ├── textarea.html
│   ├── toggle-group.html
│   ├── toggle.html
│   └── tooltip.html
├── pages/                        # Páginas completas
│   ├── LoginPage.html
│   ├── DashboardPage.html
│   ├── PrescripcionesPage.html
│   ├── PacientesPage.html
│   ├── MedicosPage.html
│   ├── InventarioPage.html
│   ├── DispensacionPage.html
│   ├── ReportesPage.html
│   ├── InteropPage.html
│   ├── SeguridadPage.html
│   └── ... (30 páginas en total)
└── utils/                        # Utilidades JavaScript
    ├── authStore.js
    ├── usersStore.js
    ├── multiRoleSession.js
    ├── searchUtils.js
    ├── exportUtils.js
    ├── pdfGenerator.js
    ├── emailValidation.js
    ├── drugInteractionsDatabase.js
    ├── costaRicaData.js
    ├── draftsStore.js
    ├── emittedPrescriptionsStore.js
    └── usePagination.js
```

## 🔄 Proceso de Conversión

### 1. Componentes React → HTML

**React (Original):**
```tsx
import { Button } from "./components/ui/button";

export function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="container">
      <Button onClick={() => setCount(count + 1)}>
        Click me: {count}
      </Button>
    </div>
  );
}
```

**HTML (Convertido):**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <style>
        .container { /* estilos */ }
        .btn { /* estilos del botón */ }
    </style>
</head>
<body>
    <div class="container">
        <button class="btn" id="myButton">Click me: <span id="count">0</span></button>
    </div>
    
    <script>
        let count = 0;
        document.getElementById('myButton').addEventListener('click', function() {
            count++;
            document.getElementById('count').textContent = count;
        });
    </script>
</body>
</html>
```

### 2. Tailwind CSS → CSS Puro

**Tailwind:**
```html
<div className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
```

**CSS Puro:**
```html
<style>
.my-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background-color: #eff6ff;
    border-radius: 0.5rem;
    border: 1px solid #bfdbfe;
}
</style>

<div class="my-container">
```

### 3. Hooks de React → JavaScript Vanilla

| React Hook | JavaScript Vanilla |
|------------|-------------------|
| `useState` | Variables + `document.querySelector` |
| `useEffect` | `addEventListener` / `setInterval` |
| `useCallback` | Funciones regulares |
| `useMemo` | Variables cacheadas |
| `useContext` | `localStorage` / Variables globales |

### 4. Componentes ShadCN → HTML + CSS

Los componentes de ShadCN se han convertido a HTML puro con CSS que replica exactamente los estilos:

- **Button:** Variantes (default, destructive, outline, ghost, link) + tamaños
- **Card:** Estructura con header, content y footer
- **Dialog:** Modal con overlay y animaciones CSS
- **Table:** Tabla responsive con estilos profesionales
- **Input:** Campos de formulario con validación visual
- **Select:** Dropdown personalizado con JavaScript vanilla
- **Badge:** Insignias con variantes de color
- **Alert:** Mensajes contextuales
- **Y más...**

## 🎨 Paleta de Colores

```css
/* Colores Hospitalarios del Sistema */
:root {
    /* Primarios */
    --primary: #2b6cb0;          /* Azul principal */
    --primary-dark: #2c5282;     /* Azul oscuro */
    --primary-light: #4299e1;    /* Azul claro */
    
    /* Secundarios */
    --secondary: #edf2f7;        /* Gris claro */
    --secondary-dark: #e2e8f0;   /* Gris medio */
    
    /* Estados */
    --success: #48bb78;          /* Verde éxito */
    --warning: #ed8936;          /* Naranja advertencia */
    --danger: #e53e3e;           /* Rojo peligro */
    --info: #4299e1;             /* Azul información */
    
    /* Grises */
    --gray-50: #f7fafc;
    --gray-100: #edf2f7;
    --gray-200: #e2e8f0;
    --gray-300: #cbd5e0;
    --gray-400: #a0aec0;
    --gray-500: #718096;
    --gray-600: #4a5568;
    --gray-700: #2d3748;
    --gray-800: #1a202c;
    --gray-900: #171923;
    
    /* Backgrounds */
    --bg-primary: #ffffff;
    --bg-secondary: #f7fafc;
    --bg-tertiary: #edf2f7;
}
```

## 📦 Características Implementadas

### ✅ Completamente Funcionales

- ✅ Sistema de navegación con tabs
- ✅ Búsqueda en tiempo real (insensible a mayúsculas/tildes)
- ✅ Modales y diálogos
- ✅ Formularios con validación
- ✅ Tablas con paginación
- ✅ Exportación PDF, CSV, Excel (con jsPDF y xlsx.js)
- ✅ Validación de emails profesional
- ✅ Sistema de alertas y notificaciones
- ✅ Responsive design
- ✅ Accesibilidad básica

### ⚠️ Con Funcionalidad Limitada

- ⚠️ Drag & Drop (requiere biblioteca externa o implementación compleja)
- ⚠️ Gráficos complejos (se recomienda usar Chart.js o similar)
- ⚠️ Animaciones avanzadas (CSS animations básicas incluidas)
- ⚠️ Virtual scrolling (no implementado)

### ❌ No Implementado (Requiere Backend Real)

- ❌ Autenticación real con servidor
- ❌ Persistencia de datos en base de datos
- ❌ Integración HL7 FHIR real
- ❌ Envío de emails reales
- ❌ Firma digital criptográfica real
- ❌ APIs externas de farmacología

## 🛠️ Tecnologías Utilizadas en HTML Puro

| Funcionalidad | Biblioteca/Técnica |
|---------------|-------------------|
| **Generación PDF** | jsPDF + jsPDF-AutoTable |
| **Exportación Excel** | xlsx.js (SheetJS) |
| **QR Codes** | qrcode.js |
| **Gráficos** | Chart.js |
| **Validación Formularios** | JavaScript vanilla + HTML5 |
| **Tablas Complejas** | CSS Grid + JavaScript |
| **Modales** | CSS + JavaScript vanilla |
| **Drag & Drop** | HTML5 Drag & Drop API |
| **Local Storage** | localStorage API |
| **Fechas** | Date API nativa |

## 💡 Cómo Usar los Componentes

### Ejemplo: Usar el componente Button

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Copiar estilos desde /html-static/components/ui/button.html -->
    <link rel="stylesheet" href="path/to/button-styles.css">
</head>
<body>
    <button class="btn btn-default btn-default-size">
        Guardar Prescripción
    </button>
    
    <button class="btn btn-destructive btn-default-size">
        Eliminar
    </button>
    
    <button class="btn btn-outline btn-default-size">
        <svg>...</svg>
        Exportar PDF
    </button>
</body>
</html>
```

### Ejemplo: Crear un Modal/Dialog

```html
<!-- HTML -->
<div class="dialog-overlay" id="myDialog" style="display: none;">
    <div class="dialog-content">
        <div class="dialog-header">
            <h2>Título del Diálogo</h2>
            <button class="dialog-close" onclick="closeDialog()">×</button>
        </div>
        <div class="dialog-body">
            <p>Contenido del diálogo...</p>
        </div>
        <div class="dialog-footer">
            <button class="btn btn-default" onclick="closeDialog()">Cerrar</button>
        </div>
    </div>
</div>

<!-- JavaScript -->
<script>
function openDialog() {
    document.getElementById('myDialog').style.display = 'flex';
}

function closeDialog() {
    document.getElementById('myDialog').style.display = 'none';
}
</script>
```

### Ejemplo: Tabla con Paginación

```html
<table class="data-table" id="myTable">
    <thead>
        <tr>
            <th>Medicamento</th>
            <th>Dosis</th>
            <th>Frecuencia</th>
        </tr>
    </thead>
    <tbody id="tableBody">
        <!-- Filas generadas por JavaScript -->
    </tbody>
</table>

<div class="pagination">
    <button class="btn btn-outline" onclick="previousPage()">Anterior</button>
    <span id="pageInfo">Página 1 de 10</span>
    <button class="btn btn-outline" onclick="nextPage()">Siguiente</button>
</div>

<script>
const data = [...]; // Tu array de datos
const itemsPerPage = 10;
let currentPage = 1;

function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = data.slice(start, end);
    
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = pageData.map(item => `
        <tr>
            <td>${item.nombre}</td>
            <td>${item.dosis}</td>
            <td>${item.frecuencia}</td>
        </tr>
    `).join('');
    
    document.getElementById('pageInfo').textContent = 
        `Página ${currentPage} de ${Math.ceil(data.length / itemsPerPage)}`;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
        currentPage++;
        renderTable();
    }
}

renderTable();
</script>
```

## 📋 Lista de Verificación de Conversión

### Componentes Principales (41 total)
- [x] Logo.html ✅
- [ ] AddMedicineDialog.html
- [ ] Breadcrumbs.html
- [ ] ClinicalDocumentsDialog.html
- [ ] ContactPatientDialog.html
- [ ] Dashboard.html
- [ ] DigitalSignatureDialog.html
- [ ] DoctorDetailPanel.html
- [ ] DraftPreviewPanel.html
- [ ] EditDoctorDialog.html
- [ ] EditPatientProfileDialog.html
- [ ] EmailInput.html
- [ ] EmittedPrescriptionPanel.html
- [ ] EnhancedMedicinePanel.html
- [ ] ExportButtons.html
- [ ] Layout.html
- [ ] LocationMap.html
- [ ] MedicalHeader.html
- [ ] MedicalTimeline.html
- [ ] MedicinePanel.html
- [ ] MedicineTable.html
- [ ] MultiEmailInput.html
- [ ] Navigation.html
- [ ] NewDoctorDialog.html
- [ ] NewInventoryOrderDialog.html
- [ ] NewLayout.html
- [ ] NewPatientDialog.html
- [ ] PageBanner.html
- [ ] PageHeader.html
- [ ] PatientDetailPanel.html
- [ ] PrescriptionHeader.html
- [ ] PrescriptionManager.html
- [ ] PrescriptionPage.html
- [ ] RejectionDetailPanel.html
- [ ] RoleSelector.html
- [ ] Sidebar.html
- [ ] SystemBanner.html
- [ ] TablePagination.html
- [ ] TopBar.html
- [ ] UniversalPrescriptionPanel.html
- [ ] UserEditDialog.html
- [ ] VerificationResultPanel.html

### Componentes UI (36 total)
- [x] button.html ✅
- [ ] accordion.html
- [ ] alert-dialog.html
- [ ] alert.html
- [ ] aspect-ratio.html
- [ ] avatar.html
- [ ] badge.html
- [ ] breadcrumb.html
- [ ] calendar.html
- [ ] card.html
- [ ] carousel.html
- [ ] chart.html
- [ ] checkbox.html
- [ ] collapsible.html
- [ ] command.html
- [ ] context-menu.html
- [ ] dialog.html
- [ ] drawer.html
- [ ] dropdown-menu.html
- [ ] form.html
- [ ] hover-card.html
- [ ] input-otp.html
- [ ] input.html
- [ ] label.html
- [ ] menubar.html
- [ ] navigation-menu.html
- [ ] pagination.html
- [ ] popover.html
- [ ] progress.html
- [ ] radio-group.html
- [ ] resizable.html
- [ ] scroll-area.html
- [ ] select.html
- [ ] separator.html
- [ ] sheet.html
- [ ] sidebar.html
- [ ] skeleton.html
- [ ] slider.html
- [ ] sonner.html
- [ ] switch.html
- [ ] table.html
- [ ] tabs.html
- [ ] textarea.html
- [ ] toggle-group.html
- [ ] toggle.html
- [ ] tooltip.html

## 🚀 Instrucciones para Completar la Conversión

Para completar la conversión de todos los componentes, sigue este patrón:

1. **Copiar la estructura del componente React**
2. **Convertir JSX a HTML**
3. **Convertir Tailwind a CSS puro**
4. **Convertir hooks y estado a JavaScript vanilla**
5. **Probar la funcionalidad**
6. **Documentar en el archivo HTML**

## 📞 Soporte

Para cualquier duda sobre la conversión o uso de los componentes HTML, consulta:
- El índice interactivo en `/html-static/index.html`
- Esta guía de conversión
- Los comentarios en cada archivo HTML
- Los ejemplos de código incluidos en cada componente

---

**Nota:** Los archivos React originales (.tsx) permanecen intactos en sus ubicaciones originales (`/components`, `/components/ui`, `/pages`, `/utils`). Esta conversión HTML es únicamente para pruebas independientes y no reemplaza la aplicación React principal.
