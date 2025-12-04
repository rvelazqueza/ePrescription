# Estrategia de Testing para ePrescription

## 📋 Resumen Ejecutivo

El proyecto ePrescription implementará una suite completa de pruebas automáticas en el **Task 16**, utilizando tecnologías modernas de .NET para garantizar calidad, confiabilidad y mantenibilidad del código.

---

## 🛠️ Tecnologías de Testing Previstas

### 1. Framework de Testing Principal

#### **xUnit** (Framework principal)
- **Propósito**: Framework de testing para .NET
- **Uso**: Tests unitarios y de integración
- **Ventajas**:
  - Moderno y ampliamente adoptado en .NET
  - Excelente integración con .NET 8
  - Soporte para tests paralelos
  - Extensible y flexible

**Paquetes**:
```xml
<PackageReference Include="xunit" Version="2.6.0" />
<PackageReference Include="xunit.runner.visualstudio" Version="2.5.0" />
```

### 2. Librerías de Assertions

#### **FluentAssertions**
- **Propósito**: Assertions legibles y expresivas
- **Uso**: Verificaciones en todos los tests
- **Ventajas**:
  - Sintaxis natural y legible
  - Mensajes de error descriptivos
  - Soporte para colecciones, excepciones, objetos complejos

**Ejemplo**:
```csharp
result.Should().NotBeNull();
result.Success.Should().BeTrue();
result.AccessToken.Should().NotBeNullOrEmpty();
```

**Paquete**:
```xml
<PackageReference Include="FluentAssertions" Version="6.12.0" />
```

### 3. Mocking y Fakes

#### **Moq** (Librería de mocking principal)
- **Propósito**: Crear mocks de dependencias
- **Uso**: Tests unitarios con dependencias aisladas
- **Ventajas**:
  - Sintaxis fluida
  - Verificación de llamadas
  - Setup de comportamientos

**Ejemplo**:
```csharp
var mockAuthService = new Mock<IAuthenticationService>();
mockAuthService
    .Setup(x => x.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
    .ReturnsAsync(new AuthenticationResult { Success = true });
```

**Paquete**:
```xml
<PackageReference Include="Moq" Version="4.20.0" />
```

#### **NSubstitute** (Alternativa a Moq)
- **Propósito**: Mocking con sintaxis más simple
- **Uso**: Tests donde Moq sea muy verboso
- **Ventajas**:
  - Sintaxis más limpia
  - Menos código boilerplate

**Paquete**:
```xml
<PackageReference Include="NSubstitute" Version="5.1.0" />
```

### 4. Tests de Integración

#### **WebApplicationFactory**
- **Propósito**: Testing de API endpoints end-to-end
- **Uso**: Tests de integración de controllers
- **Ventajas**:
  - Levanta la aplicación completa en memoria
  - Permite testing de endpoints reales
  - Integración con dependency injection

**Ejemplo**:
```csharp
public class AuthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    public AuthControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        // Arrange
        var request = new { username = "doctor.smith", password = "Doctor123!" };
        
        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
```

**Paquete**:
```xml
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.0.0" />
```

#### **Testcontainers**
- **Propósito**: Levantar contenedores Docker automáticamente para tests
- **Uso**: Tests de integración con Oracle y Keycloak reales
- **Ventajas**:
  - Tests con base de datos real (no in-memory)
  - Levanta Oracle automáticamente
  - Puede levantar Keycloak para tests de autenticación
  - Limpieza automática después de tests

**Ejemplo**:
```csharp
public class DatabaseIntegrationTests : IAsyncLifetime
{
    private readonly OracleContainer _oracleContainer;
    
    public DatabaseIntegrationTests()
    {
        _oracleContainer = new OracleBuilder()
            .WithImage("container-registry.oracle.com/database/express:21.3.0-xe")
            .WithPassword("TestPassword123!")
            .Build();
    }
    
    public async Task InitializeAsync()
    {
        await _oracleContainer.StartAsync();
    }
    
    public async Task DisposeAsync()
    {
        await _oracleContainer.DisposeAsync();
    }
}
```

**Paquetes**:
```xml
<PackageReference Include="Testcontainers" Version="3.6.0" />
<PackageReference Include="Testcontainers.Oracle" Version="3.6.0" />
<PackageReference Include="Testcontainers.Keycloak" Version="3.6.0" />
```

### 5. In-Memory Database (Alternativa Rápida)

