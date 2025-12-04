# Task 15 - Fix Status en Recetas Emitidas

## 🐛 Problema Identificado

El componente `emitidas.component.ts` estaba enviando un status incorrecto al backend:

**Error HTTP 400**:
```
GET http://localhost:8000/api/prescriptions/search?status=Issued&pageSize=100

Response:
{
  "message": "Validation failed",
  "errors": [{
    "property": "Status",
    "error": "Status must be one of: draft, active, dispensed, expired, cancelled"
  }]
}
```

## 🔍 Causa Raíz

El frontend estaba usando valores de status **incorrectos**:
- Frontend enviaba: `status=Issued`
- Backend esperaba: `status=active`

## ✅ Solución Aplicada

### 1. Corregir parámetro de búsqueda

**Antes**:
```typescript
const params: SearchPrescriptionsParams = {
  status: 'Issued', // ❌ INCORRECTO
  pageSize: 100
};
```

**Después**:
```typescript
const params: SearchPrescriptionsParams = {
  status: 'active', // ✅ CORRECTO
  pageSize: 100
};
```

### 2. Actualizar mapeo de estados

**Antes**:
```typescript
mapStatus(backendStatus: string) {
  const statusMap = {
    'Issued': 'emitida',      // ❌ Backend no usa estos valores
    'Dispensed': 'dispensada',
    'Expired': 'vencida',
    'Cancelled': 'anulada'
  };
}
```

**Después**:
```typescript
mapStatus(backendStatus: string) {
  const statusMap = {
    // ✅ Valores correctos del backend
    'active': 'emitida',
    'dispensed': 'dispensada',
    'expired': 'vencida',
    'cancelled': 'anulada',
    'draft': 'emitida',
    // Mantener compatibilidad con valores antiguos
    'Issued': 'emitida',
    'Dispensed': 'dispensada',
    'Expired': 'vencida',
    'Cancelled': 'anulada'
  };
}
```

## 📊 Estados Válidos del Backend

Según la validación del backend, los estados válidos son:

| Backend Status | Frontend Display | Descripción |
|----------------|------------------|-------------|
| `draft` | Borrador | Prescripción en borrador |
| `active` | Emitida | Prescripción activa/emitida |
| `dispensed` | Dispensada | Prescripción completamente dispensada |
| `expired` | Vencida | Prescripción vencida |
| `cancelled` | Anulada | Prescripción cancelada |

## 🧪 Pruebas

### Antes del Fix
```bash
# ❌ Error 400
curl "http://localhost:8000/api/prescriptions/search?status=Issued&pageSize=100"
```

### Después del Fix
```bash
# ✅ Debería funcionar
curl "http://localhost:8000/api/prescriptions/search?status=active&pageSize=100"
```

## 📁 Archivos Modificados

- `eprescription-frontend/src/app/pages/prescripciones/emitidas/emitidas.component.ts`
  - Línea 804: Cambio de `status: 'Issued'` a `status: 'active'`
  - Línea 935-950: Actualización del mapeo de estados

## 🎯 Próximos Pasos

1. **Probar la vista de Recetas Emitidas**:
   ```bash
   # Iniciar frontend
   cd eprescription-frontend
   npm start
   
   # Navegar a: http://localhost:4200/prescripciones/emitidas
   ```

2. **Verificar que carga datos reales** del backend

3. **Revisar otros componentes** que puedan tener el mismo problema:
   - `borradores.component.ts` - Debería usar `status=draft`
   - `dashboard.component.ts` - Ya usa los valores correctos
   - `nueva.component.ts` - Verificar al crear prescripciones

## ⚠️ Nota Importante

Este mismo problema puede existir en otros componentes. Debemos verificar que todos usen los valores correctos:
- ✅ `draft` - Para borradores
- ✅ `active` - Para recetas emitidas
- ✅ `dispensed` - Para recetas dispensadas
- ✅ `expired` - Para recetas vencidas
- ✅ `cancelled` - Para recetas anuladas

## 📝 Lecciones Aprendidas

1. **Siempre verificar la documentación del backend** antes de hacer llamadas
2. **Los valores de enums deben coincidir** entre frontend y backend
3. **Usar constantes compartidas** para evitar estos errores
4. **Agregar validación en TypeScript** para los valores de status

## ✅ Estado

- [x] Problema identificado
- [x] Solución aplicada
- [ ] Pruebas realizadas
- [ ] Verificado en navegador

