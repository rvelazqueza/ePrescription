# Seed Data Scripts - ePrescription Database

Este directorio contiene todos los scripts de datos de prueba (seed data) para la base de datos de ePrescription.

## 📋 Descripción

Los scripts están diseñados para poblar la base de datos Oracle con datos realistas de Costa Rica, incluyendo:
- Catálogos médicos (CIE-10, medicamentos ATC)
- Datos geográficos (direcciones de Costa Rica)
- Entidades médicas (pacientes, doctores, centros médicos)
- Transacciones (prescripciones, dispensaciones)
- Seguridad y auditoría (usuarios, roles, logs)

## 🚀 Ejecución Rápida

### Opción 1: Script Maestro (Recomendado)
```bash
# Desde Windows
execute-all-seeds.bat

# Desde Docker directamente
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/00-execute-all-seeds.sql"
```

### Opción 2: Scripts Individuales
Ejecutar en orden numérico (01 a 12)

## 📁 Scripts Disponibles

| # | Script | Descripción | Registros |
|---|--------|-------------|-----------|
| 00 | `00-execute-all-seeds.sql` | **Script maestro** - Ejecuta todos los demás | - |
| 01 | `01-cie10-catalog-data.sql` | Catálogo CIE-10 de diagnósticos | 50 |
| 02 | `02-addresses-data.sql` | Direcciones de Costa Rica | 50 |
| 03 | `03-specialties-routes-data.sql` | Especialidades médicas y rutas de administración | 30 |
| 04 | `04-patients-data.sql` | Pacientes con datos realistas | 50 |
| 05 | `05-medical-centers-doctors-data.sql` | Centros médicos y doctores | 40 |
| 06 | `06-medications-data.sql` | Medicamentos con códigos ATC | 35 |
| 07 | `07-drug-interactions-data.sql` | Interacciones medicamentosas | 30 |
| 08 | `08-pharmacies-inventory-data.sql` | Farmacias e inventario | 15 |
| 09 | `09-prescriptions-data.sql` | Prescripciones médicas | 50 |
| 10 | `10-dispensations-data.sql` | Dispensaciones en farmacias | 5 |
| 11 | `11-users-roles-permissions-data.sql` | Sistema de usuarios y permisos | 25 |
| 12 | `12-audit-ai-logs-data.sql` | Logs de auditoría y análisis IA | 190 |

**Total aproximado: 500+ registros**

## ⚙️ Características Especiales

### Encoding UTF-8
Todos los scripts usan:
```sql
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';
SET DEFINE OFF;
```

Esto garantiza que los caracteres especiales (tildes, ñ) se manejen correctamente.

### Datos Realistas de Costa Rica
- ✅ Nombres con tildes: María José, José María, etc.
- ✅ Cédulas formato CR: 1-0234-0567
- ✅ Teléfonos: +506 2222-3333, +506 8888-9999
- ✅ Direcciones: San José, Cartago, Heredia, etc.
- ✅ Provincias y cantones reales

### Compliance
- ✅ **FDA 21 CFR Part 11**: Audit logs inmutables
- ✅ **HIPAA**: Metadata de compliance en logs
- ✅ **Trazabilidad completa**: Todos los cambios registrados

## 🔍 Verificación

Después de ejecutar los scripts, verificar con:

```sql
-- Ver resumen de todas las tablas
SELECT table_name, num_rows 
FROM user_tables 
WHERE table_name IN (
    'CIE10_CATALOG', 'ADDRESSES', 'PATIENTS', 'DOCTORS',
    'MEDICATIONS', 'PRESCRIPTIONS', 'DISPENSATIONS', 'AUDIT_LOGS'
)
ORDER BY table_name;

-- Ver datos de ejemplo
SELECT * FROM PATIENTS FETCH FIRST 5 ROWS ONLY;
SELECT * FROM PRESCRIPTIONS FETCH FIRST 5 ROWS ONLY;
```

## 📊 Dependencias entre Scripts

```
01-cie10-catalog-data.sql
02-addresses-data.sql
03-specialties-routes-data.sql
    ↓
04-patients-data.sql (requiere addresses)
05-medical-centers-doctors-data.sql (requiere addresses, specialties)
    ↓
06-medications-data.sql
07-drug-interactions-data.sql (requiere medications)
08-pharmacies-inventory-data.sql (requiere addresses, medications)
    ↓
09-prescriptions-data.sql (requiere patients, doctors, medications, cie10, routes)
    ↓
10-dispensations-data.sql (requiere prescriptions, pharmacies, inventory)
11-users-roles-permissions-data.sql
12-audit-ai-logs-data.sql (requiere users, prescriptions)
```

## ⚠️ Notas Importantes

1. **Orden de ejecución**: Los scripts DEBEN ejecutarse en orden numérico debido a las dependencias de claves foráneas.

2. **Tabla AUDIT_LOGS**: Es inmutable (append-only). No se puede hacer DELETE ni UPDATE por compliance FDA.

3. **Inventario limitado**: Solo algunos medicamentos tienen inventario. Las dispensaciones solo funcionan con medicamentos en stock.

4. **Encoding**: Siempre usar `NLS_LANG='SPANISH_COSTA RICA.AL32UTF8'` para caracteres especiales.

## 🛠️ Troubleshooting

### Error: "ORA-02291: integrity constraint violated"
**Causa**: Scripts ejecutados fuera de orden
**Solución**: Ejecutar en orden numérico (01-12)

### Error: "ORA-20001: AUDIT_LOGS es inmutable"
**Causa**: Intentando DELETE en tabla de auditoría
**Solución**: Normal, es por diseño (FDA compliance)

### Caracteres con tildes aparecen mal
**Causa**: Encoding incorrecto
**Solución**: Usar `export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8'`

## 📝 Mantenimiento

Para limpiar y recargar datos:

```sql
-- CUIDADO: Esto borra TODOS los datos
-- Ejecutar scripts de limpieza en orden inverso (12 a 01)
-- Luego ejecutar 00-execute-all-seeds.sql
```

## 📞 Soporte

Para problemas o preguntas sobre los seed scripts, revisar:
- `DATABASE-SCHEMA-REFERENCE.md` - Estructura de la base de datos
- `ER_DIAGRAM.md` - Diagrama de relaciones
- `PROGRESS-REPORT.md` - Estado del proyecto

---

**Última actualización**: Noviembre 2024
**Versión**: 1.0
**Compatibilidad**: Oracle 21c XE
