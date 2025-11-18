# ✅ Resumen - Desarrollo Local Configurado

## Lo que se Arregló

### 1. Instalación de .NET
- ✅ .NET SDK 10.0.100 instalado via `winget`
- ✅ PATH configurado permanentemente
- ✅ Scripts incluyen fix automático del PATH

### 2. Configuración del Proyecto
- ✅ Creado `appsettings.Local.json` con configuración para localhost
- ✅ Proyecto compila sin errores
- ✅ Configuración de ambiente "Local"

### 3. Scripts Creados

#### Scripts de Inicio
- **`quick-start-local.ps1`** - Inicio rápido (recomendado)
  - Verifica todo automáticamente
  - Inicia infraestructura
  - Compila y ejecuta el API
  
- **`start-dev-local.ps1`** - Inicio completo con más detalles
  - Más verbose, muestra cada paso
  - Útil para debugging

- **`start-dev-docker.ps1`** - Volver a Docker
  - Inicia todo en contenedores

#### Scripts de Utilidad
- **`test-local-api.ps1`** - Verifica que todo esté listo
- **`fix-dotnet-simple.ps1`** - Arregla PATH de .NET

### 4. Documentación
- **`GUIA-DESARROLLO.md`** - Guía completa de desarrollo
- **`DESARROLLO-LOCAL-LISTO.md`** - Documentación del setup
- **`TROUBLESHOOTING-LOCAL.md`** - Solución de problemas

---

## Cómo Usar

### Inicio Rápido (Primera Vez)

```powershell
# 1. Verificar que todo está listo
.\test-local-api.ps1

# 2. Iniciar desarrollo local
.\quick-start-local.ps1
```

### Uso Diario

```powershell
# Simplemente ejecuta
.\quick-start-local.ps1
```

El script hace todo automáticamente:
1. Verifica .NET y Docker
2. Inicia Oracle y Keycloak
3. Detiene API en Docker si existe
4. Compila el proyecto
5. Inicia el API con hot reload

---

## URLs Disponibles

Una vez iniciado:

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health
- **Keycloak Admin**: http://localhost:8080

---

## Características del Desarrollo Local

### Hot Reload Automático
Los cambios en el código se reflejan automáticamente sin reiniciar el API.

**Archivos que activan hot reload:**
- Controllers (`.cs`)
- Services (`.cs`)
- DTOs (`.cs`)
- Configuración (`appsettings.Local.json`)

**Archivos que NO activan hot reload:**
- `Program.cs` (requiere reinicio)
- `.csproj` (requiere rebuild)

### Debug con Breakpoints

**Opción 1: Visual Studio**
1. Abrir `eprescription-API/EPrescription.sln`
2. Establecer `ePrescription.API` como proyecto de inicio
3. Presionar F5

**Opción 2: VS Code**
1. Abrir carpeta `eprescription-API`
2. Agregar breakpoints
3. F5 para debug

### Logs en Tiempo Real

Los logs se muestran en la consola donde corre el API:
- Requests HTTP
- Queries a base de datos
- Errores y excepciones
- Información de debug

También se guardan en: `eprescription-API/src/ePrescription.API/logs/`

---

## Configuración

### Archivo: `appsettings.Local.json`

```json
{
  "Keycloak": {
    "Url": "http://localhost:8080",
    "Authority": "http://localhost:8080/realms/eprescription"
  },
  "ConnectionStrings": {
    "OracleConnection": "...HOST=localhost..."
  }
}
```

**Diferencias con Docker:**
- Docker usa: `keycloak:8080` y `oracle-db`
- Local usa: `localhost:8080` y `localhost`

### Variable de Ambiente

El script establece automáticamente:
```powershell
$env:ASPNETCORE_ENVIRONMENT = "Local"
```

Esto hace que ASP.NET Core cargue `appsettings.Local.json`

---

## Ventajas vs Docker

| Característica | Local | Docker |
|---|---|---|
| Hot Reload | ✅ Instantáneo | ❌ Requiere rebuild |
| Debug | ✅ Breakpoints | ❌ No disponible |
| Velocidad | ⚡ Muy rápida | 🐢 Más lenta |
| Compilación | ⚡ 2-3 segundos | 🐢 30-60 segundos |
| Setup Inicial | ⚠️ Requiere .NET | ✅ Solo Docker |
| Consistencia | ⚠️ Depende de tu máquina | ✅ Idéntico siempre |

**Recomendación:** Usa Local para desarrollo, Docker para testing final.

---

## Workflow Recomendado

### 1. Inicio del Día
```powershell
.\quick-start-local.ps1
```

### 2. Desarrollo
- Edita código
- Guarda archivo
- Hot reload automático
- Prueba en Swagger

### 3. Testing
- Prueba endpoints en Swagger
- Verifica logs en consola
- Debug con breakpoints si es necesario

### 4. Antes de Commit
```powershell
# Detener API local (Ctrl+C)

# Probar en Docker
.\start-dev-docker.ps1

# Verificar que funciona igual
```

### 5. Fin del Día
```powershell
# Detener API local (Ctrl+C)

# Opcional: Detener infraestructura
docker-compose stop
```

---

## Problemas Comunes

### "dotnet no se encuentra"
```powershell
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH
```

### "Puerto 5000 ocupado"
```powershell
docker stop eprescription-backend-api
```

### "Oracle no conecta"
```powershell
docker restart eprescription-oracle-db
Start-Sleep -Seconds 30
```

**Para más problemas:** Ver [TROUBLESHOOTING-LOCAL.md](TROUBLESHOOTING-LOCAL.md)

---

## Próximos Pasos

Ahora que tienes desarrollo local funcionando:

1. **Familiarízate con hot reload**
   - Haz un cambio pequeño en un controller
   - Guarda y ve el cambio inmediato

2. **Prueba debug con breakpoints**
   - Abre en Visual Studio
   - Agrega breakpoint
   - Haz request desde Swagger

3. **Explora Swagger**
   - http://localhost:5000/swagger
   - Prueba los endpoints
   - Ve la documentación automática

4. **Revisa los logs**
   - Observa la consola
   - Ve qué queries se ejecutan
   - Identifica errores rápidamente

---

## Comandos de Referencia Rápida

```powershell
# Inicio rápido
.\quick-start-local.ps1

# Verificar configuración
.\test-local-api.ps1

# Volver a Docker
.\start-dev-docker.ps1

# Ver estado de servicios
docker ps

# Compilar manualmente
cd eprescription-API
dotnet build

# Limpiar y recompilar
dotnet clean
dotnet restore
dotnet build
```

---

## Estado Actual

✅ .NET instalado y funcionando
✅ Proyecto compila sin errores
✅ Configuración local creada
✅ Scripts de inicio listos
✅ Documentación completa
✅ Infraestructura Docker corriendo

**¡Todo listo para desarrollar!** 🚀
