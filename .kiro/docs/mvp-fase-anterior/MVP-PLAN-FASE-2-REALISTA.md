# MVP Fase 2 - Plan Realista con Estimaciones

## Contexto de Estimaciones

Basado en la experiencia con el endpoint de duplicar receta, donde enfrentamos:
- Problemas con EF Core + Oracle RAW(16) + ValueConverters
- Múltiples intentos fallidos antes de usar SQL directo
- Debugging de errores de BD (ORA-01400, ORA-00904, etc.)

**Factor de riesgo aplicado:** +50% de tiempo para debugging y correcciones

---

## 1. NUEVA RECETA - Talonarios + IA (CRÍTICO)

### 1.1 Cambios en Base de Datos
**Tareas:**
- Crear tabla `PRESCRIPTION_PADS`
- Agregar columna `pad_id` a `PRESCRIPTIONS`
- Crear índices y constraints
- Crear migraciones

**Tiempo estimado:**
- Diseño: 2 horas
- Implementación: 3 horas
- Testing BD: 2 horas
- **Subtotal: 7 horas**
- **Con riesgo (+50%): 10.5 horas (1.5 días)**

**Riesgos:**
- Problemas con constraints y relaciones
- Necesidad de regenerar EF Core models
- Validación de datos existentes

---

### 1.2 Backend - Modelos y Configuración EF Core
**Tareas:**
- Crear entidad `PrescriptionPad`
- Crear configuración EF Core
- Regenerar DbContext
- Crear migraciones

**Tiempo estimado:**
- Modelos: 2 horas
- Configuración EF: 2 horas
- Migraciones: 1 hora
- Testing: 2 horas
- **Subtotal: 7 horas**
- **Con riesgo (+50%): 10.5 horas (1.5 días)**

**Riesgos:**
- Problemas con ValueConverters (como antes)
- Conflictos de migraciones
- Necesidad de regenerar desde cero

---

### 1.3 Backend - Endpoints y Lógica
**Tareas:**
- POST /api/prescription-pads (crear talonario)
- GET /api/prescription-pads/{doctorId} (obtener talonarios)
- PATCH /api/prescription-pads/{id}/validate (validar número)
- Actualizar CreateDraftCommand para usar talonario
- Validación de números disponibles

**Tiempo estimado:**
- Endpoints: 4 horas
- Lógica de validación: 3 horas
- Testing: 3 horas
- **Subtotal: 10 horas**
- **Con riesgo (+50%): 15 horas (2 días)**

**Riesgos:**
- Lógica compleja de validación de talonarios
- Concurrencia en asignación de números
- Necesidad de transacciones

---

### 1.4 Frontend - Nueva Receta (React)
**Tareas:**
- Actualizar componente de nueva receta
- Integrar selector de talonario
- Actualizar asistente de IA
- Validación en cliente
- UI/UX improvements

**Tiempo estimado:**
- Componentes: 4 horas
- Integración IA: 3 horas
- Validación: 2 horas
- Styling: 2 horas
- Testing: 2 horas
- **Subtotal: 13 horas**
- **Con riesgo (+50%): 19.5 horas (2.5 días)**

**Riesgos:**
- Integración con asistente de IA
- Sincronización con backend
- Validaciones complejas

---

### 1.5 Testing e Integración
**Tareas:**
- Tests unitarios backend
- Tests de integración
- Tests E2E frontend
- Debugging de problemas

**Tiempo estimado:**
- Tests: 4 horas
- Debugging: 4 horas
- **Subtotal: 8 horas**
- **Con riesgo (+50%): 12 horas (1.5 días)**

**Subtotal Módulo 1: 9 días**

---

## 2. RECETAS EMITIDAS - Actualización de Vistas

### 2.1 Frontend - Actualización de Vistas
**Tareas:**
- Mejorar filtros
- Agregar acciones (duplicar, anular, descargar)
- Actualizar tabla de resultados
- Mejorar UX

**Tiempo estimado:**
- Componentes: 3 horas
- Acciones: 2 horas
- Styling: 2 horas
- Testing: 2 horas
- **Subtotal: 9 horas**
- **Con riesgo (+50%): 13.5 horas (2 días)**

**Riesgos:**
- Integración con endpoints existentes
- Manejo de errores

---

### 2.2 Backend - Mejoras (si necesario)
**Tareas:**
- Optimizar búsqueda
- Agregar filtros adicionales
- Mejorar paginación

**Tiempo estimado:**
- Implementación: 2 horas
- Testing: 1 hora
- **Subtotal: 3 horas**
- **Con riesgo (+50%): 4.5 horas (0.5 días)**

