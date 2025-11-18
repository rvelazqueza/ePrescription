# Requirements Document

## Introduction

Este documento define los requisitos para la migración completa del sistema ePrescription de Angular a una arquitectura empresarial moderna con backend .NET 8 LTS, base de datos Oracle SQL normalizada (4NF/5NF), contenedorización Docker y orquestación Kubernetes. El proyecto incluye la migración del asistente de IA desde el frontend React al backend, implementación de auditoría completa, cumplimiento de normativas médicas internacionales (HL7 FHIR, FDA 21 CFR Part 11, OMS/WHO ICD-10), integración con WHO API para catálogo CIE-10 oficial, servicio de traducción español-inglés para IA, y generación de diagramas de arquitectura del sistema completo.

## Glossary

- **ePrescription System**: Sistema integral de gestión de prescripciones médicas electrónicas
- **Backend API**: Servicio REST API desarrollado en .NET 8 LTS que expone endpoints para el frontend Angular
- **Oracle Database**: Sistema de gestión de base de datos relacional Oracle SQL con normalización 4NF/5NF
- **Docker Container**: Contenedor que encapsula la aplicación y sus dependencias
- **Kubernetes Cluster**: Sistema de orquestación de contenedores para despliegue escalable
- **AI Assistant**: Asistente de inteligencia artificial para diagnóstico médico y generación de prescripciones
- **Audit System**: Sistema de auditoría que registra todas las operaciones críticas del sistema
- **Mock Data**: Datos de prueba consistentes y reutilizables en toda la aplicación
- **Git Branching Strategy**: Estrategia de ramificación profesional con ramas por tarea y merge a develop
- **Angular Frontend**: Aplicación frontend existente en Angular 18 que se integrará con el nuevo backend
- **Normalization 4NF**: Cuarta forma normal de normalización de bases de datos
- **Normalization 5NF**: Quinta forma normal de normalización de bases de datos
- **REST API**: Interfaz de programación de aplicaciones basada en arquitectura REST
- **JWT Token**: JSON Web Token para autenticación y autorización
- **HIPAA Compliance**: Cumplimiento de normativas de privacidad de datos médicos
- **FDA 21 CFR Part 11**: Regulación de la FDA para registros electrónicos y firmas digitales
- **HL7 FHIR**: Estándar de interoperabilidad para intercambio de información de salud (Fast Healthcare Interoperability Resources)
- **CIE-10 (ICD-10)**: Clasificación Internacional de Enfermedades, 10ª revisión - estándar de la OMS
- **WHO API**: API oficial de la Organización Mundial de la Salud para acceso al catálogo ICD-10
- **NLP Service**: Servicio de procesamiento de lenguaje natural para análisis clínico
- **Hugging Face API**: API de modelos de inteligencia artificial para análisis médico
- **Translation Service**: Servicio de traducción automática español-inglés para procesamiento de IA
- **OMS (WHO)**: Organización Mundial de la Salud - establece estándares médicos internacionales
- **FDA 21 CFR Part 11**: Regulación de la FDA para registros electrónicos y firmas digitales en sistemas médicos

## Requirements

### Requirement 1: Arquitectura de Base de Datos Oracle Normalizada

**User Story:** Como arquitecto de datos, quiero una base de datos Oracle SQL completamente normalizada en 4NF o 5NF, para garantizar integridad de datos, eliminar redundancias y optimizar el rendimiento del sistema.

#### Acceptance Criteria

1. WHEN THE Database_Schema IS designed, THE Oracle_Database SHALL implement normalization level 4NF or 5NF based on documented data complexity analysis
2. THE Oracle_Database SHALL include tables for prescriptions, patients, doctors, pharmacies, medications, audit logs, and AI assistant data
3. THE Oracle_Database SHALL implement primary keys for each table
4. THE Oracle_Database SHALL implement foreign keys to enforce referential integrity between related tables
5. THE Oracle_Database SHALL implement indexes on columns used in search operations
6. THE Oracle_Database SHALL implement constraints to validate data values before insertion
7. THE Oracle_Database SHALL include audit tables with timestamp columns for operation tracking
8. WHERE mock_data IS required, THE Oracle_Database SHALL contain test data with valid foreign key references across related tables

