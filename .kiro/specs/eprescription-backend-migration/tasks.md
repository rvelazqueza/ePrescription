# Implementation Plan

## Overview
Este plan desglosa el proyecto en 17 tareas principales con subtareas específicas. Cada tarea se implementa en una rama feature separada siguiendo la estrategia de branching profesional. Se recomienda hacer commits y push frecuentes por subtarea para evitar pérdida de trabajo.

**Nota sobre Docker vs Kubernetes**:
- **Docker Compose**: Para desarrollo y pruebas locales (acceso directo con Postman y Oracle SQL Developer)
- **Kubernetes**: Solo para producción (opcional, no se implementará en este proyecto inicialmente)

**Manejo de Variables de Entorno**:
- `.env.example`: Archivo de plantilla SIN secrets (SÍ se commitea)
- `.env`: Archivo con secrets reales (en .gitignore, NO se commitea)
- Al iniciar el proyecto, copiar .env.example a .env y llenar con valores reales

## Branching Strategy

- **Rama principal**: `main` (solo código production-ready)
- **Rama de integración**: `develop` (integración de features)
- **Ramas de features**: `feature/task-N-description` (una por tarea)

**Workflow por tarea**:
1. Crear rama desde develop: `git checkout develop && git pull && git checkout -b feature/task-N-description`
2. Implementar subtareas con commits frecuentes
3. Push después de cada subtarea completada: `git push origin feature/task-N-description`
4. Al completar todas las subtareas, crear PR a develop
5. Después de merge, eliminar rama feature

---

## Task List

- [x] 1. Configurar estructura del proyecto y estrategia de branching


  - [x] 1.1 Crear estructura de carpetas (eprescription-API, eprescription-Database, docs)
  - [x] 1.2 Mover proyecto Angular existente a eprescription-frontend/
  - [x] 1.3 Crear documento de estrategia de branching (docs/BRANCHING_STRATEGY.md)
  - [x] 1.4 Configurar ramas principales (main, develop)
  - [x] 1.5 Crear README.md para cada componente principal
  - [x] 1.6 Configurar .gitignore para cada componente
  - [x] 1.7 Hacer commit y push de estructura inicial
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.9, 10.1, 10.2_
  - _Branch: feature/task-1-project-structure_


- [ ] 2. Diseñar y crear esquema de base de datos Oracle normalizado (4NF/5NF)
  - [ ] 2.1 Diseñar modelo entidad-relación completo con todas las tablas
  - [ ] 2.2 Crear usuario y esquema para Keycloak (keycloak_user, esquema KEYCLOAK)
  - [ ] 2.3 Crear tabla de catálogo CIE-10 (cie10_catalog) con índices para búsqueda
  - [ ] 2.4 Crear scripts SQL para tablas principales (patients, doctors, medical_centers, specialties)
  - [ ] 2.5 Crear scripts SQL para tablas de prescripciones (prescriptions, prescription_diagnoses con FK a CIE-10, prescription_medications)
  - [ ] 2.6 Crear scripts SQL para tablas de medicamentos (medications, administration_routes, drug_interactions)
  - [ ] 2.7 Crear scripts SQL para tablas de farmacias e inventario (pharmacies, inventory, dispensations, dispensation_items)
  - [ ] 2.8 Crear scripts SQL para tablas de seguridad (users, roles, permissions, user_roles, role_permissions)
  - [ ] 2.9 Crear scripts SQL para tablas de auditoría (audit_logs, ai_analysis_logs) - PRIORIDAD ALTA
  - [ ] 2.10 Crear tabla addresses y relaciones
  - [ ] 2.11 Definir índices, constraints, y foreign keys para integridad referencial
  - [ ] 2.12 Crear script maestro de inicialización (init.sql) que ejecute todos los scripts en orden
  - [ ] 2.13 Crear trigger para inmutabilidad de audit_logs
  - [ ] 2.14 Crear diagrama ERD del esquema completo (incluir esquema KEYCLOAK y catálogo CIE-10)
  - [ ] 2.15 Commit y push de scripts de base de datos
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.2_
  - _Branch: feature/task-2-database-schema_
  - _Commit strategy: Push después de cada grupo de tablas (2.4, 2.5, 2.6, etc.)_
  - _Estimated time: 14-18 hours_ (aumentado por catálogo CIE-10)

- [ ] 3. Crear datos mock consistentes y catálogo CIE-10 completo
  - [ ] 3.1 Importar catálogo completo de CIE-10 (puede ser desde API externa o archivo CSV/JSON)
  - [ ] 3.2 Crear script SQL para poblar cie10_catalog con códigos CIE-10 más comunes (mínimo 500 registros)
  - [ ] 3.3 Crear script SQL con datos mock para addresses (50 registros)
  - [ ] 3.4 Crear script SQL con datos mock para specialties y administration_routes
  - [ ] 3.5 Crear script SQL con datos mock para pacientes (50 registros con contactos y alergias)
  - [ ] 3.6 Crear script SQL con datos mock para médicos (30 registros con asignaciones a centros médicos)
  - [ ] 3.7 Crear script SQL con datos mock para medicamentos (100 registros)
  - [ ] 3.8 Crear script SQL con datos mock para interacciones medicamentosas (50 registros)
  - [ ] 3.9 Crear script SQL con datos mock para farmacias e inventario (20 farmacias)
  - [ ] 3.10 Crear script SQL con datos mock para prescripciones (100 registros con diagnósticos CIE-10 y medicamentos)
  - [ ] 3.11 Crear script SQL con datos mock para dispensaciones (50 registros)
  - [ ] 3.12 Crear script SQL con datos mock para usuarios, roles y permisos
  - [ ] 3.13 Crear script SQL con datos mock para audit_logs y ai_analysis_logs
  - [ ] 3.14 Crear script maestro de datos mock (seed-data.sql)
  - [ ] 3.15 Verificar integridad referencial de todos los datos mock (especialmente CIE-10)
  - [ ] 3.16 Commit y push de datos mock y catálogo CIE-10
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  - _Branch: feature/task-3-mock-data-cie10_
  - _Commit strategy: Push después de CIE-10 (3.2), después de cada grupo de datos (3.5, 3.7, 3.10, etc.)_
  - _Estimated time: 12-16 hours_ (aumentado por catálogo CIE-10)

