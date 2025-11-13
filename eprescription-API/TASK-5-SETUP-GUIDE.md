# Task 5: Backend .NET 8 Structure - Setup Guide

Esta guía te llevará paso a paso para completar Task 5 una vez que tengas Visual Studio 2022 instalado.

## 📋 Pre-requisitos

- ✅ Visual Studio 2022 instalado
- ✅ .NET 8 SDK instalado (viene con Visual Studio)
- ✅ Workload "ASP.NET and web development" instalado
- ✅ Git configurado
- ✅ Rama `feature/task-5-backend-structure` activa

## 🎯 Objetivo de Task 5

Crear la estructura base del backend con Clean Architecture:
- Solución .NET 8
- 5 proyectos (Domain, Application, Infrastructure, API, Tests)
- Dependencias configuradas
- NuGet packages instalados
- Estructura de carpetas
- Configuración básica

## 📁 Estructura Final Esperada

```
eprescription-API/
├── EPrescription.sln                    # Solución principal
├── src/
│   ├── EPrescription.Domain/            # Entidades, interfaces, value objects
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Interfaces/
│   │   └── EPrescription.Domain.csproj
│   ├── EPrescription.Application/       # Use cases, DTOs, servicios
│   │   ├── UseCases/
│   │   ├── DTOs/
│   │   ├── Interfaces/
│   │   ├── Mappings/
│   │   └── EPrescription.Application.csproj
│   ├── EPrescription.Infrastructure/    # EF Core, servicios externos
│   │   ├── Data/
│   │   ├── Repositories/
│   │   ├── Services/
│   │   └── EPrescription.Infrastructure.csproj
│   └── EPrescription.API/               # Controllers, middleware
│       ├── Controllers/
│       ├── Middleware/
│       ├── Program.cs
│       ├── appsettings.json
│       └── EPrescription.API.csproj
└── tests/
    └── EPrescription.Tests/             # Tests unitarios
        ├── Domain/
        ├── Application/
        ├── Infrastructure/
        └── EPrescription.Tests.csproj
```

## 🚀 Pasos de Implementación

### Paso 1: Abrir Visual Studio y Crear Solución

1. Abrir Visual Studio 2022
2. Click en "Create a new project"
3. Buscar "Blank Solution"
4. Configurar:
   - **Solution name**: `EPrescription`
   - **Location**: `C:\...\ePrescription\eprescription-API`
   - ✅ Place solution and project in the same directory
5. Click "Create"

### Paso 2: Crear Proyecto Domain (Class Library)

1. Right-click en la solución → Add → New Project
2. Buscar "Class Library"
3. Seleccionar "Class Library (.NET 8)"
4. Configurar:
   - **Project name**: `EPrescription.Domain`
   - **Location**: `eprescription-API\src`
   - **Framework**: .NET 8.0
5. Click "Create"
6. Eliminar el archivo `Class1.cs` que se crea por defecto

### Paso 3: Crear Proyecto Application (Class Library)

1. Right-click en la solución → Add → New Project
2. Buscar "Class Library"
3. Seleccionar "Class Library (.NET 8)"
4. Configurar:
   - **Project name**: `EPrescription.Application`
   - **Location**: `eprescription-API\src`
   - **Framework**: .NET 8.0
5. Click "Create"
6. Eliminar el archivo `Class1.cs`

### Paso 4: Crear Proyecto Infrastructure (Class Library)

1. Right-click en la solución → Add → New Project
2. Buscar "Class Library"
3. Seleccionar "Class Library (.NET 8)"
4. Configurar:
   - **Project name**: `EPrescription.Infrastructure`
   - **Location**: `eprescription-API\src`
   - **Framework**: .NET 8.0
5. Click "Create"
6. Eliminar el archivo `Class1.cs`

### Paso 5: Crear Proyecto API (Web API)

1. Right-click en la solución → Add → New Project
2. Buscar "ASP.NET Core Web API"
3. Seleccionar "ASP.NET Core Web API"
4. Configurar:
   - **Project name**: `EPrescription.API`
   - **Location**: `eprescription-API\src`
   - **Framework**: .NET 8.0
   - ✅ Configure for HTTPS
   - ✅ Enable OpenAPI support (Swagger)
   - ❌ Use controllers (dejar marcado)
   - ❌ Enable Docker (por ahora)
5. Click "Create"

