# ePrescription - Sistema Integral de Prescripciones Médicas

Sistema empresarial completo de gestión de prescripciones médicas con arquitectura moderna, cumplimiento de normativas internacionales (HL7 FHIR, FDA 21 CFR Part 11, OMS/WHO ICD-10) y tecnologías de vanguardia.

## 🏗️ Arquitectura del Sistema

Este proyecto implementa una arquitectura empresarial completa con tres componentes principales:

### 📱 Frontend - Angular 18
**Ubicación**: `eprescription-frontend/`

- Framework: Angular 18 con TypeScript
- UI/UX: Tailwind CSS + Lucide Icons
- Características: Sistema completo de prescripciones, dispensación, inventario, reportes
- [Ver documentación completa del frontend](./eprescription-frontend/README.md)

### ⚙️ Backend - .NET 8 LTS
**Ubicación**: `eprescription-API/`

- Framework: .NET 8 LTS con Clean Architecture
- Capas: Domain, Application, Infrastructure, API
- Características:
  - REST API completa
  - Autenticación con Keycloak (OAuth 2.0/OpenID Connect)
  - Integración con WHO API (catálogo CIE-10 oficial)
  - Asistente de IA con Hugging Face
  - Servicio de traducción (Español ↔ Inglés)
  - Sistema de auditoría inmutable
  - Exportación HL7 FHIR R4

### 🗄️ Base de Datos - Oracle SQL
**Ubicación**: `eprescription-Database/`

- Motor: Oracle Database 21c Express Edition
- Normalización: 4NF/5NF para máxima integridad
- Esquemas:
  - `EPRESCRIPTION`: Datos de la aplicación
  - `KEYCLOAK`: Datos de autenticación
  - `CIE10_CATALOG`: Catálogo oficial de diagnósticos
- Características:
  - Auditoría inmutable (7 años de retención)
  - Datos mock para desarrollo
  - Scripts de inicialización automatizados

## 🌟 Características Principales

### ✅ Cumplimiento de Normativas Médicas Internacionales

- **HL7 FHIR R4**: Interoperabilidad con sistemas de salud
- **FDA 21 CFR Part 11**: Registros electrónicos y firmas digitales
- **OMS/WHO ICD-10**: Catálogo oficial de diagnósticos
- **HIPAA**: Privacidad y seguridad de datos médicos
- **Auditoría Completa**: Trazabilidad de todas las operaciones

### 🤖 Asistente de IA Médico

- Análisis de descripciones clínicas en español
- Sugerencias de diagnósticos CIE-10 con confianza
- Recomendaciones de medicamentos
- Validación de interacciones medicamentosas
- Traducción automática ES ↔ EN para procesamiento

### 🔐 Seguridad Empresarial

- Autenticación con Keycloak (SSO)
- Autorización basada en roles (RBAC)
- Tokens JWT con refresh automático
- Auditoría inmutable de operaciones
- Cifrado de datos sensibles

### 🌐 APIs Externas Integradas

1. **WHO API** - Catálogo oficial ICD-10
2. **Hugging Face API** - Análisis de IA médico
3. **Azure Translator** - Traducción médica especializada
4. **Keycloak** - Gestión de identidad y acceso

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker Desktop 4.0+
- Node.js 18+ (para frontend)
- .NET 8 SDK (para backend)
- Git

### Instalación con Docker Compose

```bash
# Clonar el repositorio
git clone https://github.com/rvelazqueza/ePrescription.git
cd ePrescription

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Iniciar todos los servicios
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps
```

### Acceso a los Servicios

- **Frontend Angular**: http://localhost:4200
- **Backend API**: http://localhost:5000
- **Swagger/OpenAPI**: http://localhost:5000/swagger
- **Keycloak Admin**: http://localhost:8080 (admin/admin123)
- **Oracle Database**: localhost:1521 (SID: XE)

### Desarrollo Local

#### Frontend (Angular)
```bash
cd eprescription-frontend
npm install
npm start
# Disponible en http://localhost:4200
```

#### Backend (.NET)
```bash
cd eprescription-API
dotnet restore
dotnet run --project EPrescription.API
# Disponible en http://localhost:5000
```

