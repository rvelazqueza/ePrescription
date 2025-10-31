# Requirements Document

## Introduction

Este proyecto busca actualizar las vistas de perfil del paciente y recetas del paciente en la aplicación Angular, basándose en el diseño y funcionalidades mejoradas del archivo React `PorMigrar/pages/PacientesPage.tsx`. Las mejoras incluyen un diseño visual moderno, mejor organización de la información, funcionalidades adicionales como navegación directa a nueva receta, y alertas visuales para información médica crítica.

## Requirements

### Requirement 1: Actualización del Perfil del Paciente

**User Story:** Como médico, quiero ver un perfil de paciente moderno y bien organizado, para poder acceder rápidamente a toda la información relevante y navegar a funciones relacionadas.

#### Acceptance Criteria

1. WHEN accedo al perfil de un paciente THEN el sistema SHALL mostrar un header visual con gradiente azul que incluya el nombre del paciente, información básica y estadísticas
2. WHEN veo el perfil del paciente THEN el sistema SHALL mostrar cards organizadas con información personal, médica y de contacto
3. WHEN hay alergias conocidas THEN el sistema SHALL mostrar badges rojos con iconos de alerta para cada alergia
4. WHEN hay condiciones crónicas THEN el sistema SHALL mostrar badges naranjas con iconos de corazón para cada condición
5. WHEN estoy en el perfil del paciente THEN el sistema SHALL mostrar un botón "Nueva receta" prominente que redireccione a la vista de nueva receta
6. WHEN veo el perfil THEN el sistema SHALL incluir estadísticas visuales como número de recetas totales y activas
7. WHEN hay información de contacto THEN el sistema SHALL mostrar iconos apropiados (teléfono, email, ubicación) junto a cada dato

### Requirement 2: Actualización de Recetas del Paciente

**User Story:** Como médico, quiero ver el historial de recetas de un paciente de forma clara y organizada, para poder revisar tratamientos previos y tomar decisiones informadas.

#### Acceptance Criteria

1. WHEN accedo a las recetas del paciente THEN el sistema SHALL mostrar un header visual con información del paciente y estadísticas de recetas
2. WHEN veo el historial de recetas THEN el sistema SHALL mostrar cards con información resumida de cada receta incluyendo fecha, médico, medicamentos y estado
3. WHEN una receta tiene estado "Dispensada" THEN el sistema SHALL mostrar un badge verde
4. WHEN una receta tiene estado "Pendiente" THEN el sistema SHALL mostrar un badge amarillo
5. WHEN una receta está "Vencida" THEN el sistema SHALL mostrar un badge rojo
6. WHEN hay múltiples medicamentos en una receta THEN el sistema SHALL mostrar la lista de medicamentos de forma clara y legible
7. WHEN veo una receta THEN el sistema SHALL incluir botones de acción como "Ver detalles", "Reimprimir" y "Exportar"

### Requirement 3: Navegación y Funcionalidades Integradas

**User Story:** Como médico, quiero navegar fácilmente entre las diferentes vistas del paciente y acceder a funciones relacionadas, para optimizar mi flujo de trabajo.

#### Acceptance Criteria

1. WHEN estoy en el perfil del paciente THEN el sistema SHALL incluir un botón "Nueva receta" que redireccione a `/prescripciones/nueva` con el paciente preseleccionado
2. WHEN estoy en cualquier vista del paciente THEN el sistema SHALL mostrar breadcrumbs claros indicando la navegación
3. WHEN accedo a las recetas del paciente THEN el sistema SHALL incluir filtros por fecha, estado y médico
4. WHEN hay información crítica (alergias/condiciones) THEN el sistema SHALL mostrar alertas visuales prominentes
5. WHEN veo el historial médico THEN el sistema SHALL permitir exportar la información en PDF
6. WHEN interactúo con modales THEN el sistema SHALL usar los componentes de modal existentes en Angular

### Requirement 4: Diseño Visual y UX Mejorados

**User Story:** Como usuario del sistema, quiero una interfaz moderna y visualmente atractiva, para tener una mejor experiencia de uso y mayor eficiencia.

#### Acceptance Criteria

1. WHEN veo cualquier vista del paciente THEN el sistema SHALL usar un esquema de colores consistente con azules y gradientes
2. WHEN hay información importante THEN el sistema SHALL usar iconos de Lucide Angular apropiados
3. WHEN veo estadísticas THEN el sistema SHALL mostrar números grandes y destacados con iconos representativos
4. WHEN hay alertas médicas THEN el sistema SHALL usar colores distintivos (rojo para alergias, naranja para condiciones crónicas)
5. WHEN navego por las vistas THEN el sistema SHALL mantener un layout responsive que funcione en diferentes tamaños de pantalla
6. WHEN interactúo con elementos THEN el sistema SHALL proporcionar feedback visual apropiado (hover, focus, etc.)

### Requirement 5: Integración con Componentes Existentes

**User Story:** Como desarrollador, quiero reutilizar los componentes y servicios existentes en Angular, para mantener consistencia y evitar duplicación de código.

#### Acceptance Criteria

1. WHEN se necesiten modales THEN el sistema SHALL reutilizar los componentes de modal existentes en la aplicación Angular
2. WHEN se requiera navegación THEN el sistema SHALL usar el sistema de rutas existente de Angular
3. WHEN se necesiten datos de pacientes THEN el sistema SHALL usar los servicios existentes como `PatientService`
4. WHEN se requieran iconos THEN el sistema SHALL usar la biblioteca Lucide Angular ya configurada
5. WHEN se necesiten estilos THEN el sistema SHALL usar las clases de Tailwind CSS existentes
6. WHEN se implemente funcionalidad nueva THEN el sistema SHALL seguir los patrones de arquitectura establecidos en la aplicación