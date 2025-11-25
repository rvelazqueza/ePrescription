# ⚠️ Task 15.18 PENDIENTE: Dashboard Requiere Backend

## 🎯 Objetivo
Conectar el Dashboard a endpoints reales del backend para eliminar todos los datos hardcodeados.

## 📊 Estado Actual

### ✅ Servicio Creado
- **Archivo**: `eprescription-frontend/src/app/services/dashboard.service.ts`
- **Estado**: ✅ Creado y listo para usar
- **Endpoints esperados**:
  - `GET /api/dashboard/stats?role={role}` - Estadísticas completas
  - `GET /api/dashboard/kpis?role={role}` - KPIs por rol
  - `GET /api/dashboard/recent-activity?role={role}&limit={limit}` - Actividad reciente
  - `GET /api/dashboard/insights?role={role}` - Insights clínicos

### ❌ Backend NO Implementado
El backend **NO tiene** estos endpoints todavía. Se requiere:

1. **Crear DashboardController** en el API
2. **Crear Queries** para estadísticas
3. **Implementar lógica** de cálculo de KPIs por rol
4. **Implementar lógica** de actividad reciente
5. **Implementar lógica** de insights

## 📝 Datos Hardcodeados en Dashboard Component

### 1. KPIs por Rol (getCurrentKPIs)
**Médico/Médico Jefe**:
- Recetas hoy: 24 (+12%)
- Pacientes atendidos: 18 (+8%)
- Borradores pendientes: 3 (0)
- Alertas clínicas: 2 (-50%)

**Farmacéutico**:
- Dispensaciones hoy: 67 (+15%)
- Recetas verificadas: 89 (+10%)
- Stock bajo: 12 (+3)
- Rechazos: 3 (-2)

**Enfermera**:
- Pacientes registrados: 31 (+5%)
- Medicamentos administrados: 156 (+7%)
- Signos vitales tomados: 89 (+12%)
- Alertas pendientes: 4 (0)

**Administrador**:
- Usuarios activos: 245 (+3%)
- Recetas totales (hoy): 487 (+18%)
- Aprobaciones pendientes: 7 (+2)
- Incidencias: 1 (-3)

### 2. Acciones Rápidas (getCurrentQuickActions)
- Títulos, descripciones, iconos y rutas hardcodeados
- Contadores de pendientes hardcodeados (ej: "3 pendientes", "12 productos bajos")

### 3. Actividad Reciente (getCurrentRecentActivity)
- IDs de ejemplo: RX-2024-0245, DRAFT-089, DISP-456, etc.
- Nombres de pacientes de ejemplo
- Timestamps de ejemplo
- Estados hardcodeados

### 4. Insights Clínicos (getCurrentInsights)
- Patrones de prescripción hardcodeados
- Alertas de interacciones hardcodeadas
- Métricas de eficiencia hardcodeadas
- Información de stock hardcodeada

## 🚧 Trabajo Pendiente

### Backend (API) - CRÍTICO
```csharp
// Archivo: eprescription-API/src/ePrescription.API/Controllers/DashboardController.cs

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats([FromQuery] string role)
    {
        // TODO: Implementar lógica de estadísticas por rol
        // - Consultar prescripciones del día
        // - Consultar dispensaciones del día
        // - Consultar alertas activas
        // - Calcular cambios porcentuales
        // - Retornar KPIs, acciones rápidas, actividad reciente e insights
    }

    [HttpGet("kpis")]
    public async Task<ActionResult<List<DashboardKpiDto>>> GetKPIs([FromQuery] string role)
    {
        // TODO: Implementar lógica de KPIs por rol
    }

    [HttpGet("recent-activity")]
    public async Task<ActionResult<List<RecentActivityDto>>> GetRecentActivity(
        [FromQuery] string role, 
        [FromQuery] int limit = 10)
    {
        // TODO: Implementar lógica de actividad reciente
    }

    [HttpGet("insights")]
    public async Task<ActionResult<List<InsightDto>>> GetInsights([FromQuery] string role)
    {
        // TODO: Implementar lógica de insights clínicos
    }
}
```

### Frontend - PENDIENTE (Después del Backend)
Una vez que el backend esté listo:

1. **Inyectar DashboardService** en el componente
2. **Reemplazar getCurrentKPIs()** con llamada al servicio
3. **Reemplazar getCurrentQuickActions()** con llamada al servicio
4. **Reemplazar getCurrentRecentActivity()** con llamada al servicio
5. **Reemplazar getCurrentInsights()** con llamada al servicio
6. **Eliminar todos los métodos** con datos hardcodeados

## 📌 Decisión

**NO voy a modificar el Dashboard Component ahora** porque:

1. ✅ El servicio ya está creado y listo
2. ❌ El backend NO existe todavía
3. ⚠️ Modificar el componente ahora rompería la funcionalidad
4. 🎯 Es mejor esperar a que el backend esté listo

## 🎯 Próximos Pasos Recomendados

### Opción A: Implementar Backend Ahora
1. Crear DashboardController
2. Crear DTOs para dashboard
3. Crear Queries para estadísticas
4. Implementar lógica de cálculo
5. Probar endpoints
6. Conectar frontend

**Esfuerzo**: ALTO (4-6 horas)
**Prioridad**: MEDIA (no bloquea funcionalidad core)

### Opción B: Dejar para Después
1. Mantener datos hardcodeados en dashboard
2. Enfocarse en eliminar mock de otros componentes críticos
3. Implementar dashboard backend en una fase posterior

**Esfuerzo**: BAJO (0 horas ahora)
**Prioridad**: BAJA (dashboard funciona con datos de ejemplo)

## ✅ Recomendación

**Opción B**: Dejar el Dashboard para después y enfocarse en:
1. ✅ PatientService - YA COMPLETADO
2. 🎯 Componentes de Prescripciones - SIGUIENTE
3. 🎯 Otros servicios críticos

El Dashboard puede funcionar con datos de ejemplo porque:
- No afecta datos operacionales
- Es principalmente informativo
- Los usuarios entienden que son estadísticas de ejemplo
- Las funcionalidades core (prescripciones, dispensaciones, inventario) ya están conectadas

---

**Fecha**: 2025-01-XX
**Estado**: ⚠️ PENDIENTE (Backend no existe)
**Archivos Creados**: 1
- `eprescription-frontend/src/app/services/dashboard.service.ts` ✅
