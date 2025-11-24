# Guía Completa de Docker para ePrescription

Esta guía proporciona información detallada sobre el uso de Docker en el proyecto ePrescription.

## Tabla de Contenidos

- [Arquitectura de Contenedores](#arquitectura-de-contenedores)
- [Configuración Inicial](#configuración-inicial)
- [Comandos Básicos](#comandos-básicos)
- [Desarrollo con Docker](#desarrollo-con-docker)
- [Troubleshooting](#troubleshooting)
- [Mejores Prácticas](#mejores-prácticas)

## Arquitectura de Contenedores

El sistema ePrescription utiliza Docker Compose para orquestar múltiples servicios:

### Servicios

1. **oracle-db** - Oracle Database 21c Express Edition
   - Puerto: 1521 (Oracle) y 5500 (Enterprise Manager)
   - Volumen: `oracle-data` para persistencia
   - Health check: Verifica conexión SQL cada 30s
   - Tiempo de inicio: ~60s

2. **keycloak** - Servidor de autenticación
   - Puerto: 8080
   - Base de datos: Oracle (esquema KEYCLOAK)
   - Volumen: `keycloak-data` para configuración
   - Health check: Endpoint /health/ready cada 30s
   - Tiempo de inicio: ~90s (espera a Oracle)

3. **eprescription-api** - Backend .NET 8
   - Puerto: 8000 (externo) → 8080 (interno)
   - Depende de: Oracle y Keycloak
   - Health check: Endpoint raíz cada 30s
   - Tiempo de inicio: ~60s (espera a Oracle y Keycloak)

### Red Docker

Todos los servicios están conectados a la red `eprescription-network`:

- Los servicios se comunican usando **nombres de servicio** (no localhost)
- Ejemplo: El API se conecta a `oracle-db:1521` y `keycloak:8080`
- La red es de tipo `bridge` para aislamiento

### Volúmenes

- `oracle-data`: Datos de Oracle Database (persistente)
- `keycloak-data`: Configuración de Keycloak (persistente)

## Configuración Inicial

### 1. Prerrequisitos

```bash
# Verificar Docker
docker --version
# Debe ser 20.10.0 o superior

# Verificar Docker Compose
docker-compose --version
# Debe ser 2.0.0 o superior

# Verificar que Docker está corriendo
docker ps
```

### 2. Configurar Variables de Entorno

```bash
# Copiar plantilla
cp .env.example .env

# Editar con tus valores
nano .env  # o usar tu editor favorito
```

Variables importantes:
- `ORACLE_PWD`: Password del usuario SYS de Oracle
- `KEYCLOAK_CLIENT_SECRET`: Secret del cliente de Keycloak
- `HUGGINGFACE_API_KEY`: API key para el asistente de IA
- `WHO_API_CLIENT_ID` y `WHO_API_CLIENT_SECRET`: Credenciales WHO API
- `DEEPL_API_KEY`: API key para traducción

### 3. Iniciar Servicios

```bash
# Opción 1: Script automático (recomendado)
.\start-docker.ps1  # Windows
./start-docker.sh   # Linux/Mac

# Opción 2: Manual
docker-compose up -d
```

### 4. Verificar Inicio

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Esperar a que todos estén "healthy"
watch docker-compose ps  # Linux/Mac
# En Windows, ejecutar docker-compose ps cada 10 segundos
```

## Comandos Básicos

### Gestión de Servicios

```bash
# Iniciar todos los servicios
docker-compose up -d

# Iniciar un servicio específico
docker-compose up -d eprescription-api

# Detener todos los servicios
docker-compose down

# Detener sin eliminar contenedores
docker-compose stop

# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart eprescription-api

# Ver estado
docker-compose ps

# Ver recursos (CPU, memoria)
docker stats
```

### Ver Logs

```bash
# Logs de todos los servicios (seguir en tiempo real)
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f eprescription-api
docker-compose logs -f oracle-db
docker-compose logs -f keycloak

# Últimas N líneas
docker-compose logs --tail=50 eprescription-api

# Logs desde una fecha
docker-compose logs --since 2024-01-01T00:00:00 eprescription-api

# Logs hasta una fecha
docker-compose logs --until 2024-01-01T23:59:59 eprescription-api
```

### Ejecutar Comandos en Contenedores

```bash
# Bash interactivo en el API
docker exec -it eprescription-api bash

# Ejecutar comando único
docker exec eprescription-api ls -la /app

# SQL*Plus en Oracle
docker exec -it eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@XEPDB1

# Ver configuración del API
docker exec eprescription-api cat /app/appsettings.json
```

## Desarrollo con Docker

### Workflow de Desarrollo

1. **Hacer cambios en el código**
   ```bash
   # Editar archivos en tu IDE
   code eprescription-API/src/ePrescription.API/Controllers/PatientsController.cs
   ```

2. **Reconstruir imagen**
   ```bash
   docker-compose build eprescription-api
   ```

3. **Reiniciar contenedor**
   ```bash
   docker-compose up -d eprescription-api
   ```

4. **Ver logs para verificar**
   ```bash
   docker-compose logs -f eprescription-api
   ```

5. **Probar cambios**
   ```bash
   # Usar Postman o curl
   curl http://localhost:8000/api/patients
   ```

### Rebuild Rápido

```bash
# Rebuild y reinicio en un comando
docker-compose build eprescription-api && docker-compose up -d eprescription-api

# Ver logs inmediatamente
docker-compose build eprescription-api && docker-compose up -d eprescription-api && docker-compose logs -f eprescription-api
```

### Hot Reload (Desarrollo Local)

Para desarrollo más rápido, puedes montar el código como volumen:

```yaml
# Agregar a docker-compose.yml (solo para desarrollo)
services:
  eprescription-api:
    volumes:
      - ./eprescription-API/src:/app/src
```

Luego usar `dotnet watch` en el contenedor.

### Debugging

```bash
# Ver variables de entorno del contenedor
docker exec eprescription-api env

# Ver procesos corriendo
docker exec eprescription-api ps aux

# Ver puertos expuestos
docker port eprescription-api

# Inspeccionar contenedor
docker inspect eprescription-api

# Ver health check status
docker inspect eprescription-api | grep -A 10 Health
```

## Troubleshooting

### Problema: Contenedor no inicia

```bash
# Ver logs completos
docker-compose logs eprescription-api

# Ver últimos errores
docker-compose logs --tail=100 eprescription-api | grep -i error

# Verificar health check
docker inspect eprescription-api | grep -A 10 Health

# Reiniciar servicio
docker-compose restart eprescription-api
```

### Problema: No puede conectarse a Oracle

```bash
# Verificar que Oracle está corriendo
docker-compose ps oracle-db

# Ver logs de Oracle
docker-compose logs oracle-db

# Probar conexión desde el API
docker exec eprescription-api curl -v telnet://oracle-db:1521

# Verificar red
docker network inspect eprescription-network
```

### Problema: No puede conectarse a Keycloak

```bash
# Verificar que Keycloak está corriendo
docker-compose ps keycloak

# Ver logs de Keycloak
docker-compose logs keycloak

# Probar endpoint de health
docker exec eprescription-api curl http://keycloak:8080/health/ready

# Verificar configuración
docker exec eprescription-api env | grep KEYCLOAK
```

### Problema: Puerto ya en uso

```bash
# Ver qué está usando el puerto 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# Cambiar puerto en docker-compose.yml
ports:
  - "8001:8080"  # Usar 8001 en lugar de 8000
```

### Problema: Contenedor "unhealthy"

```bash
# Ver detalles del health check
docker inspect eprescription-api | grep -A 20 Health

# Probar health check manualmente
docker exec eprescription-api curl -f http://localhost:8080/

# Ver logs durante health check
docker-compose logs -f eprescription-api
```

### Problema: Cambios no se reflejan

```bash
# Rebuild sin caché
docker-compose build --no-cache eprescription-api

# Eliminar contenedor y recrear
docker-compose rm -f eprescription-api
docker-compose up -d eprescription-api

# Limpiar todo y empezar de nuevo
docker-compose down
docker system prune -a
docker-compose up -d
```

### Problema: Base de datos corrupta

```bash
# Backup antes de limpiar
docker exec eprescription-oracle-db sh -c 'expdp eprescription_user/EprescriptionPass123!@XEPDB1 directory=DATA_PUMP_DIR dumpfile=backup.dmp'

# Eliminar volumen y recrear
docker-compose down -v
docker-compose up -d

# Restaurar backup
docker exec eprescription-oracle-db sh -c 'impdp eprescription_user/EprescriptionPass123!@XEPDB1 directory=DATA_PUMP_DIR dumpfile=backup.dmp'
```

## Mejores Prácticas

### 1. Gestión de Secrets

❌ **NO hacer:**
```bash
# NO commitear .env con secrets reales
git add .env
```

✅ **SÍ hacer:**
```bash
# Usar .env.example como plantilla
cp .env.example .env
# Editar .env localmente
# .env está en .gitignore
```

### 2. Logs

```bash
# Rotar logs para evitar que crezcan demasiado
docker-compose logs --tail=1000 > logs-$(date +%Y%m%d).txt

# Limpiar logs antiguos
docker system prune -a
```

### 3. Backups

```bash
# Backup automático diario (agregar a cron/task scheduler)
docker exec eprescription-oracle-db sh -c 'expdp eprescription_user/EprescriptionPass123!@XEPDB1 directory=DATA_PUMP_DIR dumpfile=backup-$(date +%Y%m%d).dmp'
```

### 4. Monitoreo

```bash
# Ver recursos en tiempo real
docker stats

# Ver eventos de Docker
docker events

# Configurar alertas (ejemplo con Prometheus/Grafana)
# Ver: https://docs.docker.com/config/daemon/prometheus/
```

### 5. Seguridad

```bash
# Escanear imágenes por vulnerabilidades
docker scan eprescription-api

# Actualizar imágenes base regularmente
docker-compose pull
docker-compose up -d

# Usar secrets de Docker (producción)
docker secret create keycloak_secret keycloak_secret.txt
```

### 6. Performance

```bash
# Limitar recursos por contenedor
services:
  eprescription-api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 7. Networking

```bash
# Usar nombres de servicio, no IPs
# ✅ Correcto
ConnectionString: "Host=oracle-db;Port=1521;..."

# ❌ Incorrecto
ConnectionString: "Host=172.18.0.2;Port=1521;..."
```

## Comandos Avanzados

### Inspección de Red

```bash
# Ver todas las redes
docker network ls

# Inspeccionar red del proyecto
docker network inspect eprescription-network

# Ver IPs de contenedores
docker network inspect eprescription-network | grep -A 3 IPv4Address
```

### Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect eprescription_oracle-data

# Backup de volumen
docker run --rm -v eprescription_oracle-data:/data -v $(pwd):/backup alpine tar czf /backup/oracle-backup.tar.gz /data

# Restaurar volumen
docker run --rm -v eprescription_oracle-data:/data -v $(pwd):/backup alpine tar xzf /backup/oracle-backup.tar.gz -C /
```

### Limpieza

```bash
# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes sin usar
docker image prune -a

# Limpiar volúmenes sin usar
docker volume prune

# Limpiar todo (CUIDADO)
docker system prune -a --volumes
```

## Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Oracle Database on Docker](https://github.com/oracle/docker-images/tree/main/OracleDatabase)
- [Keycloak on Docker](https://www.keycloak.org/server/containers)
- [.NET on Docker](https://docs.microsoft.com/en-us/dotnet/core/docker/introduction)

---

**Última actualización**: Noviembre 2024
