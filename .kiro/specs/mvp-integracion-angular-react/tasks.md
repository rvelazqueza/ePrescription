# MVP - Integración Angular + React - Implementation Plan

## Estimaciones de Tiempo (Kiro como Agente)

**Formato:** Optimista | Realista | Pesimista

**Notas:**
- Optimista: Sin problemas, todo funciona a la primera
- Realista: Algunos problemas menores, 1-2 errores de EF Core
- Pesimista: Problemas significativos con EF Core, necesita fallback a SQL

### Resumen Ejecutivo

| Fase | Módulo | Optimista | Realista | Pesimista |
|------|--------|-----------|----------|-----------|
| 0 | BD Talonarios | 1.5 días | 2 días | 3.5 días |
| 1 | Nueva Receta | 3 días | 4.5 días | 6.5 días |
| 2 | Recetas Emitidas | 1 día | 1.5 días | 2 días |
| 3 | Dispensación | 1.5 días | 2.5 días | 3.5 días |
| 4 | Gestión | 2 días | 3 días | 4 días |
| **TOTAL** | | **9 días** | **13.5 días** | **19.5 días** |

**Recomendación:** Usar **13.5 días** como estimación realista

---

## Fase 0: Base de Datos de Talonarios (3 días)

### 0.1 Crear Tablas de Talonarios en BD

**Objetivo:** Crear PRESCRIPTION_PAD_TYPES, PRESCRIPTION_PADS, PRESCRIPTION_SLIPS en Oracle

**Tareas:**
- Conectar a Oracle en Docker
- Ejecutar SQL para crear PRESCRIPTION_PAD_TYPES
- Ejecutar SQL para crear PRESCRIPTION_PADS
- Ejecutar SQL para crear PRESCRIPTION_SLIPS
- Insertar 4 tipos de talonarios (Libre, Antimicrobianos, Psicotrópicos, Estupefacientes)
- Validar constraints y foreign keys

**Tiempo:** 4 horas
**Riesgos:** Ninguno (SQL directo)

**Validación:**
```powershell
docker exec eprescription-db sqlplus -s eprescription_user/password@XE <<EOF
SELECT COUNT(*) FROM USER_TABLES WHERE TABLE_NAME IN ('PRESCRIPTION_PAD_TYPES', 'PRESCRIPTION_PADS', 'PRESCRIPTION_SLIPS');
SELECT * FROM PRESCRIPTION_PAD_TYPES;
EOF
```

---

### 0.2 Actualizar Tabla MEDICATIONS

**Objetivo:** Agregar columna PAD_TYPE_ID a MEDICATIONS

**Tareas:**
- Ejecutar ALTER TABLE MEDICATIONS ADD PAD_TYPE_ID
- Agregar foreign key constraint
- Actualizar medicamentos existentes con PAD_TYPE_ID (NULL por defecto)
- Validar integridad referencial

**Tiempo:** 2 horas
**Riesgos:** Ninguno (SQL directo)

---

### 0.3 Crear Entidades EF Core

**Objetivo:** Crear modelos C# para nuevas tablas

**Tareas:**
- Crear clase PrescriptionPadType
- Crear clase PrescriptionPad
- Crear clase PrescriptionSlip
- Actualizar clase Medication con PAD_TYPE_ID
- Configurar relaciones en DbContext
- Validar mapeo de columnas

**Tiempo:** 3 horas
**Riesgos:** EF Core shadow properties (+1 hora si hay problemas)

**Archivos:**
- `eprescription-API/src/ePrescription.Domain/Entities/PrescriptionPadType.cs`
- `eprescription-API/src/ePrescription.Domain/Entities/PrescriptionPad.cs`
- `eprescription-API/src/ePrescription.Domain/Entities/PrescriptionSlip.cs`

---

### 0.4 Crear Migraciones EF Core

**Objetivo:** Generar migraciones para nuevas tablas

**Tareas:**
- Ejecutar `dotnet ef migrations add CreatePrescriptionPadTables`
- Revisar SQL generado
- Ejecutar `dotnet ef database update`
- Validar que tablas se crearon correctamente

