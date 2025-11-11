# Requirements Document

## Introduction

Este documento define los requisitos para la migración completa del sistema ePrescription de Angular a una arquitectura empresarial moderna con backend .NET 8 LTS, base de datos Oracle SQL normalizada (4NF/5NF), contenedorización Docker y orquestación Kubernetes. El proyecto incluye la migración del asistente de IA desde el frontend React al backend, implementación de auditoría completa, y generación de diagramas de arquitectura del sistema completo.

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
- **HL7 FHIR**: Estándar de interoperabilidad para intercambio de información de salud
- **CIE-10**: Clasificación Internacional de Enfermedades, 10ª revisión
- **NLP Service**: Servicio de procesamiento de lenguaje natural para análisis clínico
- **Hugging Face API**: API de modelos de inteligencia artificial para análisis médico

## Requirements

### Requirement 1: Arquitectura de Base de Datos Oracle Normalizada

**User Story:** Como arquitecto de datos, quiero una base de datos Oracle SQL completamente normalizada en 4NF o 5NF, para garantizar integridad de datos, eliminar redundancias y optimizar el rendimiento del sistema.

#### Acceptance Criteria

1. WHEN THE Database_Schema IS designed, THE Oracle_Database SHALL implement normalization level 4NF or 5NF based on data complexity analysis
2. THE Oracle_Database SHALL include all tables necessary for prescriptions, patients, doctors, pharmacies, medications, audit logs, and AI assistant data
3. THE Oracle_Database SHALL implement proper primary keys, foreign keys, indexes, and constraints for data integrity
4. THE Oracle_Database SHALL include audit tables with temporal tracking for all critical operations
5. WHERE mock_data IS required, THE Oracle_Database SHALL contain consistent and reusable test data across all related tables

### Requirement 2: Backend API en .NET 8 LTS

**User Story:** Como desarrollador backend, quiero una API REST completa en .NET 8 LTS con arquitectura limpia, para proporcionar servicios escalables y mantenibles al frontend Angular.

#### Acceptance Criteria

1. THE Backend_API SHALL be developed using .NET 8 LTS with clean architecture pattern
2. THE Backend_API SHALL expose RESTful endpoints for all frontend operations including authentication, prescriptions, dispensation, inventory, and reporting
3. THE Backend_API SHALL support two authentication strategies: custom JWT-based authentication OR Keycloak integration (configurable)
4. THE Backend_API SHALL implement role-based authorization with support for custom roles and permissions
5. WHERE Keycloak IS enabled, THE Backend_API SHALL integrate with Keycloak using OAuth 2.0/OpenID Connect protocols
6. THE Backend_API SHALL include comprehensive error handling and logging mechanisms
7. THE Backend_API SHALL implement data validation using FluentValidation or similar library
8. THE Backend_API SHALL use Entity Framework Core for database access with Oracle provider
9. THE Backend_API SHALL implement repository and unit of work patterns for data access

### Requirement 3: Migración del Asistente de IA al Backend

**User Story:** Como médico usuario del sistema, quiero que el asistente de IA funcione desde el backend, para mejorar la seguridad, rendimiento y centralización de la lógica de negocio médica.

#### Acceptance Criteria

1. THE AI_Assistant_Service SHALL be implemented in the backend using .NET 8 with integration to Hugging Face API or similar NLP services
2. THE AI_Assistant_Service SHALL analyze clinical descriptions and suggest CIE-10 diagnoses with confidence scores
3. THE AI_Assistant_Service SHALL generate medication recommendations based on selected diagnoses
4. THE AI_Assistant_Service SHALL validate drug interactions and contraindications
5. THE AI_Assistant_Service SHALL log all AI operations in the audit system with timestamps, user information, and decision metrics
6. THE Backend_API SHALL expose endpoints for AI analysis, diagnosis selection, and medication generation
7. WHERE AI_models ARE required, THE Backend_API SHALL support configuration of multiple AI providers (Hugging Face, OpenAI, local models)

### Requirement 4: Sistema de Auditoría Completo

**User Story:** Como auditor del sistema, quiero un registro completo e inmutable de todas las operaciones críticas, para cumplir con normativas HIPAA y FDA 21 CFR Part 11.

#### Acceptance Criteria