- [ ] 4. Configurar Docker para Oracle Database (compartido con Keycloak)
  - [ ] 4.1 Crear carpeta eprescription-Database/docker con configuración
  - [ ] 4.2 Crear docker-compose.yml inicial con servicio Oracle Database
  - [ ] 4.3 Configurar volúmenes para persistencia de datos Oracle
  - [ ] 4.4 Configurar montaje de scripts de inicialización (/docker-entrypoint-initdb.d)
  - [ ] 4.5 Exponer puerto 1521 para acceso externo (Oracle SQL Developer)
  - [ ] 4.6 Configurar health check para Oracle Database
  - [ ] 4.7 Crear script de creación de usuario eprescription_user y keycloak_user
  - [ ] 4.8 Crear script de creación de esquemas (EPRESCRIPTION, KEYCLOAK)
  - [ ] 4.9 Probar inicio de Oracle con docker-compose up
  - [ ] 4.10 Verificar conexión desde Oracle SQL Developer
  - [ ] 4.11 Verificar que ambos esquemas estén creados correctamente
  - [ ] 4.12 Crear script de backup automático (backup.sh)
  - [ ] 4.13 Documentar proceso de conexión en README.md
  - [ ] 4.14 Commit y push de configuración Docker
  - _Requirements: 5.2, 5.3, 5.4, 5.8, 5.10_
  - _Branch: feature/task-4-docker-oracle_
  - _Commit strategy: Push después de configuración básica (4.5) y después de pruebas (4.11)_
  - _Estimated time: 6-8 hours_

- [ ] 5. Crear proyecto backend .NET 8 con Clean Architecture
  - [ ] 5.1 Crear solución .NET 8 (EPrescription.sln) en eprescription-API/
  - [ ] 5.2 Crear proyecto EPrescription.Domain (Class Library)
  - [ ] 5.3 Crear proyecto EPrescription.Application (Class Library)
  - [ ] 5.4 Crear proyecto EPrescription.Infrastructure (Class Library)
  - [ ] 5.5 Crear proyecto EPrescription.API (Web API)
  - [ ] 5.6 Crear proyecto EPrescription.Tests (xUnit Test Project)
  - [ ] 5.7 Configurar dependencias entre proyectos según Clean Architecture
  - [ ] 5.8 Instalar paquetes NuGet en Domain (ninguno, debe ser independiente)
  - [ ] 5.9 Instalar paquetes NuGet en Application (FluentValidation, AutoMapper, MediatR)
  - [ ] 5.10 Instalar paquetes NuGet en Infrastructure (EF Core, Oracle.EntityFrameworkCore, Serilog)
  - [ ] 5.11 Instalar paquetes NuGet en API (Swashbuckle, Serilog.AspNetCore)
  - [ ] 5.12 Configurar Program.cs básico con dependency injection y auditoría
  - [ ] 5.13 Crear estructura de carpetas en cada proyecto
  - [ ] 5.14 Crear diagrama de componentes de Clean Architecture
  - [ ] 5.15 Commit y push de estructura de proyectos
  - _Requirements: 2.1, 12.3_
  - _Branch: feature/task-5-backend-structure_
  - _Commit strategy: Push después de crear proyectos (5.6) y después de NuGet packages (5.11)_
  - _Estimated time: 4-6 hours_


- [ ] 6. Implementar entidades del dominio, EF Core y auditoría básica
  - [ ] 6.1 Crear entidades base (BaseEntity con Id, CreatedAt, UpdatedAt)
  - [ ] 6.2 Crear entidades principales (Patient, Doctor, Prescription, Medication, Pharmacy)
  - [ ] 6.3 Crear entidades de relaciones (PrescriptionDiagnosis, PrescriptionMedication, DrugInteraction)
  - [ ] 6.4 Crear entidades de seguridad (User, Role, Permission, UserRole, RolePermission)
  - [ ] 6.5 Crear entidades de auditoría (AuditLog, AIAnalysisLog) - IMPLEMENTAR PRIMERO
  - [ ] 6.6 Crear value objects (Address, PhoneNumber, MedicalLicense, Email)
  - [ ] 6.7 Crear interfaces de repositorios en Domain (IRepository<T>, IUnitOfWork, IAuditService)
  - [ ] 6.8 Crear EPrescriptionDbContext en Infrastructure
  - [ ] 6.9 Crear configuraciones de entidades con Fluent API (IEntityTypeConfiguration)
  - [ ] 6.10 Configurar relaciones entre entidades (one-to-many, many-to-many)
  - [ ] 6.11 Implementar AuditService básico en Infrastructure (para usar desde el inicio)
  - [ ] 6.12 Implementar repositorios genéricos y específicos en Infrastructure
  - [ ] 6.13 Implementar Unit of Work pattern con auditoría integrada
  - [ ] 6.14 Configurar connection string en appsettings.json
  - [ ] 6.15 Commit y push de entidades, EF Core y auditoría básica
  - _Requirements: 2.8, 2.9, 4.1, 4.2_
  - _Branch: feature/task-6-domain-entities-audit_
  - _Commit strategy: Push después de entidades de auditoría (6.5), después de value objects (6.6), y después de repositorios (6.13)_
  - _Estimated time: 12-14 hours_

