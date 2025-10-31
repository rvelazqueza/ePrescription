# Componente de Centros Médicos

## Descripción
Este componente implementa la gestión de centros médicos y asignaciones, siguiendo el patrón de diseño establecido en la aplicación con las funcionalidades específicas solicitadas.

## Características Implementadas

### 1. Estructura de Tabs
- **Mis Asignaciones**: Muestra las asignaciones del médico a diferentes centros
- **Centros Disponibles**: Lista de centros médicos disponibles para solicitar asignación

### 2. Funcionalidades de Búsqueda
- Búsqueda rápida por texto
- Filtros avanzados por tipo, estado, etc.
- Búsqueda en tiempo real

### 3. Funcionalidad de Mayúsculas
- Botón toggle para mostrar todo el contenido de las tablas en mayúsculas
- Aplicado a todos los campos de texto relevantes

### 4. Tablas Interactivas
#### Mis Asignaciones:
- Columnas: Centro Médico, Código, Cargo, Horario, Principal, Estado, F. Solicitud, Acciones
- **Acciones homologadas**: Menú desplegable con Ver detalle y Cancelar asignación
- Estados: APROBADA, PENDIENTE, RECHAZADA
- **Doble clic** para ver detalles rápidamente
- **Texto informativo** sobre funcionalidad de doble clic

#### Centros Disponibles:
- Columnas: Nombre, Tipo, Código, Ubicación, Teléfono, Responsable, Estado, Acciones
- **Acciones homologadas**: Menú desplegable con Ver detalles y Solicitar asignación
- Tipos con colores diferenciados: Hospital, Clínica, Centro de Salud, Consultorio
- **Doble clic** para ver detalles rápidamente
- **Texto informativo** sobre funcionalidad de doble clic

### 5. Modales Implementados

#### Modal de Detalle de Asignación (Panel Lateral Derecho)
- Información completa de la asignación
- Solo informativo con botón de cerrar
- Desliza desde la derecha
- Color azul para diferenciarlo

#### Modal de Detalle de Centro Médico (Panel Lateral Derecho)
- Información completa del centro médico
- Botones de Cerrar y Solicitar asignación
- Desliza desde la derecha
- Color teal para diferenciarlo

#### Modal de Cancelar Asignación (Centrado)
- Confirmación de cancelación
- Campo obligatorio para motivo de cancelación
- Elimina el registro de la tabla al confirmar

#### Modal de Solicitar Asignación (Centrado)
- Formulario completo para solicitar asignación
- Campos: Cargo/Función, Horario, Centro Principal (checkbox), Observaciones
- Validación de campos obligatorios

### 6. Estadísticas en Dashboard
- Asignaciones Activas
- Solicitudes Pendientes  
- Centro Principal
- Centros Disponibles

### 7. Paginación y Exportación
- Paginación completa con controles
- Selector de elementos por página (10, 25, 50)
- Botón de exportar datos
- Contador de registros mostrados

### 8. Estilos y UX
- Colores consistentes con el diseño de la aplicación
- Estados visuales diferenciados por colores
- Animaciones suaves para modales
- Hover effects en tablas y botones
- Responsive design

## Archivos del Componente

- `centros.component.ts` - Lógica del componente
- `centros.component.html` - Template HTML
- `centros.component.css` - Estilos específicos
- `README.md` - Documentación

## Datos de Ejemplo

### Asignaciones
- Hospital San Juan de Dios (Principal, Aprobada)
- Clínica Bíblica (Aprobada)
- CAIS Moravia (Pendiente)

### Centros Disponibles
- Hospital San Juan de Dios
- Clínica Bíblica
- CAIS Moravia
- Consultorio Dr. Pérez

## Funcionalidades Técnicas

### Filtrado
- Filtrado en tiempo real
- Múltiples criterios de filtrado
- Reseteo de paginación al filtrar

### Gestión de Estado
- Estados reactivos para modales
- Gestión de datos de formularios
- Validaciones en tiempo real

### Interacciones
- Click handlers para todas las acciones
- Prevención de propagación de eventos
- Validaciones de formulario
- **Menús desplegables homologados** en ambas tablas
- **Doble clic** para acceso rápido a detalles
- **Texto informativo** visible sobre funcionalidad de doble clic

## Próximas Mejoras Sugeridas

1. Integración con API real
2. Notificaciones toast para acciones exitosas
3. Confirmaciones adicionales para acciones críticas
4. Filtros guardados por usuario
5. Exportación en múltiples formatos
6. Historial de cambios en asignaciones