#### Base de Datos (Oracle)
```bash
# Conectar con Oracle SQL Developer
Host: localhost
Port: 1521
Service Name: XE
Username: eprescription_user
Password: EprescriptionPass123!
```

## 📋 Estructura del Proyecto

```
ePrescription/
├── .kiro/specs/                    # Especificaciones del proyecto
│   └── eprescription-backend-migration/
│       ├── requirements.md         # 13 requisitos con criterios EARS
│       ├── design.md              # Diseño técnico completo
│       └── tasks.md               # 18 tareas de implementación
├── eprescription-frontend/         # Frontend Angular 18
│   ├── src/                       # Código fuente
│   ├── angular.json               # Configuración Angular
│   ├── package.json               # Dependencias npm
│   └── README.md                  # Documentación frontend
├── eprescription-API/              # Backend .NET 8
│   ├── EPrescription.Domain/      # Entidades y lógica de negocio
│   ├── EPrescription.Application/ # Casos de uso y DTOs
│   ├── EPrescription.Infrastructure/ # EF Core, servicios externos
│   ├── EPrescription.API/         # Controllers y middleware
│   └── EPrescription.Tests/       # Tests unitarios e integración
├── eprescription-Database/         # Scripts Oracle SQL
│   ├── schemas/                   # Definición de tablas
│   ├── mock-data/                 # Datos de prueba
│   └── migrations/                # Migraciones de BD
├── docs/                          # Documentación del proyecto
│   ├── BRANCHING_STRATEGY.md     # Estrategia de Git
│   ├── SECURITY_COMPLIANCE.md    # Cumplimiento normativo
│   ├── WHO_API_INTEGRATION.md    # Integración WHO API
│   └── architecture-diagrams/    # Diagramas del sistema
├── docker-compose.yml             # Orquestación de servicios
├── .env.example                   # Plantilla de variables de entorno
└── README.md                      # Este archivo
```

## 🔧 Configuración de Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
# Keycloak
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret

# WHO API (ICD-10 Catalog)
WHO_API_CLIENT_ID=your-who-api-client-id
WHO_API_CLIENT_SECRET=your-who-api-client-secret

# Hugging Face API (AI Analysis)
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Translation Service
TRANSLATION_API_KEY=your-azure-translator-key
TRANSLATION_API_ENDPOINT=https://api.cognitive.microsofttranslator.com

# Oracle Database
ORACLE_PASSWORD=OraclePassword123!
EPRESCRIPTION_DB_PASSWORD=EprescriptionPass123!
```

## 📊 Estado del Proyecto

### ✅ Completado

- [x] Especificaciones completas (requirements, design, tasks)
- [x] Estructura del proyecto organizada
- [x] Frontend Angular 18 funcional
- [x] Documentación técnica completa

### 🚧 En Desarrollo

- [ ] Backend .NET 8 con Clean Architecture
- [ ] Base de datos Oracle con esquema normalizado
- [ ] Integración con WHO API
- [ ] Asistente de IA con traducción
- [ ] Sistema de auditoría completo
- [ ] Exportación HL7 FHIR

### 📅 Estimación de Tiempo

- **Total**: 216-268 horas
- **Tiempo completo (40 hrs/semana)**: 5.4-6.7 semanas
- **Medio tiempo (20 hrs/semana)**: 10.8-13.4 semanas

Ver [tasks.md](./.kiro/specs/eprescription-backend-migration/tasks.md) para detalles completos.

## 🤝 Contribución

Este proyecto sigue una estrategia de branching profesional:

- `main`: Código production-ready
- `develop`: Integración de features
- `feature/*`: Ramas de desarrollo por tarea

Ver [BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) para más detalles.

## 📖 Documentación Adicional

- [Especificaciones Completas](./.kiro/specs/eprescription-backend-migration/)
- [Documentación Frontend](./eprescription-frontend/README.md)
- [Diseño de Arquitectura](./.kiro/specs/eprescription-backend-migration/design.md)
- [Plan de Implementación](./.kiro/specs/eprescription-backend-migration/tasks.md)

## 📄 Licencia

[Especificar licencia del proyecto]

## 👥 Equipo

[Información del equipo de desarrollo]

---

**Nota**: Este es un sistema médico en desarrollo. Asegúrate de cumplir con todas las normativas locales e internacionales antes de usar en producción.