- [ ] 7. Configurar Keycloak con Oracle y crear servicio de autenticación
  - [ ] 7.1 Agregar servicio Keycloak al docker-compose.yml (usando Oracle como BD)
  - [ ] 7.2 Configurar Keycloak para usar Oracle (KC_DB=oracle, esquema KEYCLOAK)
  - [ ] 7.3 Configurar health checks para Keycloak
  - [ ] 7.4 Iniciar Keycloak y verificar que use Oracle correctamente
  - [ ] 7.5 Acceder a admin console de Keycloak (localhost:8080)
  - [ ] 7.6 Crear realm "eprescription" en Keycloak
  - [ ] 7.7 Crear client "eprescription-api" con configuración confidential
  - [ ] 7.8 Crear roles en Keycloak (admin, doctor, pharmacist, patient, auditor)
  - [ ] 7.9 Crear usuarios de prueba en Keycloak con diferentes roles
  - [ ] 7.10 Verificar en Oracle SQL Developer que Keycloak creó sus tablas en esquema KEYCLOAK
  - [ ] 7.11 Crear interfaz IAuthenticationService en Application layer
  - [ ] 7.12 Implementar KeycloakAuthenticationService en Infrastructure
  - [ ] 7.13 Instalar paquetes NuGet para OAuth (Microsoft.AspNetCore.Authentication.JwtBearer)
  - [ ] 7.14 Configurar autenticación JWT en Program.cs con auditoría de login
  - [ ] 7.15 Crear middleware de autenticación personalizado con logging de auditoría
  - [ ] 7.16 Configurar appsettings.json con secciones Keycloak
  - [ ] 7.17 Crear AuthController con endpoints (login, refresh, logout) con auditoría
  - [ ] 7.18 Probar autenticación con Postman y verificar logs de auditoría
  - [ ] 7.19 Crear tests unitarios para KeycloakAuthenticationService
  - [ ] 7.20 Commit y push de autenticación Keycloak con Oracle
  - _Requirements: 2.3, 2.4, 2.5, 4.1_
  - _Branch: feature/task-7-keycloak-oracle-auth_
  - _Commit strategy: Push después de Keycloak con Oracle (7.10), después de servicio (7.12), y después de endpoints (7.17)_
  - _Estimated time: 10-12 hours_

- [ ] 8. Implementar sistema de autorización basado en roles
  - [ ] 8.1 Crear interfaz IAuthorizationService en Application layer
  - [ ] 8.2 Implementar AuthorizationService en Infrastructure
  - [ ] 8.3 Crear atributos personalizados [RequirePermission] y [RequireRole]
  - [ ] 8.4 Implementar middleware de autorización
  - [ ] 8.5 Crear endpoints para gestión de roles (/api/roles)
  - [ ] 8.6 Crear endpoints para gestión de permisos (/api/permissions)
  - [ ] 8.7 Implementar lógica de verificación de permisos en use cases
  - [ ] 8.8 Sincronizar roles de Keycloak con base de datos local
  - [ ] 8.9 Probar autorización con diferentes roles en Postman
  - [ ] 8.10 Crear tests unitarios para autorización
  - [ ] 8.11 Commit y push de sistema de autorización
  - _Requirements: 2.4_
  - _Branch: feature/task-8-authorization_
  - _Commit strategy: Push después de servicio (8.2), después de endpoints (8.6), y después de pruebas (8.9)_
  - _Estimated time: 8-10 hours_

- [ ] 9. Implementar sistema de auditoría completo
  - [ ] 9.1 Crear interfaz IAuditService en Application layer
  - [ ] 9.2 Implementar AuditService en Infrastructure layer
  - [ ] 9.3 Crear interceptor de EF Core para auditoría automática de cambios (SaveChangesInterceptor)
  - [ ] 9.4 Implementar auditoría manual para operaciones críticas (login, prescripciones)
  - [ ] 9.5 Crear AuditController con endpoints para consulta de logs
  - [ ] 9.6 Implementar filtros de búsqueda (fecha, usuario, acción, entidad)
  - [ ] 9.7 Implementar paginación para resultados de auditoría
  - [ ] 9.8 Garantizar inmutabilidad de logs (validar en servicio y trigger en BD)
  - [ ] 9.9 Implementar políticas de retención de logs (7 años)
  - [ ] 9.10 Probar logging de auditoría con operaciones CRUD
  - [ ] 9.11 Crear tests unitarios para sistema de auditoría
  - [ ] 9.12 Commit y push de sistema de auditoría completo
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - _Branch: feature/task-9-audit-system-complete_
  - _Commit strategy: Push después de servicio (9.2), después de interceptor (9.3), y después de endpoints (9.7)_
  - _Estimated time: 10-12 hours_
  - _Note: La auditoría básica ya está implementada en Task 6, esta tarea la completa_


