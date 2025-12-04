# ePrescription - Oracle Database

Base de datos Oracle 21c Express Edition para el sistema ePrescription con datos de prueba completos, compliance FDA/HIPAA y soporte UTF-8 para Costa Rica.

## 🎉 Estado: COMPLETADO

✅ **Esquema de base de datos**: 27 tablas normalizadas (4NF/5NF)  
✅ **Seed data scripts**: 12 scripts con ~500+ registros  
✅ **Datos de Costa Rica**: Nombres, direcciones, teléfonos con tildes  
✅ **Compliance**: FDA 21 CFR Part 11 + HIPAA  
✅ **Códigos estándar**: CIE-10 + ATC

## 📑 Índice

- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Inicio Rápido](#-inicio-rápido)
- [Esquema de Base de Datos](#️-esquema-de-base-de-datos)
- [Scripts Disponibles](#-scripts-disponibles)
- [Características Destacadas](#-características-destacadas)
- [Backup y Restore](#-backup-y-restore)
- [Comandos Útiles](#-comandos-útiles)
- [Troubleshooting](#-troubleshooting)
- [Documentación](#-documentación-del-proyecto)
- [Estadísticas](#-estadísticas-del-proyecto)
- [Notas Importantes](#️-notas-importantes)  

## 📋 Estructura del Proyecto

```
eprescription-Database/
├── scripts/
│   ├── 01-DDL/                   # Definición de esquema
│   │   ├── 01-create-users.sql
│   │   ├── 02-create-schemas.sql
│   │   └── 03-create-tables.sql
│   ├── 02-SEED/                  # ✅ Datos de prueba (COMPLETADO)
│   │   ├── 00-execute-all-seeds.sql    # Script maestro
│   │   ├── 00-clean-all-data.sql       # Limpieza de datos
│   │   ├── 01-cie10-catalog-data.sql   # 50 diagnósticos
│   │   ├── 02-addresses-data.sql       # 50 direcciones CR
│   │   ├── 03-specialties-routes-data.sql
│   │   ├── 04-patients-data.sql        # 50 pacientes
│   │   ├── 05-medical-centers-doctors-data.sql
│   │   ├── 06-medications-data.sql     # 35 medicamentos
│   │   ├── 07-drug-interactions-data.sql
│   │   ├── 08-pharmacies-inventory-data.sql
│   │   ├── 09-prescriptions-data.sql   # 50 prescripciones
│   │   ├── 10-dispensations-data.sql
│   │   ├── 11-users-roles-permissions-data.sql
│   │   ├── 12-audit-ai-logs-data.sql   # Compliance
│   │   ├── execute-all-seeds.bat       # Windows batch
│   │   ├── verify-seed-data.sql        # Verificación
│   │   └── README.md                   # Documentación detallada
│   ├── backup.sh                 # Script de backup
│   └── execute-all-seeds.sql     # Script maestro (legacy)
├── old-scripts/                  # Scripts históricos (referencia)
├── backups/                      # Backups de la BD (no se commitea)
├── DATABASE-SCHEMA-REFERENCE.md  # 📖 Documentación del esquema
├── SEED-DATA-SUMMARY.md          # 📊 Resumen de seed data
├── QUICK-START.md                # 🚀 Guía de inicio rápido
├── PROGRESS-REPORT.md            # 📈 Estado del proyecto
├── ER_DIAGRAM.md                 # 📐 Diagrama de relaciones
└── README.md                     # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker Desktop 4.0+
- Oracle SQL Developer (opcional, para conexión GUI)

### 1. Iniciar Oracle Database

Desde la raíz del proyecto:

```bash
# Iniciar contenedor Oracle
docker-compose up -d oracle-db

# Ver logs
docker-compose logs -f oracle-db

# Verificar estado (esperar hasta que esté "healthy")
docker-compose ps
```

### 2. Cargar Datos de Prueba

**Opción A: Script Batch (Windows)**
```bash
cd eprescription-Database/scripts/02-SEED
execute-all-seeds.bat
```

**Opción B: Docker directo**
```bash
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/00-execute-all-seeds.sql"
```

### 3. Verificar Datos

```bash
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/verify-seed-data.sql"
```

**Ver también**: [QUICK-START.md](./QUICK-START.md) para guía detallada

### Conexión a Oracle

**Desde Oracle SQL Developer:**

- **Host**: localhost
- **Port**: 1521
- **Service Name**: **XEPDB1** ⚠️ (NO usar XE)
- **Username**: EPRESCRIPTION_USER
- **Password**: EprescriptionPass123!

**Desde SQL*Plus (dentro del contenedor):**

```bash
# Conectar como eprescription_user
docker exec -it eprescription-oracle-db sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1

# Conectar como SYSDBA
docker exec -it eprescription-oracle-db sqlplus sys/OraclePassword123!@//localhost:1521/XEPDB1 as sysdba

# Con UTF-8 para caracteres especiales
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1"
```

## 🗄️ Esquema de Base de Datos

### 27 Tablas Normalizadas (4NF/5NF)

**Catálogos Base (4 tablas)**
- `CIE10_CATALOG` - 50 diagnósticos CIE-10
- `ADDRESSES` - 50 direcciones de Costa Rica
- `SPECIALTIES` - 20 especialidades médicas
- `ADMINISTRATION_ROUTES` - 10 rutas de administración

**Entidades Principales (8 tablas)**
- `PATIENTS` + `PATIENT_EMERGENCY_CONTACTS` + `PATIENT_ALLERGIES`
- `MEDICAL_CENTERS` + `DOCTORS` + `DOCTOR_MEDICAL_CENTER`
- `MEDICATIONS` - 35 medicamentos con códigos ATC
- `PHARMACIES` + `INVENTORY`

**Transacciones (6 tablas)**
- `PRESCRIPTIONS` + `PRESCRIPTION_MEDICATIONS` + `PRESCRIPTION_DIAGNOSES`
- `DISPENSATIONS` + `DISPENSATION_ITEMS`
- `DRUG_INTERACTIONS` - 30 interacciones

**Seguridad y Auditoría (7 tablas)**
- `USERS` + `ROLES` + `PERMISSIONS`
- `USER_ROLES` + `ROLE_PERMISSIONS`
- `AUDIT_LOGS` - Inmutable (FDA 21 CFR Part 11)
- `AI_ANALYSIS_LOGS` - Logs de análisis de IA

**Ver documentación completa**: [DATABASE-SCHEMA-REFERENCE.md](./DATABASE-SCHEMA-REFERENCE.md)

## 📝 Scripts Disponibles

### Scripts DDL (01-DDL/)
- `01-create-users.sql` - Crea usuarios EPRESCRIPTION_USER y KEYCLOAK_USER
- `02-create-schemas.sql` - Crea esquemas y tablespaces
- `03-create-tables.sql` - Crea las 27 tablas del sistema

### Scripts de Seed Data (02-SEED/) ✅

**Script Maestro:**
- `00-execute-all-seeds.sql` - Ejecuta todos los scripts en orden
- `00-clean-all-data.sql` - Limpia todos los datos

**Scripts Individuales (01-12):**
1. CIE-10 Catalog (50 diagnósticos)
2. Addresses (50 direcciones Costa Rica)
3. Specialties & Routes (30 registros)
4. Patients (50 pacientes + contactos + alergias)
5. Medical Centers & Doctors (40 registros)
6. Medications (35 medicamentos ATC)
7. Drug Interactions (30 interacciones)
8. Pharmacies & Inventory (60+ registros)
9. Prescriptions (50 prescripciones completas)
10. Dispensations (10+ dispensaciones)
11. Users, Roles & Permissions (100+ registros)
12. Audit & AI Logs (190+ registros)

**Utilidades:**
- `execute-all-seeds.bat` - Batch script para Windows
- `verify-seed-data.sql` - Verificación de datos

**Ver documentación completa**: [scripts/02-SEED/README.md](./scripts/02-SEED/README.md)

## 🌟 Características Destacadas

### ✅ Datos Realistas de Costa Rica
- Nombres con tildes: María José, José María, Sebastián
- Cédulas formato CR: 1-0234-0567
- Teléfonos: +506 2222-3333, +506 8888-9999
- Direcciones reales: San José, Cartago, Heredia, Alajuela

### ✅ Compliance Regulatorio
- **FDA 21 CFR Part 11**: Audit logs inmutables (no DELETE/UPDATE)
- **HIPAA**: Metadata de compliance en logs
- **Trazabilidad completa**: Todos los cambios registrados
- **Retención de datos**: 7 años de auditoría

### ✅ Códigos Estándar Internacionales
- **CIE-10**: Diagnósticos médicos (OMS/WHO)
- **ATC**: Clasificación de medicamentos
- **HL7 FHIR**: Preparado para interoperabilidad

### ✅ UTF-8 Completo
- Soporte completo para español (tildes, ñ)
- Configuración: `NLS_LANG='SPANISH_COSTA RICA.AL32UTF8'`
- Todos los scripts probados con caracteres especiales

### ✅ Integridad Referencial
- 27 tablas normalizadas (4NF/5NF)
- Foreign keys en todas las relaciones
- Constraints de validación
- Triggers de auditoría automática

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
-- Ver tablas y registros
SELECT table_name, num_rows 
FROM user_tables 
WHERE table_name IN (
    'CIE10_CATALOG', 'PATIENTS', 'DOCTORS', 'MEDICATIONS',
    'PRESCRIPTIONS', 'DISPENSATIONS', 'AUDIT_LOGS'
)
ORDER BY table_name;

-- Ver pacientes con tildes (UTF-8)
SELECT FIRST_NAME, LAST_NAME, IDENTIFICATION_NUMBER 
FROM PATIENTS 
WHERE FIRST_NAME LIKE '%í%' OR FIRST_NAME LIKE '%á%'
FETCH FIRST 5 ROWS ONLY;

-- Ver prescripciones recientes
SELECT p.PRESCRIPTION_NUMBER, 
       pt.FIRST_NAME || ' ' || pt.LAST_NAME as PATIENT,
       d.FIRST_NAME || ' ' || d.LAST_NAME as DOCTOR
FROM PRESCRIPTIONS p
JOIN PATIENTS pt ON p.PATIENT_ID = pt.PATIENT_ID
JOIN DOCTORS d ON p.DOCTOR_ID = d.DOCTOR_ID
FETCH FIRST 10 ROWS ONLY;

-- Ver estadísticas de auditoría
SELECT ACTION_TYPE, COUNT(*) as COUNT
FROM AUDIT_LOGS
GROUP BY ACTION_TYPE
ORDER BY COUNT DESC;

-- Verificar conexión
SELECT 'Conexión exitosa - ' || USER as status FROM DUAL;
```

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker logs eprescription-oracle-db

# Verificar que el puerto 1521 no esté en uso
netstat -an | findstr 1521  # Windows
lsof -i :1521               # Linux/Mac

# Reiniciar contenedor
docker-compose restart oracle-db
```

### No puedo conectarme desde SQL Developer

1. **Verificar Service Name**: Debe ser **XEPDB1** (no XE)
2. Verificar que el contenedor esté corriendo: `docker ps`
3. Verificar health check: `docker inspect eprescription-oracle-db | grep Health`
4. Esperar 1-2 minutos después del inicio (Oracle tarda en inicializar)
5. Verificar firewall y puertos

### Caracteres con tildes aparecen mal

```bash
# Siempre usar UTF-8 en la conexión
export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8'

# O en Windows
set NLS_LANG=SPANISH_COSTA RICA.AL32UTF8
```

### Error: "ORA-00001: unique constraint violated"

**Causa**: Datos ya existen en la base de datos  
**Solución**: Ejecutar script de limpieza primero

```bash
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/00-clean-all-data.sql"
```

### Error: "ORA-20001: AUDIT_LOGS es inmutable"

**Causa**: Intentando DELETE en tabla de auditoría  
**Solución**: Normal, es por diseño (FDA 21 CFR Part 11 compliance). Los audit logs no se pueden borrar.

### Error: "ORA-02291: integrity constraint violated"

**Causa**: Scripts ejecutados fuera de orden  
**Solución**: Usar el script maestro que ejecuta en orden correcto

```bash
cd eprescription-Database/scripts/02-SEED
execute-all-seeds.bat
```

## 📚 Documentación del Proyecto

### Documentos Principales
- **[QUICK-START.md](./QUICK-START.md)** - Guía de inicio rápido (3 pasos)
- **[SEED-DATA-SUMMARY.md](./SEED-DATA-SUMMARY.md)** - Resumen ejecutivo de seed data
- **[DATABASE-SCHEMA-REFERENCE.md](./DATABASE-SCHEMA-REFERENCE.md)** - Documentación completa del esquema
- **[PROGRESS-REPORT.md](./PROGRESS-REPORT.md)** - Estado del proyecto y métricas
- **[ER_DIAGRAM.md](./ER_DIAGRAM.md)** - Diagrama de relaciones entre tablas

### Documentación de Scripts
- **[scripts/02-SEED/README.md](./scripts/02-SEED/README.md)** - Documentación detallada de seed scripts
- **[old-scripts/README.md](./old-scripts/README.md)** - Archivos históricos

### Recursos Externos
- [Oracle Database Express Edition Documentation](https://docs.oracle.com/en/database/oracle/oracle-database/21/xeinl/)
- [Docker Hub - Oracle Database](https://container-registry.oracle.com/)
- [SQL Developer Download](https://www.oracle.com/database/sqldeveloper/technologies/download/)
- [CIE-10 (OMS/WHO)](https://www.who.int/standards/classifications/classification-of-diseases)
- [ATC Classification](https://www.whocc.no/atc_ddd_index/)

## 📊 Estadísticas del Proyecto

- **Tablas**: 27 (100% pobladas)
- **Scripts de seed**: 12 (100% completados)
- **Registros totales**: ~500+
- **Cobertura UTF-8**: 100%
- **Compliance**: FDA 21 CFR Part 11 + HIPAA
- **Localización**: Costa Rica 🇨🇷

## ⚠️ Notas Importantes

### Seguridad
- **NUNCA** commitear el archivo `.env` con passwords reales
- El password por defecto es solo para desarrollo
- En producción, usar passwords seguros y rotación de credenciales
- Implementar cifrado de datos sensibles

### Datos
- Los backups se guardan localmente y NO se suben a Git
- El volumen `oracle-data` persiste los datos entre reinicios del contenedor
- Los audit logs son inmutables (no se pueden borrar por compliance)
- Retención de auditoría: 7 años mínimo

### Encoding
- Siempre usar `NLS_LANG='SPANISH_COSTA RICA.AL32UTF8'`
- Verificar que los caracteres especiales (tildes, ñ) se vean correctamente
- Todos los scripts están probados con UTF-8

### Compliance
- **FDA 21 CFR Part 11**: Registros electrónicos y firmas digitales
- **HIPAA**: Privacidad y seguridad de datos médicos
- **Auditoría completa**: Todas las operaciones registradas
- **Trazabilidad**: 100% de las transacciones auditadas

## 🚀 Próximos Pasos

Con la base de datos completada, el proyecto está listo para:

1. **Desarrollo del Backend .NET 8**
   - Entity Framework Core con Oracle
   - APIs REST para acceso a datos
   - Lógica de negocio

2. **Integración con Frontend Angular**
   - Consumo de APIs
   - Interfaces de usuario
   - Dashboards y reportes

3. **Testing**
   - Unit tests con datos reales
   - Integration tests
   - Performance tests

4. **Deployment**
   - Configuración de ambientes
   - CI/CD pipelines
   - Monitoreo y alertas

---

**Última actualización**: Noviembre 2024  
**Versión**: 1.0  
**Estado**: ✅ COMPLETADO  
**Base de Datos**: Oracle 21c Express Edition  
**Encoding**: UTF-8 (AL32UTF8)  
**País**: Costa Rica 🇨🇷
