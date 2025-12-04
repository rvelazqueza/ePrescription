# Fase 0: Base de Datos de Talonarios - START

## Estado

✅ **RAMA CREADA:** `feature/fase-0-bd-talonarios`
✅ **SPEC APROBADO:** Listo para implementación
✅ **ESTIMACIÓN:** 2.75 días (realista)

---

## Objetivo de Fase 0

Crear la infraestructura de base de datos para gestión de talonarios (prescription pads), que es la base crítica para la Fase 1 (Nueva Receta).

**Dependencias:** Ninguna
**Bloqueadores:** Ninguno
**Riesgos:** EF Core + Oracle

---

## Tareas de Fase 0

### 0.1 Crear Tablas de Talonarios en BD
- **Tiempo:** 4 horas
- **Riesgo:** Bajo (SQL directo)
- **Archivos:** SQL scripts
- **Validación:** Conectar a Oracle y verificar tablas

### 0.2 Actualizar Tabla MEDICATIONS
- **Tiempo:** 2 horas
- **Riesgo:** Bajo (SQL directo)
- **Archivos:** SQL scripts
- **Validación:** Verificar columna PAD_TYPE_ID

### 0.3 Crear Entidades EF Core
- **Tiempo:** 3 horas
- **Riesgo:** Alto (EF Core shadow properties)
- **Archivos:** 
  - `PrescriptionPadType.cs`
  - `PrescriptionPad.cs`
  - `PrescriptionSlip.cs`
  - Actualizar `Medication.cs`
- **Validación:** Compilación exitosa

### 0.4 Crear Migraciones EF Core
- **Tiempo:** 2 horas
- **Riesgo:** Alto (EF Core SQL generation)
- **Archivos:** Migraciones automáticas
- **Validación:** `dotnet ef database update`

### 0.5 Crear Repositorios
- **Tiempo:** 3 horas
- **Riesgo:** Bajo (código estándar)
- **Archivos:**
  - `PrescriptionPadRepository.cs`
  - `PrescriptionSlipRepository.cs`
- **Validación:** Métodos CRUD funcionan

### 0.6 Crear Servicios de Talonarios
- **Tiempo:** 4 horas
- **Riesgo:** Medio (lógica de negocio)
- **Archivos:** `PrescriptionPadsService.cs`
- **Validación:** Métodos de validación funcionan

### 0.7 Crear Endpoints de Talonarios
- **Tiempo:** 3 horas
- **Riesgo:** Bajo (código estándar)
- **Archivos:** `PrescriptionPadsController.cs`
- **Validación:** Endpoints responden en Swagger

### 0.8 Crear Tests (OPCIONAL)
- **Tiempo:** 4 horas
- **Riesgo:** Bajo
- **Archivos:** Tests unitarios y property-based
- **Validación:** Tests pasan

### 0.9 Checkpoint - Validar Fase 0
- **Tiempo:** 1 hora
- **Riesgo:** Medio (Docker/BD connection)
- **Validación:** Todos los endpoints funcionan

---

## Workflow Docker

**Importante:** Usar Docker para todas las pruebas

```powershell
# 1. Compilar localmente
dotnet build

# 2. Rebuild Docker
docker-compose build eprescription-api

# 3. Iniciar Docker
docker-compose up -d eprescription-api

# 4. Ver logs
docker logs -f eprescription-api

# 5. Probar endpoints
# Swagger: http://localhost:8000/swagger
```

---

## Validaciones Críticas

### Después de 0.1-0.2 (BD)
```sql
-- Conectar a Oracle
docker exec eprescription-db sqlplus eprescription_user/password@XE

-- Verificar tablas
SELECT TABLE_NAME FROM USER_TABLES 
WHERE TABLE_NAME IN ('PRESCRIPTION_PAD_TYPES', 'PRESCRIPTION_PADS', 'PRESCRIPTION_SLIPS');

-- Verificar tipos
SELECT * FROM PRESCRIPTION_PAD_TYPES;
```

### Después de 0.3-0.4 (EF Core)
```powershell
# Compilar
dotnet build

# Verificar migraciones
dotnet ef migrations list

# Aplicar migraciones
dotnet ef database update
```

### Después de 0.7 (Endpoints)
```powershell
# Swagger
http://localhost:8000/swagger

# Probar endpoint
GET http://localhost:8000/api/prescription-pads/doctor/{doctorId}
```

---

## Riesgos y Mitigación

### Alto Riesgo: EF Core + Oracle
**Síntoma:** Migraciones generan SQL incorrecto
**Mitigación:** 
- Revisar SQL generado antes de ejecutar
- Tener scripts SQL de rollback listos
- Usar SQL directo si EF Core falla
**Buffer:** +2 horas

### Medio Riesgo: Lógica de Negocio
**Síntoma:** Validaciones no funcionan correctamente
**Mitigación:**
- Testing temprano
- Validar con datos reales
**Buffer:** +1 hora

---

## Próximos Pasos

1. ✅ Rama creada: `feature/fase-0-bd-talonarios`
2. ⏳ Ejecutar tareas 0.1-0.9 secuencialmente
3. ⏳ Validar en cada checkpoint
4. ⏳ Hacer commit y push
5. ⏳ Crear PR a develop
6. ⏳ Merge a develop
7. ⏳ Comenzar Fase 1

---

## Referencias

- **Spec:** `.kiro/specs/mvp-integracion-angular-react/`
- **Tasks:** `.kiro/specs/mvp-integracion-angular-react/tasks.md`
- **Database:** `.kiro/specs/mvp-integracion-angular-react/database-schema-reference.md`
- **Docker:** `docker-development-workflow.md`

---

**Estado:** LISTO PARA COMENZAR
**Rama:** `feature/fase-0-bd-talonarios`
**Estimación:** 2.75 días (realista)
