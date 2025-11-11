# ePrescription - Oracle Database

Este directorio contiene los scripts SQL y configuración de Docker para la base de datos Oracle del sistema ePrescription.

## 📋 Estructura

```
eprescription-Database/
├── scripts/
│   ├── 01-create-users.sql       # Creación de usuarios
│   ├── 02-create-schemas.sql     # Creación de esquemas
│   └── backup.sh                 # Script de backup
├── backups/                      # Backups de la BD (no se commitea)
└── README.md                     # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker Desktop 4.0+
- Oracle SQL Developer (opcional, para conexión GUI)

### Iniciar Oracle Database

Desde la raíz del proyecto:

```bash
# Iniciar contenedor Oracle
docker-compose up -d oracle-db

# Ver logs
docker-compose logs -f oracle-db

# Verificar estado
docker-compose ps
```

### Conexión a Oracle

**Desde Oracle SQL Developer:**

- **Host**: localhost
- **Port**: 1521
- **Service Name**: XE
- **Username**: eprescription_user
- **Password**: EprescriptionPass123!

**Desde SQL*Plus (dentro del contenedor):**

```bash
# Conectar como eprescription_user
docker exec -it eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@XE

# Conectar como SYSDBA
docker exec -it eprescription-oracle-db sqlplus sys/OraclePassword123!@XE as sysdba
```

## 🗄️ Esquemas

### EPRESCRIPTION_USER
Esquema principal de la aplicación que contiene:
- Tablas de pacientes, médicos, prescripciones
- Catálogo CIE-10
- Tablas de auditoría
- Tablas de inventario y farmacias

### KEYCLOAK_USER
Esquema para Keycloak (Identity and Access Management):
- Tablas de usuarios y roles
- Configuración de realms y clients
- Sesiones y tokens

## 📝 Scripts SQL

### 01-create-users.sql
Crea los usuarios de base de datos:
- `eprescription_user`: Usuario de la aplicación
- `keycloak_user`: Usuario de Keycloak

### 02-create-schemas.sql
Crea los esquemas y tablas de verificación iniciales.

## 💾 Backup y Restore

### Realizar Backup

```bash
# Ejecutar script de backup
bash eprescription-Database/scripts/backup.sh

# Los backups se guardan en eprescription-Database/backups/
```

### Restore desde Backup

```bash
# Copiar archivo .dmp al contenedor
docker cp eprescription-Database/backups/backup.dmp eprescription-oracle-db:/opt/oracle/admin/XE/dpdump/

# Ejecutar restore
docker exec eprescription-oracle-db sh -c "impdp eprescription_user/EprescriptionPass123!@XE \
    directory=DATA_PUMP_DIR \
    dumpfile=backup.dmp \
    logfile=restore.log"
```

## 🔧 Comandos Útiles

### Gestión del Contenedor

```bash
# Detener Oracle
docker-compose stop oracle-db

# Iniciar Oracle
docker-compose start oracle-db

# Reiniciar Oracle
docker-compose restart oracle-db

# Ver logs en tiempo real
docker-compose logs -f oracle-db

# Eliminar contenedor y volumen (CUIDADO: borra datos)
docker-compose down -v
```

### Queries de Verificación

```sql
-- Ver usuarios creados
SELECT username, account_status, created 
FROM dba_users 
WHERE username IN ('EPRESCRIPTION_USER', 'KEYCLOAK_USER');

-- Ver tablespaces
SELECT tablespace_name, status, contents 
FROM dba_tablespaces;

-- Ver tablas del esquema
SELECT table_name, num_rows 
FROM user_tables 
ORDER BY table_name;

-- Verificar conexión
SELECT 'Conexión exitosa' as status FROM DUAL;
```

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker logs eprescription-oracle-db

# Verificar que el puerto 1521 no esté en uso
netstat -an | findstr 1521  # Windows
lsof -i :1521               # Linux/Mac
```

### No puedo conectarme desde SQL Developer

1. Verificar que el contenedor esté corriendo: `docker ps`
2. Verificar health check: `docker inspect eprescription-oracle-db | grep Health`
3. Esperar 1-2 minutos después del inicio (Oracle tarda en inicializar)
4. Verificar firewall y puertos

### Error de permisos

```bash
# Conectar como SYSDBA y otorgar permisos
docker exec -it eprescription-oracle-db sqlplus sys/OraclePassword123!@XE as sysdba

SQL> GRANT ALL PRIVILEGES TO eprescription_user;
SQL> GRANT ALL PRIVILEGES TO keycloak_user;
```

## 📚 Recursos

- [Oracle Database Express Edition Documentation](https://docs.oracle.com/en/database/oracle/oracle-database/21/xeinl/)
- [Docker Hub - Oracle Database](https://container-registry.oracle.com/)
- [SQL Developer Download](https://www.oracle.com/database/sqldeveloper/technologies/download/)

## ⚠️ Notas Importantes

- **NUNCA** commitear el archivo `.env` con passwords reales
- Los backups se guardan localmente y NO se suben a Git
- El password por defecto es solo para desarrollo
- En producción, usar passwords seguros y rotación de credenciales
- El volumen `oracle-data` persiste los datos entre reinicios del contenedor
