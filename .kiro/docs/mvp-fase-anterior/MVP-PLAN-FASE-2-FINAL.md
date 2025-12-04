# MVP Fase 2 - Plan Final (Migración Angular → React)

## Realidad del Proyecto

**Angular (eprescription-frontend) ya tiene:**
- ✅ Pacientes (lista + perfil + recetas)
- ✅ Médicos (lista)
- ✅ Auditoría (logs)
- ✅ Farmacias (lista)
- ✅ Dispensación (registrar)
- ✅ Talonarios (gestión)

**React (ePrescription-react) necesita:**
- Nueva Receta (actualizar con IA + talonarios)
- Recetas Emitidas (actualizar)
- Migrar/Actualizar las 7 vistas restantes desde Angular

---

## Plan Optimizado - 9 Vistas

### 1. NUEVA RECETA (React) - IA + Talonarios
**Cambios:**
- Integrar talonarios
- Mejorar IA
- Actualizar UI

**Tiempo:**
- Backend: 2 días (BD + endpoints)
- React: 2 días (componentes + IA)
- Testing: 1 día
- **Total: 5 días**

---

### 2. RECETAS EMITIDAS (React) - Actualización
**Cambios:**
- Mejorar filtros
- Agregar acciones

**Tiempo:**
- React: 1 día
- Testing: 0.5 días
- **Total: 1.5 días**

---

### 3. REGISTRAR DISPENSACIÓN (React) - Migración
**Cambios:**
- Migrar componente de Angular
- Adaptar a React
- Integrar con backend

**Tiempo:**
- React: 1.5 días
- Testing: 0.5 días
- **Total: 2 días**

---

### 4. LISTADO DE PACIENTES (React) - Migración
**Cambios:**
- Migrar componente de Angular
- Adaptar a React
- Integrar búsqueda

**Tiempo:**
- React: 1.5 días
- Testing: 0.5 días
- **Total: 2 días**

---

### 5. PERFIL DEL PACIENTE (React) - Migración
**Cambios:**
- Migrar componente de Angular
- Adaptar a React
- Mostrar historial de recetas

**Tiempo:**
- React: 1.5 días
- Testing: 0.5 días
- **Total: 2 días**

---

### 6. LISTADO DE MÉDICOS (React) - Migración
**Cambios:**
- Migrar componente de Angular
- Adaptar a React
- Integrar filtros

**Tiempo:**
- React: 1 día
- Testing: 0.5 días
- **Total: 1.5 días**

---

### 7. LOG DE AUDITORÍA (React) - Migración
**Cambios:**
- Migrar componente de Angular
- Adaptar a React
- Integrar filtros

**Tiempo:**
- React: 1 día
- Testing: 0.5 días
- **Total: 1.5 días**

---

### 8. CENTROS MÉDICOS (React) - Migración
**Cambios:**
- Migrar componente de Angular
- Adaptar a React

**Tiempo:**
- React: 0.75 días
- Testing: 0.25 días
- **Total: 1 día**

---

### 9. FARMACIAS (React) - Migración
**Cambios:**
- Migrar componente de Angular
- Adaptar a React

**Tiempo:**
- React: 0.75 días
- Testing: 0.25 días
- **Total: 1 día**

---

## Resumen de Estimaciones

| Módulo | Tipo | Tiempo Base | Con Riesgo | Días |
|--------|------|-------------|-----------|------|
| 1. Nueva Receta | Actualización | 5 días | 6 días | 6 |
| 2. Recetas Emitidas | Actualización | 1.5 días | 2 días | 2 |
| 3. Dispensación | Migración | 2 días | 2.5 días | 2.5 |
| 4. Pacientes (Lista) | Migración | 2 días | 2.5 días | 2.5 |
| 5. Pacientes (Perfil) | Migración | 2 días | 2.5 días | 2.5 |
| 6. Médicos | Migración | 1.5 días | 2 días | 2 |
| 7. Auditoría | Migración | 1.5 días | 2 días | 2 |
| 8. Centros Médicos | Migración | 1 día | 1.5 días | 1.5 |
| 9. Farmacias | Migración | 1 día | 1.5 días | 1.5 |
| **TOTAL** | | **17.5 días** | **22.5 días** | **22.5** |

---

## Desglose por Semana

### Semana 1: Nueva Receta + Recetas Emitidas (8 días)
- Días 1-2: Backend (BD + endpoints)
- Días 3-4: Nueva Receta React
- Días 5-6: Recetas Emitidas React
- Días 7-8: Testing e integración

### Semana 2: Dispensación + Pacientes (9 días)
- Días 1-2: Dispensación React
- Días 3-4: Listado Pacientes React
- Días 5-6: Perfil Paciente React
- Días 7-9: Testing e integración

### Semana 3: Médicos + Auditoría + Centros + Farmacias (5.5 días)
- Días 1-2: Médicos React
- Días 2-3: Auditoría React
- Días 3-4: Centros Médicos React
- Días 4-5: Farmacias React
- Día 5.5: Testing final

---

## Factores de Riesgo

### Alto Riesgo
1. **EF Core + Oracle** (como antes)
   - Buffer: +1 día

2. **Migración de componentes Angular → React**
   - Diferencias en ciclo de vida
   - Diferencias en binding
   - Buffer: +2 días

### Medio Riesgo
1. **Integración de APIs**
   - Buffer: +1 día

2. **Validaciones y formularios**
   - Buffer: +1 día

---

## Estrategia de Migración Angular → React

### Patrón para cada vista:
1. Analizar componente Angular (0.5h)
2. Crear estructura React (0.5h)
3. Migrar lógica (1h)
4. Adaptar UI (1h)
5. Integrar APIs (0.5h)
6. Testing (0.5h)

**Total por vista: 4 horas**

---

## Estimación Realista

- **Optimista:** 17.5 días (sin problemas)
- **Realista:** 22.5 días (con algunos problemas)
- **Pesimista:** 27-28 días (problemas significativos)

**Recomendación:** Usar **22.5 días** como estimación base

---

## Recomendaciones Clave

1. **Reutilizar componentes Angular**
   - No reescribir desde cero
   - Adaptar la lógica a React

2. **Usar SQL directo para operaciones complejas**
   - Evita problemas con EF Core

3. **Testing temprano**
   - Valida integración desde día 1

4. **Documentar patrones de migración**
   - Para futuras migraciones

5. **Buffer de 2-3 días**
   - Para imprevistos

---

## Próximos Pasos

1. Confirmar estimación de 22.5 días
2. Comenzar con Nueva Receta (módulo crítico)
3. Establecer checkpoints semanales
4. Documentar problemas encontrados
