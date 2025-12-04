# 📊 Manual de Usuario - Módulo 1: Dashboard y Navegación

## Sistema ePrescription - Guía Completa del Dashboard

**Versión:** 1.0.0  
**Módulo:** Dashboard y Navegación  
**Roles:** Todos los usuarios

---

## 📋 Descripción General

El **Dashboard** es la página principal del sistema ePrescription. Es lo primero que verá al iniciar sesión y sirve como centro de control para acceder a todas las funcionalidades del sistema.

### ¿Qué es el Dashboard?

El Dashboard es un panel personalizado que muestra:
- 📊 **KPIs (Indicadores clave)** según su rol
- ⚡ **Acciones rápidas** para tareas frecuentes
- 📈 **Estadísticas en tiempo real**
- 💡 **Insights** y recomendaciones
- 🔔 **Notificaciones importantes**

---

## 🎯 Objetivos de Aprendizaje

Al completar este módulo, usted podrá:
- ✅ Navegar por el Dashboard con confianza
- ✅ Entender los KPIs de su rol
- ✅ Usar acciones rápidas eficientemente
- ✅ Cambiar entre roles (si aplica)
- ✅ Personalizar su vista
- ✅ Acceder a ayuda rápidamente

---

## 🖥️ Estructura del Dashboard

### Componentes Principales

```
┌─────────────────────────────────────────────────────┐
│  🏥 Logo ePrescription    [🔍 Búsqueda]  [🔔][👤]  │ ← Header
├───────────┬─────────────────────────────────────────┤
│           │  Dashboard > Inicio                     │ ← Breadcrumbs
│  📁 Menú  │                                         │
│  Lateral  │  ┌──────────────────────────────────┐  │
│           │  │  Ver como: [Médico ▼]            │  │ ← Selector Rol
│  • Inicio │  └──────────────────────────────────┘  │
│  • Pres   │                                         │
│  • Disp   │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  • Pac    │  │ KPI │ │ KPI │ │ KPI │ │ KPI │    │ ← KPIs
│  • ...    │  │ #1  │ │ #2  │ │ #3  │ │ #4  │    │
│           │  └─────┘ └─────┘ └─────┘ └─────┘    │
│           │                                         │
│           │  🚀 Acciones Rápidas                   │ ← Acciones
│           │  [Nueva Receta] [Ver Pacientes] ...    │
│           │                                         │
│           │  💡 Insights del sistema                │ ← Insights
│           │  • Recetas pendientes de firma: 3      │
│           │  • Stock bajo en 2 medicamentos        │
└───────────┴─────────────────────────────────────────┘
```

---

## 📝 Paso a Paso: Primer Uso

### 1. Inicio de Sesión

**🎯 Objetivo:** Acceder al sistema por primera vez

**Paso a paso:**

1. **Abrir el navegador web**
   - Chrome, Firefox, Safari o Edge
   - Versión actualizada recomendada

2. **Ingresar a la URL**
   ```
   https://eprescription.hospital.com
   ```

3. **Pantalla de login**
   - Verá el logo de ePrescription
   - Formulario de inicio de sesión

4. **Ingresar credenciales**
   - **Usuario:** Su nombre de usuario (ej: `juan.perez`)
   - **Contraseña:** Su contraseña personal
   - Marcar "Recordarme" si es dispositivo personal

5. **Click en "Iniciar sesión"**

6. **Autenticación de dos factores (2FA)** *(si está habilitado)*
   - Abrir aplicación de autenticación (Google Authenticator, Authy)
   - Ingresar código de 6 dígitos
   - Click en "Verificar"

7. **Seleccionar rol** *(si tiene múltiples roles)*
   - Se mostrará lista de roles asignados
   - Seleccionar rol principal
   - Click en "Continuar"

✅ **Resultado:** Verá el Dashboard principal

💡 **Consejo:** Active 2FA en "Mi Perfil" para mayor seguridad

---

### 2. Entender el Header (Barra Superior)

El header contiene herramientas de acceso rápido:

#### A. Logo y Nombre del Sistema
```
🏥 ePrescription
```
- Click en el logo → Volver al Dashboard desde cualquier página

#### B. Búsqueda Rápida
```
[🔍 Buscar paciente, receta, medicamento...]
```