### Requirement 2: Backend API en .NET 8 LTS

**User Story:** Como desarrollador backend, quiero una API REST completa en .NET 8 LTS con arquitectura limpia, para proporcionar servicios escalables y mantenibles al frontend Angular.

#### Acceptance Criteria

1. THE Backend_API SHALL be developed using .NET 8 LTS framework
2. THE Backend_API SHALL organize code using clean architecture pattern with Domain, Application, Infrastructure, and API layers
3. THE Backend_API SHALL expose RESTful endpoints for authentication operations
4. THE Backend_API SHALL expose RESTful endpoints for prescription management operations
5. THE Backend_API SHALL expose RESTful endpoints for dispensation operations
6. THE Backend_API SHALL expose RESTful endpoints for inventory management operations
7. THE Backend_API SHALL expose RESTful endpoints for reporting operations
8. WHERE Keycloak IS enabled, THE Backend_API SHALL authenticate users using OAuth 2.0 protocol
9. WHERE Keycloak IS enabled, THE Backend_API SHALL authenticate users using OpenID Connect protocol
10. THE Backend_API SHALL implement role-based authorization using role identifiers from authentication provider
11. THE Backend_API SHALL implement permission-based authorization using permission identifiers from authentication provider
12. WHEN AN error occurs during request processing, THE Backend_API SHALL return HTTP status code indicating error type
13. WHEN AN error occurs during request processing, THE Backend_API SHALL log error details to logging system
14. WHEN THE Backend_API receives request data, THE Backend_API SHALL validate data using FluentValidation library
15. THE Backend_API SHALL access Oracle database using Entity Framework Core with Oracle provider
16. THE Backend_API SHALL implement repository pattern for data access operations
17. THE Backend_API SHALL implement unit of work pattern for transaction management

### Requirement 3: Migración del Asistente de IA al Backend con Catálogo CIE-10

**User Story:** Como médico usuario del sistema, quiero que el asistente de IA funcione desde el backend con integración completa al catálogo CIE-10, para mejorar la seguridad, rendimiento, precisión diagnóstica y cumplimiento de estándares médicos internacionales.

#### Acceptance Criteria

1. THE CIE10_CATALOG table SHALL contain minimum 500 diagnosis code entries
2. THE CIE10_Catalog_Service SHALL provide search by diagnosis code
3. THE CIE10_Catalog_Service SHALL provide search by diagnosis description text
4. THE CIE10_Catalog_Service SHALL provide search by diagnosis category
5. THE CIE10_Catalog_Service SHALL provide search by diagnosis subcategory
6. THE AI_Assistant_Service SHALL be implemented using .NET 8 framework
7. THE AI_Assistant_Service SHALL integrate with Hugging Face API for natural language processing
8. THE AI_Assistant_Service SHALL store API keys in backend environment variables
9. WHEN THE AI_Assistant_Service receives clinical description text, THE AI_Assistant_Service SHALL analyze text using NLP service
10. WHEN THE AI_Assistant_Service generates diagnosis suggestions, THE AI_Assistant_Service SHALL validate each suggested code against CIE10_CATALOG table
11. WHEN THE AI_Assistant_Service returns diagnosis suggestions, THE AI_Assistant_Service SHALL include only codes that exist in CIE10_CATALOG table
12. WHEN THE AI_Assistant_Service receives selected diagnoses, THE AI_Assistant_Service SHALL generate medication recommendations
13. WHEN THE AI_Assistant_Service generates medication recommendations, THE AI_Assistant_Service SHALL check drug interaction database
14. WHEN THE AI_Assistant_Service generates medication recommendations, THE AI_Assistant_Service SHALL check contraindication database
15. WHEN THE AI_Assistant_Service completes analysis operation, THE AI_Assistant_Service SHALL log operation to audit system with timestamp
16. WHEN THE AI_Assistant_Service completes analysis operation, THE AI_Assistant_Service SHALL log operation to audit system with user identifier
17. WHEN THE AI_Assistant_Service completes analysis operation, THE AI_Assistant_Service SHALL log operation to audit system with confidence metrics
18. WHEN THE AI_Assistant_Service completes analysis operation, THE AI_Assistant_Service SHALL log operation to audit system with CIE-10 codes used
19. THE Backend_API SHALL expose endpoint for AI clinical description analysis
20. THE Backend_API SHALL expose endpoint for diagnosis selection
21. THE Backend_API SHALL expose endpoint for medication generation
22. THE Backend_API SHALL expose endpoint for CIE-10 catalog search
23. WHERE multiple AI providers ARE configured, THE Backend_API SHALL allow selection of AI provider through configuration parameter
24. THE PRESCRIPTION_DIAGNOSES table SHALL reference CIE10_CATALOG table using foreign key constraint

