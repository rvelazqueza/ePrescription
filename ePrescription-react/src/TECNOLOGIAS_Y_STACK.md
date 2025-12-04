# Stack Tecnológico Completo - ePrescription

## 📚 Documento Técnico de Tecnologías Utilizadas

**Proyecto:** ePrescription - Sistema de Prescripción Electrónica  
**Versión:** 1.0  
**Fecha:** Octubre 2025

---

## 🎯 Stack Principal

### 1. **Framework Base**

#### React 18+
- **Uso:** Framework principal para la interfaz de usuario
- **Import:** `import { useState, useEffect } from "react"`
- **Características utilizadas:**
  - Hooks (useState, useEffect, useCallback, useMemo)
  - Componentes funcionales
  - Props y composición de componentes
  - Context API (no implementado aún, pero disponible)

#### TypeScript
- **Uso:** Tipado estático para mayor seguridad y mantenibilidad
- **Características:**
  - Interfaces para tipos de datos
  - Type safety en props de componentes
  - Enums para valores constantes
  - Generics en utilidades

---

## 🎨 Sistema de Estilos

### 2. **Tailwind CSS v4.0**

#### Configuración
- **Archivo:** `/styles/globals.css`
- **Versión:** 4.0 (última versión)
- **Características utilizadas:**
  - CSS Variables nativas
  - `@theme inline` para configuración de tema
  - `@custom-variant` para modo oscuro
  - `@layer base` para estilos base

#### Variables CSS Definidas
```css
/* Colores principales */
--background: #fafbfc
--foreground: #1a202c
--primary: #2b6cb0 (Medical Blue)
--secondary: #e6f3ff (Light Medical Blue)
--success: #059669 (Medical Green)
--warning: #d97706 (Medical Orange)
--destructive: #dc2626 (Medical Red)

/* Componentes */
--card: #ffffff
--border: #e2e8f0
--input-background: #ffffff
--muted: #f1f5f9

/* Charts */
--chart-1 a --chart-5 (5 colores para gráficos)

/* Sidebar */
--sidebar: #f8fafc
--sidebar-primary: #2b6cb0
```

