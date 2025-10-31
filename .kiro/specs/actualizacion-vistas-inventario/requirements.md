# Requirements Document

## Introduction

Este proyecto busca actualizar las 6 vistas de farmacia e inventario en la aplicación Angular, basándose en el diseño y funcionalidad de los archivos React `PorMigrar/pages/InventarioPage.tsx`, `PorMigrar/pages/FarmaciasPage.tsx` y `PorMigrar/pages/ConsultaInventarioPage.tsx`. El enfoque principal es mejorar la experiencia de usuario (UX) manteniendo la consistencia visual con el resto de la aplicación, especialmente homologando el estilo de tablas y componentes de información con las vistas existentes como "Buscar receta".

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema médico, quiero que las vistas de inventario tengan un diseño consistente con el resto de la aplicación, para que la experiencia de navegación sea uniforme y profesional.

#### Acceptance Criteria

1. WHEN accedo a cualquier vista de inventario THEN el diseño visual SHALL estar homologado con el estilo de la aplicación Angular existente
2. WHEN veo las tablas en las vistas de inventario THEN SHALL tener el mismo estilo que las tablas de "Buscar receta"
3. WHEN navego entre diferentes vistas de inventario THEN la experiencia visual SHALL ser consistente
4. WHEN uso la aplicación en dispositivos móviles THEN las vistas SHALL ser completamente responsivas

### Requirement 2

**User Story:** Como farmacéutico, quiero visualizar el stock de medicamentos con información clara y organizada, para que pueda gestionar eficientemente el inventario.

#### Acceptance Criteria

1. WHEN accedo a la vista de Stock THEN SHALL mostrar una tabla con todos los medicamentos del inventario
2. WHEN veo la información de stock THEN SHALL incluir: nombre del medicamento, ubicación, stock actual, mínimo/máximo, estado, días de stock, valor total y último movimiento
3. WHEN el stock está bajo o crítico THEN SHALL mostrar badges de estado con colores distintivos
4. WHEN busco medicamentos THEN SHALL poder filtrar por nombre, ID, principio activo o ubicación
5. WHEN filtro por estado o categoría THEN SHALL mostrar solo los resultados relevantes
6. WHEN hago doble clic en un medicamento THEN SHALL abrir un panel de detalles
7. WHEN veo las estadísticas THEN SHALL mostrar cards con totales por estado (adecuado, bajo, crítico, agotado, sobre stock)

### Requirement 3

**User Story:** Como farmacéutico, quiero recibir alertas claras sobre medicamentos con stock bajo, para que pueda tomar acciones preventivas antes de que se agoten.

#### Acceptance Criteria

1. WHEN accedo a la vista de Alertas THEN SHALL mostrar todas las alertas de stock bajo ordenadas por prioridad
2. WHEN veo una alerta THEN SHALL incluir: medicamento, stock actual vs mínimo, farmacia, fecha de alerta, prioridad y estado
3. WHEN una alerta es crítica THEN SHALL destacarse visualmente con colores de alta prioridad
4. WHEN filtro alertas THEN SHALL poder filtrar por prioridad, estado, farmacia y fecha
5. WHEN marco una alerta como resuelta THEN SHALL cambiar su estado y actualizar las estadísticas
6. WHEN veo las estadísticas de alertas THEN SHALL mostrar cards con alertas activas, prioridad alta, resueltas hoy y medicamentos afectados

### Requirement 4

**User Story:** Como farmacéutico, quiero revisar el historial de ajustes de stock, para que pueda hacer seguimiento a todos los movimientos de inventario.

#### Acceptance Criteria

1. WHEN accedo a la vista de Ajustes THEN SHALL mostrar una tabla con todos los movimientos de stock
2. WHEN veo un ajuste THEN SHALL incluir: fecha, tipo de movimiento, medicamento, cantidad, motivo, stock anterior/nuevo, responsable y estado
3. WHEN filtro ajustes THEN SHALL poder filtrar por tipo de movimiento, fecha, medicamento y responsable
4. WHEN veo las estadísticas THEN SHALL mostrar cards con entradas, salidas, ajustes del día y valor total de movimientos
5. WHEN un ajuste requiere aprobación THEN SHALL mostrar el estado correspondiente con badge distintivo

### Requirement 5

**User Story:** Como farmacéutico, quiero gestionar los lotes de medicamentos y sus fechas de vencimiento, para que pueda controlar la rotación de inventario y evitar pérdidas por vencimiento.

#### Acceptance Criteria