- [ ] 10. Migrar asistente de IA con WHO API, CIE-10 y traducción (desde PorMigrar)
  - [ ] 10.1 Revisar código del asistente de IA en carpeta PorMigrar
  - [ ] 10.2 Extraer API keys (Hugging Face, WHO API) de código React (NO commitear)
  - [ ] 10.3 Revisar integración con APIs de catálogos CIE-10 en PorMigrar
  - [ ] 10.4 Documentar lógica de análisis clínico y generación de diagnósticos
  - [ ] 10.5 Crear interfaz IWHOApiService en Application layer
  - [ ] 10.6 Implementar WHOApiService en Infrastructure (OAuth 2.0, sync catalog)
  - [ ] 10.7 Configurar WHO API credentials en appsettings.json (usar User Secrets)
  - [ ] 10.8 Implementar sincronización diaria de catálogo CIE-10 desde WHO API
  - [ ] 10.9 Crear interfaz ITranslationService en Application layer
  - [ ] 10.10 Implementar TranslationService (Azure Translator o Google Cloud Translation)
  - [ ] 10.11 Configurar Translation API credentials en appsettings.json
  - [ ] 10.12 Crear interfaz ICIE10CatalogService en Application layer
  - [ ] 10.13 Implementar CIE10CatalogService (búsqueda local + WHO API fallback)
  - [ ] 10.14 Crear interfaz IAIAssistantService en Application layer
  - [ ] 10.15 Implementar HuggingFaceAIService en Infrastructure
  - [ ] 10.16 Implementar flujo de traducción: Español → Inglés → IA → Español
  - [ ] 10.17 Implementar método AnalyzeClinicalDescriptionAsync con traducción y validación CIE-10
  - [ ] 10.18 Implementar método GenerateMedicationRecommendationsAsync
  - [ ] 10.19 Implementar método CheckDrugInteractionsAsync
  - [ ] 10.20 Implementar método ValidateContraindicationsAsync
  - [ ] 10.21 Integrar CIE10CatalogService con AIAssistantService para validar códigos
  - [ ] 10.22 Configurar API key de Hugging Face en appsettings.json (usar User Secrets)
  - [ ] 10.23 Agregar todas las API keys a .env.example (sin valores reales)
  - [ ] 10.24 Agregar WHO_API_CLIENT_ID, WHO_API_CLIENT_SECRET, TRANSLATION_API_KEY a .env
  - [ ] 10.25 Implementar logging de operaciones de IA, traducción y WHO API en AIAnalysisLog
  - [ ] 10.26 Crear WHOApiController con endpoints de sincronización manual
  - [ ] 10.27 Crear CIE10Controller con endpoints de búsqueda de catálogo
  - [ ] 10.28 Crear AIAssistantController con endpoints REST
  - [ ] 10.29 Implementar manejo de errores y timeouts para todas las APIs externas
  - [ ] 10.30 Implementar retry policy con Polly para WHO API, Translation y Hugging Face
  - [ ] 10.31 Probar endpoints de IA, CIE-10, WHO API y traducción con Postman
  - [ ] 10.32 Crear tests unitarios con mocks para todos los servicios
  - [ ] 10.33 Commit y push de asistente de IA completo (SIN API keys en código)
  - _Requirements: 3.1-3.16, 13.1-13.20_
  - _Branch: feature/task-10-ai-who-translation_
  - _Commit strategy: Push después de WHO API (10.8), después de Translation (10.11), después de AI (10.21), y después de endpoints (10.28)_
  - _Estimated time: 24-28 hours_ (aumentado por WHO API y Translation Service)
  - _IMPORTANTE: Verificar que NO se incluyan API keys en commits_

- [ ] 11. Implementar endpoints REST para gestión de prescripciones
  - [ ] 11.1 Crear DTOs para prescripciones (CreatePrescriptionDto, PrescriptionDto, UpdatePrescriptionDto)
  - [ ] 11.2 Crear validadores FluentValidation para DTOs de prescripciones
  - [ ] 11.3 Crear AutoMapper profiles para mapeo Prescription <-> PrescriptionDto
  - [ ] 11.4 Implementar CreatePrescriptionCommand con MediatR handler
  - [ ] 11.5 Implementar GetPrescriptionQuery con handler
  - [ ] 11.6 Implementar UpdatePrescriptionCommand con handler
  - [ ] 11.7 Implementar DeletePrescriptionCommand con handler
  - [ ] 11.8 Implementar SearchPrescriptionsQuery con filtros y paginación
  - [ ] 11.9 Crear PrescriptionsController con endpoints CRUD
  - [ ] 11.10 Integrar auditoría en todas las operaciones de prescripciones
  - [ ] 11.11 Implementar autorización por roles en endpoints
  - [ ] 11.12 Probar endpoints con Postman (crear, leer, actualizar, eliminar)
  - [ ] 11.13 Crear tests de integración para endpoints de prescripciones
  - [ ] 11.14 Commit y push de endpoints de prescripciones
  - _Requirements: 2.2_
  - _Branch: feature/task-11-prescriptions-api_
  - _Commit strategy: Push después de DTOs y validadores (11.2), después de commands (11.7), y después de controller (11.9)_
  - _Estimated time: 12-14 hours_