### Requirement 4: Sistema de Auditoría Completo

**User Story:** Como auditor del sistema, quiero un registro completo e inmutable de todas las operaciones críticas, para cumplir con normativas HIPAA y FDA 21 CFR Part 11.

#### Acceptance Criteria

1. WHEN A user authentication occurs, THE Audit_System SHALL record operation to audit log
2. WHEN A prescription creation occurs, THE Audit_System SHALL record operation to audit log
3. WHEN A dispensation occurs, THE Audit_System SHALL record operation to audit log
4. WHEN A data modification occurs, THE Audit_System SHALL record operation to audit log
5. WHEN THE Audit_System records operation, THE Audit_System SHALL store timestamp of operation
6. WHEN THE Audit_System records operation, THE Audit_System SHALL store user identifier
7. WHEN THE Audit_System records operation, THE Audit_System SHALL store IP address of request
8. WHEN THE Audit_System records operation, THE Audit_System SHALL store action type identifier
9. WHEN THE Audit_System records operation, THE Audit_System SHALL store affected entity identifier
10. WHEN THE Audit_System records data modification, THE Audit_System SHALL store data values before modification
11. WHEN THE Audit_System records data modification, THE Audit_System SHALL store data values after modification
12. THE Audit_System SHALL prevent modification of audit log entries after creation
13. THE Audit_System SHALL prevent deletion of audit log entries after creation
14. THE Audit_System SHALL provide query capability filtered by date range
15. THE Audit_System SHALL provide query capability filtered by user identifier
16. THE Audit_System SHALL provide query capability filtered by action type
17. THE Audit_System SHALL provide query capability filtered by entity type
18. THE Audit_System SHALL retain audit log entries for minimum 7 years from creation date
19. WHEN AN AI assistant operation occurs, THE Audit_System SHALL record clinical description text to audit log
20. WHEN AN AI assistant operation occurs, THE Audit_System SHALL record diagnosis suggestions to audit log
21. WHEN AN AI assistant operation occurs, THE Audit_System SHALL record user decision to audit log

### Requirement 5: Contenedorización con Docker para Desarrollo y Producción

**User Story:** Como desarrollador, quiero contenedores Docker que me permitan ejecutar el sistema localmente con acceso directo a los servicios, para desarrollo, pruebas con Postman y consultas con Oracle SQL Developer.

#### Acceptance Criteria

1. THE Backend_API SHALL have a Dockerfile using multi-stage build pattern
2. THE Oracle_Database SHALL have Docker configuration file
3. THE Oracle_Database Docker configuration SHALL mount initialization scripts for schema creation
4. THE Oracle_Database Docker configuration SHALL mount initialization scripts for mock data loading
5. THE Docker_Compose_File SHALL define backend service configuration
6. THE Docker_Compose_File SHALL define database service configuration
7. THE Docker_Compose_File SHALL define service dependencies using depends_on directive
8. THE Docker_Configuration SHALL expose backend API on port 5000 for HTTP access
9. THE Docker_Configuration SHALL expose backend API on port 5001 for HTTPS access
10. THE Docker_Configuration SHALL expose Oracle database on port 1521 for SQL access
11. THE Docker_Images SHALL use multi-stage builds to reduce final image size
12. THE Docker_Configuration SHALL define environment variables for database connection strings
13. THE Docker_Configuration SHALL define environment variables for API keys
14. THE Docker_Configuration SHALL define environment variables for service URLs
15. THE Docker_Setup SHALL include health check for backend service
16. THE Docker_Setup SHALL include health check for database service
17. THE Docker_Configuration SHALL allow external connections to port 1521 for Oracle SQL Developer access
18. THE Docker_Configuration SHALL allow external connections to ports 5000 and 5001 for Postman API testing
19. WHERE backup operations ARE required, THE Docker_Configuration SHALL define volume mount for database backup directory
20. WHERE data persistence IS required, THE Docker_Configuration SHALL define named volume for database data directory

