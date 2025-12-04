# 🚀 Instrucciones Rápidas - ePrescription HTML Estático

## ⚡ Inicio Rápido (5 minutos)

### 1. Abrir el Índice Principal

```
📂 /html-static/index.html
```

👆 **Abre este archivo en tu navegador para empezar**

Este es tu punto de entrada principal. Desde aquí puedes:
- Ver el resumen del proyecto
- Navegar todos los componentes
- Buscar componentes específicos
- Ver demos interactivas

### 2. Ver Componentes Completados

**Componentes ya convertidos y listos para usar:**

✅ `/html-static/index.html` - Índice navegable  
✅ `/html-static/components/Logo.html` - Logo del sistema  
✅ `/html-static/components/ui/button.html` - Botones con variantes  
✅ `/html-static/auto-generator.html` - Generador de componentes  

### 3. Generar Más Componentes

**Opción A: Manual**
1. Copia la plantilla base de `auto-generator.html`
2. Modifica el contenido según necesites
3. Guarda en la carpeta correspondiente

**Opción B: Usar el Generador**
1. Abre `auto-generator.html`
2. Selecciona la categoría
3. Click en "Generar"
4. Copia el código generado

## 📁 ¿Dónde Está Cada Cosa?

```
/html-static/
│
├── 🏠 index.html                 ← EMPIEZA AQUÍ
├── 🏗️ auto-generator.html        ← Generador de componentes
├── 📖 README.md                  ← Documentación completa
├── 📝 CONVERSION_GUIDE.md        ← Guía de conversión React→HTML
├── ⚡ INSTRUCCIONES_RAPIDAS.md   ← Este archivo
│
├── 🧩 components/                ← Componentes de aplicación
│   ├── Logo.html                 ✅ Listo
│   ├── MedicalHeader.html        ⏳ Pendiente
│   ├── Sidebar.html              ⏳ Pendiente
│   └── ... (38 más)
│
├── 🎨 components/ui/             ← Componentes UI base
│   ├── button.html               ✅ Listo
│   ├── card.html                 ⏳ Pendiente
│   ├── dialog.html               ⏳ Pendiente
│   └── ... (33 más)
│
├── 📄 pages/                     ← Páginas completas
│   ├── LoginPage.html            ⏳ Pendiente
│   ├── DashboardPage.html        ⏳ Pendiente
│   └── ... (28 más)
│
└── 🛠️ utils/                     ← Utilidades JavaScript
    ├── authStore.js              ⏳ Pendiente
    ├── searchUtils.js            ⏳ Pendiente
    └── ... (10 más)
```

## 🎯 Casos de Uso Comunes

### Caso 1: Quiero Ver el Logo

```
1. Abre: /html-static/components/Logo.html
2. Verás todas las variantes del logo
3. Copia el código HTML/CSS que necesites
```

### Caso 2: Necesito un Botón

```
1. Abre: /html-static/components/ui/button.html
2. Elige la variante que necesites
3. Copia el HTML + CSS
4. Pega en tu proyecto
```

### Caso 3: Quiero Crear un Nuevo Componente

```
1. Abre: /html-static/auto-generator.html
2. Copia la plantilla base
3. Modifica según tus necesidades
4. Guarda en la carpeta correcta
```

### Caso 4: Buscar un Componente Específico

```
1. Abre: /html-static/index.html
2. Ve a la pestaña correspondiente
3. Usa el buscador en la parte superior
4. Click en el componente que quieres ver
```

## 📦 Componentes por Categoría

### 🎨 UI Básicos (Usar para interfaces)
- `button.html` - Botones ✅
- `card.html` - Tarjetas ⏳
- `dialog.html` - Modales ⏳
- `table.html` - Tablas ⏳
- `input.html` - Inputs ⏳
- `select.html` - Selects ⏳
- `badge.html` - Badges ⏳

### 🧩 Aplicación (Específicos de ePrescription)
- `Logo.html` - Logo ✅
- `MedicalHeader.html` - Header médico ⏳
- `Sidebar.html` - Navegación ⏳
- `MedicineTable.html` - Tabla medicamentos ⏳
- `Dashboard.html` - Dashboard ⏳

### 📄 Páginas Completas
- `LoginPage.html` - Login ⏳
- `DashboardPage.html` - Dashboard ⏳
- `PrescripcionesPage.html` - Prescripciones ⏳

## 💻 Código de Ejemplo

### Usar el Logo

```html
<!-- Copiar desde /html-static/components/Logo.html -->

<div class="logo logo-md">
    <svg width="32" height="32" viewBox="0 0 40 40">
        <rect width="40" height="40" rx="8" fill="#2b6cb0" />
        <path d="M20 8L28 12V18C28 24 24 28.5 20 32C16 28.5 12 24 12 18V12L20 8Z" 
              fill="white" opacity="0.9" />
        <path d="M20 14V26M14 20H26" stroke="#2b6cb0" 
              stroke-width="2.5" stroke-linecap="round" />
    </svg>
    <div class="logo-text">
        <span class="logo-title">ePrescription</span>
        <span class="logo-subtitle">Sistema Hospitalario</span>
    </div>
</div>
```