#### **EF Core In-Memory Provider**
- **Propósito**: Tests rápidos sin base de datos real
- **Uso**: Tests unitarios de repositorios
- **Ventajas**:
  - Muy rápido
  - No requiere Docker
  - Ideal para tests unitarios

**Paquete**:
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="8.0.0" />
```

### 6. Cobertura de Código

#### **Coverlet**
- **Propósito**: Generar reportes de cobertura de código
- **Uso**: Medir qué porcentaje del código está cubierto por tests
- **Ventajas**:
  - Integración con xUnit
  - Reportes en múltiples formatos (Cobertura, JSON, lcov)
  - Integración con CI/CD

**Comando**:
```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura
```

**Paquete**:
```xml
<PackageReference Include="coverlet.collector" Version="6.0.0" />
<PackageReference Include="coverlet.msbuild" Version="6.0.0" />
```

---

## 📁 Estructura de Proyectos de Testing

### Proyectos Previstos (Task 16.1-16.4):

```
eprescription-API/
├── tests/
│   ├── EPrescription.Domain.Tests/          # Tests unitarios del dominio
│   ├── EPrescription.Application.Tests/     # Tests unitarios de casos de uso
│   ├── EPrescription.Infrastructure.Tests/  # Tests unitarios de infraestructura
│   └── EPrescription.API.IntegrationTests/  # Tests de integración de API
```

---

## 🧪 Tipos de Tests Previstos

### 1. Tests Unitarios (Unit Tests)

#### Domain Layer Tests (16.6-16.7)
- **Entidades**: Validación de reglas de negocio
- **Value Objects**: Validación de formato y reglas
- **Ejemplo**:
```csharp
[Fact]
public void Email_WithInvalidFormat_ShouldThrowException()
{
    // Arrange & Act
    Action act = () => Email.Create("invalid-email");
    
    // Assert
    act.Should().Throw<ArgumentException>();
}
```

#### Application Layer Tests (16.8-16.11)
- **Command Handlers**: Lógica de comandos
- **Query Handlers**: Lógica de consultas
- **Validators**: FluentValidation rules
- **Servicios**: AIAssistantService, AuditService, AuthService

**Ejemplo**:
```csharp
[Fact]
public async Task CreatePrescription_WithValidData_ShouldSucceed()
{
    // Arrange
    var mockRepo = new Mock<IPrescriptionRepository>();
    var handler = new CreatePrescriptionHandler(mockRepo.Object);
    
    // Act
    var result = await handler.Handle(command, CancellationToken.None);
    
    // Assert
    result.Should().NotBeNull();
    mockRepo.Verify(x => x.AddAsync(It.IsAny<Prescription>()), Times.Once);
}
```

#### Infrastructure Layer Tests (16.12)
- **Repositorios**: CRUD operations con in-memory database
- **Servicios externos**: Mocks de Keycloak, Hugging Face, WHO API

### 2. Tests de Integración (Integration Tests)

#### API Integration Tests (16.13-16.20)
- **WebApplicationFactory**: Levanta la API completa
- **Testcontainers**: Oracle y Keycloak reales
- **Endpoints**: Todos los controllers

**Ejemplo**:
```csharp
public class PrescriptionIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    
    [Fact]
    public async Task CreatePrescription_WithAuthentication_ShouldSucceed()
    {
        // Arrange
        var token = await GetAuthTokenAsync("doctor.smith", "Doctor123!");
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);
        
        var prescription = new CreatePrescriptionDto { /* ... */ };
        
        // Act
        var response = await _client.PostAsJsonAsync("/api/prescriptions", prescription);
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

#### Database Integration Tests (16.14)
- **Testcontainers Oracle**: Base de datos real
- **Migrations**: Verificar que las migraciones funcionen
- **Queries complejas**: Verificar joins y performance

### 3. Tests End-to-End (E2E)

#### Flujos Completos (16.20)
- Login → Crear prescripción → Dispensar
- Análisis de IA → Validar CIE-10 → Crear prescripción
- Búsqueda de pacientes → Ver historial → Generar reporte

---

## 📊 Cobertura de Código Objetivo

### Metas de Cobertura (Task 16.22):

| Capa | Objetivo | Prioridad |
|------|----------|-----------|
| **Domain** | 90%+ | Alta |
| **Application** | 85%+ | Alta |
| **Infrastructure** | 70%+ | Media |
| **API Controllers** | 80%+ | Alta |
| **Overall** | 80%+ | Alta |

