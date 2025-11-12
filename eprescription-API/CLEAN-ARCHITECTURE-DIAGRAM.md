# Clean Architecture Diagram - ePrescription Backend

Diagrama visual de la arquitectura limpia implementada en el proyecto.

## 🏗️ Capas de Clean Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         EPrescription.API                        │
│                    (Presentation Layer)                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │Controllers │  │ Middleware │  │ Extensions │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│         │                │                │                      │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EPrescription.Application                      │
│                    (Application Layer)                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  UseCases  │  │    DTOs    │  │ Validators │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│         │                │                │                      │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EPrescription.Infrastructure                    │
│                   (Infrastructure Layer)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  EF Core   │  │Repositories│  │  Services  │                │
│  │  DbContext │  │            │  │  (External)│                │
│  └────────────┘  └────────────┘  └────────────┘                │
│         │                │                │                      │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EPrescription.Domain                          │
│                      (Domain Layer)                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  Entities  │  │ValueObjects│  │ Interfaces │                │
│  │            │  │            │  │            │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                                                                  │
│              ⚠️  NO DEPENDENCIES - CORE PURO                    │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Dependencias

```
API
 ↓ depends on
Application
 ↓ depends on
Domain ← Infrastructure depends on
```

**Regla de Oro**: Las dependencias siempre apuntan hacia adentro (hacia Domain)

## 📦 Responsabilidades por Capa

### 1. Domain (Núcleo)
**Responsabilidad**: Lógica de negocio pura

```
EPrescription.Domain/
├── Entities/
│   ├── Patient.cs
│   ├── Doctor.cs
│   ├── Prescription.cs
│   ├── Medication.cs
│   └── ...
├── ValueObjects/
│   ├── Address.cs
│   ├── PhoneNumber.cs
│   ├── Email.cs
│   └── MedicalLicense.cs
├── Interfaces/
│   ├── Repositories/
│   │   ├── IRepository<T>.cs
│   │   ├── IPatientRepository.cs
│   │   └── ...
│   └── Services/
│       ├── IAuditService.cs
│       └── ...
└── Common/
    └── BaseEntity.cs
```

**Características**:
- ❌ No depende de nada
- ✅ Entidades de negocio
- ✅ Interfaces de repositorios
- ✅ Value Objects
- ✅ Lógica de dominio pura

### 2. Application (Casos de Uso)
**Responsabilidad**: Orquestación de la lógica de negocio

```
EPrescription.Application/
├── UseCases/
│   ├── Patients/
│   │   ├── CreatePatient/
│   │   │   ├── CreatePatientCommand.cs
│   │   │   ├── CreatePatientHandler.cs
│   │   │   └── CreatePatientValidator.cs
│   │   └── GetPatient/
│   │       ├── GetPatientQuery.cs
│   │       └── GetPatientHandler.cs
│   ├── Prescriptions/
│   └── Medications/
├── DTOs/
│   ├── PatientDto.cs
│   ├── PrescriptionDto.cs
│   └── ...
├── Interfaces/
│   ├── IAuthenticationService.cs
│   └── ITranslationService.cs
├── Mappings/
│   └── MappingProfile.cs
└── Validators/
    └── PatientValidator.cs
```

**Características**:
- ✅ Depende de: Domain
- ✅ Use cases (CQRS con MediatR)
- ✅ DTOs para transferencia de datos
- ✅ Validaciones (FluentValidation)
- ✅ Mappings (AutoMapper)

### 3. Infrastructure (Implementación)
**Responsabilidad**: Implementación de interfaces y acceso a datos

```
EPrescription.Infrastructure/
├── Data/
│   ├── EPrescriptionDbContext.cs
│   ├── Configurations/
│   │   ├── PatientConfiguration.cs
│   │   ├── DoctorConfiguration.cs
│   │   └── ...
│   └── Migrations/
│       └── (generadas por EF Core)
├── Repositories/
│   ├── Repository<T>.cs
│   ├── PatientRepository.cs
│   ├── PrescriptionRepository.cs
│   └── ...
├── Services/
│   ├── AuditService.cs
│   ├── AuthenticationService.cs
│   └── TranslationService.cs
└── DependencyInjection.cs
```