### Requirement 6: Orquestación con Kubernetes (Futuro - No en Alcance Inicial)

**User Story:** Como administrador de infraestructura, quiero la posibilidad de desplegar el sistema en Kubernetes en el futuro para producción, pero inicialmente el proyecto se enfocará en Docker Compose para desarrollo y pruebas locales.

#### Acceptance Criteria

1. THE Project SHALL use Docker Compose for development environment deployment
2. THE Project SHALL use Docker Compose for testing environment deployment
3. THE Docker_Compose_Configuration SHALL allow direct network access to Oracle service
4. THE Docker_Compose_Configuration SHALL allow direct network access to Keycloak service
5. THE Docker_Compose_Configuration SHALL allow direct network access to Backend API service
6. THE Docker_Compose_Configuration SHALL expose service ports for external tool access
7. THE Documentation SHALL include instructions for starting services using Docker Compose
8. THE Documentation SHALL include instructions for stopping services using Docker Compose
9. THE Documentation SHALL include instructions for viewing service logs using Docker Compose
10. THE Architecture SHALL use containerization patterns compatible with Kubernetes orchestration

### Requirement 7: Organización del Proyecto por Carpetas

**User Story:** Como desarrollador del equipo, quiero una estructura de carpetas clara y organizada, para facilitar la navegación y mantenimiento del código.

#### Acceptance Criteria

1. THE Project_Structure SHALL create folder named "eprescription-frontend"
2. THE Project_Structure SHALL create folder named "eprescription-API"
3. THE Project_Structure SHALL create folder named "eprescription-Database"
4. THE Project_Structure SHALL place Angular application code in "eprescription-frontend" folder
5. THE Project_Structure SHALL place .NET API code in "eprescription-API" folder
6. THE Project_Structure SHALL organize "eprescription-API" folder using Clean Architecture layers
7. THE Project_Structure SHALL place database SQL scripts in "eprescription-Database" folder
8. THE Project_Structure SHALL place Docker configuration files in component-specific folders
9. THE Project_Structure SHALL create documentation folder for API documentation
10. THE Project_Structure SHALL create documentation folder for database schema diagrams
11. THE Project_Structure SHALL create documentation folder for deployment guides
12. WHERE backup operations ARE required, THE Project_Structure SHALL create folder for database backup scripts
13. WHEN THE project IS initialized, THE Project_Structure SHALL move existing Angular project from root directory to "eprescription-frontend" folder

### Requirement 8: Datos Mock Consistentes

**User Story:** Como tester del sistema, quiero datos mock consistentes y relacionados correctamente, para realizar pruebas integrales sin afectar datos de producción.

#### Acceptance Criteria

1. THE Mock_Data SHALL include patient records with demographic information fields populated
2. THE Mock_Data SHALL include doctor profile records with specialty identifiers
3. THE Mock_Data SHALL include doctor profile records with license numbers
4. THE Mock_Data SHALL include doctor profile records with medical center assignments
5. THE Mock_Data SHALL include prescription records with medication identifiers
6. THE Mock_Data SHALL include prescription records with dosage values
7. THE Mock_Data SHALL include prescription records with dispensation history entries
8. THE Mock_Data SHALL include pharmacy records with inventory quantities
9. THE Mock_Data SHALL include pharmacy records with location data
10. THE Mock_Data SHALL maintain valid foreign key references between related tables
11. THE Mock_Data SHALL include audit log entries for audit functionality testing
12. THE Mock_Data SHALL be loadable using SQL script execution

### Requirement 9: Integración del Frontend Angular

**User Story:** Como desarrollador frontend, quiero integrar el frontend Angular existente con el nuevo backend, para mantener toda la funcionalidad actual con la nueva arquitectura.

#### Acceptance Criteria

