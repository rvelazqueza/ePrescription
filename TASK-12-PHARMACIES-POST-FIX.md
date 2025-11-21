# Task 12 - Pharmacies POST Fix - RESUELTO

## Fecha
2025-11-21

## Problema
El endpoint POST /api/pharmacies retornaba error 500 al intentar crear una farmacia.

## Diagnóstico

### Síntomas
- GET, PUT, DELETE funcionaban correctamente
- POST fallaba con error 500 Internal Server Error
- Logs mostraban: `ORA-06550: line 15, column 34: PLS-00382: expression is of wrong type`

### Investigación
1. Verificamos la estructura de la tabla PHARMACIES en Oracle:
   ```sql
   DESC PHARMACIES;
   ```
   
2. Comparamos con el script de creación (Task 2):
   - Script DDL: `08-pharmacies-inventory.sql`
   - Script SEED: `08-pharmacies-inventory-data.sql`

3. Identificamos que el campo `IS_ACTIVE` es `NUMBER(1)` en Oracle

4. Revisamos la configuración de EF Core en `PharmacyConfiguration.cs`

### Causa Raíz
El campo `IsActive` en C# es de tipo `bool`, pero en Oracle es `NUMBER(1)`. 

EF Core necesita una **conversión explícita** para mapear correctamente entre estos tipos. Sin esta conversión, Oracle no puede interpretar el valor booleano y genera el error PLS-00382.

## Solución

### Cambio Realizado
En `PharmacyConfiguration.cs`, se modificó la configuración del campo `IsActive`:

**ANTES:**
```csharp
builder.Property(p => p.IsActive)
    .HasColumnName("IS_ACTIVE")
    .IsRequired();
```

**DESPUÉS:**
```csharp
builder.Property(p => p.IsActive)
    .HasColumnName("IS_ACTIVE")
    .HasColumnType("NUMBER(1)")
    .HasConversion<int>()
    .IsRequired();
```

### Explicación
- `.HasColumnType("NUMBER(1)")`: Especifica el tipo de columna en Oracle
- `.HasConversion<int>()`: Convierte bool (C#) ↔ int (Oracle)
  - `true` → `1`
  - `false` → `0`

## Resultados

### Antes del Fix
```
Test 1: POST /api/pharmacies - Create Pharmacy
❌ FAILED: Error 500 Internal Server Error
```

### Después del Fix
```
Test 1: POST /api/pharmacies - Create Pharmacy
✅ SUCCESS: Pharmacy created successfully
  ID: cc4f18c2-955a-410b-b1a6-00dbc779ddd7
  License: PHARM-TEST-2137
  Name: Farmacia Test Central
  Full Address: , Springfield,
```

### Todos los Tests
```
========================================
Task 12.9-12.11 - Pharmacies API Tests
========================================

✅ Test 1: POST - Create Pharmacy
✅ Test 2: GET - Get by ID
✅ Test 3: PUT - Update Pharmacy
✅ Test 4: GET - Search All
✅ Test 5: GET - Search by City
✅ Test 6: GET - Search by State
✅ Test 7: GET - Search by Term
✅ Test 8: GET - Search Active
✅ Test 9: DELETE - Delete Pharmacy
✅ Test 10: Verify Deletion
✅ Test 11: Validation - Empty License
✅ Test 12: Validation - Invalid Email

12/12 Tests PASSED ✅
```

## Lección Aprendida

### Regla General para Oracle + EF Core
**Todos los campos booleanos que mapean a NUMBER(1) en Oracle DEBEN tener conversión explícita:**

```csharp
builder.Property(e => e.BooleanField)
    .HasColumnName("BOOLEAN_FIELD")
    .HasColumnType("NUMBER(1)")
    .HasConversion<int>()
    .IsRequired();
```

### Aplicar a Otras Entidades
Esta configuración debe aplicarse a:
- ✅ Pharmacy.IsActive (CORREGIDO)
- ⚠️ Verificar otras entidades con campos bool:
  - Patient (si tiene IsActive)
  - Doctor (si tiene IsActive)
  - Medication (si tiene IsActive)
  - Inventory (si tiene campos bool)
  - Dispensation (si tiene campos bool)

## Archivos Modificados

1. **PharmacyConfiguration.cs**
   - Agregada conversión explícita para IsActive
   - Línea: `.HasColumnType("NUMBER(1)").HasConversion<int>()`

## Compilación y Despliegue

```bash
# Rebuild
docker-compose build eprescription-api

# Deploy
docker-compose up -d eprescription-api

# Verify
curl http://localhost:8000/swagger
```

## Verificación en Base de Datos

Después del fix, las farmacias se insertan correctamente:

```sql
SELECT PHARMACY_NAME, LICENSE_NUMBER, IS_ACTIVE 
FROM PHARMACIES 
WHERE LICENSE_NUMBER LIKE 'PHARM-TEST%';

-- Resultado:
-- Farmacia Test Central | PHARM-TEST-6951 | 1
-- Farmacia Test Central | PHARM-TEST-2137 | 1
```

## Impacto

### Positivo
- ✅ POST /api/pharmacies funciona correctamente
- ✅ Todos los endpoints CRUD funcionan
- ✅ API de Pharmacies 100% funcional
- ✅ Lección aprendida para futuras entidades

### Sin Impacto Negativo
- ✅ No afecta endpoints existentes (GET, PUT, DELETE)
- ✅ No requiere cambios en la base de datos
- ✅ No requiere cambios en el código de negocio
- ✅ Backward compatible con datos existentes

## Próximos Pasos

1. ✅ Pharmacies API completamente funcional
2. ⏭️ Task 12.12 - Probar endpoints con Postman
3. ⏭️ Task 12.13 - Implementar búsqueda avanzada
4. 🔍 Revisar otras entidades para aplicar el mismo fix si es necesario

## Referencias

- Script DDL: `eprescription-Database/scripts/01-DDL/08-pharmacies-inventory.sql`
- Script SEED: `eprescription-Database/scripts/02-SEED/08-pharmacies-inventory-data.sql`
- Configuración: `eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PharmacyConfiguration.cs`
- Tests: `test-task12-pharmacies.ps1`

## Conclusión

El problema fue resuelto exitosamente identificando que Oracle requiere conversión explícita para campos booleanos. Esta es una lección importante para todas las entidades que usan campos bool con Oracle.

**Status: ✅ RESUELTO - API de Pharmacies 100% funcional**
