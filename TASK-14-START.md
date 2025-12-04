# Task 14 - INICIO: Docker Backend Configuration

## 🎯 Estado Actual

**Fecha**: 21 de Noviembre, 2024  
**Branch**: `feature/task-14-docker-backend`  
**Task Anterior**: Task 13 ✅ Mergeado exitosamente a develop  
**Estado Docker**: ✅ Servicios corriendo (Oracle, Keycloak, API)

## 📋 Objetivo del Task 14

Configurar Docker completo para backend API con:
- ✅ Dockerfile multi-stage optimizado
- ✅ docker-compose.yml completo con todos los servicios
- ✅ Variables de entorno configuradas (.env.example)
- ✅ Health checks implementados
- ✅ Red Docker personalizada
- ✅ Documentación completa

## 🔍 Análisis del Estado Actual

### Archivos Docker Existentes

Actualmente tenemos:
1. ✅ `docker-compose.yml` - Con Oracle y Keycloak
2. ✅ `eprescription-API/Dockerfile` - Dockerfile básico del API
3. ⚠️ `.env` - Variables de entorno (NO debe commitearse)
4. ❌ `.env.example` - NO existe (necesitamos crearlo)

### Servicios Docker Actuales

```
CONTAINER ID   IMAGE                                                      STATUS
bcee1d7dbe1d   eprescription-eprescription-api                            Up 31 minutes (unhealthy)
3c71001a2c86   eprescription-keycloak                                     Up 9 hours (healthy)
ee2dd16cd128   container-registry.oracle.com/database/express:21.3.0-xe   Up 9 hours (healthy)
```

**Observación**: El API está "unhealthy" - necesitamos configurar health check correcto.

## 📝 Plan de Ejecución del Task 14

### Fase 1: Dockerfile Optimizado (14.1-14.2) - 2 horas

**Objetivo**: Crear Dockerfile multi-stage optimizado

**Tareas**:
- [ ] 14.1 Crear Dockerfile multi-stage para backend .NET 8
  - Stage 1: Build (SDK)
  - Stage 2: Runtime (aspnet)
  - Optimizar capas
  - Reducir tamaño de imagen

- [ ] 14.2 Optimizar imagen Docker
  - Multi-stage build
  - Minimizar capas
  - Usar .dockerignore
  - Configurar seguridad

**Archivos a modificar**:
- `eprescription-API/Dockerfile`
- `eprescription-API/.dockerignore` (crear si no existe)

### Fase 2: Docker Compose Completo (14.3-14.8) - 2-3 horas

**Objetivo**: Configurar docker-compose.yml completo

**Tareas**:
- [ ] 14.3 Actualizar docker-compose.yml agregando servicio backend-api
- [ ] 14.4 Configurar variables de entorno para backend
- [ ] 14.5 Configurar dependencias entre servicios (depends_on)
- [ ] 14.6 Exponer puertos 5000 (HTTP) y 5001 (HTTPS)
- [ ] 14.7 Configurar health check para backend API
- [ ] 14.8 Configurar red Docker personalizada (eprescription-network)

**Archivos a modificar**:
- `docker-compose.yml`

### Fase 3: Variables de Entorno (14.9-14.10) - 1 hora

**Objetivo**: Configurar variables de entorno correctamente

**Tareas**:
- [ ] 14.9 Crear archivo .env.example con todas las variables necesarias
- [ ] 14.10 Agregar .env a .gitignore (verificar que ya esté)

**Archivos a crear/modificar**:
- `.env.example` (crear)
- `.gitignore` (verificar)

### Fase 4: Pruebas y Verificación (14.11-14.14) - 1-2 horas

**Objetivo**: Probar configuración Docker completa

**Tareas**:
- [ ] 14.11 Probar docker-compose up -d con todos los servicios
- [ ] 14.12 Verificar logs de cada servicio
- [ ] 14.13 Verificar conectividad entre servicios
- [ ] 14.14 Probar endpoints desde Postman

**Comandos a ejecutar**:
```powershell
# Rebuild y reiniciar
docker-compose down
docker-compose build
docker-compose up -d

# Verificar logs
docker-compose logs -f eprescription-api

# Probar endpoints
curl http://localhost:8000/swagger
```

### Fase 5: Documentación (14.15-14.17) - 1 hora

**Objetivo**: Documentar configuración Docker

**Tareas**:
- [ ] 14.15 Documentar comandos Docker en README.md
- [ ] 14.16 Crear script de inicio rápido (start-docker.sh / start-docker.bat)
- [ ] 14.17 Commit y push de configuración Docker completa

**Archivos a crear/modificar**:
- `README.md` (actualizar)
- `start-docker.sh` (crear)
- `start-docker.bat` (crear)
- `docs/DOCKER_SETUP.md` (crear)

## 🔧 Configuración Técnica

