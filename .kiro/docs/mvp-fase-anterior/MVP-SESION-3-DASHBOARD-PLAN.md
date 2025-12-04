# Plan de Migración: Dashboard Component

## Estado Actual

El componente Dashboard tiene **TODO hardcodeado** con datos mock muy detallados:
- KPIs por rol (4 métricas por rol)
- Acciones rápidas (4 por rol)
- Actividad reciente (4 items por rol)
- Insights y recomendaciones (3 por rol)
- Métricas del sistema (4 métricas)

**Total de datos mock**: ~100+ objetos hardcodeados

## Problema Principal

❌ **NO HAY ENDPOINTS EN EL BACKEND**

El `DashboardService` está preparado pero los endpoints no existen:
- `GET /api/dashboard/stats?role={role}`
- `GET /api/dashboard/kpis?role={role}`
- `GET /api/dashboard/recent-activity?role={role}`
- `GET /api/dashboard/insights?role={role}`

## Opciones de Migración

### Opción A: Crear Endpoints en Backend (Completo)
**Tiempo**: 4-6 horas
**Complejidad**: Alta

**Requiere**:
1. Crear `DashboardController` en backend
2. Implementar queries para calcular KPIs reales:
   - Contar prescripciones por día/rol
   - Contar pacientes atendidos
   - Calcular dispensaciones
   - Obtener alertas
3. Implementar actividad reciente (queries a audit log)
4. Implementar insights (lógica de negocio compleja)
5. Testing completo

**Ventajas**:
- Dashboard 100% real
- Datos precisos y actualizados
- Insights valiosos

**Desventajas**:
- Muy largo (4-6 horas)
- Requiere lógica de negocio compleja
- Puede requerir índices en BD

---

### Opción B: Usar Endpoints Existentes (Híbrido) ⭐ RECOMENDADO
**Tiempo**: 1.5-2 horas
**Complejidad**: Media

**Estrategia**:
Calcular KPIs en el frontend usando endpoints existentes:

```typescript
// En lugar de GET /api/dashboard/kpis
// Usar endpoints existentes:

// KPI: Recetas hoy
GET /api/prescriptions/search?status=Issued&startDate=today
→ response.totalCount

// KPI: Pacientes atendidos
GET /api/patients/search?pageSize=1
→ response.totalCount

// KPI: Borradores pendientes
GET /api/prescriptions/search?status=Draft
→ response.totalCount

// KPI: Dispensaciones
GET /api/dispensations/search?startDate=today
→ response.totalCount
```

**Ventajas**:
- Usa infraestructura existente
- Datos reales del sistema
- Rápido de implementar
- No requiere cambios en backend

**Desventajas**:
- Múltiples llamadas HTTP (4-6 requests)
- No hay cálculo de "cambio vs ayer" (puede ser mock)
- Insights siguen siendo mock (por ahora)

---

### Opción C: Mantener Mock + Indicador (Rápido)
**Tiempo**: 30 minutos
**Complejidad**: Baja

**Estrategia**:
- Mantener datos mock
- Agregar banner: "Dashboard en modo demostración"
- Marcar para migración futura

**Ventajas**:
- Muy rápido
- No rompe nada
- Dashboard sigue funcional

**Desventajas**:
- No elimina mock data
- No cumple objetivo del MVP

---

## Recomendación: Opción B (Híbrido)

### Plan de Implementación

#### Fase 1: KPIs Reales (45 min)

**Para Médico**:
```typescript
async loadMedicoKPIs() {
  const today = new Date().toISOString().split('T')[0];
  
  // Recetas hoy
  const recetasHoy = await this.prescripcionesService
    .getPrescripciones({ status: 'Issued', startDate: today })
    .pipe(map(r => r.totalCount));
  
  // Pacientes (total en sistema)
  const pacientes = await this.patientService
    .searchPatients({ pageSize: 1 })
    .pipe(map(r => r.totalCount));
  
  // Borradores pendientes
  const borradores = await this.prescripcionesService
    .getPrescripciones({ status: 'Draft' })
    .pipe(map(r => r.totalCount));
  
  return [
    { label: 'Recetas hoy', value: recetasHoy, ... },
    { label: 'Pacientes', value: pacientes, ... },
    { label: 'Borradores', value: borradores, ... },
    { label: 'Alertas', value: 0, ... } // Mock por ahora
  ];
}
```

**Para Farmacéutico**:
```typescript
async loadFarmaceuticoKPIs() {
  const today = new Date().toISOString().split('T')[0];
  
  // Dispensaciones hoy
  const dispensaciones = await this.dispensationService
    .searchDispensations({ startDate: today })
    .pipe(map(r => r.totalCount));
  
  // Stock bajo
  const stockBajo = await this.inventoryService
    .getLowStockAlerts()
    .pipe(map(r => r.length));
  
  return [
    { label: 'Dispensaciones hoy', value: dispensaciones, ... },
    { label: 'Stock bajo', value: stockBajo, ... },
    // ... más KPIs
  ];
}
```

#### Fase 2: Actividad Reciente Real (30 min)

