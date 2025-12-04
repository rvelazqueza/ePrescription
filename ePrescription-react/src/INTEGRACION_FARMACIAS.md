# Integración de Farmacias con ePrescription

## Resumen Ejecutivo

Este documento describe la integración del **módulo de Farmacias Registradas** y **Consulta de Inventario** con todos los componentes del sistema ePrescription, garantizando que no se afecte la funcionalidad existente.

## Nuevos Módulos Implementados

### 1. Farmacias Registradas (`/inventario/farmacias`)

**Funcionalidad:**
- ✅ Gestión completa (CRUD) de farmacias
- ✅ Ubicación geográfica por provincia, cantón, distrito (Costa Rica)
- ✅ Información de contacto y regente farmacéutico
- ✅ Búsqueda normalizada (insensible a mayúsculas/tildes)
- ✅ Paginación y exportación (PDF, CSV, Excel)
- ✅ Toggle opcional para visualización en mayúsculas

**Datos almacenados:**
```typescript
interface Farmacia {
  id: string;
  codigo: string;                 // FARM-001 (único)
  nombre: string;
  provinciaId: string;            // Relación con datos de Costa Rica
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  email: string;
  responsable: string;            // Regente farmacéutico
  cedulaResponsable: string;
  estado: "activa" | "inactiva" | "suspendida";
  fechaRegistro: string;
  horario: string;
  observaciones: string;
}
```

### 2. Consulta de Inventario (`/inventario/consulta`)

**Funcionalidad:**
- ✅ Visualización de saldos por farmacia
- ✅ Información completa: medicamento + farmacia + ubicación + stock
- ✅ Alertas de stock (crítico, bajo, normal)
- ✅ Búsqueda por cualquier columna
- ✅ Filtrado por farmacia, provincia, nivel de stock
- ✅ Estadísticas en tiempo real
- ✅ Exportación completa

**Datos relacionados:**
```typescript
interface InventarioFarmacia {
  // Medicamento
  medicamentoId: string;
  medicamentoNombre: string;
  medicamentoCodigo: string;
  presentacion: string;
  
  // Farmacia
  farmaciaId: string;             // FK a Farmacias
  farmaciaNombre: string;
  farmaciaCode: string;
  
  // Ubicación (desnormalizada para performance)
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  
  // Stock
  stock: number;
  stockMinimo: number;
  stockMaximo: number;
  lote: string;
  fechaVencimiento: string;
  ultimaActualizacion: string;
}
```

### 3. Datos Geográficos Costa Rica (`/utils/costaRicaData.ts`)

**Estructura:**
```
Costa Rica
  └── 7 Provincias
       └── Cantones
            └── Distritos
```

**Provincias implementadas:**
1. San José (10+ cantones)
2. Alajuela (3+ cantones)
3. Cartago (3+ cantones)
4. Heredia (4+ cantones)
5. Guanacaste (3+ cantones)
6. Puntarenas (2+ cantones)
7. Limón (3+ cantones)

**Funciones utilitarias:**
```typescript
getCantonesByProvincia(provinciaId: string): Canton[]
getDistritosByCanton(provinciaId: string, cantonId: string): Distrito[]
getFullLocation(provinciaId, cantonId, distritoId): string
```

## Integración con Módulos Existentes

### 1. Prescripciones

**Integración:**
```typescript
// Al crear nueva receta, seleccionar farmacia de destino
interface Prescription {
  // ... campos existentes ...
  farmaciaDestinoId?: string;      // Nueva: farmacia donde se dispensará
  farmaciaDestino?: {
    codigo: string;
    nombre: string;
    ubicacion: string;
    telefono: string;
  };
}
```

**Impacto:** 
- ✅ Sin cambios en funcionalidad existente
- ✅ Campo opcional, compatible con recetas antiguas
- ✅ Mejora trazabilidad: médico puede sugerir farmacia

### 2. Dispensación

**Integración:**
```typescript
// Al verificar/dispensar receta
interface Dispensacion {
  // ... campos existentes ...
  farmaciaId: string;              // Obligatorio: farmacia que dispensa
  farmaciaInfo: {
    codigo: string;
    nombre: string;
    responsable: string;
  };
  stockDisponible: boolean;        // Verificación contra inventario
}
```

**Flujo actualizado:**
1. Farmacéutico escanea QR/Token
2. Sistema verifica farmacia autorizada
3. Consulta inventario de esa farmacia
4. Muestra disponibilidad de medicamentos
5. Registra dispensación con farmacia específica

**Impacto:**
- ✅ Mejora auditoría y trazabilidad
- ✅ Valida stock antes de dispensar
- ✅ Registra farmacia exacta