1. THE Angular_Frontend SHALL consume REST API endpoints from backend service
2. THE Angular_Frontend SHALL implement HTTP interceptor for adding JWT tokens to requests
3. THE Angular_Frontend SHALL implement HTTP interceptor for handling token refresh
4. THE Angular_Frontend SHALL update service classes to call backend endpoints
5. WHEN THE Angular_Frontend receives API error response, THE Angular_Frontend SHALL display error message to user
6. WHEN THE Angular_Frontend receives API error response, THE Angular_Frontend SHALL log error details to console
7. THE Angular_Frontend SHALL update AI assistant components to call backend AI endpoints
8. THE Angular_Frontend SHALL maintain existing user interface layouts
9. THE Angular_Frontend SHALL maintain existing user interaction patterns
10. THE Angular_Frontend SHALL define environment configuration for development backend URL
11. THE Angular_Frontend SHALL define environment configuration for staging backend URL
12. THE Angular_Frontend SHALL define environment configuration for production backend URL

### Requirement 10: Estrategia de Branching Profesional

**User Story:** Como líder técnico, quiero una estrategia de branching profesional con Git, para mantener un flujo de trabajo ordenado y facilitar la colaboración del equipo.

#### Acceptance Criteria

1. THE Git_Repository SHALL implement branching strategy with main branch
2. THE Git_Repository SHALL implement branching strategy with develop branch
3. THE Git_Repository SHALL implement branching strategy with feature branches
4. WHEN A new task IS started, THE Developer SHALL create feature branch from develop branch
5. WHEN A new task IS started, THE Developer SHALL name feature branch using "feature/task-name" convention
6. WHEN ALL subtasks ARE completed for a feature, THE Developer SHALL create pull request to merge feature branch into develop branch
7. WHEN A pull request IS created, THE Pull_Request SHALL require code review approval before merge completion
8. THE Develop_Branch SHALL serve as integration branch for completed features
9. THE Main_Branch SHALL contain production-ready code only
10. THE Git_Repository SHALL implement branch protection rule preventing direct commits to main branch
11. THE Git_Repository SHALL implement branch protection rule preventing direct commits to develop branch

### Requirement 11: Sistema de Pruebas Unitarias e Integración

**User Story:** Como desarrollador, quiero un sistema completo de pruebas unitarias y de integración, para verificar que cada componente funciona correctamente y detectar errores tempranamente durante el desarrollo.

#### Acceptance Criteria

1. THE Backend_API SHALL include unit tests for business logic services achieving minimum 80 percent code coverage
2. THE Backend_API SHALL include unit tests for controller classes using mock dependencies
3. THE Backend_API SHALL include unit tests for repository implementations
4. THE Backend_API SHALL use xUnit testing framework for test execution
5. THE Backend_API SHALL use FluentAssertions library for test assertions
6. THE Backend_API SHALL use Moq library for creating mock dependencies in unit tests
7. THE Backend_API SHALL include integration tests for API endpoints using WebApplicationFactory
8. THE Backend_API SHALL include integration tests for database operations using test containers
9. THE AI_Assistant_Service SHALL include unit tests for diagnosis analysis logic
10. THE AI_Assistant_Service SHALL include unit tests for medication generation logic
11. THE Audit_System SHALL include unit tests verifying authentication operations are logged
12. THE Audit_System SHALL include unit tests verifying prescription operations are logged
13. THE Audit_System SHALL include unit tests verifying dispensation operations are logged
14. THE Test_Suite SHALL be executable from command line interface
15. THE Test_Suite SHALL generate test results in JUnit XML format
16. THE Test_Suite SHALL generate code coverage results in Cobertura format
17. WHERE test data IS needed, THE Test_Suite SHALL use builder pattern for test data creation
18. WHERE test data IS needed, THE Test_Suite SHALL use fixture pattern for test data creation

### Requirement 12: Diagramas de Arquitectura del Sistema

**User Story:** Como arquitecto de soluciones, quiero diagramas completos de la arquitectura del sistema, para documentar y comunicar el diseño técnico a todos los stakeholders.

#### Acceptance Criteria

