# Docker Setup - Oracle Database

## 📦 Primera Vez - Descarga de Imagen

La primera vez que ejecutes `docker-compose up`, Docker descargará la imagen de Oracle Database Express Edition (aproximadamente 2-3 GB). Esto puede tardar 10-20 minutos dependiendo de tu conexión a internet.

```bash
# Iniciar Oracle Database
docker-compose up -d oracle-db

# Ver progreso de descarga
docker-compose logs -f oracle-db
```

## ⏱️ Tiempo de Inicialización

Después de descargar la imagen, Oracle tarda aproximadamente **2-3 minutos** en inicializar completamente la primera vez:

1. **0-30 segundos**: Creación del contenedor
2. **30-90 segundos**: Inicialización de Oracle Database
3. **90-180 segundos**: Ejecución de scripts de inicialización
4. **180+ segundos**: Base de datos lista para conexiones

## ✅ Verificar Estado

### Opción 1: Docker Compose

```bash
# Ver estado del contenedor
docker-compose ps

# Debería mostrar:
# NAME                      STATUS              PORTS
# eprescription-oracle-db   Up (healthy)        0.0.0.0:1521->1521/tcp
```

### Opción 2: Health Check

```bash
# Verificar health check
docker inspect eprescription-oracle-db --format='{{.State.Health.Status}}'

# Debería mostrar: healthy
```

### Opción 3: Logs

```bash
# Ver logs en tiempo real
docker-compose logs -f oracle-db

# Buscar este mensaje:
# "DATABASE IS READY TO USE!"
```

## 🔌 Probar Conexión

### Desde SQL*Plus (dentro del contenedor)

```bash
# Conectar como eprescription_user
docker exec -it eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

# Si la conexión es exitosa, verás:
# SQL> 

# Probar query
SQL> SELECT 'Conexión exitosa' FROM DUAL;
SQL> EXIT;
```

### Desde Oracle SQL Developer

1. Abrir Oracle SQL Developer
2. Crear nueva conexión:
   - **Name**: ePrescription Local
   - **Username**: eprescription_user
   - **Password**: EprescriptionPass123!
   - **Hostname**: localhost
   - **Port**: 1521
   - **Service name**: XEPDB1 (⚠️ Importante: usar XEPDB1, no XE)
3. Click en "Test" - debería mostrar "Status: Success"
4. Click en "Connect"

**Nota**: Oracle XE 21c usa una arquitectura multitenant. El contenedor raíz es `XE` pero las aplicaciones deben conectarse al PDB (Pluggable Database) llamado `XEPDB1`.

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker logs eprescription-oracle-db

# Verificar que el puerto 1521 no esté en uso
netstat -an | findstr 1521  # Windows
lsof -i :1521               # Linux/Mac

# Si el puerto está en uso, detener el servicio que lo usa
# o cambiar el puerto en docker-compose.yml
```

### Health check falla

```bash
# Esperar 2-3 minutos después del inicio
# Oracle tarda en inicializar

# Verificar logs
docker-compose logs oracle-db | grep -i error

# Reiniciar contenedor
docker-compose restart oracle-db
```

### No puedo conectarme desde SQL Developer

1. **Verificar que el contenedor esté corriendo**:
   ```bash
   docker ps | grep oracle
   ```

2. **Verificar health check**:
   ```bash
   docker inspect eprescription-oracle-db | grep Health
   ```

3. **Esperar 2-3 minutos** después del inicio

4. **Verificar firewall** (Windows):
   - Permitir conexiones en puerto 1521
   - Desactivar temporalmente para probar

5. **Probar desde dentro del contenedor primero**:
   ```bash
   docker exec -it eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@XE
   ```

### Scripts de inicialización no se ejecutan

```bash
# Verificar que los scripts estén montados
docker exec eprescription-oracle-db ls -la /docker-entrypoint-initdb.d/startup/

# Si no aparecen, verificar docker-compose.yml:
# volumes:
#   - ./eprescription-Database/scripts:/docker-entrypoint-initdb.d/startup

# Recrear contenedor
docker-compose down -v
docker-compose up -d oracle-db
```

### Error "ORA-12514: TNS:listener does not currently know of service"

Este error significa que Oracle aún no ha terminado de inicializar. **Espera 2-3 minutos** y vuelve a intentar.

## 🔄 Comandos Útiles

### Reiniciar Oracle

```bash
# Reinicio suave
docker-compose restart oracle-db

# Reinicio completo (borra datos temporales)
docker-compose down
docker-compose up -d oracle-db
```

### Limpiar Todo (CUIDADO: Borra datos)

```bash
# Detener y eliminar contenedor + volumen
docker-compose down -v

# Volver a iniciar desde cero
docker-compose up -d oracle-db
```

### Ver Uso de Recursos

```bash
# Ver CPU y memoria
docker stats eprescription-oracle-db

# Ver tamaño del volumen
docker volume inspect eprescription_oracle-data
```

## 📊 Verificación Post-Instalación

Ejecuta estos comandos para verificar que todo esté correcto:

```bash
# 1. Verificar que el contenedor esté corriendo
docker ps | grep oracle

# 2. Verificar health check
docker inspect eprescription-oracle-db --format='{{.State.Health.Status}}'

# 3. Conectar y verificar usuarios
docker exec -it eprescription-oracle-db sqlplus sys/OraclePassword123!@XE as sysdba <<EOF
SELECT username, account_status FROM dba_users WHERE username IN ('EPRESCRIPTION_USER', 'KEYCLOAK_USER');
EXIT;
EOF

# 4. Verificar esquemas
docker exec -it eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@XE <<EOF
SELECT * FROM schema_info;
EXIT;
EOF
```

Si todos los comandos se ejecutan sin errores, ¡la instalación fue exitosa! ✅

## 🎯 Próximos Pasos

1. ✅ Oracle Database configurado
2. ⏭️ Crear esquema de tablas (Task 2)
3. ⏭️ Poblar con datos mock (Task 3)
4. ⏭️ Configurar Keycloak (Task 7)

## 📚 Referencias

- [Oracle Database Express Edition](https://www.oracle.com/database/technologies/appdev/xe.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Oracle SQL Developer](https://www.oracle.com/database/sqldeveloper/)