- [ ] 12. Implementar endpoints REST para pacientes, médicos y farmacias
  - [ ] 12.1 Crear DTOs, validadores y mappers para pacientes
  - [ ] 12.2 Crear commands/queries y handlers para pacientes (CRUD + búsqueda)
  - [ ] 12.3 Crear PatientsController con endpoints
  - [ ] 12.4 Probar endpoints de pacientes con Postman
  - [ ] 12.5 Crear DTOs, validadores y mappers para médicos
  - [ ] 12.6 Crear commands/queries y handlers para médicos (CRUD + búsqueda por especialidad)
  - [ ] 12.7 Crear DoctorsController con endpoints
  - [ ] 12.8 Probar endpoints de médicos con Postman
  - [ ] 12.9 Crear DTOs, validadores y mappers para farmacias
  - [ ] 12.10 Crear commands/queries y handlers para farmacias (CRUD + búsqueda)
  - [ ] 12.11 Crear PharmaciesController con endpoints
  - [ ] 12.12 Probar endpoints de farmacias con Postman
  - [ ] 12.13 Implementar búsqueda avanzada con múltiples filtros
  - [ ] 12.14 Implementar paginación en todos los listados
  - [ ] 12.15 Crear tests de integración para todos los endpoints
  - [ ] 12.16 Commit y push de endpoints de pacientes, médicos y farmacias
  - _Requirements: 2.2_
  - _Branch: feature/task-12-patients-doctors-pharmacies-api_
  - _Commit strategy: Push después de pacientes (12.4), después de médicos (12.8), y después de farmacias (12.12)_
  - _Estimated time: 16-18 hours_

- [ ] 13. Implementar endpoints REST para dispensación e inventario
  - [ ] 13.1 Crear DTOs, validadores y mappers para dispensación
  - [ ] 13.2 Crear RegisterDispensationCommand con handler
  - [ ] 13.3 Crear VerifyDispensationCommand con handler
  - [ ] 13.4 Crear GetDispensationQuery con handler
  - [ ] 13.5 Crear DispensationsController con endpoints
  - [ ] 13.6 Probar endpoints de dispensación con Postman
  - [ ] 13.7 Crear DTOs, validadores y mappers para inventario
  - [ ] 13.8 Crear commands para gestión de inventario (AddStock, AdjustStock, GetInventory)
  - [ ] 13.9 Crear InventoryController con endpoints
  - [ ] 13.10 Implementar alertas de stock bajo (query)
  - [ ] 13.11 Implementar validación de lotes y fechas de vencimiento
  - [ ] 13.12 Probar endpoints de inventario con Postman
  - [ ] 13.13 Crear tests de integración para dispensación e inventario
  - [ ] 13.14 Commit y push de endpoints de dispensación e inventario
  - _Requirements: 2.2_
  - _Branch: feature/task-13-dispensation-inventory-api_
  - _Commit strategy: Push después de dispensación (13.6) y después de inventario (13.12)_
  - _Estimated time: 12-14 hours_


