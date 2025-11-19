# ePrescription - Componentes HTML Estáticos

## 🎯 Propósito

Este directorio contiene versiones en **HTML puro** de todos los componentes React del sistema ePrescription. Estos archivos se crearon para **pruebas independientes**, demostraciones y prototipado sin necesidad de un entorno React.

## 📁 Estructura

```
/html-static/
├── index.html                    # 🏠 Índice navegable principal - EMPEZAR AQUÍ
├── auto-generator.html           # 🏗️ Generador de plantillas de componentes
├── CONVERSION_GUIDE.md           # 📖 Guía completa de conversión
├── README.md                     # 📄 Este archivo
│
├── components/                   # 🧩 Componentes de aplicación (41 archivos)
│   ├── Logo.html                 # ✅ Logo del sistema
│   ├── MedicalHeader.html        # Header médico con estadísticas
│   ├── Sidebar.html              # Barra lateral de navegación
│   ├── Dashboard.html            # Panel principal
│   ├── MedicineTable.html        # Tabla de medicamentos
│   └── ...                       # +36 componentes más
│
├── components/ui/                # 🎨 Componentes UI base (36 archivos)
│   ├── button.html               # ✅ Botones con variantes
│   ├── card.html                 # Tarjetas contenedoras
│   ├── dialog.html               # Modales/Diálogos
│   ├── table.html                # Tablas profesionales
│   ├── input.html                # Campos de formulario
│   └── ...                       # +31 componentes UI más
│
├── pages/                        # 📄 Páginas completas (30 archivos)
│   ├── LoginPage.html            # Inicio de sesión
│   ├── DashboardPage.html        # Dashboard principal
│   ├── PrescripcionesPage.html   # Gestión de prescripciones
│   ├── PacientesPage.html        # Gestión de pacientes
│   └── ...                       # +26 páginas más
│
└── utils/                        # 🛠️ Utilidades JavaScript (12 archivos)
    ├── authStore.js              # Gestión de autenticación
    ├── usersStore.js             # Store de usuarios
    ├── searchUtils.js            # Búsqueda sin tildes
    ├── exportUtils.js            # Exportación PDF/CSV/Excel
    └── ...                       # +8 utilidades más
```

## 🚀 Cómo Empezar

### Opción 1: Ver el Índice Interactivo (Recomendado)

1. Abre `/html-static/index.html` en tu navegador
2. Navega por las diferentes secciones usando las pestañas
3. Usa el buscador para encontrar componentes específicos
4. Haz clic en cualquier componente para ver su demo

### Opción 2: Usar el Generador Automático

1. Abre `/html-static/auto-generator.html` en tu navegador
2. Selecciona la categoría de componentes que deseas generar
3. Presiona el botón de generación correspondiente
4. Copia el código generado para crear nuevos componentes

### Opción 3: Explorar Directamente

Navega directamente a cualquier archivo `.html` en las carpetas:
- `/html-static/components/` - Para componentes de aplicación
- `/html-static/components/ui/` - Para componentes UI
- `/html-static/pages/` - Para páginas completas

## 📋 Estado de Conversión

### ✅ Completado

| Categoría | Archivos Completados | Total | Progreso |
|-----------|---------------------|-------|----------|
| **index.html** | 1 | 1 | 100% ✅ |
| **Componentes UI** | 2 | 36 | 6% |
| **Componentes App** | 1 | 41 | 2% |
| **Páginas** | 0 | 30 | 0% |
| **Utilidades** | 0 | 12 | 0% |
| **TOTAL** | **4** | **120** | **3%** |

### Archivos Completados

- ✅ `/html-static/index.html` - Índice principal navegable
- ✅ `/html-static/components/Logo.html` - Logo del sistema
- ✅ `/html-static/components/ui/button.html` - Componente Button
- ✅ `/html-static/auto-generator.html` - Generador automático

## 🛠️ Tecnologías Utilizadas

Todos los componentes están construidos usando:

- **HTML5** puro (sin frameworks)
- **CSS3** con variables CSS para theming
- **JavaScript Vanilla** (ES6+)
- **SVG** para iconos y gráficos

### Bibliotecas Externas Opcionales

Para funcionalidades avanzadas, se pueden incluir:

```html
<!-- Generación de PDFs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

<!-- Exportación Excel -->
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>

<!-- Códigos QR -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

<!-- Gráficos -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Colores Hospitalarios */
--primary: #2b6cb0;           /* Azul principal */
--primary-dark: #2c5282;      /* Azul oscuro */
--success: #48bb78;           /* Verde éxito */
--warning: #ed8936;           /* Naranja advertencia */
--danger: #e53e3e;            /* Rojo peligro */
--info: #4299e1;              /* Azul información */
```

### Tipografía

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### Espaciado

```
0.25rem = 4px
0.5rem  = 8px
1rem    = 16px
1.5rem  = 24px
2rem    = 32px
```

## 💡 Ejemplos de Uso

### Usar un Componente en Tu HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Aplicación</title>
    
    <!-- Copiar estilos del componente -->
    <style>
        /* Pegar aquí los estilos del componente que deseas usar */
    </style>
</head>
<body>
    <!-- Pegar aquí el HTML del componente -->
    <button class="btn btn-default">Mi Botón</button>
    
    <!-- Pegar aquí el JavaScript del componente -->
    <script>
        // JavaScript del componente
    </script>
</body>
</html>
```

### Crear un Modal Simple

```html
<!-- HTML -->
<button onclick="openModal()">Abrir Modal</button>

