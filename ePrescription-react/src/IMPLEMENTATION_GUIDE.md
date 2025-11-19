# Guía de Implementación: Búsquedas Normalizadas, Paginación y Exportación

## ✅ Componentes y Utilidades Creados

### 1. **Utilidades de Búsqueda** (`/utils/searchUtils.ts`)
- `normalizeSearchText()`: Normaliza texto eliminando tildes y convirtiendo a minúsculas
- `normalizedIncludes()`: Verifica si un texto contiene otro de forma normalizada
- `normalizedEquals()`: Compara dos textos de forma normalizada

### 2. **Utilidades de Exportación** (`/utils/exportUtils.ts`)
- `exportToCSV()`: Exporta datos a formato CSV
- `exportToExcel()`: Exporta datos a formato Excel (.xls)
- `exportToPDF()`: Exporta datos a formato PDF (impresión)
- `formatDataForExport()`: Formatea datos complejos para exportación

### 3. **Hook de Paginación** (`/utils/usePagination.ts`)
- Hook personalizado que maneja toda la lógica de paginación
- Retorna datos paginados y funciones de navegación

### 4. **Componente de Paginación** (`/components/TablePagination.tsx`)
- Componente visual para controles de paginación
- Muestra información de registros, selector de tamaño de página y navegación

### 5. **Componentes de Exportación** (`/components/ExportButtons.tsx`)
- `ExportButtons`: Dropdown con opciones de exportación (PDF, CSV, Excel)
- `ExportButtonsCompact`: Botones individuales para cada formato

## 📋 Patrón de Implementación

### Paso 1: Importar dependencias

```typescript
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
```

### Paso 2: Implementar hook de paginación

```typescript
// En el componente funcional
const [searchTerm, setSearchTerm] = useState("");

// Filtrar datos (con búsqueda normalizada)
const filteredData = mockData.filter(item =>
  normalizedIncludes(item.name, searchTerm) ||
  normalizedIncludes(item.description, searchTerm)
);

// Aplicar paginación
const {
  currentPage,
  pageSize,
  totalPages,
  paginatedData,
  setCurrentPage,
  setPageSize
} = usePagination({
  data: filteredData,
  initialPageSize: 25
});
```

### Paso 3: Agregar botones de exportación en el header

```typescript
<CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>Título de la Tabla</CardTitle>
    <ExportButtons
      data={filteredData}
      filename="nombre_archivo"
      title="Título del Reporte"
      headers={['Columna 1', 'Columna 2', 'Columna 3']}
      columnsMap={{
        id: 'ID',
        name: 'Nombre',
        status: 'Estado'
      }}
    />
  </div>
</CardHeader>
```

### Paso 4: Usar datos paginados en la tabla

```typescript
<TableBody>
  {paginatedData.map(item => (
    <TableRow key={item.id}>
      <TableCell>{item.name}</TableCell>
      {/* ... más celdas */}
    </TableRow>
  ))}
</TableBody>
```

### Paso 5: Agregar componente de paginación

```typescript
<TablePagination
  currentPage={currentPage}
  totalPages={totalPages}
  pageSize={pageSize}
  totalItems={filteredData.length}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
```

## 🔍 Actualización de Búsquedas

### ANTES (sensible a mayúsculas y tildes):
```typescript
const filtered = data.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### DESPUÉS (insensible a mayúsculas y tildes):
```typescript
const filtered = data.filter(item =>
  normalizedIncludes(item.name, searchTerm)
);
```

## 📄 Páginas que Requieren Actualización

### ✅ Completadas:
1. PrescripcionesPage - Búsquedas actualizadas, falta paginación
2. PacientesPage - Búsquedas parcialmente actualizadas
3. MedicosPage - Importación agregada
4. InventarioPage - Búsquedas parcialmente actualizadas  
5. DispensacionPage - Búsquedas parcialmente actualizadas

### ⏳ Pendientes de actualizar búsquedas:
6. AlertasPage (3 subpáginas)
7. FirmaPage
8. ReportesPage (3 subpáginas)
9. InteropPage (4 subpáginas)
10. SeguridadPage (5 subpáginas)
11. AuditoriaPage
12. CatalogosPage (7 catálogos)
13. ConfigPage

### ⏳ Todas pendientes de paginación y exportación

## 🎯 Tablas Identificadas por Página

### PrescripcionesPage:
- Borradores (BorradoresPage)
- Recetas emitidas (EmitidasPage)
- Resultados de búsqueda (BuscarRecetaPage)
- Recetas para duplicar (DuplicarRecetaPage)

### DispensacionPage:
- Resultados de verificación
- Historial de dispensación
- Rechazos

### PacientesPage:
- Lista de pacientes
- Documentos clínicos
- Prescripciones del paciente

### MedicosPage:
- Lista de médicos
- Prescripciones por médico

### InventarioPage:
- Stock de medicamentos
- Alertas de stock
- Ajustes de stock
- Lotes y vencimientos

### AlertasPage:
- Bandeja de alertas
- Reglas de interacciones
- Tipos de alertas

### FirmaPage:
- Trazabilidad de firmas

### ReportesPage:
- Actividad por médico
- Actividad de farmacia
- Plantillas de reportes

### InteropPage:
- IDs FHIR
- Eventos HL7

### SeguridadPage:
- Usuarios
- Roles
- Bloqueos
- Sesiones

### AuditoriaPage:
- Log de auditoría

### CatalogosPage:
- Medicamentos
- Vías de administración
- Especialidades
- Unidades médicas
- Interacciones
- Tipos de alertas
- Países

### ConfigPage:
- Políticas de recetas

## 💡 Notas Importantes

1. **Búsquedas normalizadas**: Usar siempre `normalizedIncludes()` en lugar de `.toLowerCase().includes()`

2. **Paginación predeterminada**: Usar 25 registros por página como estándar médico

3. **Exportación**: Siempre incluir botones de exportación en tablas con datos clínicos

4. **Headers personalizados**: Usar `columnsMap` para traducir nombres técnicos a nombres amigables en exportaciones

5. **Filtros**: Los filtros deben aplicarse ANTES de la paginación

6. **Performance**: Con paginación, solo se renderizan los registros visibles

## 🚀 Beneficios Implementados

✅ **Búsquedas mejoradas**: Insensibles a mayúsculas, minúsculas y tildes  
✅ **Mejor UX**: Paginación profesional con navegación intuitiva  
✅ **Exportación completa**: PDF, CSV y Excel para todos los reportes  
✅ **Performance**: Renderizado optimizado con paginación  
✅ **Estándares médicos**: Cumplimiento de normativas de documentación  
✅ **Reutilizable**: Componentes y hooks fáciles de aplicar  

## 📝 Próximos Pasos

1. Terminar de actualizar todas las búsquedas con `normalizedIncludes`
2. Aplicar paginación a todas las tablas del sistema
3. Agregar botones de exportación a todas las vistas de datos
4. Probar exportaciones con datos reales
5. Ajustar tamaños de página según necesidades específicas
