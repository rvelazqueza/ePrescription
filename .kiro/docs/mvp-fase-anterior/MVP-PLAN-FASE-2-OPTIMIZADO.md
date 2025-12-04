# MVP Fase 2 - Plan Optimizado (Angular + React)

## Contexto Actual

**Frontend existente en Angular:**
- ✅ Búsqueda de recetas
- ✅ Dashboard
- ✅ Auditoría
- ✅ Pacientes
- ✅ Médicos
- ✅ Farmacias
- ✅ Talonarios
- ✅ Dispensación
- ✅ Inventario

**Frontend en React (ePrescription-react):**
- Nueva Receta (con IA)
- Recetas Emitidas
- Borradores

**Realidad:** No necesitas crear 9 vistas nuevas. Solo necesitas:
1. Actualizar Nueva Receta en React (IA + Talonarios)
2. Actualizar Recetas Emitidas en React
3. Integrar Dispensación desde Angular a React (si aplica)

---

## Plan Optimizado - 3 Módulos Principales

### 1. NUEVA RECETA - React (IA + Talonarios)

**Cambios en BD:**
- Crear tabla `PRESCRIPTION_PADS`
- Agregar `pad_id` a `PRESCRIPTIONS`

**Tiempo:**
- BD: 1 día (crear tabla + migraciones)
- Backend endpoints: 1.5 días (POST pad, GET pad, validar número)
- React UI: 1.5 días (selector talonario + IA)
- Testing: 1 día
- **Total: 5 días**

**Riesgos:**
- Problemas con EF Core (buffer: +1 día)
- Integración IA (buffer: +0.5 días)

**Con riesgo: 6.5 días**

---

### 2. RECETAS EMITIDAS - React (Actualización)

**Cambios:**
- Mejorar filtros
- Agregar acciones (duplicar, anular, descargar)
- Actualizar tabla

**Tiempo:**
- React UI: 1 día
- Testing: 0.5 días
- **Total: 1.5 días**

**Riesgos:**
- Integración con endpoints (buffer: +0.5 días)

**Con riesgo: 2 días**

---

### 3. DISPENSACIÓN - Integración

**Opción A: Usar Angular existente**
- Ya existe en Angular
- Solo integrar en React si es necesario
- **Tiempo: 0 días** (ya existe)

**Opción B: Actualizar en React**
- Crear componente en React
- Integrar con backend
- **Tiempo: 2 días**

**Recomendación:** Usar Angular existente por ahora

---

## Resumen Realista

| Módulo | Tiempo Base | Con Riesgo | Días |
|--------|-------------|-----------|------|
| 1. Nueva Receta | 5 días | 6.5 días | 6.5 |
| 2. Recetas Emitidas | 1.5 días | 2 días | 2 |
| 3. Dispensación | 0 días | 0 días | 0 |
| **TOTAL** | **6.5 días** | **8.5 días** | **8.5** |

---

## Desglose Detallado

### Semana 1: Nueva Receta (6.5 días)

**Día 1: BD + Backend Setup**
- Crear tabla `PRESCRIPTION_PADS` (2h)
- Crear migraciones (1h)
- Crear entidad y configuración EF Core (2h)
- Testing BD (1h)
- **Total: 6h**

**Día 2: Backend Endpoints**
- POST /api/prescription-pads (2h)
- GET /api/prescription-pads/{doctorId} (1h)
- PATCH /api/prescription-pads/{id}/validate (2h)
- Testing: 1h
- **Total: 6h**

**Día 3: Backend Integración**
- Actualizar CreateDraftCommand (2h)
- Validación de talonarios (2h)
- Testing: 2h
- **Total: 6h**

**Día 4: React UI - Componentes**
- Selector de talonario (2h)
- Integración con formulario (2h)
- Validación en cliente (1h)
- **Total: 5h**

**Día 5: React UI - IA + Styling**
- Integración asistente IA (2h)
- Styling y UX (2h)
- Testing: 1h
- **Total: 5h**

**Día 6.5: Testing e Integración**
- Tests E2E (2h)
- Debugging (2h)
- Validación final (1h)
- **Total: 5h**

---

### Semana 2: Recetas Emitidas (2 días)

**Día 1: React UI**
- Mejorar filtros (1h)
- Agregar acciones (1h)
- Actualizar tabla (1h)
- Styling (1h)
- **Total: 4h**

**Día 2: Testing**
- Tests E2E (1h)
- Debugging (1h)
- Validación final (1h)
- **Total: 3h**

---

## Factores de Riesgo Específicos

### Alto Riesgo
1. **EF Core + Oracle RAW(16)** (como antes)
   - Solución: Usar SQL directo
   - Buffer: +1 día

2. **Integración IA en React**
   - Solución: Testing temprano
   - Buffer: +0.5 días

### Medio Riesgo
1. **Validación de talonarios concurrentes**
   - Solución: Transacciones
   - Buffer: +0.5 días

2. **Integración frontend-backend**
   - Solución: Testing E2E
   - Buffer: +0.5 días

---

## Recomendaciones Clave

1. **No recrear lo que ya existe en Angular**
   - Dispensación, Pacientes, Médicos, Auditoría, Farmacias ya están en Angular
   - Solo actualiza React si es necesario

2. **Usar SQL directo para operaciones complejas**
   - Evita problemas con EF Core
   - Basado en experiencia con duplicate

3. **Testing temprano**
   - Valida integración BD-Backend desde día 1
   - Valida integración React-Backend desde día 3

4. **Buffer de 1-2 días**
   - Para imprevistos
   - Para debugging

---

## Estimación Final

- **Optimista:** 6.5 días (sin problemas)
- **Realista:** 8.5 días (con algunos problemas)
- **Pesimista:** 10-11 días (problemas significativos)

**Recomendación:** Usar **8.5 días** como estimación base

---

## Próximos Pasos

1. Confirmar si necesitas Dispensación en React o usas Angular
2. Comenzar con Nueva Receta (módulo crítico)
3. Establecer checkpoints diarios
4. Documentar problemas encontrados