<div id="myModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); 
                          display: flex; align-items: center; justify-content: center;">
    <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 500px;">
        <h2>Título del Modal</h2>
        <p>Contenido...</p>
        <button onclick="closeModal()">Cerrar</button>
    </div>
</div>

<!-- JavaScript -->
<script>
function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}
</script>
```

### Tabla con Búsqueda

```html
<input type="text" id="searchInput" onkeyup="searchTable()" 
       placeholder="Buscar medicamento...">

<table id="myTable">
    <thead>
        <tr><th>Medicamento</th><th>Dosis</th></tr>
    </thead>
    <tbody>
        <tr><td>Paracetamol</td><td>500mg</td></tr>
        <tr><td>Ibuprofeno</td><td>400mg</td></tr>
    </tbody>
</table>

<script>
function searchTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('myTable');
    const tr = table.getElementsByTagName('tr');
    
    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < td.length; j++) {
            if (td[j].textContent.toLowerCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        
        tr[i].style.display = found ? '' : 'none';
    }
}
</script>
```

## 📚 Recursos Adicionales

### Documentación

- **CONVERSION_GUIDE.md** - Guía completa de conversión React → HTML
- **auto-generator.html** - Herramienta para generar nuevos componentes
- Comentarios en cada archivo `.html` explicando el código

### Archivos Originales React

Los archivos React originales (.tsx) se mantienen intactos en:
- `/components/` - Componentes React originales
- `/components/ui/` - Componentes UI React originales
- `/pages/` - Páginas React originales
- `/utils/` - Utilidades TypeScript originales

### Diferencias Principales

| React/TSX | HTML Puro |
|-----------|-----------|
| `useState` | Variables + DOM manipulation |
| `useEffect` | Event listeners |
| `className` | `class` |
| JSX | HTML |
| Props | Atributos HTML + data-* |
| Tailwind | CSS inline o classes |
| Imports | Todo en un archivo |

## 🔧 Desarrollo

### Agregar un Nuevo Componente

1. Copia la plantilla base desde `auto-generator.html`
2. Reemplaza el contenido con tu componente
3. Asegúrate de incluir:
   - Estilos CSS completos
   - HTML semántico
   - JavaScript funcional
   - Link de regreso al índice
   - Ejemplos de uso

4. Actualiza `index.html` para incluir el nuevo componente

### Mejores Prácticas

- ✅ Usar HTML semántico (`<button>`, `<header>`, `<nav>`, etc.)
- ✅ Incluir aria-labels para accesibilidad
- ✅ Responsive design (mobile-first)
- ✅ Comentar el código JavaScript
- ✅ Incluir ejemplos de uso
- ✅ Validar HTML con W3C Validator

## 🐛 Troubleshooting

### El componente no se ve bien

- Verifica que copiaste todos los estilos CSS
- Asegúrate de que los colores en CSS variables estén definidos
- Revisa la consola del navegador para errores

### El JavaScript no funciona

- Abre la consola del navegador (F12)
- Verifica que los IDs coincidan entre HTML y JavaScript
- Asegúrate de que el script esté después del HTML

### Las imágenes no cargan

- Verifica las rutas de las imágenes
- Usa rutas relativas desde la ubicación del archivo HTML
- Considera usar CDN para imágenes externas

## 📞 Soporte

Para dudas sobre:
- **Conversión de componentes**: Ver `CONVERSION_GUIDE.md`
- **Uso de componentes**: Ver ejemplos en cada archivo `.html`
- **Generación automática**: Usar `auto-generator.html`

## 📝 Notas Importantes

⚠️ **Este es un entorno de prueba estático**

- No hay persistencia de datos real (usa localStorage)
- No hay backend real (datos mock/simulados)
- No hay autenticación real (simulada en frontend)
- No hay integración HL7 real (datos de ejemplo)

✅ **Ideal para:**

- Prototipos rápidos
- Demostraciones a stakeholders
- Pruebas de UI/UX
- Aprendizaje de HTML/CSS/JS
- Documentación visual

❌ **No usar para:**

- Producción
- Datos reales de pacientes
- Prescripciones reales
- Almacenamiento de información sensible

## 🚧 Trabajo Pendiente

### Alta Prioridad

- [ ] Completar componentes UI restantes (34 de 36)
- [ ] Crear componentes de aplicación principales (40 de 41)
- [ ] Generar páginas del sistema (30 de 30)

### Media Prioridad

- [ ] Convertir utilidades a JavaScript (12 de 12)
- [ ] Crear versión minificada de estilos comunes
- [ ] Documentar cada componente individualmente

### Baja Prioridad

- [ ] Crear versión dark mode
- [ ] Optimizar para mejor performance
- [ ] Agregar tests automatizados
- [ ] Crear storybook estático

## 📊 Métricas del Proyecto

- **Total de Archivos**: 120
- **Líneas de Código**: ~50,000 (estimado cuando esté completo)
- **Componentes Únicos**: 77
- **Páginas**: 30
- **Utilidades**: 12

## 🔐 Licencia y Uso

Este código es parte del sistema ePrescription y está destinado únicamente para:
- Pruebas internas
- Desarrollo
- Demostraciones

No usar con datos reales de pacientes ni en entornos de producción.

---

**Última actualización**: 2025-01-09  
**Versión**: 0.1.0-alpha  
**Progreso**: 3% (4/120 archivos)  
**Estado**: En desarrollo activo 🚧