- [ ] 14. Configurar Docker completo para backend API
  - [ ] 14.1 Crear Dockerfile multi-stage para backend .NET 8 en eprescription-API/
  - [ ] 14.2 Optimizar imagen Docker (multi-stage build, tamaño reducido)
  - [ ] 14.3 Actualizar docker-compose.yml agregando servicio backend-api
  - [ ] 14.4 Configurar variables de entorno para backend en docker-compose
  - [ ] 14.5 Configurar dependencias entre servicios (backend depende de Oracle y Keycloak)
  - [ ] 14.6 Exponer puertos 5000 (HTTP) y 5001 (HTTPS) para acceso externo
  - [ ] 14.7 Configurar health check para backend API
  - [ ] 14.8 Configurar red Docker para comunicación entre servicios
  - [ ] 14.9 Crear archivo .env con variables de entorno (incluir .env.example sin secrets)
  - [ ] 14.10 Agregar .env a .gitignore
  - [ ] 14.11 Probar docker-compose up con todos los servicios
  - [ ] 14.12 Verificar conectividad entre servicios (backend -> Oracle, backend -> Keycloak)
  - [ ] 14.13 Probar endpoints desde Postman (http://localhost:5000)
  - [ ] 14.14 Documentar comandos Docker en README.md
  - [ ] 14.15 Commit y push de configuración Docker completa
  - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.7, 5.9_
  - _Branch: feature/task-14-docker-backend_
  - _Commit strategy: Push después de Dockerfile (14.2), después de docker-compose (14.8), y después de pruebas (14.13)_
  - _Estimated time: 6-8 hours_

- [ ] 15. Integrar frontend Angular con backend API
  - [ ] 15.1 Actualizar environment.ts con URL del backend API (http://localhost:5000)
  - [ ] 15.2 Crear HTTP interceptor para agregar JWT token a requests (auth.interceptor.ts)
  - [ ] 15.3 Crear HTTP interceptor para manejo de errores global (error.interceptor.ts)
  - [ ] 15.4 Actualizar AuthService para llamar endpoints de autenticación del backend
  - [ ] 15.5 Implementar lógica de refresh token en AuthService
  - [ ] 15.6 Actualizar guards para usar nuevo AuthService
  - [ ] 15.7 Actualizar PrescriptionService para llamar endpoints REST de prescripciones
  - [ ] 15.8 Actualizar PatientService para llamar endpoints REST de pacientes
  - [ ] 15.9 Actualizar DoctorService para llamar endpoints REST de médicos
  - [ ] 15.10 Actualizar PharmacyService para llamar endpoints REST de farmacias
  - [ ] 15.11 Actualizar InventoryService para llamar endpoints REST de inventario
  - [ ] 15.12 Actualizar DispensationService para llamar endpoints REST de dispensación
  - [ ] 15.13 Migrar componentes del asistente de IA para llamar endpoints del backend
  - [ ] 15.14 Eliminar API key de Hugging Face del frontend (si existe)
  - [ ] 15.15 Actualizar manejo de estados de carga y errores en componentes
  - [ ] 15.16 Eliminar servicios mock del frontend
  - [ ] 15.17 Probar flujos principales end-to-end (login, crear prescripción, dispensar)
  - [ ] 15.18 Realizar pruebas de integración frontend-backend
  - [ ] 15.19 Commit y push de integración frontend
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  - _Branch: feature/task-15-frontend-integration_
  - _Commit strategy: Push después de interceptors (15.3), después de servicios (15.12), y después de AI (15.14)_
  - _Estimated time: 16-20 hours_

- [ ] 16. Implementar suite de tests completa
  - [ ] 16.1 Configurar proyecto EPrescription.Domain.Tests
  - [ ] 16.2 Configurar proyecto EPrescription.Application.Tests
  - [ ] 16.3 Configurar proyecto EPrescription.Infrastructure.Tests
  - [ ] 16.4 Configurar proyecto EPrescription.API.IntegrationTests
  - [ ] 16.5 Instalar paquetes de testing (xUnit, FluentAssertions, Moq, NSubstitute)
  - [ ] 16.6 Crear tests unitarios para entidades del dominio
  - [ ] 16.7 Crear tests unitarios para value objects
  - [ ] 16.8 Crear tests unitarios para command handlers (CreatePrescription, etc.)
  - [ ] 16.9 Crear tests unitarios para query handlers
  - [ ] 16.10 Crear tests unitarios para validadores FluentValidation
  - [ ] 16.11 Crear tests unitarios para servicios (AIAssistantService, AuditService, AuthService)
  - [ ] 16.12 Crear tests unitarios para repositorios (con in-memory database)
  - [ ] 16.13 Configurar WebApplicationFactory para tests de integración
  - [ ] 16.14 Configurar Testcontainers para Oracle en tests de integración
  - [ ] 16.15 Crear tests de integración para endpoints de autenticación
  - [ ] 16.16 Crear tests de integración para endpoints de prescripciones
  - [ ] 16.17 Crear tests de integración para endpoints de pacientes, médicos, farmacias
  - [ ] 16.18 Crear tests de integración para endpoints de dispensación e inventario
  - [ ] 16.19 Crear tests de integración para flujos completos (crear prescripción -> dispensar)
  - [ ] 16.20 Configurar generación de reportes de cobertura de código (coverlet)
  - [ ] 16.21 Ejecutar todos los tests y verificar cobertura (objetivo: 80%+ en business logic)
  - [ ] 16.22 Commit y push de suite de tests
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11, 11.12_
  - _Branch: feature/task-16-testing_
  - _Commit strategy: Push después de unit tests (16.12), después de integration tests setup (16.14), y después de todos los tests (16.21)_
  - _Estimated time: 20-24 hours_


- [ ] 17. Implementar compliance con HL7 FHIR y normativas médicas
  - [ ] 17.1 Crear interfaz IFHIRService en Application layer
  - [ ] 17.2 Implementar FHIRService en Infrastructure
  - [ ] 17.3 Crear mappers de Patient a FHIR Patient resource
  - [ ] 17.4 Crear mappers de Doctor (Practitioner) a FHIR Practitioner resource
  - [ ] 17.5 Crear mappers de Prescription a FHIR MedicationRequest resource
  - [ ] 17.6 Crear mappers de Dispensation a FHIR MedicationDispense resource
  - [ ] 17.7 Crear mappers de Diagnosis a FHIR Condition resource con ICD-10 coding
  - [ ] 17.8 Implementar exportación a FHIR JSON format
  - [ ] 17.9 Implementar validación de recursos FHIR
  - [ ] 17.10 Crear FHIRController con endpoints de exportación
  - [ ] 17.11 Documentar cumplimiento con FDA 21 CFR Part 11 (audit trail, electronic signatures)
  - [ ] 17.12 Documentar cumplimiento con HL7 FHIR R4
  - [ ] 17.13 Documentar cumplimiento con OMS/WHO ICD-10
  - [ ] 17.14 Crear documento de validación del sistema (para FDA compliance)
  - [ ] 17.15 Probar exportación FHIR con Postman
  - [ ] 17.16 Crear tests unitarios para FHIR mappers
  - [ ] 17.17 Commit y push de implementación FHIR y compliance
  - _Requirements: 13.1-13.7_
  - _Branch: feature/task-17-fhir-compliance_
  - _Commit strategy: Push después de mappers (17.7), después de endpoints (17.10), y después de documentación (17.14)_
  - _Estimated time: 14-16 hours_

- [ ] 18. Crear documentación y diagramas de arquitectura
  - [ ] 18.1 Crear diagrama de arquitectura de alto nivel del sistema completo
  - [ ] 18.2 Crear diagrama ERD (Entity Relationship Diagram) de la base de datos
  - [ ] 18.3 Crear diagrama de componentes mostrando capas de Clean Architecture
  - [ ] 18.4 Crear diagrama de despliegue con Docker containers
  - [ ] 18.5 Crear diagrama de secuencia para flujo de creación de prescripción
  - [ ] 18.6 Crear diagrama de secuencia para flujo de análisis de IA con traducción
  - [ ] 18.7 Crear diagrama de secuencia para flujo de dispensación
  - [ ] 18.8 Crear diagrama de integración con WHO API y Translation Service
  - [ ] 18.9 Configurar Swagger/OpenAPI en backend API
  - [ ] 18.10 Agregar comentarios XML a controllers y DTOs para Swagger
  - [ ] 18.11 Crear README.md principal del proyecto con overview completo
  - [ ] 18.12 Actualizar README.md de eprescription-API con guía de desarrollo
  - [ ] 18.13 Actualizar README.md de eprescription-Database con guía de scripts
  - [ ] 18.14 Actualizar README.md de eprescription-frontend con guía de integración
  - [ ] 18.15 Crear guía de instalación y configuración (docs/INSTALLATION.md)
  - [ ] 18.16 Crear guía de desarrollo local con Docker (docs/DEVELOPMENT.md)
  - [ ] 18.17 Crear guía de despliegue (docs/DEPLOYMENT.md)
  - [ ] 18.18 Documentar estrategia de branching en docs/BRANCHING_STRATEGY.md
  - [ ] 18.19 Crear guía de seguridad y compliance (docs/SECURITY_COMPLIANCE.md)
  - [ ] 18.20 Documentar integración con WHO API (docs/WHO_API_INTEGRATION.md)
  - [ ] 18.21 Documentar servicio de traducción (docs/TRANSLATION_SERVICE.md)
  - [ ] 18.22 Exportar diagramas en formatos PNG, SVG y PDF
  - [ ] 18.23 Organizar diagramas en carpeta docs/architecture-diagrams/
  - [ ] 18.24 Commit y push de documentación completa
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 13.1-13.20_
  - _Branch: feature/task-18-documentation_
  - _Commit strategy: Push después de diagramas (18.8), después de Swagger (18.10), y después de documentación (18.23)_
  - _Estimated time: 14-16 hours_

---

## Notes

### Estrategia de Commits y Push

**Commits frecuentes**:
- Hacer commit después de completar cada subtarea significativa
- Usar mensajes descriptivos siguiendo Conventional Commits
- Formato: `tipo(scope): descripción`
- Tipos: feat, fix, docs, test, refactor, chore

**Push frecuente**:
- Push después de cada grupo de subtareas relacionadas (indicado en cada tarea)
- Esto previene pérdida de trabajo y facilita colaboración
- Permite detectar conflictos tempranamente

**Ejemplo de commits para Tarea 10**:
```bash
git commit -m "feat(ai): create IAIAssistantService interface"
git commit -m "feat(ai): implement HuggingFaceAIService with diagnosis analysis"
git push origin feature/task-10-ai-migration

git commit -m "feat(ai): implement medication recommendations"
git commit -m "feat(ai): implement drug interactions check"
git push origin feature/task-10-ai-migration

git commit -m "feat(ai): create AIAssistantController with REST endpoints"
git commit -m "feat(ai): add error handling and retry policy"
git push origin feature/task-10-ai-migration
```

### Manejo de Secrets y Variables de Entorno

**Archivos de variables de entorno**:
- `.env.example`: Plantilla con placeholders (SÍ se commitea al repositorio)
- `.env`: Archivo con valores reales (en .gitignore, NUNCA se commitea)

**Contenido de .env.example** (commitear este archivo):
```env
# Keycloak
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret-here

# Hugging Face API (AI Analysis)
HUGGINGFACE_API_KEY=your-huggingface-api-key-here

# WHO API (Official ICD-10 Catalog)
WHO_API_CLIENT_ID=your-who-api-client-id-here
WHO_API_CLIENT_SECRET=your-who-api-client-secret-here
WHO_API_BASE_URL=https://icd.who.int/icdapi

# Translation Service (Azure Translator or Google Cloud Translation)
TRANSLATION_API_KEY=your-translation-api-key-here
TRANSLATION_API_ENDPOINT=https://api.cognitive.microsofttranslator.com
TRANSLATION_REGION=eastus

# Oracle Database
ORACLE_PASSWORD=your-oracle-password-here
EPRESCRIPTION_DB_PASSWORD=your-db-password-here
KEYCLOAK_DB_PASSWORD=your-keycloak-db-password-here
```

**Proceso de configuración**:
1. Copiar .env.example a .env: `cp .env.example .env`
2. Editar .env y llenar con valores reales
3. .env está en .gitignore, nunca se subirá a Git

**NUNCA commitear**:
- API keys (Hugging Face, etc.)
- Passwords de base de datos
- Client secrets de Keycloak
- Tokens de acceso
- Archivo .env con valores reales

**Usar**:
- User Secrets en desarrollo (.NET): `dotnet user-secrets set "HuggingFace:ApiKey" "valor"`
- Variables de entorno en Docker (archivo .env)
- .gitignore para .env
- .env.example con placeholders (SÍ commitear)

### Merge a Develop

**Después de completar cada tarea**:
1. Asegurar que todos los tests pasen
2. Hacer push final de la rama feature
3. Crear Pull Request a develop
4. Revisar cambios
5. Merge a develop
6. Eliminar rama feature local y remota
7. Actualizar rama develop local

```bash
# Después de merge en GitHub/GitLab
git checkout develop
git pull origin develop
git branch -d feature/task-N-description
git push origin --delete feature/task-N-description
```

### Prioridades

**Tareas críticas** (deben completarse en orden):
1. Task 1: Estructura del proyecto ✅
2. Task 2: Esquema de base de datos
3. Task 4: Docker Oracle
4. Task 5: Estructura backend
5. Task 6: Entidades y EF Core
6. Task 7: Keycloak y autenticación

**Tareas que pueden paralelizarse** (después de Task 7):
- Task 8: Autorización
- Task 9: Auditoría
- Task 10: AI Migration

**Tareas finales**:
- Task 16: Testing (después de todas las features)
- Task 17: Documentación (puede ir en paralelo)

### Todas las Tareas son Requeridas

Todas las subtareas en este plan son requeridas para completar el proyecto correctamente:
- Diagramas de arquitectura: Necesarios para documentación y comprensión del sistema
- Tests unitarios e integración: Esenciales para calidad y mantenibilidad
- Documentación: Crítica para desarrollo en equipo y mantenimiento futuro

No hay subtareas opcionales. Todas deben completarse para tener un sistema production-ready.

### Docker Compose vs Kubernetes

**Docker Compose** (Implementar en este proyecto):
- Para desarrollo local
- Para pruebas con Postman y Oracle SQL Developer
- Acceso directo a puertos (1521, 5000, 8080)
- Fácil de iniciar y detener
- Configuración en docker-compose.yml

**Kubernetes** (NO implementar inicialmente):
- Solo para producción
- Requiere cluster de Kubernetes
- Configuración más compleja
- Se puede agregar en el futuro si es necesario
- No es parte del alcance actual del proyecto



---

## Estimación de Tiempo Total

### Por Tarea (Desarrollador Fullstack Senior)

- **Task 1**: Estructura del proyecto ✅ COMPLETADA
- **Task 2**: Esquema de base de datos Oracle + CIE-10 - **14-18 horas**
- **Task 3**: Datos mock + catálogo CIE-10 completo - **12-16 horas**
- **Task 4**: Docker Oracle + Keycloak - **6-8 horas**
- **Task 5**: Estructura backend .NET 8 - **4-6 horas**
- **Task 6**: Entidades, EF Core y auditoría básica - **12-14 horas**
- **Task 7**: Keycloak con Oracle + autenticación - **10-12 horas**
- **Task 8**: Sistema de autorización - **8-10 horas**
- **Task 9**: Sistema de auditoría completo - **10-12 horas**
- **Task 10**: IA + WHO API + CIE-10 + Translation - **24-28 horas**
- **Task 11**: Endpoints de prescripciones - **12-14 horas**
- **Task 12**: Endpoints pacientes/médicos/farmacias - **16-18 horas**
- **Task 13**: Endpoints dispensación/inventario - **12-14 horas**
- **Task 14**: Docker completo backend - **6-8 horas**
- **Task 15**: Integración frontend Angular - **16-20 horas**
- **Task 16**: Suite de tests completa - **20-24 horas**
- **Task 17**: HL7 FHIR compliance y normativas - **14-16 horas**
- **Task 18**: Documentación y diagramas completos - **14-16 horas**
- **Task 19**: Imágenes Docker para distribución - **8-10 horas**

### Resumen de Estimación

- **Total estimado**: **224-278 horas**
- **Semanas (40 hrs/semana)**: **5.6-7 semanas**
- **Semanas (20 hrs/semana)**: **11.2-13.9 semanas**
- **Incremento por Docker images**: +8-10 horas
- **Incremento total por normativas, WHO API y Docker**: +30-40 horas vs estimación inicial

### Notas sobre Estimación

- Estimaciones para desarrollador fullstack senior con experiencia en:
  - .NET 8 y Clean Architecture
  - Oracle SQL y normalización de bases de datos
  - Angular 18
  - Docker y Keycloak
  - Testing (xUnit, integration tests)

- Factores que pueden aumentar el tiempo:
  - Curva de aprendizaje con Keycloak
  - Configuración de Keycloak con Oracle (menos común)
  - Debugging de issues de integración
  - Ajustes de requisitos durante desarrollo

- Factores que pueden reducir el tiempo:
  - Experiencia previa con stack similar
  - Reutilización de código existente
  - Herramientas de generación de código (scaffolding)

### Ruta Crítica

Las siguientes tareas son críticas y deben completarse en orden:
1. Task 2 → Task 4 → Task 5 → Task 6 → Task 7

Después de Task 7, las siguientes pueden paralelizarse parcialmente:
- Task 8, 9, 10 (pueden trabajarse en paralelo)
- Task 11, 12, 13 (requieren Task 6-9 completadas)



- [ ] 19. Generar imágenes Docker para distribución y despliegue
  - [ ] 19.1 Crear Dockerfile optimizado para backend API (multi-stage)
  - [ ] 19.2 Crear Dockerfile optimizado para frontend Angular con nginx
  - [ ] 19.3 Crear docker-compose.yml completo con todos los servicios
  - [ ] 19.4 Incluir Keycloak en docker-compose usando Oracle como BD
  - [ ] 19.5 Configurar health checks para todos los servicios
  - [ ] 19.6 Configurar redes Docker para comunicación entre servicios
  - [ ] 19.7 Crear archivo .env.example con todas las variables necesarias
  - [ ] 19.8 Agregar .env a .gitignore
  - [ ] 19.9 Probar docker-compose up con todos los servicios
  - [ ] 19.10 Verificar conectividad entre servicios (backend -> Oracle, backend -> Keycloak)
  - [ ] 19.11 Construir imágenes con tags de versión (1.0.0)
  - [ ] 19.12 Generar archivos .tar de imágenes para distribución offline
  - [ ] 19.13 Crear script de carga de imágenes (load-images.sh)
  - [ ] 19.14 Documentar proceso de despliegue con imágenes Docker
  - [ ] 19.15 Crear docker-compose.prod.yml para producción
  - [ ] 19.16 Configurar volúmenes persistentes para datos
  - [ ] 19.17 Probar despliegue completo en ambiente limpio
  - [ ] 19.18 Crear guía de despliegue para otros equipos (docs/DOCKER_DEPLOYMENT.md)
  - [ ] 19.19 Commit y push de configuración Docker completa
  - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.7, 5.9, 6.1-6.10_
  - _Branch: feature/task-19-docker-images_
  - _Commit strategy: Push después de Dockerfiles (19.2), después de docker-compose (19.9), y después de imágenes (19.13)_
  - _Estimated time: 8-10 hours_