**Tiempo:** 2 horas
**Riesgos:** EF Core puede generar SQL incorrecto (+2 horas si hay que corregir manualmente)

**Fallback:** Si EF Core falla, usar SQL directo

---

### 0.5 Crear Repositorios

**Objetivo:** Crear repositorios para acceso a datos

**Tareas:**
- Crear PrescriptionPadTypeRepository
- Crear PrescriptionPadRepository
- Crear PrescriptionSlipRepository
- Implementar métodos CRUD básicos
- Implementar métodos de búsqueda (GetAvailablePadsForDoctor, etc.)

**Tiempo:** 3 horas
**Riesgos:** Ninguno (código estándar)

**Archivos:**
- `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionPadRepository.cs`
- `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionSlipRepository.cs`

---

### 0.6 Crear Servicios de Talonarios

**Objetivo:** Implementar lógica de negocio para talonarios

**Tareas:**
- Crear PrescriptionPadsService
- Implementar GetAvailablePadsForDoctor()
- Implementar ValidatePadAvailability()
- Implementar DecrementPadCount()
- Implementar CreatePrescriptionSlips()
- Implementar GetAvailableSlips()

**Tiempo:** 4 horas
**Riesgos:** Lógica de negocio compleja (+1 hora si hay bugs)

**Archivos:**
- `eprescription-API/src/ePrescription.Application/Services/PrescriptionPadsService.cs`

---

### 0.7 Crear Endpoints de Talonarios

**Objetivo:** Exponer servicios de talonarios vía REST API

**Tareas:**
- Crear PrescriptionPadsController
- Implementar GET /api/prescription-pads/doctor/{doctorId}
- Implementar GET /api/prescription-pads/{padId}/validate
- Implementar POST /api/prescription-pads/{padId}/decrement
- Implementar GET /api/prescription-pads/{padId}/slips
- Agregar validación y error handling

**Tiempo:** 3 horas
**Riesgos:** Ninguno (código estándar)

**Archivos:**
- `eprescription-API/src/ePrescription.API/Controllers/PrescriptionPadsController.cs`

---

### 0.8 Crear Tests para Talonarios

**Objetivo:** Implementar tests unitarios y property-based

**Tareas:**
- Crear tests unitarios para PrescriptionPadsService
- Crear property-based tests para validación de disponibilidad
- Crear property-based tests para decremento de cantidad
- Crear tests de integración para endpoints

**Tiempo:** 4 horas (OPCIONAL - marcar con *)
**Riesgos:** Ninguno

**Archivos:**
- `eprescription-API/tests/ePrescription.Tests/Services/PrescriptionPadsServiceTests.cs`
- `eprescription-API/tests/ePrescription.Tests/Properties/PrescriptionPadPropertiesTests.cs`

---

### 0.9 Checkpoint - Validar Fase 0

**Objetivo:** Asegurar que todos los endpoints de talonarios funcionan

**Tareas:**
- Compilar código: `dotnet build`
- Rebuild Docker: `docker-compose build eprescription-api`
- Iniciar Docker: `docker-compose up -d eprescription-api`
- Probar endpoints en Swagger: `http://localhost:8000/swagger`
- Validar que GET /api/prescription-pads/doctor/{doctorId} retorna datos
- Validar que POST /api/prescription-pads/{padId}/decrement funciona

**Tiempo:** 1 hora
**Riesgos:** Errores de compilación o conexión a BD (+1 hora)

---

## Fase 1: Nueva Receta (7 días)

### 1.1 Actualizar CreateDraftCommand

**Objetivo:** Agregar validación de talonarios al crear borrador

**Tareas:**
- Actualizar CreateDraftCommand para incluir PAD_ID
- Actualizar CreateDraftCommandHandler
- Agregar validación de disponibilidad de talonario
- Agregar validación de tipo de talonario vs medicamentos
- Crear boleta (PRESCRIPTION_SLIP) al crear receta

**Tiempo:** 3 horas
**Riesgos:** Lógica de validación compleja (+1 hora)

