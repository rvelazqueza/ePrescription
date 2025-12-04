# Arquitectura Completa del Sistema ePrescription

## 1. Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "Frontend Layer"
        FE[Angular Frontend<br/>Puerto 4200]
    end
    
    subgraph "API Gateway Layer"
        API[.NET 8 REST API<br/>Puerto 8000]
    end
    
    subgraph "Authentication & Authorization"
        KC[Keycloak<br/>Puerto 8080]
    end
    
    subgraph "Database Layer"
        DB[(Oracle Database<br/>Puerto 1521)]
    end
    
    subgraph "External Services"
        WHO[WHO API<br/>Medicamentos + CIE-10]
        DEEPL[DeepL API<br/>Traducción]
        HF[HuggingFace<br/>AI Assistant]
    end
    
    FE -->|HTTP/REST| API
    FE -->|OAuth2/OIDC| KC
    API -->|OAuth2 Validation| KC
    API -->|EF Core| DB
    API -->|HTTP| WHO
    API -->|HTTP| DEEPL
    API -->|HTTP| HF
    
    style FE fill:#e1f5ff
    style API fill:#fff3e0
    style KC fill:#f3e5f5
    style DB fill:#e8f5e9
    style WHO fill:#fce4ec
    style DEEPL fill:#fce4ec
    style HF fill:#fce4ec
```

## 2. Arquitectura Clean Architecture del Backend

```mermaid
graph TB
    subgraph "Presentation Layer"
        CTRL[Controllers]
        MW[Middleware]
        ATTR[Attributes]
    end
    
    subgraph "Application Layer"
        CMD[Commands]
        QRY[Queries]
        DTO[DTOs]
        VAL[Validators]
        MAP[Mappings]
        INT[Interfaces]
    end
    
    subgraph "Domain Layer"
        ENT[Entities]
        VO[Value Objects]
        ENUM[Enumerations]
    end
    
    subgraph "Infrastructure Layer"
        REPO[Repositories]
        DBCTX[DbContext]
        CFG[Configurations]
        SVC[Services]
        AUTH[Authentication]
        AUTHZ[Authorization]
        BG[Background Services]
    end
    
    CTRL --> CMD
    CTRL --> QRY
    CMD --> INT
    QRY --> INT
    CMD --> VAL
    QRY --> VAL
    CMD --> MAP
    QRY --> MAP
    INT --> SVC
    INT --> REPO
    REPO --> DBCTX
    DBCTX --> CFG
    DBCTX --> ENT
    SVC --> ENT
    MW --> AUTHZ
    ATTR --> AUTHZ
    
    style CTRL fill:#e1f5ff
    style CMD fill:#fff3e0
    style QRY fill:#fff3e0
    style ENT fill:#f3e5f5
    style REPO fill:#e8f5e9
    style SVC fill:#e8f5e9
```

## 3. Flujo de Autenticación y Autorización

```mermaid
sequenceDiagram
    participant U as Usuario
    participant FE as Frontend
    participant KC as Keycloak
    participant API as REST API
    participant MW as Auth Middleware
    participant DB as Database
    
    U->>FE: Login (username/password)
    FE->>KC: POST /token
    KC->>KC: Validar credenciales
    KC->>FE: JWT Token + Refresh Token
    FE->>FE: Guardar tokens
    
    FE->>API: Request + Bearer Token
    API->>MW: Interceptar request
    MW->>KC: Validar token
    KC->>MW: Token válido + Claims
    MW->>DB: Verificar roles/permisos
    DB->>MW: Roles/permisos del usuario
    MW->>API: Autorizar request
    API->>DB: Ejecutar operación
    DB->>API: Resultado
    API->>FE: Response
    FE->>U: Mostrar resultado
