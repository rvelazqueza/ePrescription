# Requirements Document

## Introduction

Esta funcionalidad actualiza la vista de Nueva Receta en el módulo de prescripciones para incluir un sistema completo de selección de pacientes. La nueva sección permitirá a los médicos buscar, seleccionar y gestionar pacientes antes de crear una prescripción médica, mejorando el flujo de trabajo y asegurando que todas las prescripciones estén asociadas correctamente con un paciente específico.

## Requirements

### Requirement 1

**User Story:** Como médico, quiero poder seleccionar un paciente antes de crear una prescripción, para que la receta médica esté correctamente asociada con el paciente correcto.

#### Acceptance Criteria

1. WHEN el médico accede a la vista de Nueva Receta THEN el sistema SHALL mostrar una sección de "Seleccione un paciente" después del encabezado
2. WHEN no hay paciente seleccionado THEN el sistema SHALL mostrar un mensaje indicativo y un botón "Seleccionar Paciente"
3. WHEN el médico hace clic en "Seleccionar Paciente" THEN el sistema SHALL abrir un modal de selección de pacientes
4. WHEN no hay paciente seleccionado THEN el sistema SHALL mantener deshabilitado el botón "Agregar Medicamento"

### Requirement 2

**User Story:** Como médico, quiero buscar pacientes a través de un modal con pestañas, para que pueda encontrar fácilmente tanto pacientes recientes como realizar búsquedas avanzadas.

#### Acceptance Criteria

1. WHEN se abre el modal de selección THEN el sistema SHALL mostrar dos pestañas: "Pacientes Recientes" y "Búsqueda Avanzada"
2. WHEN el médico selecciona la pestaña "Pacientes Recientes" THEN el sistema SHALL mostrar una lista de los últimos pacientes atendidos
3. WHEN el médico selecciona la pestaña "Búsqueda Avanzada" THEN el sistema SHALL mostrar un campo de búsqueda con filtros
4. WHEN el médico ingresa criterios de búsqueda THEN el sistema SHALL filtrar los pacientes en tiempo real
5. WHEN el médico encuentra un paciente THEN el sistema SHALL mostrar información básica del paciente incluyendo alergias y condiciones

### Requirement 3

**User Story:** Como médico, quiero poder crear un nuevo paciente desde el modal de selección, para que pueda registrar pacientes nuevos sin interrumpir el flujo de creación de prescripciones.

#### Acceptance Criteria

1. WHEN el modal de selección está abierto THEN el sistema SHALL mostrar un botón "Nuevo Paciente"
2. WHEN el médico hace clic en "Nuevo Paciente" THEN el sistema SHALL abrir un modal de registro de paciente
3. WHEN el médico completa el registro del nuevo paciente THEN el sistema SHALL guardar la información y seleccionar automáticamente al paciente recién creado
4. WHEN se crea un nuevo paciente THEN el sistema SHALL cerrar ambos modales y mostrar la información del paciente en la vista principal

### Requirement 4

**User Story:** Como médico, quiero ver la información completa del paciente seleccionado, para que pueda verificar los datos del paciente y considerar sus alergias y condiciones médicas al prescribir medicamentos.

#### Acceptance Criteria

1. WHEN un paciente es seleccionado THEN el sistema SHALL mostrar la información del paciente en lugar del mensaje de selección
2. WHEN se muestra la información del paciente THEN el sistema SHALL incluir nombre completo, cédula, edad, sexo y tipo de sangre
3. WHEN se muestra la información del paciente THEN el sistema SHALL mostrar una sección destacada de "Alertas médicas del paciente"
4. WHEN hay alergias conocidas THEN el sistema SHALL mostrar las alergias con iconos de advertencia
5. WHEN hay condiciones crónicas THEN el sistema SHALL mostrar las condiciones médicas actuales
6. WHEN hay medicación actual THEN el sistema SHALL mostrar los medicamentos que está tomando el paciente

### Requirement 5

**User Story:** Como médico, quiero poder cambiar el paciente seleccionado, para que pueda corregir errores de selección o crear prescripciones para diferentes pacientes.

#### Acceptance Criteria

1. WHEN un paciente está seleccionado THEN el sistema SHALL mostrar un botón "Cambiar paciente"
2. WHEN el médico hace clic en "Cambiar paciente" THEN el sistema SHALL abrir nuevamente el modal de selección de pacientes
3. WHEN se selecciona un nuevo paciente THEN el sistema SHALL reemplazar la información del paciente anterior
4. WHEN se cambia de paciente THEN el sistema SHALL mantener habilitado el botón "Agregar Medicamento"

### Requirement 6

**User Story:** Como médico, quiero que el botón de agregar medicamento esté controlado por la selección de paciente, para que no pueda agregar medicamentos sin tener un paciente asociado a la prescripción.

#### Acceptance Criteria

1. WHEN no hay paciente seleccionado THEN el sistema SHALL mantener deshabilitado el botón "Agregar Medicamento"
2. WHEN se selecciona un paciente THEN el sistema SHALL habilitar el botón "Agregar Medicamento"
3. WHEN se cambia de paciente THEN el sistema SHALL mantener habilitado el botón "Agregar Medicamento"
4. WHEN el botón está deshabilitado THEN el sistema SHALL mostrar un tooltip explicativo

### Requirement 7

**User Story:** Como desarrollador, quiero que el modal de nuevo paciente sea un componente reutilizable, para que pueda ser utilizado en otras vistas del sistema que requieran registro de pacientes.

#### Acceptance Criteria

1. WHEN se implementa el modal de nuevo paciente THEN el sistema SHALL crear un componente independiente y reutilizable
2. WHEN el componente es reutilizable THEN el sistema SHALL permitir configuración de callbacks para diferentes contextos de uso
3. WHEN se usa el componente THEN el sistema SHALL mantener consistencia en la interfaz y funcionalidad
4. WHEN se completa el registro THEN el sistema SHALL emitir eventos apropiados para que el componente padre pueda reaccionar