**¿Qué puedo buscar?**
- Pacientes (por nombre, cédula, código)
- Recetas (por número, código)
- Medicamentos (por nombre, principio activo)
- Médicos (por nombre, cédula)

**Cómo usar:**
1. Click en el campo de búsqueda
2. Escribir término (mínimo 3 caracteres)
3. Aparecen resultados en tiempo real
4. Click en resultado para ir directo

💡 **Consejo:** Use atajos de teclado `Ctrl+K` para búsqueda rápida

#### C. Notificaciones
```
[🔔] (con badge si hay no leídas)
```

**Click en la campana:**
- Ver últimas 5 notificaciones
- Marcar como leída
- Ir a "Ver todas"

**Tipos de notificaciones:**
- 🔴 Urgentes (requieren acción inmediata)
- 🟡 Importantes (requieren atención)
- 🔵 Informativas (FYI)

#### D. Perfil de Usuario
```
[👤 Dr. Juan Pérez ▼]
```

**Click en tu nombre:**
- 👤 Mi perfil
- 🔔 Notificaciones
- ⚙️ Configuración
- 🚪 Cerrar sesión

---

### 3. Navegar por el Menú Lateral (Sidebar)

El menú lateral contiene todos los módulos del sistema organizados jerárquicamente.

#### Estructura del Menú

```
📊 Dashboard
💊 Prescripciones
   • Nueva receta
   • Mis borradores
   • Recetas emitidas
   • Buscar receta
   • Duplicar receta
   • Centros médicos
🏥 Dispensación
   • Verificar receta
   • Registrar dispensación
   • Rechazos y motivos
👥 Pacientes
   • Listado de pacientes
   • Perfil del paciente
   • Recetas del paciente
... (más módulos)
```

**Cómo navegar:**

1. **Expandir/Contraer secciones**
   - Click en el nombre del módulo
   - Se muestra/oculta el submenú
   - Ícono `▼` indica expandido, `▶` contraído

2. **Seleccionar opción**
   - Click en opción del submenú
   - La página cambia al módulo seleccionado
   - El menú permanece visible

3. **Minimizar sidebar**
   - Click en ícono `☰` (hamburguesa)
   - Solo se muestran íconos
   - Pasar mouse para ver nombres

💡 **Consejo:** Solo verá módulos permitidos para su rol

---

### 4. Selector de Rol Multi-Rol

**🎯 Objetivo:** Cambiar entre roles asignados

Si tiene múltiples roles (ej: Médico + Médico Jefe), puede alternar entre ellos sin cerrar sesión.

**Ubicación:**
```
Dashboard > Ver como: [Médico ▼]
```

**Paso a paso:**

1. **Ir al Dashboard** (página de inicio)

2. **Localizar selector "Ver como:"**
   - Está debajo del header
   - Muestra rol actual

3. **Click en el selector**
   - Se despliega lista de roles disponibles
   - Roles con badge de color

4. **Seleccionar nuevo rol**
   - Click en el rol deseado
   - Ejemplo: Cambiar de "Médico" a "Médico Jefe"

5. **El sistema recarga automáticamente**
   - KPIs cambian según nuevo rol
   - Acciones rápidas se actualizan
   - Insights son diferentes

✅ **Resultado:** Dashboard muestra información del nuevo rol

**Ejemplo:**
```
Rol: Médico
KPIs: 
- Recetas emitidas hoy: 12
- Pacientes atendidos: 8
- Borradores guardados: 2

Cambio a: Médico Jefe
KPIs:
- Recetas del equipo: 45
- Médicos activos: 8
- Recetas sin firmar: 3
```

⚠️ **Advertencia:** El cambio de rol es temporal. Al cerrar sesión, volverá a su rol principal.

---

## 📊 KPIs por Rol

### Médico

Cuando inicia sesión como **Médico**, verá:

```
┌─────────────────────────┐  ┌─────────────────────────┐
│ 📝 Recetas Emitidas Hoy │  │ 👥 Pacientes Atendidos  │
│         12              │  │         8               │
└─────────────────────────┘  └─────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│ 📋 Borradores Guardados │  │ ⏱️ Tiempo Promedio      │
│         2               │  │     8.5 min/receta      │
└─────────────────────────┘  └─────────────────────────┘
```

**Acciones rápidas:**
- 🆕 Nueva receta
- 📋 Ver mis borradores
- 👥 Buscar paciente
- 📊 Mis estadísticas