1. THE Architecture_Diagrams SHALL include high-level system architecture diagram showing system components
2. THE Architecture_Diagrams SHALL include high-level system architecture diagram showing component interactions
3. THE Architecture_Diagrams SHALL include database entity-relationship diagram showing table structures
4. THE Architecture_Diagrams SHALL include database entity-relationship diagram showing table relationships
5. THE Architecture_Diagrams SHALL include component diagram showing API layer
6. THE Architecture_Diagrams SHALL include component diagram showing business logic layer
7. THE Architecture_Diagrams SHALL include component diagram showing data access layer
8. THE Architecture_Diagrams SHALL include deployment diagram showing Docker container configuration
9. THE Architecture_Diagrams SHALL include sequence diagram for prescription creation workflow
10. THE Architecture_Diagrams SHALL include sequence diagram for AI analysis workflow
11. THE Architecture_Diagrams SHALL include sequence diagram for dispensation workflow
12. THE Architecture_Diagrams SHALL use UML notation for diagram creation
13. THE Architecture_Diagrams SHALL be exported in PNG format
14. THE Architecture_Diagrams SHALL be exported in SVG format
15. THE Architecture_Diagrams SHALL be exported in PDF format
16. THE Architecture_Diagrams SHALL be stored in documentation folder


### Requirement 13: Cumplimiento de Normativas y Estándares Médicos Internacionales

**User Story:** Como administrador del sistema de salud, quiero que el sistema cumpla con todas las normativas y estándares médicos internacionales (HL7 FHIR, FDA 21 CFR Part 11, OMS/WHO ICD-10), para garantizar interoperabilidad, seguridad, trazabilidad y cumplimiento legal en el manejo de información médica.

#### Acceptance Criteria

1. THE System SHALL implement HL7 FHIR R4 standard for data interoperability
2. THE System SHALL provide FHIR resource mapping for Patient entity
3. THE System SHALL provide FHIR resource mapping for Practitioner entity
4. THE System SHALL provide FHIR resource mapping for MedicationRequest entity
5. THE System SHALL provide FHIR resource mapping for MedicationDispense entity
6. THE System SHALL provide FHIR resource mapping for Condition entity
7. THE System SHALL export prescription data in FHIR JSON format
8. THE System SHALL export medical record data in FHIR JSON format
9. THE System SHALL implement FDA 21 CFR Part 11 requirements for electronic records
10. THE System SHALL implement FDA 21 CFR Part 11 requirements for electronic signatures
11. THE System SHALL maintain immutable audit trail for prescription creation operations
12. THE System SHALL maintain immutable audit trail for prescription modification operations
13. THE System SHALL maintain immutable audit trail for prescription dispensation operations
14. WHEN A prescription IS created, THE System SHALL record Keycloak authentication token as electronic signature
15. THE System SHALL integrate with WHO ICD API for ICD-10 catalog access
16. WHEN THE WHO_API_Service authenticates, THE WHO_API_Service SHALL use OAuth 2.0 client credentials flow
17. THE WHO_API_Service SHALL synchronize ICD-10 catalog from WHO API once per day
18. THE WHO_API_Service SHALL retrieve ICD-10 catalog entries in Spanish language
19. THE WHO_API_Service SHALL retrieve ICD-10 catalog entries in English language
20. WHEN THE System receives diagnosis code, THE System SHALL validate code against WHO ICD-10 catalog
21. THE System SHALL include Translation_Service for medical text translation
22. WHEN THE Translation_Service receives Spanish clinical description, THE Translation_Service SHALL translate text to English
23. WHEN THE Translation_Service receives English AI results, THE Translation_Service SHALL translate text to Spanish
24. THE Translation_Service SHALL use Azure Translator API for translation operations
25. THE Translation_Service SHALL use medical terminology dictionary for translation accuracy
26. THE System SHALL store WHO API client identifier in environment variable
27. THE System SHALL store WHO API client secret in environment variable
28. THE System SHALL store Translation API key in environment variable
29. IF THE WHO API IS unavailable, THEN THE System SHALL retrieve diagnosis codes from local CIE10_CATALOG table
30. THE System SHALL store ICD-10 catalog version number from WHO API
31. THE System SHALL store ICD-10 catalog update date from WHO API
32. WHEN THE WHO_API_Service calls WHO API, THE System SHALL log API call to audit system
33. WHEN THE Translation_Service translates text, THE System SHALL log translation operation to audit system