### Dockerfile Multi-Stage

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/ePrescription.API/ePrescription.API.csproj", "ePrescription.API/"]
COPY ["src/ePrescription.Application/ePrescription.Application.csproj", "ePrescription.Application/"]
COPY ["src/ePrescription.Domain/ePrescription.Domain.csproj", "ePrescription.Domain/"]
COPY ["src/ePrescription.Infrastructure/ePrescription.Infrastructure.csproj", "ePrescription.Infrastructure/"]
RUN dotnet restore "ePrescription.API/ePrescription.API.csproj"
COPY src/ .
RUN dotnet build "ePrescription.API/ePrescription.API.csproj" -c Release -o /app/build
RUN dotnet publish "ePrescription.API/ePrescription.API.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
EXPOSE 8081
ENTRYPOINT ["dotnet", "ePrescription.API.dll"]
```

### Docker Compose - Servicio Backend

```yaml
services:
  eprescription-api:
    build:
      context: ./eprescription-API
      dockerfile: Dockerfile
    container_name: eprescription-api
    ports:
      - "5000:8080"
      - "5001:8081"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=${DB_CONNECTION_STRING}
      - Keycloak__Authority=http://keycloak:8080/realms/eprescription
      - Keycloak__ClientId=${KEYCLOAK_CLIENT_ID}
      - Keycloak__ClientSecret=${KEYCLOAK_CLIENT_SECRET}
    depends_on:
      oracle-db:
        condition: service_healthy
      keycloak:
        condition: service_healthy
    networks:
      - eprescription-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Variables de Entorno (.env.example)

```env
# Database
DB_CONNECTION_STRING=User Id=eprescription_user;Password=YOUR_PASSWORD;Data Source=oracle-db:1521/XE

# Keycloak
KEYCLOAK_CLIENT_ID=eprescription-api
KEYCLOAK_CLIENT_SECRET=YOUR_CLIENT_SECRET

# External APIs
HUGGINGFACE_API_KEY=YOUR_API_KEY
WHO_API_CLIENT_ID=YOUR_CLIENT_ID
WHO_API_CLIENT_SECRET=YOUR_CLIENT_SECRET
DEEPL_API_KEY=YOUR_API_KEY

# Oracle
ORACLE_PASSWORD=YOUR_ORACLE_PASSWORD
```

## 📊 Checklist de Verificación

### Pre-Inicio
- [x] Task 13 mergeado a develop
- [x] Branch `feature/task-14-docker-backend` creada
- [x] Docker Desktop corriendo
- [x] Servicios actuales funcionando

### Durante Ejecución
- [ ] Dockerfile multi-stage creado
- [ ] docker-compose.yml actualizado
- [ ] .env.example creado
- [ ] Health checks configurados
- [ ] Red Docker configurada
- [ ] Pruebas exitosas
- [ ] Documentación completa

### Post-Ejecución
- [ ] Todos los servicios corriendo (healthy)
- [ ] Endpoints accesibles desde Postman
- [ ] Logs sin errores
- [ ] Documentación actualizada
- [ ] Commit y push realizados

## 🚀 Comandos Útiles

### Docker Compose
```powershell
# Rebuild y reiniciar
docker-compose build eprescription-api
docker-compose up -d eprescription-api

# Ver logs
docker logs -f eprescription-api

# Ver todos los servicios
docker-compose ps

# Detener todo
docker-compose down

# Reiniciar todo
docker-compose restart
```

### Docker
```powershell
# Ver contenedores
docker ps

# Ver imágenes
docker images | grep eprescription

# Entrar al contenedor
docker exec -it eprescription-api bash

# Ver logs
docker logs eprescription-api --tail 100
```

### Testing
```powershell
# Probar health endpoint
curl http://localhost:8000/health

# Probar Swagger
curl http://localhost:8000/swagger/index.html

# Probar API
curl http://localhost:8000/api/prescriptions
```

## ⚠️ Consideraciones Importantes

### Según Steering Rules

**IMPORTANTE**: Todos los tasks de REST API deben desarrollarse y probarse usando Docker, NO desarrollo local.

**Workflow**:
1. Hacer cambios en código
2. Rebuild imagen: `docker-compose build eprescription-api`
3. Reiniciar: `docker-compose up -d eprescription-api`
4. Ver logs: `docker logs -f eprescription-api`
5. Probar: http://localhost:8000/swagger

### Comunicación entre Contenedores

Los servicios se comunican usando **nombres de servicio Docker**:
- Backend → Oracle: `oracle-db:1521`
- Backend → Keycloak: `http://keycloak:8080`
- NO usar `localhost` dentro de contenedores

### Secrets

**NUNCA commitear**:
- ❌ API keys
- ❌ Passwords
- ❌ Client secrets
- ❌ Archivo `.env` con valores reales

**SÍ commitear**:
- ✅ `.env.example` con placeholders
- ✅ Documentación de configuración

## 📚 Referencias

- Docker multi-stage builds: https://docs.docker.com/build/building/multi-stage/
- .NET Docker images: https://hub.docker.com/_/microsoft-dotnet
- Docker Compose: https://docs.docker.com/compose/
- Health checks: https://docs.docker.com/engine/reference/builder/#healthcheck

## 🎯 Objetivo Final

Al completar Task 14, tendremos:
- ✅ Dockerfile optimizado y multi-stage
- ✅ docker-compose.yml completo con 3 servicios
- ✅ Variables de entorno configuradas correctamente
- ✅ Health checks funcionando
- ✅ Red Docker personalizada
- ✅ Documentación completa
- ✅ Scripts de inicio rápido

## 📈 Progreso Esperado

**Tiempo estimado**: 6-8 horas  
**Commits esperados**: 5-7 commits  
**Archivos a modificar**: 8-10 archivos  
**Líneas de código**: ~300-400 líneas

---

**Estado**: ✅ **LISTO PARA COMENZAR TASK 14**  
**Branch**: `feature/task-14-docker-backend`  
**Próximo Paso**: Task 14.1 - Crear Dockerfile multi-stage