**Archivos:**
- `eprescription-API/src/ePrescription.Application/Commands/Prescriptions/CreateDraftCommand.cs`
- `eprescription-API/src/ePrescription.Application/Commands/Prescriptions/CreateDraftCommandHandler.cs`

---

### 1.2 Actualizar IssuePrescriptionCommand

**Objetivo:** Decrementar talonario al emitir receta

**Tareas:**
- Actualizar IssuePrescriptionCommandHandler
- Agregar lógica para decrementar AVAILABLE_COUNT
- Agregar lógica para marcar PRESCRIPTION_SLIP como "used"
- Agregar validación de que talonario sigue disponible

**Tiempo:** 2 horas
**Riesgos:** Concurrencia (+1 hora si hay race conditions)

**Archivos:**
- `eprescription-API/src/ePrescription.Application/Commands/Prescriptions/IssuePrescriptionCommandHandler.cs`

---

### 1.3 Crear MedicationsService

**Objetivo:** Implementar validaciones de medicamentos y talonarios

**Tareas:**
- Crear MedicationsService
- Implementar GetMedicationsByPadType()
- Implementar ValidateMedicationPadType()
- Implementar CheckDrugInteractions()
- Implementar GetMedicationDetails()

**Tiempo:** 3 horas
**Riesgos:** Lógica de interacciones complejas (+1 hora)

**Archivos:**
- `eprescription-API/src/ePrescription.Application/Services/MedicationsService.cs`

---

### 1.4 Crear AIAssistantService

**Objetivo:** Integrar asistente de IA para sugerencias

**Tareas:**
- Crear AIAssistantService
- Implementar SuggestMedications()
- Integrar con proveedor de IA (HuggingFace/OpenAI)
- Implementar AnalyzeDrugInteractions()
- Implementar LogAnalysis()

**Tiempo:** 4 horas
**Riesgos:** Integración con IA (+2 horas si hay problemas de API)

**Archivos:**
- `eprescription-API/src/ePrescription.Application/Services/AIAssistantService.cs`

---

### 1.5 Crear Endpoints de Nueva Receta

**Objetivo:** Exponer endpoints para crear recetas

**Tareas:**
- Actualizar PrescriptionsController
- Implementar POST /api/prescriptions/draft
- Implementar POST /api/prescriptions/{id}/issue
- Agregar validación de talonarios
- Agregar error handling

**Tiempo:** 2 horas
**Riesgos:** Ninguno

**Archivos:**
- `eprescription-API/src/ePrescription.API/Controllers/PrescriptionsController.cs`

---

### 1.6 Crear Componente React - Nueva Receta

**Objetivo:** Implementar UI para crear recetas

**Tareas:**
- Crear NewPrescriptionComponent
- Crear PrescriptionPadSelectorComponent
- Crear MedicationSelectorComponent
- Crear AIAssistantComponent
- Integrar con backend

**Tiempo:** 6 horas
**Riesgos:** Complejidad de UI (+2 horas)

**Archivos:**
- `ePrescription-react/src/components/NewPrescriptionComponent.tsx`
- `ePrescription-react/src/components/PrescriptionPadSelectorComponent.tsx`
- `ePrescription-react/src/components/MedicationSelectorComponent.tsx`
- `ePrescription-react/src/components/AIAssistantComponent.tsx`

---

### 1.7 Crear Tests para Nueva Receta

**Objetivo:** Implementar tests unitarios y property-based

**Tareas:**
- Crear tests para CreateDraftCommandHandler
- Crear tests para IssuePrescriptionCommandHandler
- Crear property-based tests para validación de talonarios
- Crear tests de integración para endpoints
- Crear tests E2E para flujo completo

**Tiempo:** 5 horas (OPCIONAL - marcar con *)
**Riesgos:** Ninguno

**Archivos:**
- `eprescription-API/tests/ePrescription.Tests/Commands/CreateDraftCommandHandlerTests.cs`
- `eprescription-API/tests/ePrescription.Tests/Properties/NewPrescriptionPropertiesTests.cs`