1. WHEN accedo a la vista de Lotes THEN SHALL mostrar una tabla con todos los lotes de medicamentos
2. WHEN veo un lote THEN SHALL incluir: número de lote, medicamento, proveedor, fechas de fabricación/vencimiento, cantidad inicial/restante, ubicación y estado
3. WHEN un lote está próximo a vencer THEN SHALL destacarse con colores de advertencia
4. WHEN un lote está vencido THEN SHALL marcarse claramente como expirado
5. WHEN filtro lotes THEN SHALL poder filtrar por estado, medicamento, proveedor y rango de fechas
6. WHEN veo las estadísticas THEN SHALL mostrar cards con lotes activos, próximos a vencer, vencidos y valor total

### Requirement 6

**User Story:** Como farmacéutico, quiero gestionar el registro de farmacias del sistema, para que pueda mantener actualizada la información de todas las farmacias participantes.

#### Acceptance Criteria

1. WHEN accedo a la vista de Farmacias THEN SHALL mostrar una tabla con todas las farmacias registradas
2. WHEN veo una farmacia THEN SHALL incluir: código, nombre, ubicación completa (provincia/cantón/distrito), dirección específica, teléfono, email, responsable y estado
3. WHEN filtro farmacias THEN SHALL poder filtrar por provincia, estado y buscar por texto
4. WHEN veo los detalles de una farmacia THEN SHALL mostrar información completa incluyendo horarios y observaciones
5. WHEN una farmacia está suspendida o inactiva THEN SHALL destacarse visualmente con badges distintivos
6. WHEN exporto datos THEN SHALL incluir toda la información relevante de las farmacias

### Requirement 7

**User Story:** Como farmacéutico, quiero consultar el inventario de medicamentos por farmacia, para que pueda verificar disponibilidad en diferentes ubicaciones.

#### Acceptance Criteria

1. WHEN accedo a la vista de Consulta de Inventario THEN SHALL mostrar una tabla con el stock de medicamentos por farmacia
2. WHEN veo un registro THEN SHALL incluir: medicamento, presentación, farmacia, ubicación, stock actual vs mínimo y estado
3. WHEN filtro consultas THEN SHALL poder filtrar por farmacia, nivel de stock y buscar por medicamento o ubicación
4. WHEN veo las estadísticas THEN SHALL mostrar cards con totales por nivel de stock (crítico, bajo, normal)
5. WHEN un medicamento tiene stock crítico THEN SHALL destacarse con colores de alerta
6. WHEN consulto múltiples farmacias THEN SHALL poder comparar stocks del mismo medicamento

### Requirement 8

**User Story:** Como desarrollador, quiero que las vistas utilicen los mismos datos mock de los archivos React, para que la funcionalidad sea consistente durante el desarrollo.

#### Acceptance Criteria

1. WHEN implemento las vistas de inventario THEN SHALL usar exactamente los mismos datos mock del archivo `InventarioPage.tsx`
2. WHEN implemento la vista de farmacias THEN SHALL usar los datos mock del archivo `FarmaciasPage.tsx`
3. WHEN implemento la vista de consulta THEN SHALL usar los datos mock del archivo `ConsultaInventarioPage.tsx`
4. WHEN muestro información THEN SHALL mantener la estructura de datos original de cada archivo React
5. WHEN integro los datos THEN SHALL asegurar consistencia entre las diferentes vistas

### Requirement 9

**User Story:** Como usuario, quiero que las vistas sean simples y funcionales sin animaciones complejas, para que la aplicación sea rápida y accesible.

#### Acceptance Criteria

1. WHEN navego por las vistas THEN NO SHALL incluir animaciones complejas o innecesarias
2. WHEN interactúo con elementos THEN SHALL tener transiciones suaves y mínimas
3. WHEN la aplicación carga THEN SHALL priorizar la velocidad sobre efectos visuales elaborados
4. WHEN uso la aplicación THEN SHALL mantener la accesibilidad sin depender de animaciones

### Requirement 10

**User Story:** Como usuario, quiero que las vistas mantengan la estructura de componentes existente en Angular, para que la integración sea seamless con el resto de la aplicación.

#### Acceptance Criteria

1. WHEN implemento las vistas THEN SHALL usar los componentes existentes de la aplicación Angular
2. WHEN necesito iconos THEN SHALL usar Lucide Angular como en el resto de la aplicación
3. WHEN implemento estilos THEN SHALL usar Tailwind CSS y las clases del design system existente
4. WHEN creo nuevos componentes THEN SHALL seguir la estructura y patrones establecidos
5. WHEN implemento funcionalidad THEN SHALL usar TypeScript y Angular standalone components