#### Utilidades de Tailwind Usadas
- **Layout:** `flex`, `grid`, `container`, `max-w-*`
- **Spacing:** `p-*`, `m-*`, `gap-*`, `space-*`
- **Typography:** Manejado por variables CSS (h1, h2, p, label, button)
- **Colors:** Usando variables CSS personalizadas
- **Borders:** `border`, `rounded-*`, `border-*`
- **Effects:** `shadow-*`, `opacity-*`, `transition-*`
- **Responsive:** `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

#### Modo Oscuro
- **Implementación:** `.dark` class con `@custom-variant`
- **Estrategia:** CSS variables que cambian en modo oscuro
- **Colores:** Sistema completo de colores para dark mode usando `oklch()`

---

## 🧩 Librería de Componentes

### 3. **shadcn/ui**

**Ubicación:** `/components/ui/`

#### Componentes Implementados (46 componentes)

**Formularios y Entradas:**
- `button.tsx` - Botones con variantes (primary, secondary, outline, ghost, destructive)
- `input.tsx` - Campos de entrada de texto
- `textarea.tsx` - Áreas de texto
- `label.tsx` - Etiquetas para formularios
- `select.tsx` - Selectores dropdown
- `checkbox.tsx` - Casillas de verificación
- `radio-group.tsx` - Grupos de radio buttons
- `switch.tsx` - Interruptores toggle
- `slider.tsx` - Controles deslizantes
- `input-otp.tsx` - Entrada de códigos OTP
- `form.tsx` - Wrapper para formularios con validación

**Navegación:**
- `navigation-menu.tsx` - Menús de navegación
- `breadcrumb.tsx` - Migajas de pan
- `menubar.tsx` - Barra de menú
- `tabs.tsx` - Pestañas/Tabs
- `pagination.tsx` - Paginación
- `sidebar.tsx` - Barra lateral

**Overlay/Modales:**
- `dialog.tsx` - Diálogos/Modales
- `alert-dialog.tsx` - Diálogos de confirmación
- `sheet.tsx` - Paneles laterales deslizantes
- `drawer.tsx` - Cajones deslizantes
- `popover.tsx` - Popovers/tooltips posicionados
- `tooltip.tsx` - Tooltips simples
- `hover-card.tsx` - Tarjetas al pasar el mouse
- `context-menu.tsx` - Menús contextuales
- `dropdown-menu.tsx` - Menús desplegables

**Visualización de Datos:**
- `table.tsx` - Tablas de datos
- `card.tsx` - Tarjetas de contenido
- `badge.tsx` - Insignias/etiquetas
- `alert.tsx` - Alertas y mensajes
- `avatar.tsx` - Avatares de usuario
- `skeleton.tsx` - Esqueletos de carga
- `progress.tsx` - Barras de progreso

**Interacción:**
- `accordion.tsx` - Acordeones expansibles
- `collapsible.tsx` - Contenido colapsable
- `command.tsx` - Paleta de comandos (Cmd+K)
- `calendar.tsx` - Selector de calendario
- `carousel.tsx` - Carrusel de imágenes
- `scroll-area.tsx` - Áreas con scroll personalizado
- `resizable.tsx` - Paneles redimensionables
- `aspect-ratio.tsx` - Contenedores con aspect ratio
- `separator.tsx` - Separadores visuales
- `toggle.tsx` - Botones de alternancia
- `toggle-group.tsx` - Grupos de toggles

**Gráficos:**
- `chart.tsx` - Componentes para gráficos (integración con Recharts)

**Notificaciones:**
- `sonner.tsx` - Toast notifications

**Utilidades:**
- `use-mobile.ts` - Hook para detectar dispositivos móviles
- `utils.ts` - Utilidades de clases CSS (cn helper)

#### Características de shadcn/ui
- ✅ Componentes accesibles (WAI-ARIA)
- ✅ Totalmente personalizables
- ✅ Copy-paste friendly (no es una librería instalada)
- ✅ Usa Radix UI primitives internamente
- ✅ Integrado con Tailwind CSS
- ✅ TypeScript first

---

## 🎨 Iconografía

### 4. **Lucide React**

**Package:** `lucide-react`  
**Versión:** Última estable  
**Tipo:** Librería de iconos SVG

#### Iconos Utilizados en el Proyecto (70+ iconos)

**Médicos/Salud:**
- `Stethoscope` - Estetoscopio (médicos)
- `Pill` - Píldora (medicamentos)
- `Syringe` - Jeringa
- `Bandage` - Vendaje
- `Activity` - Actividad vital
- `Heart` - Corazón
- `Thermometer` - Termómetro

**Navegación:**
- `Home` - Inicio
- `Menu` - Menú hamburguesa
- `ChevronDown`, `ChevronUp`, `ChevronLeft`, `ChevronRight` - Flechas
- `ArrowLeft`, `ArrowRight` - Flechas direccionales
- `MoreVertical`, `MoreHorizontal` - Más opciones

**Acciones:**
- `Plus` - Agregar
- `Edit`, `Edit2`, `Edit3` - Editar
- `Trash2` - Eliminar
- `Save` - Guardar
- `Download` - Descargar
- `Upload` - Subir
- `Copy` - Copiar
- `Check`, `CheckCircle2` - Confirmar
- `X` - Cerrar
- `Send` - Enviar
- `Printer` - Imprimir
- `FileText` - Documento
- `Eye`, `EyeOff` - Mostrar/Ocultar

**Usuario/Perfil:**
- `User`, `UserPlus` - Usuario
- `Users` - Múltiples usuarios
- `Shield`, `ShieldCheck`, `ShieldAlert` - Seguridad
- `Lock`, `Unlock` - Bloquear/Desbloquear
- `Key`, `KeyRound` - Llaves
- `Fingerprint` - Huella digital

**Comunicación:**
- `Mail` - Correo
- `Phone` - Teléfono
- `Smartphone` - Teléfono móvil
- `MessageSquare` - Mensaje
- `Bell`, `BellRing` - Notificaciones

**Estado/Alerta:**
- `AlertCircle` - Alerta/Info
- `AlertTriangle` - Advertencia
- `Info` - Información
- `CheckCircle2` - Éxito
- `XCircle` - Error
- `HelpCircle` - Ayuda

**Archivos:**
- `FileText` - Documento de texto
- `FileEdit` - Editar archivo
- `FileCheck` - Archivo verificado
- `FileWarning` - Archivo con advertencia
- `Files` - Múltiples archivos
- `Folder` - Carpeta

**Búsqueda/Filtros:**
- `Search` - Búsqueda
- `Filter`, `FilterX` - Filtros
- `SlidersHorizontal` - Ajustes

**Tiempo:**
- `Clock` - Reloj
- `Calendar` - Calendario
- `History` - Historial

**Ubicación:**
- `MapPin` - Marcador de mapa
- `Navigation` - Navegación/GPS
- `Globe` - Globo terráqueo

**Edificios:**
- `Building2` - Edificio
- `Hospital` - Hospital
- `Package` - Paquete

**Gráficos:**
- `BarChart3` - Gráfico de barras
- `LineChart` - Gráfico de líneas
- `PieChart` - Gráfico circular
- `TrendingUp` - Tendencia ascendente

**Configuración:**
- `Settings` - Configuración
- `Cog` - Engranaje
- `Wrench` - Llave inglesa

**Otros:**
- `Star` - Estrella
- `Award` - Premio
- `Loader2` - Cargando (animado)
- `QrCode` - Código QR
- `Scan` - Escanear
- `RefreshCw` - Refrescar
- `LogOut` - Cerrar sesión

#### Uso de Lucide
```tsx
import { Pill, User, Settings } from "lucide-react";