**Características**:
- ✅ Depende de: Domain, Application
- ✅ EF Core DbContext
- ✅ Implementación de repositorios
- ✅ Servicios externos (APIs, etc.)
- ✅ Configuración de entidades

### 4. API (Presentación)
**Responsabilidad**: Exponer endpoints HTTP

```
EPrescription.API/
├── Controllers/
│   ├── PatientsController.cs
│   ├── PrescriptionsController.cs
│   ├── MedicationsController.cs
│   └── ...
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs
│   └── AuditMiddleware.cs
├── Extensions/
│   └── ServiceCollectionExtensions.cs
├── Program.cs
└── appsettings.json
```

**Características**:
- ✅ Depende de: Application, Infrastructure
- ✅ Controllers (REST API)
- ✅ Middleware personalizado
- ✅ Configuración de servicios
- ✅ Swagger/OpenAPI

### 5. Tests (Pruebas)
**Responsabilidad**: Tests unitarios e integración

```
EPrescription.Tests/
├── Domain/
│   ├── Entities/
│   └── ValueObjects/
├── Application/
│   ├── UseCases/
│   └── Validators/
├── Infrastructure/
│   ├── Repositories/
│   └── Services/
└── API/
    └── Controllers/
```

**Características**:
- ✅ Depende de: Todos los proyectos
- ✅ xUnit para tests
- ✅ Moq para mocking
- ✅ FluentAssertions para asserts
- ✅ InMemory DB para tests

## 🔌 Inyección de Dependencias

### Registro de Servicios

**Infrastructure/DependencyInjection.cs**:
```csharp
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<EPrescriptionDbContext>(options =>
            options.UseOracle(configuration.GetConnectionString("OracleConnection")));

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IPatientRepository, PatientRepository>();
        
        // Services
        services.AddScoped<IAuditService, AuditService>();
        
        return services;
    }
}
```

**Application/DependencyInjection.cs**:
```csharp
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        
        // FluentValidation
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        
        // MediatR
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        
        return services;
    }
}
```

**API/Program.cs**:
```csharp
// Add services
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
```

## 📊 Flujo de una Request

```
1. HTTP Request
   ↓
2. Controller (API)
   ↓
3. MediatR Handler (Application)
   ↓
4. Repository (Infrastructure)
   ↓
5. DbContext (Infrastructure)
   ↓
6. Oracle Database
   ↓
7. Response DTO (Application)
   ↓
8. HTTP Response
```

**Ejemplo: Crear un Paciente**

```
POST /api/patients
   ↓
PatientsController.Create()
   ↓
Mediator.Send(CreatePatientCommand)
   ↓
CreatePatientHandler.Handle()
   ↓
IPatientRepository.AddAsync()
   ↓
EPrescriptionDbContext.SaveChangesAsync()
   ↓
Oracle Database (INSERT INTO PATIENTS)
   ↓
PatientDto (mapped)
   ↓
201 Created Response
```

## 🎯 Ventajas de Clean Architecture

1. **Independencia de Frameworks**: Domain no depende de EF Core, ASP.NET, etc.
2. **Testeable**: Cada capa se puede testear independientemente
3. **Independencia de UI**: Puedes cambiar de REST a GraphQL sin tocar Domain
4. **Independencia de BD**: Puedes cambiar de Oracle a SQL Server sin tocar Domain
5. **Mantenible**: Cambios en una capa no afectan otras
6. **Escalable**: Fácil agregar nuevas features

## 🔒 Reglas de Clean Architecture

### ✅ Permitido
- Application → Domain
- Infrastructure → Domain, Application
- API → Application, Infrastructure
- Tests → Todos

### ❌ NO Permitido
- Domain → Application (Domain no puede depender de nada)
- Domain → Infrastructure
- Application → Infrastructure
- Application → API

## 📝 Próximos Pasos (Task 6)

En Task 6 implementaremos:
1. Entidades en Domain
2. DbContext en Infrastructure
3. Repositorios en Infrastructure
4. Configuraciones de EF Core
5. Migraciones

---

**Última actualización**: Noviembre 2024  
**Task**: 5 - Backend Structure  
**Arquitectura**: Clean Architecture  
**Framework**: .NET 8