### 3. Inventario Existente

**Antes (sin farmacias):**
```typescript
interface InventoryItem {
  medicineId: string;
  currentStock: number;
  location: string;  // Ubicación física en almacén
}
```

**Después (con farmacias):**
```typescript
interface InventoryItem {
  medicineId: string;
  farmaciaId: string;             // Nueva: a qué farmacia pertenece
  currentStock: number;
  location: string;               // Ubicación dentro de la farmacia
}
```

**Migración:**
- Inventario existente se asigna a "Farmacia Central" (default)
- Nuevos registros requieren especificar farmacia
- Compatible hacia atrás

### 4. Reportes

**Nuevos reportes disponibles:**

#### Actividad por Farmacia
```typescript
interface ReporteFarmacia {
  farmaciaId: string;
  periodo: string;
  recetasDispensadas: number;
  medicamentosMovidos: number;
  stockPromedio: number;
  alertasGeneradas: number;
}
```

#### Distribución Geográfica
```typescript
interface ReporteGeografico {
  provincia: string;
  canton: string;
  totalFarmacias: number;
  recetasAtendidas: number;
  coberturaPoblacion: number;
}
```

**Reportes existentes actualizados:**
- "Actividad de Farmacia" ahora filtra por farmacia específica
- "Exportaciones" incluye datos de farmacia en todos los reportes

### 5. Alertas Clínicas

**Nueva alerta de inventario:**
```typescript
interface AlertaInventarioFarmacia {
  tipo: "stock_bajo_farmacia";
  farmaciaId: string;
  farmaciaNombre: string;
  medicamentoId: string;
  medicamentoNombre: string;
  stockActual: number;
  stockMinimo: number;
  criticidad: "baja" | "media" | "alta" | "critica";
}
```

**Integración:**
- Al prescribir medicamento, sistema verifica stock en farmacia destino
- Alerta si medicamento no disponible o stock bajo
- Sugiere farmacias alternativas con stock disponible

### 6. Interoperabilidad (FHIR/HL7)

**Mapeo FHIR:**
```json
{
  "resourceType": "Organization",
  "id": "farmacia-001",
  "identifier": [{
    "system": "urn:oid:2.16.840.1.113883.3.cr",
    "value": "FARM-001"
  }],
  "type": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/organization-type",
      "code": "prov",
      "display": "Healthcare Provider"
    }]
  }],
  "name": "Farmacia Central",
  "telecom": [
    {"system": "phone", "value": "2222-3344"},
    {"system": "email", "value": "central@farmacia.cr"}
  ],
  "address": [{
    "line": ["Avenida Central, frente al Hospital San Juan de Dios"],
    "city": "Hospital",
    "district": "San José",
    "state": "San José",
    "country": "CR"
  }]
}
```

**Eventos HL7 nuevos:**
- `PHM^O13` - Pharmacy Order Message (con farmacia)
- `RDS^O13` - Pharmacy Dispense (desde farmacia específica)

### 7. Auditoría

**Nuevos registros de auditoría:**
```typescript
interface AuditLog {
  // ... campos existentes ...
  farmaciaId?: string;
  farmaciaNombre?: string;
  accion: 
    | "crear_farmacia"
    | "editar_farmacia"
    | "consultar_inventario_farmacia"
    | "ajustar_stock_farmacia"
    | "dispensar_desde_farmacia";
}
```

**Trazabilidad completa:**
- Quién realizó cada acción
- En qué farmacia
- Qué medicamento/receta
- Cuándo y desde dónde

### 8. Seguridad

**Nuevos permisos:**
```typescript
interface Permissions {
  // ... permisos existentes ...
  farmacias: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
    consultarInventario: boolean;
  };
  inventarioPorFarmacia: {
    verPropia: boolean;          // Solo su farmacia
    verTodas: boolean;            // Todas las farmacias
    ajustarStock: boolean;
  };
}
```

**Roles sugeridos:**
- **Regente Farmacéutico**: Full access a su farmacia
- **Farmacéutico**: Ver y dispensar en su farmacia
- **Director Médico**: Ver todas las farmacias
- **Administrador**: Full access sistema

## Relaciones de Base de Datos

### Diagrama de Relaciones

```
┌─────────────────┐
│   MEDICAMENTOS  │
│  (existente)    │
└────────┬────────┘
         │
         │ N:M
         ▼
┌─────────────────┐      1:N     ┌─────────────────┐
│  INVENTARIO     │◄──────────────┤   FARMACIAS     │
│  (actualizado)  │               │   (nuevo)       │
└────────┬────────┘               └────────┬────────┘
         │                                 │
         │ N:1                            │ N:1
         ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐
│  DISPENSACION   │               │  UBICACIONES    │
│  (actualizado)  │               │  COSTA RICA     │
└─────────────────┘               │  (nuevo)        │
                                  └─────────────────┘
         
┌─────────────────┐      N:1     ┌─────────────────┐
│  PRESCRIPCIONES │──────────────►│   FARMACIAS     │
│  (actualizado)  │  (opcional)   │   (nuevo)       │
└─────────────────┘               └─────────────────┘
```