---

### 1.8 Checkpoint - Validar Fase 1

**Objetivo:** Asegurar que Nueva Receta funciona end-to-end

**Tareas:**
- Compilar y rebuild Docker
- Probar crear borrador en Swagger
- Probar emitir receta en Swagger
- Verificar que talonario se decrementó
- Probar componente React
- Verificar que receta se guardó en BD

**Tiempo:** 1.5 horas
**Riesgos:** Errores de integración (+1 hora)

---

## Fase 2: Recetas Emitidas (2 días)

### 2.1 Crear Endpoint GET Recetas Emitidas

**Objetivo:** Obtener recetas emitidas con filtros

**Tareas:**
- Crear GetIssuedPrescriptionsQuery
- Implementar filtrado por fecha, paciente, estado
- Implementar paginación
- Agregar sorting

**Tiempo:** 2 horas
**Riesgos:** Queries complejas (+1 hora si EF Core falla)

**Archivos:**
- `eprescription-API/src/ePrescription.Application/Queries/Prescriptions/GetIssuedPrescriptionsQuery.cs`

---

### 2.2 Crear Componente React - Recetas Emitidas

**Objetivo:** Implementar UI para ver recetas emitidas

**Tareas:**
- Crear IssuedPrescriptionsComponent
- Implementar tabla con recetas
- Implementar filtros
- Implementar paginación
- Agregar botones: duplicar, anular, descargar

**Tiempo:** 4 horas
**Riesgos:** Complejidad de UI (+1 hora)

**Archivos:**
- `ePrescription-react/src/components/IssuedPrescriptionsComponent.tsx`

---

### 2.3 Crear Tests para Recetas Emitidas

**Objetivo:** Implementar tests

**Tareas:**
- Crear tests para GetIssuedPrescriptionsQuery
- Crear property-based tests para filtrado
- Crear tests de integración

**Tiempo:** 2 horas (OPCIONAL - marcar con *)
**Riesgos:** Ninguno

---

### 2.4 Checkpoint - Validar Fase 2

**Objetivo:** Asegurar que Recetas Emitidas funciona

**Tareas:**
- Probar endpoint GET en Swagger
- Probar componente React
- Verificar filtros y paginación

**Tiempo:** 0.5 horas

---

## Fase 3: Dispensación (3 días)

### 3.1 Crear DispensationService

**Objetivo:** Implementar lógica de dispensación

**Tareas:**
- Crear DispensationService
- Implementar SearchPrescriptions()
- Implementar RegisterDispensation()
- Implementar ValidateDispensationQuantities()
- Implementar CompleteDispensation()

**Tiempo:** 3 horas
**Riesgos:** Lógica de validación (+1 hora)

**Archivos:**
- `eprescription-API/src/ePrescription.Application/Services/DispensationService.cs`

---

### 3.2 Crear Endpoints de Dispensación

**Objetivo:** Exponer endpoints para dispensación

**Tareas:**
- Crear DispensationsController
- Implementar GET /api/dispensations/search
- Implementar POST /api/dispensations
- Implementar PATCH /api/dispensations/{id}/complete
- Agregar validación y error handling

**Tiempo:** 2 horas
**Riesgos:** Ninguno

**Archivos:**
- `eprescription-API/src/ePrescription.API/Controllers/DispensationsController.cs`

---

### 3.3 Crear Componente React - Dispensación

**Objetivo:** Implementar UI para registrar dispensación

**Tareas:**
- Crear DispensationComponent
- Implementar búsqueda de recetas
- Implementar selector de medicamentos
- Implementar entrada de cantidades
- Integrar con backend

**Tiempo:** 4 horas
**Riesgos:** Complejidad de UI (+1 hora)

**Archivos:**
- `ePrescription-react/src/components/DispensationComponent.tsx`

---

### 3.4 Crear Tests para Dispensación

**Objetivo:** Implementar tests

**Tareas:**
- Crear tests para DispensationService
- Crear property-based tests para validación de cantidades
- Crear tests de integración