**Insights:**
- ✅ Has completado 12 recetas hoy
- ⚠️ Tienes 2 borradores sin finalizar
- 💡 Tu tiempo promedio es óptimo

---

### Farmacéutico

Cuando inicia sesión como **Farmacéutico**, verá:

```
┌─────────────────────────┐  ┌─────────────────────────┐
│ ✅ Dispensadas Hoy      │  │ ⏳ Pendientes          │
│         28              │  │         3               │
└─────────────────────────┘  └─────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│ 📦 Stock Bajo           │  │ ❌ Rechazos Hoy        │
│         5 items         │  │         1               │
└─────────────────────────┘  └─────────────────────────┘
```

**Acciones rápidas:**
- 🔍 Verificar receta
- ✅ Registrar dispensación
- 📦 Consultar stock
- ⚠️ Ver alertas de stock

**Insights:**
- ✅ Eficiencia de dispensación: 93%
- ⚠️ 5 medicamentos con stock bajo
- 💡 Solicitar reposición de Paracetamol

---

### Administrador

Cuando inicia sesión como **Administrador**, verá:

```
┌─────────────────────────┐  ┌─────────────────────────┐
│ 👥 Usuarios Activos     │  │ 📊 Recetas del Día     │
│         124             │  │         156             │
└─────────────────────────┘  └─────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│ 🔐 Sesiones Activas     │  │ 📝 Logs de Auditoría   │
│         87              │  │     1,247 eventos       │
└─────────────────────────┘  └─────────────────────────┘
```

**Acciones rápidas:**
- 👤 Gestionar usuarios
- 📈 Ver reportes
- 🔐 Revisar auditoría
- ⚙️ Configuración

**Insights:**
- ✅ Sistema funcionando óptimamente
- ⚠️ 3 usuarios pendientes de aprobación
- 💡 Revisar logs de seguridad

---

### Enfermera

Cuando inicia sesión como **Enfermera**, verá:

```
┌─────────────────────────┐  ┌─────────────────────────┐
│ 👥 Pacientes Hoy        │  │ 💊 Medicamentos Admin.  │
│         15              │  │         42              │
└─────────────────────────┘  └─────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│ ⚠️ Alertas Clínicas     │  │ 📋 Tareas Pendientes   │
│         2               │  │         5               │
└─────────────────────────┘  └─────────────────────────┘
```

**Acciones rápidas:**
- 👥 Ver pacientes
- 💊 Consultar recetas
- ⚠️ Ver alertas
- 📋 Mis tareas

**Insights:**
- ✅ 15 pacientes atendidos hoy
- ⚠️ 2 alertas de alergias activas
- 💡 5 tareas pendientes de completar

---

## 🚀 Acciones Rápidas

Las **acciones rápidas** son botones que le permiten realizar tareas frecuentes con un solo click.

### Acciones por Rol

#### Médico
```
[🆕 Nueva Receta]  [📋 Mis Borradores]  [👥 Pacientes]
[📊 Estadísticas]  [🔍 Buscar Receta]   [📖 Ayuda]
```

#### Farmacéutico
```
[🔍 Verificar]  [✅ Dispensar]  [📦 Stock]
[⚠️ Alertas]    [📋 Rechazos]   [📊 Reportes]
```

#### Administrador
```
[👤 Usuarios]  [📈 Reportes]  [🔐 Auditoría]
[⚙️ Config]    [📚 Catálogos]  [🔔 Notifs]
```

**Cómo usar:**
1. Identificar acción deseada
2. Click en botón
3. Se abre página/diálogo correspondiente

💡 **Consejo:** Las acciones rápidas están ordenadas por frecuencia de uso

---

## 💡 Insights del Sistema

Los **insights** son recomendaciones inteligentes basadas en su actividad.

### Tipos de Insights

#### ✅ Éxito
```
✅ Has completado 12 recetas hoy
   ¡Excelente productividad!
```

#### ⚠️ Advertencia
```
⚠️ Tienes 3 recetas sin firmar
   [Ir a firmar] →
```

#### 📊 Estadística
```
📊 Tu tiempo promedio de prescripción es 8.5 min
   23% mejor que el promedio del hospital
```