### Usar un Botón

```html
<!-- Copiar desde /html-static/components/ui/button.html -->

<!-- Botón default -->
<button class="btn btn-default btn-default-size">Guardar</button>

<!-- Botón destructivo -->
<button class="btn btn-destructive btn-default-size">Eliminar</button>

<!-- Botón con icono -->
<button class="btn btn-outline btn-default-size">
    <svg><!-- icono --></svg>
    Exportar
</button>
```

### Crear un Modal

```html
<div id="myModal" style="display: none; position: fixed; inset: 0; 
                          background: rgba(0,0,0,0.5); z-index: 1000;
                          display: flex; align-items: center; justify-content: center;">
    <div style="background: white; padding: 2rem; border-radius: 8px; 
                max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <h2>Título</h2>
        <p>Contenido del modal</p>
        <button onclick="document.getElementById('myModal').style.display='none'">
            Cerrar
        </button>
    </div>
</div>

<button onclick="document.getElementById('myModal').style.display='flex'">
    Abrir Modal
</button>
```

## 🔧 Personalización Rápida

### Cambiar Colores

```css
/* En la etiqueta <style> de tu componente */
:root {
    --primary: #2b6cb0;      /* Cambiar a tu color principal */
    --success: #48bb78;      /* Cambiar a tu color de éxito */
    --danger: #e53e3e;       /* Cambiar a tu color de peligro */
}
```

### Cambiar Fuente

```css
body {
    font-family: 'Tu Fuente', -apple-system, sans-serif;
}
```

### Hacer Responsive

```css
/* Mobile first approach */
.container {
    padding: 1rem;
}

/* Tablets */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        padding: 3rem;
    }
}
```

## ⚠️ Cosas Importantes

### ✅ Puedes Hacer

- ✅ Usar componentes en tus proyectos HTML
- ✅ Modificar estilos y colores
- ✅ Combinar múltiples componentes
- ✅ Copiar y pegar código
- ✅ Aprender de los ejemplos

### ❌ NO Hacer

- ❌ Usar con datos reales de pacientes
- ❌ Usar en producción (solo pruebas)
- ❌ Esperar funcionalidad de backend real
- ❌ Almacenar datos sensibles
- ❌ Usar para prescripciones médicas reales

## 📊 Progreso Actual

```
Total: 120 archivos
Completados: 4 (3%)
Pendientes: 116 (97%)

Estado: 🚧 EN DESARROLLO
```

## 🆘 ¿Necesitas Ayuda?

### 1. Documentación
- **README.md** - Documentación completa
- **CONVERSION_GUIDE.md** - Guía de conversión
- **auto-generator.html** - Herramienta de generación

### 2. Ejemplos
Cada componente `.html` incluye:
- ✅ Ejemplos de uso
- ✅ Código completo
- ✅ Estilos CSS
- ✅ JavaScript funcional

### 3. Navegación
- **index.html** tiene búsqueda integrada
- Enlaces de "Volver" en cada componente
- Categorización clara por tipo

## 🎓 Tutorial de 3 Minutos

### Paso 1 (30 segundos)
Abre `/html-static/index.html` en tu navegador

### Paso 2 (1 minuto)
Navega por las pestañas y busca "button"

### Paso 3 (1 minuto)
Haz click en "Button", ve el demo, copia el código

### Paso 4 (30 segundos)
Crea un archivo `test.html`, pega el código, ábrelo en tu navegador

**¡Listo!** Ya sabes cómo usar los componentes.

## 🔗 Links Rápidos

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| [index.html](./index.html) | Índice principal | ✅ |
| [auto-generator.html](./auto-generator.html) | Generador | ✅ |
| [components/Logo.html](./components/Logo.html) | Logo | ✅ |
| [components/ui/button.html](./components/ui/button.html) | Button | ✅ |

## 📝 Próximos Pasos

### Para Desarrolladores

1. **Generar componentes faltantes**
   - Usa `auto-generator.html`
   - Copia plantilla base
   - Modifica según necesites

2. **Documentar componentes**
   - Agregar ejemplos
   - Explicar uso
   - Incluir variantes

3. **Probar en navegadores**
   - Chrome
   - Firefox
   - Safari
   - Edge

### Para Usuarios

1. **Explorar componentes**
   - Ver demos en `index.html`
   - Probar interactividad
   - Copiar código útil

2. **Crear prototipos**
   - Combinar componentes
   - Personalizar estilos
   - Agregar funcionalidad

3. **Dar feedback**
   - ¿Qué componentes necesitas?
   - ¿Qué está confuso?
   - ¿Qué falta?

## 🎉 ¡Eso es Todo!

Ya estás listo para usar los componentes HTML de ePrescription.

**Recuerda**: Esto es para **pruebas y desarrollo**, NO para producción con datos reales.

---

**¿Dudas?** Consulta el README.md completo o explora los componentes en index.html

**¿Necesitas más componentes?** Usa auto-generator.html para crearlos

**¿Quieres contribuir?** Genera componentes faltantes y compártelos