**Tiempo:** 3 horas (OPCIONAL - marcar con *)
**Riesgos:** Ninguno

---

### 3.5 Checkpoint - Validar Fase 3

**Objetivo:** Asegurar que Dispensación funciona

**Tareas:**
- Probar endpoints en Swagger
- Probar componente React
- Verificar que prescripción cambió a "dispensed"

**Tiempo:** 0.5 horas

---

## Fase 4: Vistas de Gestión (5 días)

### 4.1 Crear Endpoints de Pacientes

**Objetivo:** Endpoints para listar y filtrar pacientes

**Tareas:**
- Crear PatientsController
- Implementar GET /api/patients
- Implementar GET /api/patients/{id}
- Implementar búsqueda y filtrado
- Implementar paginación

**Tiempo:** 2 horas
**Riesgos:** Ninguno

---

### 4.2 Crear Componentes Angular - Pacientes

**Objetivo:** Vistas para pacientes

**Tareas:**
- Actualizar PatientListComponent
- Actualizar PatientProfileComponent
- Agregar búsqueda y filtros
- Agregar paginación

**Tiempo:** 3 horas
**Riesgos:** Ninguno

---

### 4.3 Crear Endpoints de Médicos

**Objetivo:** Endpoints para listar médicos

**Tareas:**
- Crear DoctorsController
- Implementar GET /api/doctors
- Implementar GET /api/doctors/{id}
- Implementar búsqueda y filtrado por especialidad
- Implementar paginación

**Tiempo:** 2 horas
**Riesgos:** Ninguno

---

### 4.4 Crear Componentes Angular - Médicos

**Objetivo:** Vistas para médicos

**Tareas:**
- Crear DoctorListComponent
- Agregar búsqueda y filtros
- Agregar paginación

**Tiempo:** 2 horas
**Riesgos:** Ninguno

---

### 4.5 Crear Endpoints de Auditoría

**Objetivo:** Endpoints para logs de auditoría

**Tareas:**
- Crear AuditController
- Implementar GET /api/audit-logs
- Implementar filtrado por fecha, usuario, tipo
- Implementar búsqueda
- Implementar paginación

**Tiempo:** 2 horas
**Riesgos:** Queries complejas (+1 hora)

---

### 4.6 Crear Componentes Angular - Auditoría

**Objetivo:** Vistas para auditoría

**Tareas:**
- Crear AuditLogComponent
- Agregar filtros y búsqueda
- Agregar paginación
- Mostrar before/after values

**Tiempo:** 2 horas
**Riesgos:** Ninguno

---

### 4.7 Crear Endpoints de Centros y Farmacias

**Objetivo:** Endpoints para centros médicos y farmacias

**Tareas:**
- Crear MedicalCentersController
- Crear PharmaciesController
- Implementar GET endpoints
- Implementar búsqueda y filtrado
- Implementar paginación

**Tiempo:** 2 horas
**Riesgos:** Ninguno

---

### 4.8 Crear Componentes Angular - Centros y Farmacias

**Objetivo:** Vistas para centros y farmacias

**Tareas:**
- Crear MedicalCenterListComponent
- Crear PharmacyListComponent
- Agregar búsqueda y filtros
- Agregar paginación

**Tiempo:** 2 horas
**Riesgos:** Ninguno

---

### 4.9 Crear Tests para Vistas de Gestión

**Objetivo:** Implementar tests

**Tareas:**
- Crear tests para todos los controllers
- Crear property-based tests para filtrado y búsqueda
- Crear tests de integración

**Tiempo:** 4 horas (OPCIONAL - marcar con *)
**Riesgos:** Ninguno

---

### 4.10 Checkpoint - Validar Fase 4

**Objetivo:** Asegurar que todas las vistas funcionan

**Tareas:**
- Probar todos los endpoints en Swagger
- Probar todos los componentes Angular
- Verificar búsqueda, filtrado y paginación

**Tiempo:** 1 hora

---

## Resumen de Tareas

**Total de tareas:** 40+
**Tareas opcionales (tests):** 8
**Tareas críticas:** 32