1. THE Audit_System SHALL record all critical operations including user authentication, prescription creation, dispensation, and data modifications
2. THE Audit_System SHALL store audit logs with timestamp, user ID, IP address, action type, affected entities, and before/after values
3. THE Audit_System SHALL implement immutable audit logs that cannot be modified or deleted
4. THE Audit_System SHALL provide query capabilities for audit log retrieval with filtering by date, user, action type, and entity
5. THE Audit_System SHALL retain audit logs for minimum 7 years according to healthcare regulations
6. THE Audit_System SHALL include audit logs for AI assistant operations with clinical descriptions, suggestions, and user decisions

### Requirement 5: Contenedorización con Docker para Desarrollo y Producción

**User Story:** Como desarrollador, quiero contenedores Docker que me permitan ejecutar el sistema localmente con acceso directo a los servicios, para desarrollo, pruebas con Postman y consultas con Oracle SQL Developer.

#### Acceptance Criteria

1. THE Backend_API SHALL have a Dockerfile that creates an optimized production image
2. THE Oracle_Database SHALL have a Docker configuration with initialization scripts for schema and mock data
3. THE Docker_Compose_File SHALL orchestrate backend, database, and any additional services (Redis, message queue)
4. THE Docker_Configuration SHALL expose ports for external access: backend API (5000/5001), Oracle database (1521), and any additional services
5. THE Docker_Images SHALL be optimized for size and security with multi-stage builds
6. THE Docker_Configuration SHALL include environment variables for configuration management
7. THE Docker_Setup SHALL include health checks for all services
8. THE Docker_Configuration SHALL allow direct database connections from Oracle SQL Developer using exposed port 1521
9. THE Docker_Configuration SHALL allow API testing from Postman using exposed HTTP/HTTPS ports
10. WHERE backup_scripts ARE needed, THE Docker_Configuration SHALL include volume mounts for database backups and persistent data

### Requirement 6: Orquestación con Kubernetes (Opcional para Producción)

**User Story:** Como administrador de infraestructura, quiero manifiestos de Kubernetes opcionales para desplegar el sistema en un clúster de producción, para lograr alta disponibilidad y escalabilidad automática cuando sea necesario.

#### Acceptance Criteria

1. THE Kubernetes_Manifests SHALL be provided as optional deployment method for production environments
2. THE Kubernetes_Manifests SHALL include deployments for backend API with replica configuration
3. THE Kubernetes_Manifests SHALL include StatefulSet for Oracle database with persistent volume claims
4. THE Kubernetes_Manifests SHALL include services with NodePort or LoadBalancer for external access during development
5. THE Kubernetes_Manifests SHALL include ConfigMaps for application configuration
6. THE Kubernetes_Manifests SHALL include Secrets for sensitive data (database passwords, API keys)
7. THE Kubernetes_Manifests SHALL include ingress configuration for external access in production
8. THE Kubernetes_Manifests SHALL include horizontal pod autoscaler for backend API based on CPU/memory metrics
9. THE Kubernetes_Configuration SHALL maintain compatibility with Docker Compose for local development
10. THE Documentation SHALL clearly explain the difference between Docker Compose (development) and Kubernetes (production) deployments

### Requirement 7: Organización del Proyecto por Carpetas

**User Story:** Como desarrollador del equipo, quiero una estructura de carpetas clara y organizada, para facilitar la navegación y mantenimiento del código.

#### Acceptance Criteria

1. THE Project_Structure SHALL separate frontend Angular code in "eprescription-frontend" folder
2. THE Project_Structure SHALL separate backend API code in "eprescription-API" folder
3. THE Project_Structure SHALL separate database scripts in "eprescription-Database" folder
4. THE Project_Structure SHALL separate Docker configurations in appropriate folders within each component
5. THE Project_Structure SHALL include documentation folders for API documentation, database schema diagrams, and deployment guides
6. THE Project_Structure SHALL maintain clear separation between frontend, backend, and database components
7. WHERE backup_files ARE needed, THE Project_Structure SHALL include folders for database backup scripts and Docker volume backups

### Requirement 8: Datos Mock Consistentes

**User Story:** Como tester del sistema, quiero datos mock consistentes y relacionados correctamente, para realizar pruebas integrales sin afectar datos de producción.

#### Acceptance Criteria

