# Requirements Document

## Introduction

Este spec documenta la corrección de errores de compilación en el frontend Angular causados por referencias a servicios mock que fueron eliminados. Los componentes de farmacias, inventario, médicos y pacientes necesitan actualizarse para usar los servicios reales que consumen la API backend.

## Glossary

- **Servicio Mock**: Servicio de prueba que simula datos sin conectarse al backend real
- **Servicio Real**: Servicio que consume endpoints REST del backend API
- **Componente Deprecated**: Componente que ya no se usa en la aplicación pero se mantiene por compatibilidad
- **Angular Frontend**: Aplicación frontend en Angular ubicada en `eprescription-frontend/`

## Requirements

### Requirement 1

**User Story:** Como desarrollador, quiero que todos los componentes usen servicios reales en lugar de servicios mock, para que la aplicación compile correctamente y se conecte al backend.

#### Acceptance Criteria

1. WHEN el sistema compila THEN no debe haber errores de módulos no encontrados relacionados con servicios mock
2. WHEN un componente necesita datos THEN debe usar el servicio real correspondiente (pharmacy.service, inventory.service, doctor.service, patient.service)
3. WHEN se eliminan servicios mock THEN todos los componentes deben actualizarse para usar servicios reales
4. WHEN hay componentes deprecated THEN deben marcarse claramente y usar servicios reales o eliminarse

### Requirement 2

**User Story:** Como desarrollador, quiero que los parámetros de funciones tengan tipos explícitos, para evitar errores de TypeScript y mejorar la mantenibilidad del código.

#### Acceptance Criteria

1. WHEN una función recibe parámetros THEN todos los parámetros deben tener tipos explícitos
2. WHEN se usa un callback en subscribe THEN los parámetros del callback deben tener tipos definidos
3. WHEN TypeScript detecta tipos implícitos 'any' THEN deben corregirse con tipos apropiados
4. WHEN se corrigen tipos THEN la aplicación debe compilar sin warnings de tipos implícitos

### Requirement 3

**User Story:** Como desarrollador, quiero que los formularios reactivos manejen el estado disabled correctamente, para evitar warnings de Angular y seguir las mejores prácticas.

#### Acceptance Criteria

1. WHEN se usa un FormControl con estado disabled THEN debe configurarse en el constructor del FormControl
2. WHEN se necesita habilitar/deshabilitar un control THEN debe usarse .enable() o .disable()
3. WHEN se usa el atributo disabled en HTML con formularios reactivos THEN Angular debe mostrar un warning
4. WHEN se corrige el manejo de disabled THEN no deben aparecer warnings de Angular Forms

### Requirement 4

**User Story:** Como desarrollador, quiero que el endpoint de búsqueda de pacientes funcione correctamente, para que la aplicación pueda cargar datos de pacientes sin errores 400.

#### Acceptance Criteria

1. WHEN se llama al endpoint /api/patients/search THEN debe aceptar parámetros opcionales
2. WHEN no se proporcionan parámetros de búsqueda THEN debe devolver resultados paginados por defecto
3. WHEN el backend valida parámetros THEN debe aceptar pageSize sin otros parámetros requeridos
4. WHEN hay un error 400 THEN debe proporcionar detalles claros de validación en la respuesta