**Tiempo estimado:**
- Optimista: 14.5 días (sin problemas)
- Realista: 20 días (con algunos problemas)
- Pesimista: 25 días (problemas significativos con EF Core)

**Recomendación:** Usar 20 días como estimación base


---

## Estimaciones Detalladas por Tarea (Kiro)

### Fase 0: Base de Datos de Talonarios

| Tarea | Optimista | Realista | Pesimista | Riesgo Principal |
|-------|-----------|----------|-----------|------------------|
| 0.1 Crear Tablas | 3h | 4h | 6h | SQL syntax |
| 0.2 Actualizar MEDICATIONS | 1h | 2h | 3h | FK constraints |
| 0.3 Crear Entidades EF Core | 2h | 3h | 5h | Shadow properties |
| 0.4 Crear Migraciones | 1h | 2h | 4h | EF Core SQL generation |
| 0.5 Crear Repositorios | 2h | 3h | 4h | Ninguno |
| 0.6 Crear Servicios | 3h | 4h | 5h | Lógica de negocio |
| 0.7 Crear Endpoints | 2h | 3h | 4h | Ninguno |
| 0.8 Tests (OPCIONAL) | 3h | 4h | 5h | Ninguno |
| 0.9 Checkpoint | 0.5h | 1h | 2h | Docker/BD connection |
| **Fase 0 Total** | **17.5h (2.2 días)** | **22h (2.75 días)** | **38h (4.75 días)** | |

### Fase 1: Nueva Receta

| Tarea | Optimista | Realista | Pesimista | Riesgo Principal |
|-------|-----------|----------|-----------|------------------|
| 1.1 Actualizar CreateDraftCommand | 2h | 3h | 5h | Validación compleja |
| 1.2 Actualizar IssuePrescriptionCommand | 1.5h | 2.5h | 4h | Race conditions |
| 1.3 Crear MedicationsService | 2h | 3h | 5h | Interacciones medicamentos |
| 1.4 Crear AIAssistantService | 3h | 5h | 8h | Integración IA |
| 1.5 Crear Endpoints | 1.5h | 2h | 3h | Ninguno |
| 1.6 Componente React | 4h | 6h | 8h | Complejidad UI |
| 1.7 Tests (OPCIONAL) | 4h | 5h | 6h | Ninguno |
| 1.8 Checkpoint | 1h | 1.5h | 2h | Integración |
| **Fase 1 Total** | **19h (2.4 días)** | **28.5h (3.6 días)** | **41h (5.1 días)** | |

### Fase 2: Recetas Emitidas

| Tarea | Optimista | Realista | Pesimista | Riesgo Principal |
|-------|-----------|----------|-----------|------------------|
| 2.1 Endpoint GET | 1.5h | 2h | 3h | Queries complejas |
| 2.2 Componente React | 3h | 4h | 5h | Complejidad UI |
| 2.3 Tests (OPCIONAL) | 1.5h | 2h | 2.5h | Ninguno |
| 2.4 Checkpoint | 0.5h | 0.5h | 1h | Ninguno |
| **Fase 2 Total** | **6.5h (0.8 días)** | **8.5h (1.1 días)** | **11.5h (1.4 días)** | |

### Fase 3: Dispensación

| Tarea | Optimista | Realista | Pesimista | Riesgo Principal |
|-------|-----------|----------|-----------|------------------|
| 3.1 DispensationService | 2h | 3h | 4h | Validación cantidades |
| 3.2 Endpoints | 1.5h | 2h | 3h | Ninguno |
| 3.3 Componente React | 3h | 4h | 5h | Complejidad UI |
| 3.4 Tests (OPCIONAL) | 2h | 3h | 4h | Ninguno |
| 3.5 Checkpoint | 0.5h | 0.5h | 1h | Ninguno |
| **Fase 3 Total** | **9h (1.1 días)** | **12.5h (1.6 días)** | **17h (2.1 días)** | |

### Fase 4: Vistas de Gestión