1. THE Mock_Data SHALL include realistic patient records with complete demographic information
2. THE Mock_Data SHALL include doctor profiles with specialties, licenses, and medical center assignments
3. THE Mock_Data SHALL include prescription records with medications, dosages, and dispensation history
4. THE Mock_Data SHALL include pharmacy records with inventory and location data
5. THE Mock_Data SHALL maintain referential integrity across all related tables
6. THE Mock_Data SHALL include audit log entries for testing audit functionality
7. THE Mock_Data SHALL be loadable through SQL scripts or Entity Framework seed data

### Requirement 9: Integración del Frontend Angular

**User Story:** Como desarrollador frontend, quiero integrar el frontend Angular existente con el nuevo backend, para mantener toda la funcionalidad actual con la nueva arquitectura.

#### Acceptance Criteria

1. THE Angular_Frontend SHALL be updated to consume REST API endpoints from the new backend
2. THE Angular_Frontend SHALL implement HTTP interceptors for JWT token management
3. THE Angular_Frontend SHALL update all service classes to call backend endpoints instead of mock data
4. THE Angular_Frontend SHALL implement error handling for API responses
5. THE Angular_Frontend SHALL update the AI assistant components to call backend AI endpoints
6. THE Angular_Frontend SHALL maintain all existing UI/UX functionality
7. THE Angular_Frontend SHALL implement environment configuration for different backend URLs (development, staging, production)

### Requirement 10: Estrategia de Branching Profesional

**User Story:** Como líder técnico, quiero una estrategia de branching profesional con Git, para mantener un flujo de trabajo ordenado y facilitar la colaboración del equipo.

#### Acceptance Criteria

1. THE Git_Repository SHALL implement a branching strategy with main, develop, and feature branches
2. WHEN A new_task IS started, THE Developer SHALL create a feature branch from develop with naming convention "feature/task-name"
3. WHEN ALL subtasks ARE completed, THE Developer SHALL create a pull request to merge feature branch into develop
4. THE Pull_Request SHALL require code review approval before merging
5. THE Develop_Branch SHALL be the integration branch for all completed features
6. THE Main_Branch SHALL contain only production-ready code
7. THE Git_Repository SHALL include branch protection rules to prevent direct commits to main and develop

### Requirement 11: Sistema de Pruebas Unitarias e Integración

**User Story:** Como desarrollador, quiero un sistema completo de pruebas unitarias y de integración, para verificar que cada componente funciona correctamente y detectar errores tempranamente durante el desarrollo.

#### Acceptance Criteria

1. THE Backend_API SHALL include unit tests for all business logic services with minimum 80% code coverage
2. THE Backend_API SHALL include unit tests for all controllers with mock dependencies
3. THE Backend_API SHALL include unit tests for all repository implementations
4. THE Backend_API SHALL use xUnit or NUnit as testing framework with FluentAssertions for readable assertions
5. THE Backend_API SHALL use Moq or NSubstitute for mocking dependencies in unit tests
6. THE Backend_API SHALL include integration tests for API endpoints using WebApplicationFactory
7. THE Backend_API SHALL include integration tests for database operations using in-memory database or test containers
8. THE AI_Assistant_Service SHALL include unit tests for diagnosis analysis and medication generation logic
9. THE Audit_System SHALL include unit tests to verify all critical operations are logged correctly
10. THE Test_Suite SHALL be executable from command line and integrated into CI/CD pipeline
11. THE Test_Results SHALL be generated in standard formats (JUnit XML, Cobertura) for reporting
12. WHERE test_data IS needed, THE Test_Suite SHALL use builders or fixtures for consistent test data creation

### Requirement 12: Diagramas de Arquitectura del Sistema

**User Story:** Como arquitecto de soluciones, quiero diagramas completos de la arquitectura del sistema, para documentar y comunicar el diseño técnico a todos los stakeholders.

#### Acceptance Criteria

1. THE Architecture_Diagrams SHALL include a high-level system architecture diagram showing all components and their interactions
2. THE Architecture_Diagrams SHALL include a database entity-relationship diagram (ERD) with all tables and relationships
3. THE Architecture_Diagrams SHALL include a component diagram showing backend layers (API, business logic, data access)
4. THE Architecture_Diagrams SHALL include a deployment diagram showing Docker containers and Kubernetes pods
5. THE Architecture_Diagrams SHALL include a sequence diagram for critical workflows (prescription creation, AI analysis, dispensation)
6. THE Architecture_Diagrams SHALL be created using standard notation (UML, C4 model, or similar)
7. THE Architecture_Diagrams SHALL be exported in multiple formats (PNG, SVG, PDF) and stored in the documentation folder
