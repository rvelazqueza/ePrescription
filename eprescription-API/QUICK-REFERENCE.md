# Quick Reference - Task 5

Referencia rápida de comandos, configuraciones y decisiones para Task 5.

## 🎯 Proyectos a Crear

| Proyecto | Tipo | Framework | Ubicación |
|----------|------|-----------|-----------|
| EPrescription.Domain | Class Library | .NET 8.0 | src/ |
| EPrescription.Application | Class Library | .NET 8.0 | src/ |
| EPrescription.Infrastructure | Class Library | .NET 8.0 | src/ |
| EPrescription.API | ASP.NET Core Web API | .NET 8.0 | src/ |
| EPrescription.Tests | xUnit Test Project | .NET 8.0 | tests/ |

## 🔗 Dependencias entre Proyectos

```
Domain (no dependencies)
  ↑
Application → Domain
  ↑
Infrastructure → Domain, Application
  ↑
API → Application, Infrastructure
  ↑
Tests → Domain, Application, Infrastructure, API
```

## 📦 NuGet Packages por Proyecto

### Domain
```
(ninguno - debe ser puro)
```

### Application
```
FluentValidation
FluentValidation.DependencyInjectionExtensions
AutoMapper
AutoMapper.Extensions.Microsoft.DependencyInjection
MediatR
```

### Infrastructure
```
Microsoft.EntityFrameworkCore (8.0.x)
Microsoft.EntityFrameworkCore.Design (8.0.x)
Oracle.EntityFrameworkCore (8.0.x)
Serilog
Serilog.Sinks.Console
Serilog.Sinks.File
```

### API
```
Swashbuckle.AspNetCore (ya instalado)
Serilog.AspNetCore
Serilog.Sinks.Console
Microsoft.AspNetCore.Authentication.JwtBearer (8.0.x)
```

### Tests
```
xunit (ya instalado)
xunit.runner.visualstudio (ya instalado)
Moq
FluentAssertions
Microsoft.EntityFrameworkCore.InMemory (8.0.x)
```

## 🔌 Connection String

```json
"ConnectionStrings": {
  "OracleConnection": "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle-db)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XEPDB1)));User Id=EPRESCRIPTION_USER;Password=EprescriptionPass123!;"
}
```

**Importante**:
- Host: `oracle-db` (nombre de servicio Docker, NO localhost)
- Service Name: `XEPDB1` (NO XE)
- User: `EPRESCRIPTION_USER`

## 📁 Estructura de Carpetas

### Domain
```
Entities/
ValueObjects/
Interfaces/
  Repositories/
  Services/
Common/
```

### Application
```
UseCases/
  Patients/
  Prescriptions/
  Medications/
DTOs/
Interfaces/
Mappings/
Validators/
```

### Infrastructure
```
Data/
  Configurations/
  Migrations/
Repositories/
Services/
DependencyInjection.cs
```

### API
```
Controllers/
Middleware/
Extensions/
Program.cs
appsettings.json
```

### Tests
```
Domain/
Application/
Infrastructure/
API/
```

## ⚙️ Program.cs Básico

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

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure pipeline
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

## 🔒 appsettings.json

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

## 🚀 Comandos Git

```bash
# Ver estado
git status

# Agregar archivos
git add .

# Commit
git commit -m "feat(task-5): Create .NET 8 backend structure with Clean Architecture

- Created EPrescription.sln solution
- Created 5 projects (Domain, Application, Infrastructure, API, Tests)
- Configured project dependencies (Clean Architecture)
- Installed NuGet packages
- Created folder structure
- Configured Program.cs and appsettings.json

Subtasks completed: 5.1-5.13"

# Push
git push origin feature/task-5-backend-structure
```

## ✅ Checklist Rápido

- [ ] Solución creada
- [ ] 5 proyectos creados
- [ ] Dependencias configuradas
- [ ] NuGet packages instalados
- [ ] Carpetas creadas
- [ ] Program.cs configurado
- [ ] appsettings.json configurado
- [ ] .gitignore creado
- [ ] Compila sin errores
- [ ] API ejecuta correctamente
- [ ] Commit y push

## 🎯 Nombres de Tablas (para Task 6)

Usar exactamente estos nombres de `DATABASE-SCHEMA-REFERENCE.md`:

```
ADDRESSES
ADMINISTRATION_ROUTES
AI_ANALYSIS_LOGS
AUDIT_LOGS
CIE10_CATALOG
DISPENSATION_ITEMS
DISPENSATIONS
DOCTOR_MEDICAL_CENTER
DOCTORS
DRUG_INTERACTIONS
INVENTORY
MEDICAL_CENTERS
MEDICATIONS
PATIENT_ALLERGIES
PATIENT_EMERGENCY_CONTACTS
PATIENTS
PERMISSIONS
PHARMACIES
PRESCRIPTION_DIAGNOSES
PRESCRIPTION_MEDICATIONS
PRESCRIPTIONS
ROLE_PERMISSIONS
ROLES
SPECIALTIES
USER_ROLES
USERS
```

## 📊 Coherencia con Tasks Anteriores

### Task 2 (Esquema BD)
- ✅ Usar Service Name: XEPDB1
- ✅ Usar esquema: EPRESCRIPTION_USER
- ✅ Nombres de tablas exactos

### Task 3 (Seed Data)
- ✅ Datos de prueba disponibles
- ✅ UTF-8 configurado
- ✅ ~500+ registros para testing

### Task 4 (Docker Oracle)
- ✅ Usar nombre de servicio: oracle-db
- ✅ Puerto: 1521
- ✅ Service Name: XEPDB1

---

**Branch**: feature/task-5-backend-structure  
**Status**: En progreso  
**Siguiente**: Task 6 - Domain Entities & EF Core
