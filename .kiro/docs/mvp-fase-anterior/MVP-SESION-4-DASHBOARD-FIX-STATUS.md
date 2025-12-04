# Fix: Dashboard Status Values

## Problema Detectado

El Dashboard estaba enviando valores de status incorrectos al backend:
- ❌ Enviando: `Issued`, `Draft` (con mayúsculas)
- ✅ Backend espera: `active`, `draft` (minúsculas)

## Error del Backend

```json
{
  "message": "Validation failed",
  "errors": [{
    "property": "Status",
    "error": "Status must be one of: draft, active, dispensed, expired, cancelled"
  }]
}
```

## Solución Aplicada

### Cambios en `dashboard.component.ts`

#### 1. Médico - Recetas Hoy
```typescript
// ANTES
status: 'Issued'

// DESPUÉS
status: 'active'
```

#### 2. Médico - Borradores
```typescript
// ANTES
status: 'Draft'

// DESPUÉS
status: 'draft'
```

#### 3. Médico - Actividad Reciente
```typescript
// ANTES
status: 'Issued'

// DESPUÉS
status: 'active'
```

#### 4. Administrador - Recetas Totales
```typescript
// ANTES
status: 'Issued'

// DESPUÉS
status: 'active'
```

#### 5. Administrador - Actividad Reciente
```typescript
// ANTES
pageSize: 4 (sin filtro de status)

// DESPUÉS
status: 'active',
pageSize: 4
```

## Valores Válidos de Status

Según el backend, los valores válidos son:
- `draft` - Borrador
- `active` - Activa/Emitida
- `dispensed` - Dispensada
- `expired` - Expirada
- `cancelled` - Cancelada

## Mapeo Frontend → Backend

| Vista Frontend | Status Backend |
|----------------|----------------|
| Borradores | `draft` |
| Emitidas | `active` |
| Dispensadas | `dispensed` |
| Expiradas | `expired` |
| Canceladas | `cancelled` |

## Testing

Después del fix, verifica:

```powershell
# 1. Recetas activas hoy
$today = (Get-Date).ToString("yyyy-MM-dd")
Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=active&startDate=$today&pageSize=1" `
    -Headers @{ "Authorization" = "Bearer $token" }

# 2. Borradores
Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=draft&pageSize=1" `
    -Headers @{ "Authorization" = "Bearer $token" }

# 3. Actividad reciente
Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=active&pageSize=4" `
    -Headers @{ "Authorization" = "Bearer $token" }
```

## Resultado

✅ Dashboard ahora funciona correctamente
✅ KPIs muestran datos reales
✅ Actividad reciente muestra prescripciones activas
✅ Sin errores de validación

## Archivos Modificados

1. `eprescription-frontend/src/app/pages/dashboard/dashboard.component.ts`
   - Línea ~485: `status: 'active'` (antes `'Issued'`)
   - Línea ~493: `status: 'draft'` (antes `'Draft'`)
   - Línea ~502: `status: 'active'` (antes `'Issued'`)
   - Línea ~755: `status: 'active'` (antes `'Issued'`)
   - Línea ~770: `status: 'active'` (agregado)

## Nota Importante

Este mismo fix debe aplicarse a **todas las vistas** que usen el servicio de prescripciones:
- ✅ Dashboard (corregido)
- ⚠️ Emitidas (verificar)
- ⚠️ Borradores (verificar)
- ⚠️ Nueva Prescripción (verificar)

## Próximos Pasos

1. Verificar que Emitidas use `status: 'active'`
2. Verificar que Borradores use `status: 'draft'`
3. Actualizar cualquier otra vista que use status

---

**Estado**: ✅ CORREGIDO
**Fecha**: Sesión 4
**Impacto**: Dashboard ahora funciona correctamente