#### 💡 Recomendación
```
💡 5 medicamentos con stock bajo
   Considera solicitar reposición de:
   • Paracetamol 500mg
   • Amoxicilina 500mg
   [Ver detalles] →
```

**Cómo usar los insights:**
1. Leer el mensaje
2. Si hay acción sugerida, click en botón
3. Se abre la página relevante
4. Puede descartar insight si ya lo atendió

---

## 🔔 Sistema de Notificaciones

### Tipos de Notificaciones

| Tipo | Ícono | Color | Prioridad |
|------|-------|-------|-----------|
| Urgente | 🔴 | Rojo | Alta - Requiere acción inmediata |
| Importante | 🟡 | Amarillo | Media - Requiere atención |
| Informativa | 🔵 | Azul | Baja - Para su conocimiento |
| Éxito | 🟢 | Verde | Info - Confirmación |

### Panel de Notificaciones

**Acceso:**
- Click en campana 🔔 en header
- O ir a menú → Notificaciones

**Funciones:**
```
📬 Notificaciones (3 no leídas)

🔴 Urgente - Stock crítico: Insulina
   Hace 5 minutos
   [Marcar leída] [Ir a inventario]

🟡 Receta pendiente de firma #12345
   Hace 1 hora
   [Ver receta]

🔵 Nueva actualización del sistema
   Hace 3 horas
   [Leer más]

[Ver todas] [Marcar todas como leídas]
```

**Interacciones:**
1. **Marcar como leída:** Click en ✓
2. **Ir a detalle:** Click en el título
3. **Archivar:** Click en 🗑️
4. **Configurar:** Click en ⚙️

---

## 🎨 Personalización del Dashboard

### Cambiar Idioma
```
Menú → Mi Perfil → Preferencias → Idioma
Opciones: Español | English | Português
```

### Modo Oscuro/Claro
```
Header → 👤 → Configuración → Tema
Opciones: Claro | Oscuro | Auto
```

### Orden de Widgets
1. Pasar mouse sobre KPI
2. Aparece ícono ⋮⋮
3. Arrastrar y soltar en nueva posición
4. Cambios se guardan automáticamente

### Ocultar/Mostrar Secciones
```
Dashboard → ⚙️ (esquina superior derecha)
✓ KPIs
✓ Acciones rápidas
✓ Insights
✗ Gráficos (oculto)
```

---

## ⌨️ Atajos de Teclado

### Navegación General
| Atajo | Acción |
|-------|--------|
| `Alt+D` | Ir a Dashboard |
| `Ctrl+K` | Búsqueda rápida |
| `F1` | Ayuda |
| `Alt+N` | Notificaciones |
| `Alt+P` | Mi perfil |

### Médicos
| Atajo | Acción |
|-------|--------|
| `Ctrl+N` | Nueva receta |
| `Ctrl+B` | Mis borradores |
| `Ctrl+E` | Recetas emitidas |

### Farmacéuticos
| Atajo | Acción |
|-------|--------|
| `Ctrl+V` | Verificar receta |
| `Ctrl+D` | Registrar dispensación |
| `Ctrl+I` | Consultar inventario |

💡 **Consejo:** Ver todos los atajos en `Ayuda → Atajos de teclado`

---

## 🔍 Búsqueda Avanzada

### Búsqueda Rápida (Header)

**Sintaxis especial:**
```
# Buscar paciente por cédula
ced:123456789

# Buscar receta por número
rec:12345

# Buscar medicamento
med:paracetamol

# Buscar médico
doc:juan perez
```

### Filtros

**Ejemplo: Buscar recetas**
```
[🔍 Buscar receta]

Filtros:
□ Por número: ___________
□ Por médico: [Seleccionar ▼]
□ Por paciente: [Seleccionar ▼]
□ Por fecha: [📅 Desde] [📅 Hasta]
□ Por estado: [✓ Todas  ○ Pendientes  ○ Dispensadas]

[Buscar] [Limpiar]
```

---

## 📱 Versión Móvil

El Dashboard es responsive y funciona en dispositivos móviles.

### Diferencias en Móvil

**Desktop:**
- Sidebar siempre visible
- KPIs en 4 columnas
- Acciones en fila horizontal

**Móvil:**
- Sidebar se contrae (☰)
- KPIs en 2 columnas
- Acciones en lista vertical