// En componente
<Pill className="w-5 h-5 text-primary" />
<User className="w-6 h-6" />
```

---

## 📊 Gráficos y Visualización

### 5. **Recharts**

**Package:** `recharts`  
**Uso:** Gráficos y visualización de datos

#### Componentes Utilizados
- `LineChart` - Gráficos de líneas
- `BarChart` - Gráficos de barras
- `PieChart` - Gráficos circulares
- `AreaChart` - Gráficos de área
- `CartesianGrid` - Cuadrícula
- `XAxis`, `YAxis` - Ejes
- `Tooltip` - Tooltips en gráficos
- `Legend` - Leyenda
- `ResponsiveContainer` - Contenedor responsive

#### Ejemplos de Uso
- Dashboard: Estadísticas de prescripciones
- Reportes: Actividad por médico/farmacia
- Analítica: Tendencias de medicamentos

---

## 🎬 Animaciones

### 6. **Motion (Framer Motion)**

**Package:** `motion/react`  
**Anteriormente:** `framer-motion`  
**Uso:** Animaciones y transiciones

#### Import
```tsx
import { motion } from "motion/react";
```

#### Características Usadas
- Animaciones de entrada/salida
- Transiciones suaves
- Gestos y drag & drop
- Layout animations
- Variants para animaciones complejas

---

## 📝 Formularios

### 7. **React Hook Form**

**Package:** `react-hook-form@7.55.0`  
**Versión específica requerida:** 7.55.0  
**Uso:** Manejo de formularios con validación

#### Import
```tsx
import { useForm } from "react-hook-form@7.55.0";
```

#### Características
- Validación de formularios
- Control de estado de formularios
- Integración con shadcn/ui form component
- Manejo de errores
- Performance optimizado

---

## 🔔 Notificaciones

### 8. **Sonner**

**Package:** `sonner@2.0.3`  
**Versión específica requerida:** 2.0.3  
**Uso:** Toast notifications

#### Import
```tsx
import { toast } from "sonner@2.0.3";
```

#### Uso
```tsx
toast.success("Operación exitosa");
toast.error("Error al procesar");
toast.warning("Advertencia importante");
toast.info("Información relevante");
```

---

## 🗺️ Mapas

### 9. **OpenStreetMap**

**Tipo:** Servicio de mapas embebido  
**Uso:** Geolocalización y mapas interactivos

#### APIs Utilizadas
- **Nominatim API:**
  - Geocodificación (dirección → coordenadas)
  - Geocodificación inversa (coordenadas → dirección)
  - Búsqueda de ubicaciones

#### Componente Custom
- `LocationMap.tsx` - Mapa interactivo con iframe de OSM

---

## 📦 Otras Librerías

### 10. **React Slick**
**Package:** `react-slick`  
**Uso:** Carruseles de imágenes (si se necesitan)

### 11. **React Responsive Masonry**
**Package:** `react-responsive-masonry`  
**Uso:** Grids tipo Masonry (Pinterest-style)

### 12. **React DnD**
**Package:** `react-dnd`  
**Uso:** Drag and drop funcionalidad

### 13. **Popper.js**
**Package:** `popper.js`  
**Uso:** Posicionamiento de popovers y tooltips (usado por shadcn/ui)

---

## 🛠️ Utilidades y Helpers

### Archivos Propios en `/utils/`

1. **authStore.ts**
   - Manejo de autenticación
   - Mock de usuarios y sesiones
   - Verificación MFA

2. **costaRicaData.ts**
   - Datos geográficos de Costa Rica
   - Provincias, cantones, distritos

3. **draftsStore.ts**
   - Almacenamiento de borradores de recetas
   - CRUD de borradores

4. **emittedPrescriptionsStore.ts**
   - Almacenamiento de recetas emitidas
   - Histórico de prescripciones

5. **drugInteractionsDatabase.ts**
   - Base de datos de interacciones medicamentosas
   - Validación de interacciones
   - Severidad de alertas

6. **interactionsHistoryStore.ts**
   - Historial de interacciones detectadas
   - Decisiones del médico

7. **externalPharmacologyAPI.ts**
   - Integración con APIs externas de farmacología
   - DrugBank, RxNorm, IDIS, etc.

8. **pdfGenerator.ts**
   - Generación de PDFs de recetas
   - Impresión de documentos

9. **exportUtils.ts**
   - Exportación a CSV, Excel
   - Utilidades de exportación

10. **emailValidation.ts**
    - Validación de emails
    - Detección de emails desechables

11. **searchUtils.ts**
    - Búsqueda normalizada (sin tildes/mayúsculas)
    - Utilidades de búsqueda

12. **usePagination.ts**
    - Hook custom para paginación
    - Manejo de tablas paginadas

---

## 🎨 Sistema de Diseño

### Paleta de Colores Médica

**Colores Principales:**
- `#2b6cb0` - Medical Blue (Primary)
- `#e6f3ff` - Light Medical Blue (Secondary)
- `#059669` - Medical Green (Success)
- `#d97706` - Medical Orange (Warning)
- `#dc2626` - Medical Red (Destructive/Alerts)

