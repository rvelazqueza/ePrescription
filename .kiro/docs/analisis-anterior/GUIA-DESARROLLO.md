# 🚀 Guía de Desarrollo - ePrescription

## Opciones de Desarrollo

Tienes dos formas de trabajar con el proyecto:

### 🔧 Opción 1: Desarrollo Local (.NET local)

**Usa esto cuando**:
- Estás desarrollando activamente
- Necesitas debug con breakpoints
- Quieres hot reload automático
- Trabajas en Visual Studio

**Comando Rápido** (recomendado):
```powershell
.\quick-start-local.ps1
```

**Comando Completo**:
```powershell
.\start-dev-local.ps1
```

**Qué hace**:
- Verifica .NET y Docker
- Detiene el API en Docker (si está corriendo)
- Inicia Oracle y Keycloak en Docker
- Compila el proyecto .NET localmente
- Configura ambiente "Local" (usa appsettings.Local.json)
- Inicia el API con `dotnet watch` (hot reload)

**Ventajas**:
✅ Hot reload automático al guardar cambios
✅ Debug con breakpoints en Visual Studio
✅ Compilación más rápida
✅ IntelliSense completo
✅ Mejor experiencia de desarrollo

**Desventajas**:
❌ Requiere .NET instalado localmente
❌ Necesitas reiniciar PowerShell después de instalar .NET

---

### 🐳 Opción 2: Todo en Docker

**Usa esto cuando**:
- Quieres un ambiente consistente
- No tienes .NET instalado
- Estás probando el ambiente de producción
- Compartes el proyecto con otros

**Comando**:
```powershell
.\start-dev-docker.ps1
```

**Qué hace**:
- Inicia Oracle, Keycloak y API en Docker
- Todo corre en contenedores

**Ventajas**:
✅ No requiere .NET local
✅ Ambiente idéntico a producción
✅ Fácil de compartir con el equipo
✅ Consistente entre máquinas

**Desventajas**:
❌ Sin hot reload (necesitas rebuild)
❌ No puedes usar breakpoints
❌ Compilación más lenta
❌ Necesitas rebuild para ver cambios

---

## Comparación Rápida

| Característica | Local (.NET) | Docker |
|---|---|---|
| Hot Reload | ✅ Sí | ❌ No |
| Debug con Breakpoints | ✅ Sí | ❌ No |
| Velocidad de Compilación | ⚡ Rápida | 🐢 Lenta |
| Requiere .NET Local | ✅ Sí | ❌ No |
| Consistencia con Producción | ⚠️ Similar | ✅ Idéntico |
| Facilidad de Setup | ⚠️ Media | ✅ Fácil |

---

## Recomendación

### Para Desarrollo Diario
**Usa Desarrollo Local** (`.\start-dev-local.ps1`)

Es mucho más rápido y cómodo para desarrollar. Los cambios se ven inmediatamente.

### Para Testing Final
**Usa Docker** (`.\start-dev-docker.ps1`)

Antes de hacer commit, prueba en Docker para asegurar que funciona en el ambiente de producción.

---

## Workflow Recomendado

1. **Desarrollo**: Usa `.\start-dev-local.ps1`
   - Desarrolla con hot reload
   - Debug con breakpoints
   - Itera rápidamente

2. **Testing**: Usa `.\start-dev-docker.ps1`
   - Prueba en ambiente Docker
   - Verifica que todo funciona
   - Asegura consistencia

3. **Commit**: Sube cambios
   - Todo probado en ambos ambientes
   - Confianza en que funciona

---

## URLs Disponibles

En ambas opciones:

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health
- **Keycloak**: http://localhost:8080

---

## Comandos Útiles

### Desarrollo Local

```powershell
# Inicio rapido
.\quick-start-local.ps1

# Probar configuracion
.\test-local-api.ps1

# Compilar
cd eprescription-API
dotnet build

# Limpiar y recompilar
dotnet clean
dotnet restore
dotnet build

# Ejecutar sin hot reload
dotnet run --project src/ePrescription.API --urls http://localhost:5000
```

### Docker

```powershell
# Ver logs del API
docker logs -f eprescription-backend-api

# Detener todo
docker-compose down

# Reiniciar servicios
docker-compose restart

# Limpiar y rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Infraestructura

```powershell
# Solo Oracle y Keycloak
docker-compose up -d oracle-db keycloak

# Ver estado
docker ps

# Reiniciar Oracle
docker restart eprescription-oracle-db

# Reiniciar Keycloak
docker restart eprescription-keycloak
```

---

## Troubleshooting

Para problemas detallados, consulta: **[TROUBLESHOOTING-LOCAL.md](TROUBLESHOOTING-LOCAL.md)**

### Problemas Comunes

**1. .NET no se encuentra**
```powershell
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH
dotnet --version
```

**2. Puerto 5000 ocupado**
```powershell
docker stop eprescription-backend-api
```

**3. Oracle no conecta**
```powershell
docker restart eprescription-oracle-db
Start-Sleep -Seconds 30
```

**4. Keycloak no conecta**
```powershell
docker restart eprescription-keycloak
Start-Sleep -Seconds 20
```

**5. Error de compilación**
```powershell
cd eprescription-API
dotnet clean
dotnet restore
dotnet build
```

**6. Hot reload no funciona**
- Verifica que usas `dotnet watch run` (no solo `dotnet run`)
- Guarda el archivo correctamente
- Revisa errores en la consola

---

## Estado Actual

✅ .NET 10.0.100 instalado
✅ Proyecto compila sin errores
✅ Docker funcionando
✅ Infraestructura corriendo (Oracle + Keycloak)
✅ Scripts listos para ambas opciones

**¡Todo listo para desarrollar!** 🎉