### Relaciones Clave

1. **Farmacia → Ubicación**: N:1 (cada farmacia en una ubicación única)
2. **Inventario → Farmacia**: N:1 (cada item de inventario pertenece a una farmacia)
3. **Inventario → Medicamento**: N:1 (relación existente mantenida)
4. **Dispensación → Farmacia**: N:1 (cada dispensación en una farmacia)
5. **Prescripción → Farmacia**: N:1 opcional (farmacia destino sugerida)

## Flujos de Negocio Actualizados

### Flujo 1: Nueva Prescripción

```
1. Médico crea receta
2. Selecciona medicamentos
3. [NUEVO] Opcionalmente sugiere farmacia de destino
   └─ Sistema verifica stock en esa farmacia
   └─ Alerta si no hay disponibilidad
   └─ Sugiere farmacias alternativas
4. Firma y emite receta
5. [NUEVO] Receta incluye farmacia sugerida en metadatos
```

### Flujo 2: Dispensación

```
1. Paciente llega a farmacia con QR/Token
2. Farmacéutico escanea código
3. [NUEVO] Sistema identifica farmacia del usuario
4. [NUEVO] Verifica inventario de esa farmacia específica
5. [NUEVO] Muestra disponibilidad en tiempo real:
   ✓ Medicamento disponible: stock 150 unidades
   ✗ Medicamento no disponible
     → Consultar otras farmacias cercanas
6. Registra dispensación
7. [NUEVO] Actualiza inventario de la farmacia
8. [NUEVO] Genera alerta si stock queda bajo mínimo
```

### Flujo 3: Consulta de Disponibilidad

```
1. Usuario accede a "Consulta de Inventario"
2. Busca medicamento o farmacia
3. Sistema muestra:
   - Todas las farmacias que tienen el medicamento
   - Stock disponible en cada una
   - Ubicación geográfica
   - Teléfono para confirmar
4. [NUEVO] Puede filtrar por:
   - Provincia/Cantón
   - Farmacia específica
   - Nivel de stock
5. Exporta resultados si necesario
```

### Flujo 4: Ajuste de Inventario

```
1. Regente de farmacia accede a "Ajustes de Stock"
2. [NUEVO] Sistema filtra solo SU farmacia
3. Selecciona medicamento
4. Registra movimiento:
   - Entrada (compra/recepción)
   - Salida (venta/dispensación)
   - Ajuste (conteo físico)
5. [NUEVO] Movimiento queda registrado por farmacia
6. Sistema actualiza stock
7. Genera auditoría completa
```

## Consideraciones de Performance

### Optimizaciones Implementadas

1. **Desnormalización Controlada**
   - Datos de ubicación se replican en inventario
   - Evita JOINs costosos en consultas frecuentes
   - Trade-off: espacio por velocidad

2. **Índices Sugeridos**
   ```sql
   CREATE INDEX idx_inventario_farmacia ON inventario(farmacia_id);
   CREATE INDEX idx_inventario_medicamento ON inventario(medicamento_id);
   CREATE INDEX idx_inventario_stock ON inventario(stock, stock_minimo);
   CREATE INDEX idx_farmacias_estado ON farmacias(estado);
   CREATE INDEX idx_farmacias_ubicacion ON farmacias(provincia_id, canton_id);
   ```

3. **Caché de Datos Geográficos**
   - Provincias/cantones/distritos en memoria
   - Datos estáticos, no cambian frecuentemente
   - Carga inicial rápida

4. **Paginación Obligatoria**
   - Listados limitados a 10-50 registros por página
   - Reduce carga de red y renderizado
   - Mejora experiencia en móviles

## Testing y Validación

### Tests Implementados

