# Old Scripts - Archivos Históricos

Esta carpeta contiene scripts y archivos temporales que fueron utilizados durante el desarrollo y debugging del proyecto.

## ⚠️ Nota Importante

Estos archivos son **históricos** y ya no son necesarios para el funcionamiento del sistema. Se mantienen aquí solo como referencia.

## 📁 Contenido

### Scripts SQL Temporales
- `fix-complete-database.sql` - Script de corrección usado durante desarrollo
- `test-insert-simple.sql` - Pruebas de inserción
- `test-insert.sql` - Pruebas de inserción
- `verify-all-tables.sql` - Verificación de tablas (reemplazado por verify-seed-data.sql)
- `verify-and-fix-inventory.sql` - Corrección de inventario
- `check-inventory.sql` - Verificación de inventario
- `diagnostic-queries.sql` - Queries de diagnóstico

### Scripts Batch Temporales
- `execute-all-seeds.bat` - Versión antigua (reemplazado por scripts/02-SEED/execute-all-seeds.bat)
- `check-and-seed.bat` - Script de verificación y seed
- `run-seed.bat` - Ejecución de seeds
- `run-test.bat` - Ejecución de tests

### Otros
- `table-structures.txt` - Estructura de tablas (reemplazado por DATABASE-SCHEMA-REFERENCE.md)

## ✅ Scripts Actuales a Usar

En lugar de estos archivos, usa los scripts oficiales en:

- **Seed Data**: `scripts/02-SEED/00-execute-all-seeds.sql`
- **Verificación**: `scripts/02-SEED/verify-seed-data.sql`
- **Limpieza**: `scripts/02-SEED/00-clean-all-data.sql`
- **Batch Script**: `scripts/02-SEED/execute-all-seeds.bat`

## 🗑️ ¿Puedo Eliminar Esta Carpeta?

Sí, esta carpeta puede ser eliminada sin afectar el funcionamiento del sistema. Se mantiene solo como referencia histórica del proceso de desarrollo.

---

**Última actualización:** Noviembre 2024