```

## 4. Arquitectura de Datos - Modelo Entidad-Relación

### Diagrama Simplificado por Módulos

```mermaid
erDiagram
    %% === SEGURIDAD ===
    USERS ||--o{ USER_ROLES : "tiene"
    ROLES ||--o{ USER_ROLES : "asignado"
    ROLES ||--o{ ROLE_PERMISSIONS : "posee"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "otorgado"
    
    %% === ENTIDADES MÉDICAS ===
    PATIENTS ||--o{ PATIENT_CONTACTS : "tiene"
    PATIENTS ||--o{ PATIENT_ALLERGIES : "tiene"
    SPECIALTIES ||--o{ DOCTORS : "especializa"
    DOCTORS ||--o{ DOCTOR_MEDICAL_CENTERS : "trabaja en"
    MEDICAL_CENTERS ||--o{ DOCTOR_MEDICAL_CENTERS : "emplea"
    
    %% === PRESCRIPCIONES ===
    PATIENTS ||--o{ PRESCRIPTIONS : "recibe"
    DOCTORS ||--o{ PRESCRIPTIONS : "crea"
    PRESCRIPTIONS ||--o{ PRESCRIPTION_DIAGNOSES : "contiene"
    PRESCRIPTIONS ||--o{ PRESCRIPTION_MEDICATIONS : "incluye"
    CIE10_CATALOG ||--o{ PRESCRIPTION_DIAGNOSES : "clasifica"
    MEDICATIONS ||--o{ PRESCRIPTION_MEDICATIONS : "prescrito"
    ADMINISTRATION_ROUTES ||--o{ PRESCRIPTION_MEDICATIONS : "vía"
    MEDICATIONS ||--o{ DRUG_INTERACTIONS : "interactúa"
    
    %% === FARMACIA ===
    PHARMACIES ||--o{ INVENTORY : "gestiona"
    MEDICATIONS ||--o{ INVENTORY : "almacenado"
    PHARMACIES ||--o{ DISPENSATIONS : "realiza"
    PRESCRIPTIONS ||--o{ DISPENSATIONS : "cumple"
    DISPENSATIONS ||--o{ DISPENSATION_ITEMS : "contiene"
    INVENTORY ||--o{ DISPENSATION_ITEMS : "desde"
    
    %% === AUDITORÍA ===
    USERS ||--o{ AUDIT_LOGS : "realiza"
    USERS ||--o{ AI_ANALYSIS_LOGS : "solicita"
    PRESCRIPTIONS ||--o{ AI_ANALYSIS_LOGS : "analiza"
```

**Nota**: Para un diagrama más detallado con todos los campos de cada entidad, consultar `docs/DIAGRAMA-ER-MEJORADO.md`

## 5. Flujo de Creación de Prescripción

```mermaid
sequenceDiagram
    participant D as Doctor
    participant FE as Frontend
    participant API as API
    participant VAL as Validator
    participant CMD as CreatePrescriptionHandler
    participant REPO as Repository
    participant DB as Database
    participant AUDIT as Audit Service
    participant AI as AI Assistant
    
    D->>FE: Crear prescripción
    FE->>AI: Sugerir diagnósticos (opcional)
    AI->>FE: Sugerencias CIE-10
    FE->>AI: Sugerir medicamentos (opcional)
    AI->>FE: Sugerencias + interacciones
    
    FE->>API: POST /prescriptions
    API->>VAL: Validar datos
    VAL->>API: Validación OK
    API->>CMD: Ejecutar comando
    CMD->>REPO: Guardar prescripción
    REPO->>DB: INSERT
    DB->>REPO: ID generado
    REPO->>CMD: Prescripción creada
    CMD->>AUDIT: Registrar auditoría
    AUDIT->>DB: INSERT audit_log
    CMD->>API: Resultado
    API->>FE: 201 Created
    FE->>D: Prescripción creada
```

## 6. Flujo de Dispensación en Farmacia

```mermaid
sequenceDiagram
    participant P as Farmacéutico
    participant FE as Frontend
    participant API as API
    participant VAL as Validator
    participant CMD as RegisterDispensationHandler
    participant PREPO as PrescriptionRepo
    participant IREPO as InventoryRepo
    participant DB as Database
    participant AUDIT as Audit Service
    
    P->>FE: Buscar prescripción
    FE->>API: GET /prescriptions/search
    API->>PREPO: Buscar
    PREPO->>DB: SELECT
    DB->>FE: Lista prescripciones
    
    P->>FE: Seleccionar prescripción
    FE->>API: GET /prescriptions/{id}
    API->>FE: Detalle prescripción
    
    P->>FE: Registrar dispensación
    FE->>API: POST /dispensations
    API->>VAL: Validar datos
    VAL->>API: Validación OK
    API->>CMD: Ejecutar comando
    
    CMD->>PREPO: Verificar prescripción válida
    PREPO->>CMD: OK
    
    CMD->>IREPO: Verificar inventario
    IREPO->>DB: SELECT stock
    DB->>IREPO: Stock disponible
    IREPO->>CMD: Stock suficiente
    
    CMD->>IREPO: Reducir inventario
    IREPO->>DB: UPDATE inventory
    
    CMD->>PREPO: Guardar dispensación
    PREPO->>DB: INSERT dispensation
    
    CMD->>AUDIT: Registrar auditoría
    AUDIT->>DB: INSERT audit_log
    
    CMD->>API: Resultado
    API->>FE: 201 Created
    FE->>P: Dispensación registrada
```

## 7. Arquitectura de Seguridad

```mermaid
graph TB
    subgraph "Security Layers"
        L1[Layer 1: Network Security<br/>HTTPS/TLS]
        L2[Layer 2: Authentication<br/>Keycloak OAuth2/OIDC]
        L3[Layer 3: Authorization<br/>Role-Based + Permission-Based]
        L4[Layer 4: Data Security<br/>Encryption at Rest]
        L5[Layer 5: Audit Trail<br/>Complete Logging]
    end
    
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    
    subgraph "Security Components"
        JWT[JWT Token Validation]
        RBAC[Role-Based Access Control]
        PBAC[Permission-Based Access Control]
        ENC[Data Encryption]
        LOG[Audit Logging]
    end
    
    L2 -.-> JWT
    L3 -.-> RBAC
    L3 -.-> PBAC
    L4 -.-> ENC
    L5 -.-> LOG
    
    style L1 fill:#ffebee
    style L2 fill:#fce4ec
    style L3 fill:#f3e5f5
    style L4 fill:#ede7f6
    style L5 fill:#e8eaf6
```

## 8. Componentes del Sistema

### 8.1 Frontend (Angular)

- **Tecnología**: Angular 18
- **Puerto**: 4200
- **Características**:
  - SPA (Single Page Application)
  - Routing con guards de autenticación
  - Servicios HTTP para comunicación con API
  - Gestión de estado con RxJS
  - UI con Tailwind CSS

### 8.2 Backend API (.NET 8)

- **Tecnología**: ASP.NET Core 8
- **Puerto**: 8000
- **Arquitectura**: Clean Architecture
- **Patrones**:
  - CQRS (Command Query Responsibility Segregation)
  - Repository Pattern
  - Mediator Pattern (MediatR)
  - Dependency Injection

### 8.3 Base de Datos (Oracle)

- **Tecnología**: Oracle Database 21c
- **Puerto**: 1521
- **Características**:
  - Esquema normalizado
  - Índices optimizados
  - Constraints de integridad referencial
  - Triggers para auditoría

### 8.4 Autenticación (Keycloak)

- **Tecnología**: Keycloak 23
- **Puerto**: 8080
- **Características**:
  - OAuth 2.0 / OpenID Connect
  - Gestión de usuarios y roles
  - Single Sign-On (SSO)
  - Token management

## 9. Integraciones Externas

### 9.1 WHO API
- **Propósito**: Catálogo internacional de medicamentos y diagnósticos CIE-10
- **Uso**: 
  - Búsqueda y sincronización de medicamentos
  - Búsqueda y sincronización de códigos CIE-10 (diagnósticos)
- **Frecuencia**: Sincronización diaria automática (1:00 AM)
- **Endpoints**:
  - `/medications` - Catálogo de medicamentos
  - `/icd-10` - Códigos CIE-10

### 9.2 DeepL API
- **Propósito**: Traducción de contenido médico
- **Uso**: Traducir nombres de medicamentos y diagnósticos
- **Límite**: 500,000 caracteres/mes

### 9.3 HuggingFace API
- **Propósito**: Asistente AI para sugerencias médicas
- **Uso**: Sugerir diagnósticos y medicamentos
- **Modelo**: Llama 3.2 3B Instruct

## 10. Despliegue con Docker

```mermaid
graph TB
    subgraph "Docker Compose"
        subgraph "Container: Frontend"
            FE[Angular App<br/>nginx:alpine]
        end
        
        subgraph "Container: API"
            API[.NET 8 API<br/>mcr.microsoft.com/dotnet/aspnet:8.0]
        end
        
        subgraph "Container: Keycloak"
            KC[Keycloak 23<br/>quay.io/keycloak/keycloak:23.0]
        end
        
        subgraph "Container: Database"
            DB[Oracle 21c<br/>gvenzl/oracle-xe:21-slim]
        end
    end
    
    subgraph "Volumes"
        V1[oracle-data]
        V2[keycloak-data]
    end
    
    DB -.-> V1
    KC -.-> V2
    
    FE -->|Port 4200| API
    API -->|Port 8000| KC
    API -->|Port 8000| DB
    KC -->|Port 8080| DB
    
    style FE fill:#e1f5ff
    style API fill:#fff3e0
    style KC fill:#f3e5f5
    style DB fill:#e8f5e9
```

## 11. Flujo de Datos Completo

```mermaid
graph LR
    U[Usuario] -->|1. Login| KC[Keycloak]
    KC -->|2. Token| U
    U -->|3. Request + Token| FE[Frontend]
    FE -->|4. API Call| API[REST API]
    API -->|5. Validate Token| KC
    API -->|6. Query/Command| DB[(Database)]
    DB -->|7. Data| API
    API -->|8. Response| FE
    FE -->|9. Display| U
    
    API -.->|Sync Diaria| WHO[WHO API<br/>Medicamentos + CIE-10]
    API -.->|Traducción| DEEPL[DeepL API<br/>i18n]
    API -.->|Sugerencias| HF[HuggingFace<br/>AI Assistant]
    
    style U fill:#e3f2fd
    style FE fill:#e1f5ff
    style API fill:#fff3e0
    style KC fill:#f3e5f5
    style DB fill:#e8f5e9
    style WHO fill:#fce4ec
    style DEEPL fill:#fce4ec
    style HF fill:#fce4ec
```

## 12. Resumen de Tecnologías

| Componente | Tecnología | Versión | Puerto |
|------------|-----------|---------|--------|
| Frontend | Angular | 18 | 4200 |
| Backend API | .NET Core | 8.0 | 8000 |
| Base de Datos | Oracle Database | 21c | 1521 |
| Autenticación | Keycloak | 23.0 | 8080 |
| ORM | Entity Framework Core | 8.0 | - |
| Contenedores | Docker | Latest | - |
| Orquestación | Docker Compose | Latest | - |

## 13. Flujo de Análisis de IA con Traducción

```mermaid
sequenceDiagram
    participant D as Doctor
    participant FE as Frontend
    participant API as API
    participant AI as HuggingFace AI
    participant TRANS as DeepL Translation
    participant CIE10 as CIE-10 Service
    participant WHO as WHO API
    participant DB as Database
    
    Note over D,DB: Flujo de Sugerencia de Diagnósticos
    D->>FE: Escribe síntomas
    FE->>API: POST /ai-assistant/suggest-diagnosis
    API->>AI: Analizar síntomas
    AI->>API: Códigos CIE-10 sugeridos
    
    API->>CIE10: Buscar descripciones
    CIE10->>DB: Query diagnoses
    DB->>CIE10: Diagnósticos en inglés
    
    API->>TRANS: Traducir a español
    TRANS->>API: Diagnósticos traducidos
    API->>FE: Lista de sugerencias
    FE->>D: Mostrar diagnósticos
    
    Note over D,DB: Flujo de Sugerencia de Medicamentos
    D->>FE: Selecciona diagnóstico
    FE->>API: POST /ai-assistant/suggest-medications
    API->>AI: Analizar diagnóstico
    AI->>API: Medicamentos sugeridos
    
    API->>WHO: Buscar medicamentos
    WHO->>API: Datos de medicamentos
    
    API->>TRANS: Traducir nombres
    TRANS->>API: Nombres traducidos
    
    API->>DB: Verificar interacciones
    DB->>API: Interacciones encontradas
    
    API->>FE: Medicamentos + Interacciones
    FE->>D: Mostrar con alertas
```

## 14. Integración WHO API y Translation Service

```mermaid
graph TB
    subgraph "Backend Services"
        WHO_SVC[WHO API Service]
        TRANS_SVC[Translation Service]
        CIE10_SVC[CIE-10 Catalog Service]
        BG_SYNC[Background Sync Service<br/>Scheduled Job]
    end
    
    subgraph "External APIs"
        WHO_API[WHO API<br/>api.who.int]
        DEEPL_API[DeepL API<br/>api.deepl.com]
    end
    
    subgraph "Database"
        MED_TABLE[(Medications Table)]
        CIE10_TABLE[(Diagnoses Table<br/>CIE-10)]
        TRANS_CACHE[(Translation Cache)]
    end
    
    subgraph "Controllers"
        WHO_CTRL[WHO Controller]
        AI_CTRL[AI Assistant Controller]
        CIE10_CTRL[CIE-10 Controller]
    end
    
    BG_SYNC -->|Fetch Medications| WHO_SVC
    BG_SYNC -->|Fetch CIE-10| WHO_SVC
    
    WHO_SVC -->|HTTP GET| WHO_API
    WHO_API -->|JSON Response| WHO_SVC
    
    WHO_SVC -->|Translate Names| TRANS_SVC
    TRANS_SVC -->|HTTP POST| DEEPL_API
    DEEPL_API -->|Translated Text| TRANS_SVC
    
    TRANS_SVC -->|Cache| TRANS_CACHE
    WHO_SVC -->|Save| MED_TABLE
    WHO_SVC -->|Save| CIE10_TABLE
    
    WHO_CTRL -->|Query| WHO_SVC
    AI_CTRL -->|Query| WHO_SVC
    AI_CTRL -->|Translate| TRANS_SVC
    CIE10_CTRL -->|Query| CIE10_SVC
    CIE10_SVC -->|Read| CIE10_TABLE
    
    style BG_SYNC fill:#fff3e0
    style WHO_SVC fill:#e1f5ff
    style TRANS_SVC fill:#e1f5ff
    style WHO_API fill:#fce4ec
    style DEEPL_API fill:#fce4ec
    style MED_TABLE fill:#e8f5e9
    style CIE10_TABLE fill:#e8f5e9
```

## 15. Proceso de Sincronización WHO (Background Service)

```mermaid
sequenceDiagram
    participant SCHED as Scheduler<br/>(1:00 AM Daily)
    participant BG as Background Service
    participant WHO_SVC as WHO Service
    participant WHO_API as WHO API
    participant TRANS as Translation Service
    participant DEEPL as DeepL API
    participant DB as Database
    participant LOG as Logger
    
    SCHED->>BG: Trigger Sync Job
    BG->>LOG: Log: Sync Started
    
    Note over BG,DB: Fase 1: Sincronizar Medicamentos
    BG->>WHO_SVC: SyncMedications()
    WHO_SVC->>WHO_API: GET /medications
    WHO_API->>WHO_SVC: Medications List (EN)
    
    loop For each medication
        WHO_SVC->>TRANS: Translate(name, EN->ES)
        TRANS->>DEEPL: POST /translate
        DEEPL->>TRANS: Translated name
        WHO_SVC->>DB: UPSERT medication
    end
    
    WHO_SVC->>BG: Sync Complete (Count)
    BG->>LOG: Log: Medications Synced
    
    Note over BG,DB: Fase 2: Sincronizar CIE-10
    BG->>WHO_SVC: SyncDiagnoses()
    WHO_SVC->>WHO_API: GET /icd-10
    WHO_API->>WHO_SVC: CIE-10 Codes (EN)
    
    loop For each diagnosis
        WHO_SVC->>TRANS: Translate(description, EN->ES)
        TRANS->>DEEPL: POST /translate
        DEEPL->>TRANS: Translated description
        WHO_SVC->>DB: UPSERT diagnosis
    end
    
    WHO_SVC->>BG: Sync Complete (Count)
    BG->>LOG: Log: CIE-10 Synced
    
    Note over BG,DB: Fase 3: Cleanup
    BG->>DB: Mark obsolete records
    BG->>LOG: Log: Sync Completed Successfully
    BG->>SCHED: Job Finished
```

## 16. Patrones de Diseño Implementados

1. **Clean Architecture**: Separación en capas (Presentation, Application, Domain, Infrastructure)
2. **CQRS**: Separación de comandos y consultas
3. **Repository Pattern**: Abstracción de acceso a datos
4. **Mediator Pattern**: Desacoplamiento de handlers
5. **Dependency Injection**: Inversión de control
6. **Unit of Work**: Transacciones coordinadas
7. **Factory Pattern**: Creación de objetos complejos
8. **Strategy Pattern**: Diferentes estrategias de autenticación/autorización