#### 1. Tests de Integración
```typescript
describe('Farmacia - Inventario Integration', () => {
  test('Actualizar stock en farmacia específica', async () => {
    const farmacia = await crearFarmacia();
    const medicamento = await crearMedicamento();
    
    await ajustarStock({
      farmaciaId: farmacia.id,
      medicamentoId: medicamento.id,
      cantidad: 100
    });
    
    const stock = await consultarStock(farmacia.id, medicamento.id);
    expect(stock).toBe(100);
  });
  
  test('No afectar inventario de otras farmacias', async () => {
    const farmacia1 = await crearFarmacia('FARM-001');
    const farmacia2 = await crearFarmacia('FARM-002');
    const medicamento = await crearMedicamento();
    
    await ajustarStock({
      farmaciaId: farmacia1.id,
      medicamentoId: medicamento.id,
      cantidad: 50
    });
    
    const stockFarmacia1 = await consultarStock(farmacia1.id, medicamento.id);
    const stockFarmacia2 = await consultarStock(farmacia2.id, medicamento.id);
    
    expect(stockFarmacia1).toBe(50);
    expect(stockFarmacia2).toBe(0);  // No afectado
  });
});
```

#### 2. Tests de Regresión
```typescript
describe('Backward Compatibility', () => {
  test('Recetas antiguas sin farmacia funcionan', async () => {
    const recetaAntigua = {
      id: 'RX-001',
      medicamentos: [...],
      // Sin farmaciaDestinoId
    };
    
    await dispensarReceta(recetaAntigua);
    // Debe funcionar sin errores
  });
  
  test('Inventario sin farmaciaId usa default', async () => {
    const item = {
      medicamentoId: 'MED-001',
      stock: 100
      // Sin farmaciaId
    };
    
    const resultado = await crearInventario(item);
    expect(resultado.farmaciaId).toBe('FARM-DEFAULT');
  });
});
```

### Validaciones de Datos

1. **Validación de Ubicación**
   - Provincia debe existir en lista Costa Rica
   - Cantón debe pertenecer a la provincia
   - Distrito debe pertenecer al cantón

2. **Validación de Códigos**
   - Código de farmacia único en sistema
   - Formato: FARM-XXX (3 dígitos)

3. **Validación de Stock**
   - Stock no puede ser negativo
   - Stock mínimo < Stock máximo
   - Alertas se generan automáticamente

## Migración de Datos

### Estrategia de Migración

```sql
-- Paso 1: Crear farmacia default
INSERT INTO farmacias (id, codigo, nombre, ...) 
VALUES ('farm-default', 'FARM-000', 'Farmacia Central', ...);

-- Paso 2: Migrar inventario existente
UPDATE inventario 
SET farmacia_id = 'farm-default' 
WHERE farmacia_id IS NULL;

-- Paso 3: Migrar dispensaciones históricas
UPDATE dispensaciones 
SET farmacia_id = 'farm-default' 
WHERE farmacia_id IS NULL;

-- Paso 4: Hacer farmacia_id obligatorio
ALTER TABLE inventario 
MODIFY COLUMN farmacia_id VARCHAR(50) NOT NULL;
```

## Roadmap Futuro

### Fase 2 (Próximas versiones)

1. **Transferencias Entre Farmacias**
   - Mover stock entre ubicaciones
   - Trazabilidad de movimientos
   - Aprobación de regente

2. **Pedidos Automáticos**
   - Cuando stock < mínimo
   - Generar orden de compra
   - Integración con proveedores

3. **Geolocalización**
   - Mapa con ubicación de farmacias
   - Farmacia más cercana al paciente
   - Rutas de Google Maps

4. **App Móvil**
   - Consulta de disponibilidad
   - Reserva de medicamentos
   - Notificaciones de stock

5. **BI y Analytics**
   - Dashboard de red de farmacias
   - Predicción de demanda por zona
   - Optimización de distribución

## Conclusiones

### ✅ Cumplimiento de Requerimientos

- [x] Farmacias registradas con código, nombre, ubicación completa
- [x] País Costa Rica con provincias, cantones, distritos
- [x] Búsqueda insensible a mayúsculas y tildes
- [x] Paginación en todos los listados
- [x] Exportación a PDF, CSV, Excel
- [x] Consulta de inventario por farmacia
- [x] Visualización de saldos con toda la información
- [x] Integración con prescripciones, dispensación, reportes
- [x] Sin afectación a funcionalidad existente
- [x] Toggle opcional para visualización en mayúsculas

### ✅ Valor Agregado

- Trazabilidad completa de medicamentos por ubicación
- Mejor gestión de inventario distribuido
- Datos geográficos estructurados de Costa Rica
- Base para expansión a múltiples sucursales
- Cumplimiento de estándares internacionales (FHIR)
- Auditoría granular por farmacia

### 🎯 Próximos Pasos

1. Validar con usuario piloto
2. Ajustar según feedback
3. Capacitación a usuarios finales
4. Despliegue gradual (farmacia por farmacia)
5. Monitoreo de performance en producción

---

**Documento preparado por:** Equipo Técnico ePrescription  
**Última actualización:** Octubre 2024  
**Versión:** 1.0
