# MVP Sesión 3 - Plan de Trabajo

## Estado Actual

✅ **Completado:**
- Borradores (100% Backend Real)

## Próximas Vistas Prioritarias

### Opción 1: Nueva Prescripción (Parcialmente Mock)
**Complejidad:** ALTA
**Tiempo Estimado:** 3-4 horas
**Estado:** Parcialmente conectado

**Trabajo Requerido:**
- Completar `cargarDatosBorrador()`
- Implementar mapper medications
- Conectar `guardarCambios()` a `createPrescripcion()`
- Conectar `finalizarPrescripcion()` a `updatePrescripcion()`

**Ventajas:**
- Es crítico para el flujo principal
- Ya tiene servicios inyectados
- Backend disponible

**Desventajas:**
- Más complejo
- Requiere mapeo de datos complejos
- Múltiples operaciones CRUD

---

### ✅ Opción 2: Emitidas - COMPLETADO
**Complejidad:** BAJA
**Tiempo Real:** 45 minutos
**Estado:** ✅ 100% Backend Real

**Trabajo Completado:**
- ✅ Eliminado array mock `recetas` (5 recetas hardcodeadas)
- ✅ Implementado `loadPrescriptions()`
- ✅ Mapeado `PrescriptionDto` → `RecetaEmitida`
- ✅ Conectadas operaciones (ver, anular)
- ✅ Cache de pacientes implementado
- ✅ Estados de carga (loading/error/success)
- ✅ Sin errores de compilación

**Resultado:**
- Vista funcional con datos reales
- Integración completa con backend
- Documentación de limitaciones
- Script de testing creado

**Ver detalles:** `MVP-SESION-3-EMITIDAS-COMPLETADO.md`

---

### Opción 3: Dashboard (100% Mock)
**Complejidad:** MEDIA
**Tiempo Estimado:** 3 horas
**Estado:** 100% Mock

**Trabajo Requerido:**
- Implementar endpoints de estadísticas
- Conectar gráficos y métricas
- Actividad reciente

**Ventajas:**
- Vista principal de la app
- Alto impacto visual

**Desventajas:**
- Requiere múltiples endpoints
- Puede necesitar agregaciones en backend

---

## Progreso Actual

**Completados:**
1. ✅ Borradores (Sesión 2)
2. ✅ Emitidas (Sesión 3 - 45 min)

**Próximo Paso Recomendado:**

**Opción A: Dashboard** (Impacto visual alto)
- Tiempo: 2-3 horas
- Complejidad: Media
- Requiere: Múltiples endpoints de estadísticas

**Opción B: Nueva Prescripción** (Crítico para flujo)
- Tiempo: 3-4 horas
- Complejidad: Alta
- Requiere: Completar integraciones parciales

**Opción C: Buscar Prescripciones** (Rápido)
- Tiempo: 1-2 horas
- Complejidad: Baja
- Requiere: Similar a Emitidas/Borradores

**Orden Sugerido Actualizado:**
1. ✅ Borradores (COMPLETADO)
2. ✅ Emitidas (COMPLETADO)
3. 🎯 Dashboard o Buscar (SIGUIENTE)
4. 📝 Nueva Prescripción (después)
5. 🔍 Otras vistas menores

## Endpoint Disponible

```
GET /api/prescriptions/search?status=issued
```

**Respuesta:**
```json
{
  "items": [
    {
      "id": "guid",
      "prescriptionNumber": "RX-2025-001234",
      "patientId": "guid",
      "doctorId": "guid",
      "prescriptionDate": "2025-01-15",
      "status": "issued",
      "medications": [...],
      "diagnoses": [...]
    }
  ],
  "totalCount": 10,
  "page": 1,
  "pageSize": 10
}
```

## Archivos a Modificar

1. `eprescription-frontend/src/app/pages/prescripciones/emitidas/emitidas.component.ts`
   - Eliminar mock data
   - Implementar `loadIssuedPrescriptions()`
   - Mapear datos

2. Ya tenemos el servicio listo:
   - `PrescripcionesService.getPrescripciones({ status: 'issued' })`
   - Interfaz `PaginatedPrescriptionResponse` ya creada

## Patrón a Seguir

Usar el mismo patrón que Borradores:

```typescript
loadIssuedPrescriptions() {
  this.isLoading = true;
  this.error = null;

  this.prescripcionesService.getPrescripciones({ status: 'issued' }).subscribe({
    next: (response) => {
      const prescriptions = response.items || [];
      this.recetas = this.mapPrescriptionsToRecetas(prescriptions);
      this.isLoading = false;
    },
    error: (error) => {
      this.error = 'Error al cargar las prescripciones emitidas';
      this.isLoading = false;
    }
  });
}
```