### Gestos Táctiles
- **Swipe derecha:** Abrir menú
- **Swipe izquierda:** Cerrar menú
- **Tap largo:** Opciones rápidas
- **Pull down:** Actualizar datos

---

## ❓ Preguntas Frecuentes

### ¿Por qué no veo todos los módulos?

Solo verá módulos para los que tenga permisos según su rol. Si necesita acceso adicional, contacte a su administrador.

### ¿Puedo cambiar los KPIs que se muestran?

Actualmente los KPIs están predefinidos por rol, pero puede ocultar secciones completas en Configuración.

### ¿Los datos son en tiempo real?

Sí, los KPIs se actualizan automáticamente cada 30 segundos. Puede forzar actualización haciendo click en 🔄.

### ¿Cómo vuelvo al Dashboard?

Click en el logo ePrescription en cualquier momento, o use `Alt+D`.

### ¿Puedo exportar mis estadísticas?

Sí, en Reportes → Actividad por médico → Exportar.

---

## 🎯 Casos de Uso Prácticos

### Caso 1: Dr. Juan inicia su día

**Situación:** Es lunes 8:00am, Dr. Juan inicia sesión.

**Pasos:**
1. Inicia sesión
2. Ve Dashboard con KPIs:
   - 0 recetas emitidas hoy
   - 8 pacientes en agenda
   - 2 borradores de viernes
3. Insight: "Tienes 2 borradores sin finalizar"
4. Click en "Mis borradores"
5. Completa y emite borradores
6. Regresa a Dashboard
7. Click en "Nueva receta" para primer paciente

✅ **Resultado:** Día organizado desde el inicio

---

### Caso 2: Farmacéutica Ana monitorea stock

**Situación:** Ana ve alerta de stock bajo.

**Pasos:**
1. En Dashboard ve KPI:
   - "Stock bajo: 5 items"
2. Insight: "⚠️ Solicitar reposición de Paracetamol"
3. Click en "Ver alertas de stock"
4. Revisa lista de medicamentos
5. Click en "Solicitar reposición"
6. Completa formulario
7. Envía solicitud

✅ **Resultado:** Previene quiebre de stock

---

### Caso 3: Admin revisa usuarios pendientes

**Situación:** Notificación de nuevos usuarios.

**Pasos:**
1. Campana 🔔 muestra: "3 usuarios pendientes"
2. Click en notificación
3. Va a "Aprobación de usuarios"
4. Revisa solicitudes
5. Aprueba/Rechaza según política
6. Usuarios reciben email automático

✅ **Resultado:** Usuarios activados rápidamente

---

## 🔗 Módulos Relacionados

- **Módulo 17:** [Mi Perfil](./MANUAL_17_MI_PERFIL.md) - Personalizar dashboard
- **Módulo 16:** [Notificaciones](./MANUAL_16_NOTIFICACIONES.md) - Gestionar alertas
- **Módulo 19:** [Centro de Ayuda](./MANUAL_19_CENTRO_AYUDA.md) - Soporte

---

## ✅ Checklist de Dominio

Marque cuando complete cada tarea:

**Básico:**
- [ ] Iniciar sesión exitosamente
- [ ] Entender layout del Dashboard
- [ ] Usar búsqueda rápida
- [ ] Ver notificaciones
- [ ] Navegar por el menú

**Intermedio:**
- [ ] Cambiar entre roles (multi-rol)
- [ ] Interpretar KPIs de mi rol
- [ ] Usar acciones rápidas
- [ ] Atender insights
- [ ] Personalizar vista

**Avanzado:**
- [ ] Usar atajos de teclado
- [ ] Búsqueda avanzada con filtros
- [ ] Optimizar mi flujo de trabajo
- [ ] Ayudar a colegas

---

## 📞 ¿Necesita Ayuda?

**Dentro del Dashboard:**
- Click en **"Centro de ayuda"** (menú)
- O presione **F1**

**Soporte técnico:**
- Email: soporte@eprescription.hospital.com
- Teléfono: +506 2222-3333

---

**✅ ¡Felicitaciones! Ha completado el Módulo 1**

**Próximo paso:**  
[Módulo 2: Prescripciones Médicas →](./MANUAL_02_PRESCRIPCIONES.md)

---

**Fecha de actualización:** Octubre 2025  
**Versión del documento:** 1.0.0
