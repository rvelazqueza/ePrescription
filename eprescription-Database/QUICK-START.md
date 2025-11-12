# 🚀 Quick Start Guide - ePrescription Database

## Inicio Rápido en 3 Pasos

### 1️⃣ Cargar Todos los Datos

```bash
# Opción A: Desde Windows
cd eprescription-Database\scripts\02-SEED
execute-all-seeds.bat

# Opción B: Desde Docker
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/00-execute-all-seeds.sql"
```

### 2️⃣ Verificar los Datos

```bash
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/verify-seed-data.sql"
```

### 3️⃣ ¡Listo para Desarrollar!

La base de datos ahora tiene:
- ✅ 50 pacientes
- ✅ 30 doctores
- ✅ 35 medicamentos
- ✅ 50 prescripciones
- ✅ 10 farmacias
- ✅ Y mucho más...

---

## 🔄 Limpiar y Recargar

Si necesitas empezar de cero:

```bash
# 1. Limpiar datos
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/00-clean-all-data.sql"

# 2. Recargar datos
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/00-execute-all-seeds.sql"
```

---

## 📊 Consultas Útiles

### Ver Pacientes
```sql
SELECT FIRST_NAME, LAST_NAME, IDENTIFICATION_NUMBER 
FROM PATIENTS 
FETCH FIRST 10 ROWS ONLY;
```

### Ver Prescripciones
```sql
SELECT p.PRESCRIPTION_NUMBER, 
       pt.FIRST_NAME || ' ' || pt.LAST_NAME as PATIENT,
       d.FIRST_NAME || ' ' || d.LAST_NAME as DOCTOR
FROM PRESCRIPTIONS p
JOIN PATIENTS pt ON p.PATIENT_ID = pt.PATIENT_ID
JOIN DOCTORS d ON p.DOCTOR_ID = d.DOCTOR_ID
FETCH FIRST 10 ROWS ONLY;
```

### Ver Medicamentos en Inventario
```sql
SELECT ph.PHARMACY_NAME, m.GENERIC_NAME, i.QUANTITY_AVAILABLE
FROM INVENTORY i
JOIN PHARMACIES ph ON i.PHARMACY_ID = ph.PHARMACY_ID
JOIN MEDICATIONS m ON i.MEDICATION_ID = m.MEDICATION_ID
WHERE i.QUANTITY_AVAILABLE > 0
FETCH FIRST 10 ROWS ONLY;
```

---

## 📚 Documentación Completa

- `SEED-DATA-SUMMARY.md` - Resumen completo del proyecto
- `scripts/02-SEED/README.md` - Documentación detallada
- `DATABASE-SCHEMA-REFERENCE.md` - Estructura de la base de datos
- `ER_DIAGRAM.md` - Diagrama de relaciones

---

## ⚠️ Notas Importantes

1. **Encoding UTF-8**: Siempre usar `NLS_LANG='SPANISH_COSTA RICA.AL32UTF8'`
2. **Audit Logs**: Son inmutables (no se pueden borrar por compliance FDA)
3. **Orden**: Los scripts deben ejecutarse en orden (01-12)

---

## 🆘 Problemas Comunes

### "unique constraint violated"
Ya hay datos en la base. Ejecutar `00-clean-all-data.sql` primero.

### Tildes aparecen mal
Falta configurar UTF-8. Usar `export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8'`

### "integrity constraint violated"
Scripts ejecutados fuera de orden. Usar `00-execute-all-seeds.sql`

---

**¿Listo para empezar?** Ejecuta el paso 1 y tendrás una base de datos completa en minutos! 🎉