| Tarea | Optimista | Realista | Pesimista | Riesgo Principal |
|-------|-----------|----------|-----------|------------------|
| 4.1 Endpoints Pacientes | 1.5h | 2h | 3h | Ninguno |
| 4.2 Componentes Pacientes | 2h | 3h | 4h | Ninguno |
| 4.3 Endpoints Médicos | 1.5h | 2h | 3h | Ninguno |
| 4.4 Componentes Médicos | 1.5h | 2h | 3h | Ninguno |
| 4.5 Endpoints Auditoría | 1.5h | 2h | 3h | Queries complejas |
| 4.6 Componentes Auditoría | 1.5h | 2h | 3h | Ninguno |
| 4.7 Endpoints Centros/Farmacias | 1.5h | 2h | 3h | Ninguno |
| 4.8 Componentes Centros/Farmacias | 1.5h | 2h | 3h | Ninguno |
| 4.9 Tests (OPCIONAL) | 3h | 4h | 5h | Ninguno |
| 4.10 Checkpoint | 0.5h | 1h | 1.5h | Ninguno |
| **Fase 4 Total** | **16.5h (2.1 días)** | **22h (2.75 días)** | **31.5h (3.9 días)** | |

---

## Resumen Total

| Escenario | Horas | Días |
|-----------|-------|------|
| **Optimista** | 68.5h | 8.6 días |
| **Realista** | 93.5h | 11.7 días |
| **Pesimista** | 139h | 17.4 días |

**Recomendación:** Usar **11.7 días (93.5 horas)** como estimación realista

---

## Factores de Riesgo y Mitigación

### Alto Riesgo: EF Core + Oracle

**Síntomas:**
- Migraciones generan SQL incorrecto
- Shadow properties no mapeadas
- Tipos de datos incompatibles (RAW(16))

**Mitigación:**
- Usar SQL directo para operaciones complejas
- Validar migraciones antes de ejecutar
- Tener scripts SQL de rollback listos

**Buffer:** +2-3 horas por fase

### Medio Riesgo: Integración IA

**Síntomas:**
- API de IA no responde
- Formato de respuesta inesperado
- Latencia alta

**Mitigación:**
- Usar mock data para testing
- Implementar timeout y retry
- Tener fallback a sugerencias estáticas

**Buffer:** +2-3 horas

### Bajo Riesgo: Complejidad de UI

**Síntomas:**
- Componentes React no renderean
- Binding de datos incorrecto
- Performance issues

**Mitigación:**
- Usar componentes reutilizables
- Testing temprano
- Profiling de performance

**Buffer:** +1-2 horas por componente

---

## Estrategia de Ejecución

### Día 1-2: Fase 0 (BD)
- Crear tablas SQL
- Crear entidades EF Core
- Crear repositorios y servicios
- Validar en Docker

### Día 3-5: Fase 1 (Nueva Receta)
- Actualizar commands
- Crear servicios
- Crear endpoints
- Crear componente React
- Validar end-to-end

### Día 6: Fase 2 (Recetas Emitidas)
- Crear endpoint
- Crear componente React
- Validar

### Día 7-8: Fase 3 (Dispensación)
- Crear servicio
- Crear endpoints
- Crear componente React
- Validar

### Día 9-12: Fase 4 (Gestión)
- Crear endpoints (Pacientes, Médicos, Auditoría, Centros, Farmacias)
- Crear componentes Angular
- Validar

### Día 13: Buffer y Fixes
- Resolver problemas encontrados
- Optimizar performance
- Documentar

---

## Checkpoints Críticos

1. **Después de Fase 0:** Validar que endpoints de talonarios funcionan
2. **Después de Fase 1:** Validar que Nueva Receta funciona end-to-end
3. **Después de Fase 2:** Validar que Recetas Emitidas funciona
4. **Después de Fase 3:** Validar que Dispensación funciona
5. **Después de Fase 4:** Validar que todas las vistas funcionan

Cada checkpoint incluye:
- Compilación exitosa
- Docker rebuild exitoso
- Endpoints respondiendo en Swagger
- Componentes renderean correctamente
- Datos persisten en BD