**Colores de Fondo:**
- `#fafbfc` - Background principal
- `#ffffff` - Cards y elementos
- `#f1f5f9` - Muted backgrounds

**Colores de Texto:**
- `#1a202c` - Texto principal
- `#64748b` - Texto secundario/muted

**Bordes:**
- `#e2e8f0` - Bordes suaves

### Tipografía

**Sistema Base:**
```css
h1: 2rem (32px) - font-weight: 500
h2: 1.5rem (24px) - font-weight: 500
h3: 1.25rem (20px) - font-weight: 500
h4: 1rem (16px) - font-weight: 500
p: 1rem (16px) - font-weight: 400
label: 1rem (16px) - font-weight: 500
button: 1rem (16px) - font-weight: 500
input: 1rem (16px) - font-weight: 400
```

**Font Stack:**
```css
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
"Helvetica Neue", Arial, sans-serif
```

### Border Radius

```css
--radius: 0.5rem (8px)
--radius-sm: calc(var(--radius) - 4px) = 4px
--radius-md: calc(var(--radius) - 2px) = 6px
--radius-lg: var(--radius) = 8px
--radius-xl: calc(var(--radius) + 4px) = 12px
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Estrategia Mobile-First
- Diseño base para móvil
- Adaptaciones progresivas con breakpoints
- Componentes responsive nativos

---

## 🔒 Seguridad y Cumplimiento

### Estándares Implementados

1. **HL7 FHIR**
   - Formato de datos de salud
   - Interoperabilidad

2. **FDA 21 CFR Part 11**
   - Firmas electrónicas
   - Registros electrónicos

3. **OMS (WHO)**
   - Directrices de prescripción electrónica
   - Buenas prácticas

### Funcionalidades de Seguridad
- Autenticación multifactor (MFA)
- Firma digital BCCR (GAUDI)
- Gestión de sesiones
- Auditoría completa
- Validación de interacciones medicamentosas

---

## 📋 Estructura de Archivos

### Organización del Proyecto

```
/
├── App.tsx                    # Punto de entrada principal
├── components/                # Componentes reutilizables
│   ├── ui/                   # shadcn/ui components
│   ├── figma/                # Componentes de Figma
│   └── [otros]               # Componentes específicos
├── pages/                     # Páginas de la aplicación
├── utils/                     # Utilidades y helpers
├── styles/                    # Estilos globales
│   └── globals.css           # Tailwind + Variables CSS
└── guidelines/               # Documentación
```

---

## 🚀 Build y Desarrollo

### Scripts Típicos
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Bundler
- **Vite** - Build tool rápido y moderno

---

## 📊 Características del Sistema

### Módulos Principales (14)

1. **Prescripciones** (6 páginas)
2. **Dispensación** (3 páginas)
3. **Pacientes** (3 páginas)
4. **Médicos** (2 páginas)
5. **Farmacia e Inventario** (6 páginas)
6. **Talonarios** (2 páginas)
7. **Alertas Clínicas** (4 páginas)
8. **Firma y Verificación** (4 páginas)
9. **Reportes y Analítica** (3 páginas)
10. **Interoperabilidad** (4 páginas)
11. **Seguridad y Usuarios** (7 páginas)
12. **Auditoría** (1 página)
13. **Catálogos Clínicos** (7 páginas)
14. **Configuración** (3 páginas)

**Total:** 60+ páginas funcionales

---

## 🎯 Mejores Prácticas Implementadas

### Código
- ✅ TypeScript para type safety
- ✅ Componentes funcionales con Hooks
- ✅ Separación de concerns (components/pages/utils)
- ✅ Props typing completo
- ✅ Custom hooks reutilizables

### Estilos
- ✅ Tailwind para utility-first CSS
- ✅ CSS Variables para tematización
- ✅ Modo oscuro completo
- ✅ Mobile-first responsive

### UX
- ✅ Búsquedas normalizadas (sin tildes/mayúsculas)
- ✅ Paginación en todos los listados
- ✅ Exportación múltiple (PDF, CSV, Excel)
- ✅ Mensajes de confirmación
- ✅ Feedback visual (toast, loading states)

### Accesibilidad
- ✅ Componentes accesibles (WAI-ARIA)
- ✅ Navegación por teclado
- ✅ Labels semánticos
- ✅ Contraste de colores adecuado

---

## 📖 Recursos y Documentación

### Documentación Interna
- `IMPLEMENTATION_GUIDE.md` - Guía de implementación
- `DRUG_INTERACTIONS_GUIDE.md` - Interacciones medicamentosas
- `AUTH_MFA_GUIDE.md` - Autenticación y MFA
- `EXPORTACION_PDF_GUIDE.md` - Exportación a PDF
- `HOMOLOGACION_REGISTRO_USUARIOS.md` - Registro de usuarios

### Enlaces Externos
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Recharts](https://recharts.org)
- [React Hook Form](https://react-hook-form.com)
- [Sonner](https://sonner.emilkowal.ski)

---

## 🔄 Versiones Específicas Requeridas

**Importante:** Estas librerías requieren versiones específicas:

```tsx
import { useForm } from "react-hook-form@7.55.0";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react"; // No framer-motion
```

---

## ✅ Checklist de Tecnologías

- [x] React 18+
- [x] TypeScript
- [x] Tailwind CSS v4.0
- [x] shadcn/ui (46 componentes)
- [x] Lucide React (70+ iconos)
- [x] Recharts (gráficos)
- [x] Motion/React (animaciones)
- [x] React Hook Form v7.55.0
- [x] Sonner v2.0.3
- [x] OpenStreetMap (mapas)
- [x] Vite (bundler)

---

**Fecha de actualización:** Octubre 2025  
**Mantenido por:** Equipo ePrescription  
**Versión del documento:** 1.0