**Subtotal Módulo 2: 2.5 días**

---

## 3. REGISTRAR DISPENSACIÓN

### 3.1 Backend - Endpoints
**Tareas:**
- POST /api/dispensations (crear)
- GET /api/dispensations/{prescriptionId}
- PATCH /api/dispensations/{id}
- Validación de inventario
- Actualización de inventario

**Tiempo estimado:**
- Endpoints: 4 horas
- Lógica: 4 horas
- Validación: 2 horas
- Testing: 3 horas
- **Subtotal: 13 horas**
- **Con riesgo (+50%): 19.5 horas (2.5 días)**

**Riesgos:**
- Problemas con transacciones
- Validación de inventario
- Concurrencia en actualizaciones

---

### 3.2 Frontend - Interfaz
**Tareas:**
- Crear vista de dispensación
- Formulario de medicamentos
- Validación en cliente
- Confirmación

**Tiempo estimado:**
- Componentes: 4 horas
- Formularios: 3 horas
- Validación: 2 horas
- Testing: 2 horas
- **Subtotal: 11 horas**
- **Con riesgo (+50%): 16.5 horas (2 días)**

**Subtotal Módulo 3: 4.5 días**

---

## 4. LISTADO DE PACIENTES + PERFIL

### 4.1 Backend - Endpoints
**Tareas:**
- GET /api/patients (listado)
- GET /api/patients/{id} (perfil)
- GET /api/patients/{id}/prescriptions
- GET /api/patients/{id}/allergies
- Búsqueda y filtros

**Tiempo estimado:**
- Endpoints: 4 horas
- Búsqueda: 2 horas
- Testing: 2 horas
- **Subtotal: 8 horas**
- **Con riesgo (+50%): 12 horas (1.5 días)**

**Riesgos:**
- Problemas de performance en búsqueda
- Relaciones complejas

---

### 4.2 Frontend - Listado y Perfil
**Tareas:**
- Componente de listado
- Componente de perfil
- Búsqueda y filtros
- Historial de recetas
- Alergias

**Tiempo estimado:**
- Listado: 3 horas
- Perfil: 4 horas
- Búsqueda: 2 horas
- Styling: 2 horas
- Testing: 2 horas
- **Subtotal: 13 horas**
- **Con riesgo (+50%): 19.5 horas (2.5 días)**

**Riesgos:**
- Integración con múltiples endpoints
- Performance en listados grandes

---

### 4.3 Testing
**Tiempo estimado:**
- Tests: 2 horas
- Debugging: 2 horas
- **Subtotal: 4 horas**
- **Con riesgo (+50%): 6 horas (1 día)**

**Subtotal Módulo 4: 5 días**

---

## 5. LISTADO DE MÉDICOS

### 5.1 Backend - Endpoints
**Tareas:**
- GET /api/doctors (listado)
- GET /api/doctors/{id}
- GET /api/doctors/specialty/{specialtyId}
- Búsqueda

**Tiempo estimado:**
- Endpoints: 2 horas
- Búsqueda: 1 hora
- Testing: 1 hora
- **Subtotal: 4 horas**
- **Con riesgo (+50%): 6 horas (1 día)**

---

### 5.2 Frontend - Listado
**Tareas:**
- Componente de listado
- Búsqueda y filtros
- Detalles del médico

**Tiempo estimado:**
- Componentes: 3 horas
- Búsqueda: 1 hora
- Styling: 1 hora
- Testing: 1 hora
- **Subtotal: 6 horas**
- **Con riesgo (+50%): 9 horas (1 día)**

**Subtotal Módulo 5: 2 días**

---

## 6. LOG DE AUDITORÍA

### 6.1 Frontend - Vistas
**Tareas:**
- Componente de logs
- Filtros (usuario, acción, fecha)
- Búsqueda
- Exportar

**Tiempo estimado:**
- Componentes: 2 horas
- Filtros: 2 horas
- Exportar: 1 hora
- Styling: 1 hora
- Testing: 1 hora
- **Subtotal: 7 horas**
- **Con riesgo (+50%): 10.5 horas (1.5 días)**

**Subtotal Módulo 6: 1.5 días**

---

## 7. CENTROS MÉDICOS

### 7.1 Backend - Endpoints
**Tareas:**
- GET /api/medical-centers
- GET /api/medical-centers/{id}
- GET /api/medical-centers/{id}/doctors