### Áreas Críticas (100% cobertura):
- Validación de prescripciones
- Lógica de dispensación
- Sistema de auditoría
- Autenticación y autorización
- Análisis de IA

---

## 🔄 Integración con CI/CD

### Pipeline de Testing (Futuro):

```yaml
# Ejemplo de pipeline
test:
  - dotnet restore
  - dotnet build
  - dotnet test --collect:"XPlat Code Coverage"
  - reportgenerator -reports:**/coverage.cobertura.xml -targetdir:coverage
```

---

## 🎯 Respuesta a tu Pregunta sobre los Errores

### ¿Los errores menores afectarán las pruebas automáticas?

**Respuesta**: **NO, si arreglamos los roles ahora**

#### Escenario 1: Si NO arreglamos los roles
- ❌ Tests de autenticación con roles fallarán
- ❌ Tests de autorización fallarán
- ❌ Tests de integración de endpoints protegidos fallarán
- ⚠️ Tendremos que arreglar los roles antes del Task 16

#### Escenario 2: Si arreglamos los roles AHORA (5 minutos)
- ✅ Todos los tests funcionarán correctamente
- ✅ No habrá problemas en Task 16
- ✅ Los tests de integración con Testcontainers funcionarán
- ✅ Los tests de autorización pasarán

### Tecnologías que Usaremos para Probar Keycloak:

1. **Testcontainers.Keycloak** (Task 16.15)
   - Levanta Keycloak automáticamente para tests
   - Configura realm, client y usuarios programáticamente
   - Limpia todo después de los tests

2. **Mocks de IAuthenticationService** (Task 16.11)
   - Para tests unitarios que no necesitan Keycloak real
   - Más rápidos y aislados

3. **WebApplicationFactory con Keycloak real** (Task 16.16)
   - Tests de integración completos
   - Verifica que la autenticación funcione end-to-end

---

## 🎯 Recomendación Final

### Para Evitar Problemas Futuros:

**ARREGLA LOS ROLES AHORA** (5 minutos de trabajo manual):

1. Accede a Keycloak Admin Console
2. Asigna los roles a cada usuario
3. Ejecuta `./keycloak/verify-keycloak-setup.ps1` para confirmar
4. Continúa con confianza sabiendo que:
   - ✅ Task 8 (Autorización) funcionará
   - ✅ Task 16 (Testing) funcionará
   - ✅ Todos los endpoints protegidos funcionarán
   - ✅ No tendrás que volver a este problema

### Alternativa:

Si prefieres, puedo crear un script usando **Keycloak CLI (kcadm.sh)** que es más confiable que la REST API para asignar roles.

---

## 📚 Referencias del Task 16

### Subtareas de Testing:

**Tests Unitarios**:
- 16.6 - Tests de entidades del dominio
- 16.7 - Tests de value objects
- 16.8 - Tests de command handlers
- 16.9 - Tests de query handlers
- 16.10 - Tests de validadores FluentValidation
- 16.11 - Tests de servicios (AIAssistantService, **AuditService**, **AuthService**)
- 16.12 - Tests de repositorios

**Tests de Integración**:
- 16.13 - WebApplicationFactory setup
- 16.14 - **Testcontainers para Oracle**
- 16.15 - **Testcontainers para Keycloak** (opcional)
- 16.16 - Tests de endpoints de **autenticación** ⚠️ (necesita roles)
- 16.17 - Tests de endpoints de prescripciones
- 16.18 - Tests de endpoints de pacientes, médicos, farmacias
- 16.19 - Tests de endpoints de dispensación e inventario
- 16.20 - Tests de flujos completos

**Cobertura**:
- 16.21 - Coverlet para reportes
- 16.22 - Verificar 80%+ cobertura

---

## ✅ Conclusión

**Tecnologías Previstas**:
- ✅ xUnit (framework principal)
- ✅ FluentAssertions (assertions)
- ✅ Moq / NSubstitute (mocking)
- ✅ WebApplicationFactory (integration tests)
- ✅ Testcontainers (Oracle + Keycloak)
- ✅ EF Core In-Memory (tests rápidos)
- ✅ Coverlet (cobertura de código)

**Impacto de los Errores Actuales**:
- ⚠️ **Medio** - Afectará tests de autorización si no se arregla
- ✅ **Fácil de arreglar** - 5 minutos de trabajo manual
- ✅ **No afecta infraestructura** - Todo lo demás funciona perfectamente

**Acción Recomendada**:
Arregla los roles ahora para evitar problemas en Task 16 (Testing).