**Estrategia**: Usar endpoints de búsqueda con ordenamiento por fecha

```typescript
async loadRecentActivity() {
  const role = this.currentSession.activeRole;
  
  switch (role) {
    case 'Médico':
      // Últimas 4 prescripciones
      const prescriptions = await this.prescripcionesService
        .getPrescripciones({ 
          status: 'Issued', 
          pageSize: 4,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
      
      return prescriptions.items.map(p => ({
        id: p.prescriptionNumber,
        title: 'Receta emitida',
        subtitle: `Paciente ${p.patientId}`,
        time: this.formatTime(p.createdAt),
        status: 'success',
        icon: this.fileCheckIcon,
        route: `/prescripciones/emitidas`
      }));
      
    case 'Farmacéutico':
      // Últimas dispensaciones
      const dispensations = await this.dispensationService
        .searchDispensations({ pageSize: 4 });
      // ... mapear
  }
}
```

#### Fase 3: Mantener Mock para Insights (15 min)

Los insights requieren lógica de negocio compleja. Por ahora:
- Mantener mock data
- Agregar comentario: `// TODO: Implementar con backend`
- Documentar para futura implementación

#### Fase 4: Optimización (30 min)

**Problema**: Múltiples llamadas HTTP secuenciales

**Solución**: Usar `forkJoin` para paralelizar

```typescript
loadDashboardData() {
  this.isLoading = true;
  
  forkJoin({
    recetasHoy: this.prescripcionesService.getPrescripciones({ 
      status: 'Issued', 
      startDate: today 
    }),
    borradores: this.prescripcionesService.getPrescripciones({ 
      status: 'Draft' 
    }),
    pacientes: this.patientService.searchPatients({ pageSize: 1 }),
    recentPrescriptions: this.prescripcionesService.getPrescripciones({ 
      pageSize: 4 
    })
  }).subscribe({
    next: (data) => {
      this.kpis = this.buildKPIs(data);
      this.recentActivity = this.buildActivity(data);
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading dashboard:', error);
      this.isLoading = false;
    }
  });
}
```

---

## Datos Disponibles vs No Disponibles

### ✅ Datos Disponibles (Endpoints Existentes)

| Métrica | Endpoint | Disponible |
|---------|----------|------------|
| Recetas emitidas | `/api/prescriptions/search?status=Issued` | ✅ |
| Borradores | `/api/prescriptions/search?status=Draft` | ✅ |
| Pacientes | `/api/patients/search` | ✅ |
| Dispensaciones | `/api/dispensations/search` | ✅ |
| Stock bajo | `/api/inventory/low-stock-alerts` | ✅ |
| Últimas prescripciones | `/api/prescriptions/search?pageSize=4` | ✅ |
| Últimas dispensaciones | `/api/dispensations/search?pageSize=4` | ✅ |

### ⚠️ Datos No Disponibles (Requieren Backend)

| Métrica | Razón | Solución Temporal |
|---------|-------|-------------------|
| Cambio vs ayer ("+12%") | Requiere cálculo histórico | Mock o "N/A" |
| Alertas clínicas | No hay endpoint | Mock (0) |
| Insights personalizados | Requiere lógica compleja | Mock |
| Métricas del sistema | Requiere monitoreo | Mock |
| Tiempo promedio por receta | Requiere analytics | Mock |

---

## Estimación de Tiempo

| Fase | Descripción | Tiempo |
|------|-------------|--------|
| 1 | KPIs reales (Médico + Farmacéutico) | 45 min |
| 2 | Actividad reciente real | 30 min |
| 3 | Mantener mock para insights | 15 min |
| 4 | Optimización (forkJoin) | 30 min |
| **TOTAL** | | **2 horas** |

---

## Resultado Esperado

### Después de la Migración

```
Dashboard:
├── KPIs
│   ├── ✅ Valores reales del backend
│   ├── ⚠️ Cambios vs ayer (mock)
│   └── ✅ Navegación funcional
├── Acciones Rápidas
│   └── ✅ Mantener (no requiere backend)
├── Actividad Reciente
│   ├── ✅ Datos reales (últimas 4)
│   └── ✅ Timestamps reales
├── Insights
│   └── ⚠️ Mock (documentado para futuro)
└── Métricas del Sistema
    └── ⚠️ Mock (documentado para futuro)
```

**Progreso**: 60% real, 40% mock (documentado)

---

## Decisión Requerida

**¿Procedemos con Opción B (Híbrido)?**

**Pros**:
- 2 horas de trabajo
- KPIs y actividad reciente reales
- No requiere cambios en backend
- Usa infraestructura existente

**Cons**:
- Insights siguen siendo mock
- Cambios "vs ayer" son mock
- Múltiples llamadas HTTP

**Alternativa**: Si prefieres 100% real, necesitamos 4-6 horas para crear endpoints en backend.

---

## Siguiente Paso

¿Quieres que proceda con la Opción B (Híbrido - 2 horas)?

O prefieres:
- **Opción A**: Crear endpoints completos en backend (4-6 horas)
- **Opción C**: Mantener mock + banner (30 min) y pasar a otra vista
