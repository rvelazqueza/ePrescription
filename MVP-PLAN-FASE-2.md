# MVP Fase 2 - Plan de Desarrollo

## Objetivo
Implementar funcionalidades críticas del sistema de e-prescripción con enfoque en actualización del asistente de IA, talonarios, y vistas administrativas.

## Prioridades por Módulo

### 1. NUEVA RECETA (React Frontend + Backend)
**Cambios principales:**
- Integración mejorada del asistente de IA
- Funcionalidad de talonarios (gestión de números de receta)
- Actualización de UI/UX

**Cambios en BD:**
- Nueva tabla: `PRESCRIPTION_PADS` (talonarios)
  - `pad_id` (PK)
  - `doctor_id` (FK)
  - `start_number`
  - `end_number`
  - `current_number`
  - `status` (active/inactive)
  - `created_at`

- Relación: `PRESCRIPTIONS.pad_id` → `PRESCRIPTION_PADS.pad_id`

**Endpoints a actualizar:**
- POST /api/prescriptions/create-draft (incluir pad_id)
- POST /api/prescriptions (incluir validación de talonario)

---

### 2. RECETAS EMITIDAS (React Frontend)
**Cambios principales:**
- Actualización de vistas
- Filtros mejorados
- Acciones: ver detalles, duplicar, anular, descargar

**Endpoints existentes:**
- GET /api/prescriptions/search (ya funciona)
- POST /api/prescriptions/{id}/duplicate (ya funciona)
- PATCH /api/prescriptions/{id}/cancel (ya funciona)

---

### 3. REGISTRAR DISPENSACIÓN (React Frontend + Backend)
**Cambios principales:**
- Nueva vista para registrar dispensaciones
- Validación de medicamentos disponibles
- Actualización de inventario

**Cambios en BD:**
- Tabla `DISPENSATIONS` ya existe
- Tabla `DISPENSATION_ITEMS` ya existe
- Tabla `INVENTORY` ya existe

**Endpoints a crear:**
- POST /api/dispensations (crear dispensación)
- GET /api/dispensations/{prescriptionId} (obtener dispensaciones de receta)
- PATCH /api/dispensations/{id} (actualizar dispensación)

---

### 4. LISTADO DE PACIENTES + PERFIL (React Frontend + Backend)
**Cambios principales:**
- Vista de listado con búsqueda y filtros
- Perfil detallado del paciente
- Historial de recetas
- Alergias y condiciones médicas

**Endpoints a crear:**
- GET /api/patients (listado con paginación)
- GET /api/patients/{id} (perfil completo)
- GET /api/patients/{id}/prescriptions (historial)
- GET /api/patients/{id}/allergies (alergias)

---

### 5. LISTADO DE MÉDICOS (React Frontend + Backend)
**Cambios principales:**
- Vista de listado con búsqueda
- Filtros por especialidad
- Información de contacto

**Endpoints a crear:**
- GET /api/doctors (listado con paginación)
- GET /api/doctors/{id} (detalles)
- GET /api/doctors/specialty/{specialtyId} (por especialidad)

---

### 6. LOG DE AUDITORÍA (React Frontend + Backend)
**Cambios principales:**
- Vista de logs con filtros
- Búsqueda por usuario, acción, fecha
- Exportar logs

**Endpoints existentes:**
- GET /api/audit-logs (ya existe)
- GET /api/audit-logs/search (ya existe)

---

### 7. CENTROS MÉDICOS (React Frontend + Backend)
**Cambios principales:**
- Listado de centros registrados
- Información de contacto
- Médicos asociados

**Endpoints a crear:**
- GET /api/medical-centers (listado)
- GET /api/medical-centers/{id} (detalles)
- GET /api/medical-centers/{id}/doctors (médicos)

---

### 8. FARMACIAS (React Frontend + Backend)
**Cambios principales:**
- Listado de farmacias registradas
- Información de contacto
- Inventario disponible

**Endpoints a crear:**
- GET /api/pharmacies (listado)
- GET /api/pharmacies/{id} (detalles)
- GET /api/pharmacies/{id}/inventory (inventario)

---

## Cambios en Base de Datos

### Nuevas Tablas
1. `PRESCRIPTION_PADS` - Talonarios de recetas

### Nuevas Columnas
1. `PRESCRIPTIONS.pad_id` - Referencia al talonario

### Nuevas Relaciones
1. `PRESCRIPTIONS` → `PRESCRIPTION_PADS`

---

## Orden de Implementación Recomendado

1. **Fase 1**: Nueva Receta (talonarios + IA)
2. **Fase 2**: Recetas Emitidas (actualización de vistas)
3. **Fase 3**: Registrar Dispensación
4. **Fase 4**: Listado de Pacientes + Perfil
5. **Fase 5**: Listado de Médicos
6. **Fase 6**: Log de Auditoría
7. **Fase 7**: Centros Médicos
8. **Fase 8**: Farmacias

---

## Estimación de Esfuerzo

| Módulo | Frontend | Backend | BD | Total |
|--------|----------|---------|----|----|
| Nueva Receta | 3 días | 2 días | 1 día | 6 días |
| Recetas Emitidas | 2 días | 0 días | 0 días | 2 días |
| Dispensación | 2 días | 2 días | 0 días | 4 días |
| Pacientes | 3 días | 2 días | 0 días | 5 días |
| Médicos | 2 días | 1 día | 0 días | 3 días |
| Auditoría | 1 día | 0 días | 0 días | 1 día |
| Centros Médicos | 1 día | 1 día | 0 días | 2 días |
| Farmacias | 1 día | 1 día | 0 días | 2 días |
| **TOTAL** | **15 días** | **9 días** | **1 día** | **25 días** |

---

## Próximos Pasos

1. Crear estructura de BD para talonarios
2. Actualizar modelos de dominio
3. Crear migraciones de BD
4. Implementar endpoints backend
5. Actualizar componentes React
6. Testing e integración