### Paso 6: Crear Proyecto Tests (xUnit)

1. Right-click en la solución → Add → New Project
2. Buscar "xUnit Test Project"
3. Seleccionar "xUnit Test Project (.NET 8)"
4. Configurar:
   - **Project name**: `EPrescription.Tests`
   - **Location**: `eprescription-API\tests`
   - **Framework**: .NET 8.0
5. Click "Create"

### Paso 7: Configurar Dependencias entre Proyectos

Según Clean Architecture, las dependencias deben fluir hacia adentro:

**EPrescription.Domain**:
- ❌ No tiene dependencias (núcleo independiente)

**EPrescription.Application**:
- ✅ Depende de: Domain

**EPrescription.Infrastructure**:
- ✅ Depende de: Domain, Application

**EPrescription.API**:
- ✅ Depende de: Application, Infrastructure

**EPrescription.Tests**:
- ✅ Depende de: Domain, Application, Infrastructure, API

#### Cómo agregar dependencias:

1. Right-click en el proyecto → Add → Project Reference
2. Seleccionar los proyectos necesarios
3. Click OK

**Orden de configuración**:

1. **Application** → Add Reference → Domain
2. **Infrastructure** → Add Reference → Domain, Application
3. **API** → Add Reference → Application, Infrastructure
4. **Tests** → Add Reference → Domain, Application, Infrastructure, API

### Paso 8: Instalar Paquetes NuGet

#### 8.1 Domain (ninguno - debe ser independiente)
```
No instalar paquetes. Domain debe ser puro.
```

#### 8.2 Application
Right-click en EPrescription.Application → Manage NuGet Packages

Instalar:
- `FluentValidation` (latest)
- `FluentValidation.DependencyInjectionExtensions` (latest)
- `AutoMapper` (latest)
- `AutoMapper.Extensions.Microsoft.DependencyInjection` (latest)
- `MediatR` (latest)

#### 8.3 Infrastructure
Right-click en EPrescription.Infrastructure → Manage NuGet Packages

Instalar:
- `Microsoft.EntityFrameworkCore` (8.0.x)
- `Microsoft.EntityFrameworkCore.Design` (8.0.x)
- `Oracle.EntityFrameworkCore` (8.0.x)
- `Serilog` (latest)
- `Serilog.Sinks.Console` (latest)
- `Serilog.Sinks.File` (latest)

#### 8.4 API
Right-click en EPrescription.API → Manage NuGet Packages

Instalar:
- `Swashbuckle.AspNetCore` (ya viene instalado)
- `Serilog.AspNetCore` (latest)
- `Serilog.Sinks.Console` (latest)
- `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.x)

#### 8.5 Tests
Right-click en EPrescription.Tests → Manage NuGet Packages

Instalar:
- `xunit` (ya viene instalado)
- `xunit.runner.visualstudio` (ya viene instalado)
- `Moq` (latest)
- `FluentAssertions` (latest)
- `Microsoft.EntityFrameworkCore.InMemory` (8.0.x)

### Paso 9: Crear Estructura de Carpetas

#### Domain
```
EPrescription.Domain/
├── Entities/
├── ValueObjects/
├── Interfaces/
│   ├── Repositories/
│   └── Services/
└── Common/
```

#### Application
```
EPrescription.Application/
├── UseCases/
│   ├── Patients/
│   ├── Prescriptions/
│   └── Medications/
├── DTOs/
├── Interfaces/
├── Mappings/
└── Validators/
```

#### Infrastructure
```
EPrescription.Infrastructure/
├── Data/
│   ├── Configurations/
│   └── Migrations/
├── Repositories/
├── Services/
└── DependencyInjection.cs
```

#### API
```
EPrescription.API/
├── Controllers/
├── Middleware/
├── Extensions/
└── Program.cs (ya existe)
```

#### Tests
```
EPrescription.Tests/
├── Domain/
├── Application/
├── Infrastructure/
└── API/
```

**Cómo crear carpetas en Visual Studio**:
1. Right-click en el proyecto
2. Add → New Folder
3. Nombrar la carpeta

### Paso 10: Configurar Program.cs Básico

Abrir `EPrescription.API/Program.cs` y reemplazar con:

```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/eprescription-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// TODO: Add Infrastructure services (Task 6)
// TODO: Add Application services (Task 6)

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