**Tiempo estimado:**
- Endpoints: 2 horas
- Testing: 1 hora
- **Subtotal: 3 horas**
- **Con riesgo (+50%): 4.5 horas (0.5 días)**

---

### 7.2 Frontend - Listado
**Tareas:**
- Componente de listado
- Detalles

**Tiempo estimado:**
- Componentes: 2 horas
- Styling: 1 hora
- Testing: 1 hora
- **Subtotal: 4 horas**
- **Con riesgo (+50%): 6 horas (1 día)**

**Subtotal Módulo 7: 1.5 días**

---

## 8. FARMACIAS

### 8.1 Backend - Endpoints
**Tareas:**
- GET /api/pharmacies
- GET /api/pharmacies/{id}
- GET /api/pharmacies/{id}/inventory

**Tiempo estimado:**
- Endpoints: 2 horas
- Testing: 1 hora
- **Subtotal: 3 horas**
- **Con riesgo (+50%): 4.5 horas (0.5 días)**

---

### 8.2 Frontend - Listado
**Tareas:**
- Componente de listado
- Detalles e inventario

**Tiempo estimado:**
- Componentes: 2 horas
- Styling: 1 hora
- Testing: 1 hora
- **Subtotal: 4 horas**
- **Con riesgo (+50%): 6 horas (1 día)**

**Subtotal Módulo 8: 1.5 días**

---

## RESUMEN DE ESTIMACIONES

| Módulo | Base | Con Riesgo | Días |
|--------|------|-----------|------|
| 1. Nueva Receta | 48h | 72h | 9 |
| 2. Recetas Emitidas | 12h | 18h | 2.5 |
| 3. Dispensación | 24h | 36h | 4.5 |
| 4. Pacientes | 25h | 37.5h | 5 |
| 5. Médicos | 10h | 15h | 2 |
| 6. Auditoría | 7h | 10.5h | 1.5 |
| 7. Centros Médicos | 7h | 10.5h | 1.5 |
| 8. Farmacias | 7h | 10.5h | 1.5 |
| **TOTAL** | **140h** | **210h** | **27.5 días** |

---

## Estimación Realista por Escenarios

### Escenario Optimista (sin problemas mayores)
- **Tiempo:** 140 horas = 17.5 días (8 horas/día)
- **Probabilidad:** 20%

### Escenario Realista (con algunos problemas)
- **Tiempo:** 210 horas = 26 días (8 horas/día)
- **Probabilidad:** 60%
- **Incluye:** Debugging, correcciones menores, problemas de integración

### Escenario Pesimista (problemas significativos como EF Core)
- **Tiempo:** 280 horas = 35 días (8 horas/día)
- **Probabilidad:** 20%
- **Incluye:** Reescrituras de código, problemas de BD, debugging extenso

---

## Recomendación de Ejecución

### Fase 1: Semana 1-2 (Nueva Receta)
- Días 1-2: BD + Modelos EF Core
- Días 3-4: Backend endpoints
- Días 5-6: Frontend
- Días 7-9: Testing e integración

**Riesgo alto:** Problemas con EF Core + Oracle

### Fase 2: Semana 3 (Recetas Emitidas + Dispensación)
- Días 1-2: Recetas Emitidas
- Días 3-4.5: Dispensación

### Fase 3: Semana 4-5 (Vistas Administrativas)
- Días 1-5: Pacientes + Perfil
- Días 6-7: Médicos
- Días 8-8.5: Auditoría
- Días 9-9.5: Centros + Farmacias

---

## Factores de Riesgo Identificados

1. **EF Core + Oracle RAW(16)** (Alto)
   - Solución: Usar SQL directo para operaciones complejas
   - Tiempo buffer: +2 días

2. **Concurrencia en Talonarios** (Medio)
   - Solución: Transacciones y locks
   - Tiempo buffer: +1 día

3. **Performance en Búsquedas** (Medio)
   - Solución: Índices y optimización de queries
   - Tiempo buffer: +1 día

4. **Integración Frontend-Backend** (Medio)
   - Solución: Testing E2E temprano
   - Tiempo buffer: +1 día

---

## Recomendaciones

1. **Usar SQL directo** para operaciones complejas (como en duplicate)
2. **Testing temprano** de integración BD-Backend
3. **Validar datos** antes de operaciones críticas
4. **Documentar** problemas encontrados para futuras referencias
5. **Buffer de 2-3 días** para imprevistos

---

## Próximos Pasos

1. Confirmar estimación realista (26 días)
2. Definir sprint de 2 semanas
3. Comenzar con Nueva Receta (módulo crítico)
4. Establecer checkpoints de validación