try
{
    Log.Information("Starting ePrescription API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application start-up failed");
}
finally
{
    Log.CloseAndFlush();
}
```

### Paso 11: Configurar appsettings.json

Abrir `EPrescription.API/appsettings.json` y agregar:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  },
  "ConnectionStrings": {
    "OracleConnection": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle-db)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XEPDB1)));User Id=EPRESCRIPTION_USER;Password=EprescriptionPass123!;"
  },
  "AllowedHosts": "*"
}
```

### Paso 12: Crear .gitignore para API

Crear archivo `eprescription-API/.gitignore`:

```gitignore
## Ignore Visual Studio temporary files, build results, and
## files generated by popular Visual Studio add-ons.

# User-specific files
*.rsuser
*.suo
*.user
*.userosscache
*.sln.docstates

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/

# Visual Studio cache/options directory
.vs/

# NuGet Packages
*.nupkg
*.snupkg
**/packages/*
!**/packages/build/

# User Secrets
**/appsettings.Development.json
secrets.json

# Logs
logs/
*.log
```

### Paso 13: Compilar y Verificar

1. Build → Build Solution (Ctrl+Shift+B)
2. Verificar que no hay errores
3. Verificar que todos los proyectos compilan correctamente

### Paso 14: Ejecutar API (Prueba Básica)

1. Set EPrescription.API as Startup Project (right-click → Set as Startup Project)
2. Press F5 o click en el botón "Play"
3. Debe abrir Swagger UI en el navegador
4. Verificar que la API está corriendo

### Paso 15: Commit y Push

Desde la terminal (o Git en Visual Studio):

```bash
# Ver cambios
git status

# Agregar todos los archivos
git add .

# Commit
git commit -m "feat(task-5): Create .NET 8 backend structure with Clean Architecture

- Created EPrescription.sln solution
- Created 5 projects (Domain, Application, Infrastructure, API, Tests)
- Configured project dependencies (Clean Architecture)
- Installed NuGet packages (EF Core, Oracle, Serilog, etc.)
- Created folder structure for each project
- Configured basic Program.cs with Serilog
- Configured appsettings.json with Oracle connection
- Added .gitignore for API
- Verified compilation and basic API execution

Subtasks completed: 5.1-5.13"

# Push
git push origin feature/task-5-backend-structure
```

## ✅ Checklist de Verificación

Antes de considerar Task 5 completada, verificar:

- [ ] Solución EPrescription.sln creada
- [ ] 5 proyectos creados (Domain, Application, Infrastructure, API, Tests)
- [ ] Dependencias entre proyectos configuradas correctamente
- [ ] NuGet packages instalados en cada proyecto
- [ ] Estructura de carpetas creada
- [ ] Program.cs configurado con Serilog
- [ ] appsettings.json configurado con connection string
- [ ] .gitignore creado
- [ ] Solución compila sin errores
- [ ] API ejecuta y muestra Swagger UI
- [ ] Commit y push realizados

## 📊 Coherencia con Tasks Anteriores

### Connection String
```
Host: oracle-db (nombre de servicio Docker)
Port: 1521
Service Name: XEPDB1 (NO XE)
User: EPRESCRIPTION_USER
Password: EprescriptionPass123!
```

### Nombres de Tablas
Usar exactamente los nombres de `DATABASE-SCHEMA-REFERENCE.md`:
- PATIENTS
- DOCTORS
- PRESCRIPTIONS
- MEDICATIONS
- etc.

### Encoding UTF-8
El connection string ya incluye configuración para UTF-8.

## 🎯 Próximos Pasos (Task 6)

Una vez completado Task 5, continuaremos con Task 6:
- Crear entidades del dominio
- Configurar EF Core
- Implementar repositorios
- Configurar DbContext
- Crear migraciones

## 📝 Notas Importantes

1. **No commitear secrets**: El .gitignore ya está configurado para ignorar appsettings.Development.json
2. **Clean Architecture**: Respetar las dependencias (Domain no depende de nada)
3. **Oracle Connection**: Usar nombre de servicio Docker `oracle-db`, no `localhost`
4. **Service Name**: Siempre usar `XEPDB1`, no `XE`

---

**Última actualización**: Noviembre 2024  
**Task**: 5 - Backend Structure  
**Branch**: feature/task-5-backend-structure  
**Status**: En progreso
