# 💻 Ejemplos de Código - Exportación e Impresión

## 🎯 Guía Rápida para Desarrolladores

Este documento contiene ejemplos prácticos de cómo implementar funcionalidades de exportación e impresión en nuevas páginas o componentes del sistema ePrescription.

---

## 📦 Ejemplo 1: Imprimir Receta Individual

### **Caso de Uso:** Botón de impresión en una tabla de recetas

```typescript
// 1. Importaciones necesarias
import { printPrescriptionPDF } from "../utils/pdfGenerator";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { toast } from "sonner@2.0.3";
import { Printer } from "lucide-react";
import { Button } from "../components/ui/button";

// 2. Componente funcional
export function MiComponenteDeRecetas() {
  // 3. Función de manejo de impresión
  const handlePrint = (prescriptionNumber: string) => {
    // Obtener datos completos del store
    const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescriptionNumber);
    
    if (fullPrescriptionData) {
      // Imprimir usando la función utilitaria
      printPrescriptionPDF(fullPrescriptionData);
      
      // Notificar al usuario
      toast.success('Imprimiendo receta', {
        description: `Se abrirá una nueva ventana con la receta ${prescriptionNumber} lista para imprimir`,
        duration: 3000,
      });
    } else {
      // Manejo de error
      toast.error('No se pudo cargar la receta', {
        description: 'Los datos completos de la receta no están disponibles',
        duration: 3000,
      });
    }
  };

  // 4. Renderizar botón
  return (
    <Button onClick={() => handlePrint('RX-2025-001234')}>
      <Printer className="w-4 h-4 mr-2" />
      Imprimir Receta
    </Button>
  );
}
```

---

## 📥 Ejemplo 2: Exportar Receta como PDF

### **Caso de Uso:** Botón de descarga en panel de detalles

```typescript
// 1. Importaciones necesarias
import { downloadPrescriptionPDF } from "../utils/pdfGenerator";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { toast } from "sonner@2.0.3";
import { Download } from "lucide-react";
import { Button } from "../components/ui/button";

// 2. Componente funcional
export function PanelDetalleReceta({ prescriptionNumber }: { prescriptionNumber: string }) {
  // 3. Función de manejo de exportación
  const handleExport = () => {
    // Obtener datos completos del store
    const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescriptionNumber);
    
    if (fullPrescriptionData) {
      // Exportar usando la función utilitaria
      downloadPrescriptionPDF(fullPrescriptionData);
      
      // Notificar al usuario
      toast.success('Exportando PDF', {
        description: 'Se abrirá el diálogo de impresión. Seleccione "Guardar como PDF" para descargar el archivo',
        duration: 4000,
      });
    } else {
      // Manejo de error
      toast.error('No se pudo cargar la receta', {
        description: 'Intente nuevamente más tarde',
        duration: 3000,
      });
    }
  };

  // 4. Renderizar botón
  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Exportar PDF
    </Button>
  );
}
```

---

## 📊 Ejemplo 3: Exportar Tabla de Datos (Múltiples Formatos)

### **Caso de Uso:** Tabla de pacientes con exportación a PDF/CSV/Excel

```typescript
// 1. Importaciones necesarias
import { ExportButtons } from "../components/ExportButtons";

// 2. Datos de ejemplo
const patients = [
  {
    id: "PAT-001",
    fullName: "María Elena González",
    idNumber: "52.841.963",
    age: 45,
    totalPrescriptions: 24,
    lastVisit: "27/09/2025"
  },
  {
    id: "PAT-002",
    fullName: "Juan Carlos Martínez",
    idNumber: "41.523.789",
    age: 52,
    totalPrescriptions: 18,
    lastVisit: "20/09/2025"
  }
];

// 3. Definir mapeo de columnas (opcional)
const columnsMap = {
  id: "ID Paciente",
  fullName: "Nombre Completo",
  idNumber: "Identificación",
  age: "Edad",
  totalPrescriptions: "Total Recetas",
  lastVisit: "Última Visita"
};

// 4. Definir headers (opcional - si no se proporciona, usa las claves del objeto)
const headers = [
  "ID Paciente",
  "Nombre Completo", 
  "Identificación",
  "Edad",
  "Total Recetas",
  "Última Visita"
];

// 5. Componente funcional
export function TablaPacientes() {
  return (
    <div>
      {/* Botón de exportación */}
      <ExportButtons
        data={patients}
        filename="pacientes"
        title="Listado de Pacientes - ePrescription"
        headers={headers}
        columnsMap={columnsMap}
      />
      
      {/* ... resto de la tabla ... */}
    </div>
  );
}
```

---

## 🔄 Ejemplo 4: Imprimir con Validación de Estado

### **Caso de Uso:** Solo permitir imprimir recetas emitidas (no borradores)

```typescript
// 1. Importaciones necesarias
import { printPrescriptionPDF } from "../utils/pdfGenerator";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { toast } from "sonner@2.0.3";
import { Printer } from "lucide-react";
import { Button } from "../components/ui/button";

// 2. Interface de la receta
interface Prescription {
  id: string;
  prescriptionNumber: string;
  status: "draft" | "emitted" | "dispensed" | "cancelled";
}

// 3. Componente funcional
export function BotonImprimirReceta({ prescription }: { prescription: Prescription }) {
  // 4. Función de manejo de impresión con validación
  const handlePrint = () => {
    // VALIDACIÓN: No permitir imprimir borradores
    if (prescription.status === 'draft') {
      toast.error("No se puede imprimir un borrador", {
        description: "Solo las recetas emitidas pueden ser impresas",
        duration: 3000
      });
      return;
    }

    // VALIDACIÓN: No permitir imprimir recetas anuladas
    if (prescription.status === 'cancelled') {
      toast.error("No se puede imprimir una receta anulada", {
        description: "Esta receta ha sido anulada y no es válida",
        duration: 3000
      });
      return;
    }

    // Obtener datos completos del store
    const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(
      prescription.prescriptionNumber
    );
    
    if (fullPrescriptionData) {
      // Imprimir
      printPrescriptionPDF(fullPrescriptionData);
      
      // Mensaje específico según el estado
      const message = prescription.status === 'emitted' 
        ? 'Imprimiendo receta' 
        : 'Reimprimiendo receta';
      
      toast.success(message, {
        description: "Se abrirá el diálogo de impresión del navegador",
        duration: 3000
      });
    } else {
      toast.error('No se pudo cargar la receta', {
        description: 'Los datos completos de la receta no están disponibles',
        duration: 3000
      });
    }
  };

  // 5. Renderizar botón (deshabilitar si es borrador o anulada)
  const isDisabled = prescription.status === 'draft' || prescription.status === 'cancelled';
  
  return (
    <Button 
      onClick={handlePrint} 
      disabled={isDisabled}
      variant={isDisabled ? "outline" : "default"}
    >
      <Printer className="w-4 h-4 mr-2" />
      {prescription.status === 'emitted' ? 'Imprimir' : 'Reimprimir'}
    </Button>
  );
}
```

---

## 🎭 Ejemplo 5: Menú Desplegable con Múltiples Acciones

### **Caso de Uso:** Menú de acciones en una fila de tabla

```typescript
// 1. Importaciones necesarias
import { printPrescriptionPDF, downloadPrescriptionPDF } from "../utils/pdfGenerator";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { toast } from "sonner@2.0.3";
import { MoreVertical, Eye, Printer, Download, Ban } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

// 2. Interface de la receta
interface PrescriptionRow {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  status: "emitted" | "partially_dispensed" | "fully_dispensed" | "cancelled";
}

// 3. Componente funcional
export function MenuAccionesReceta({ prescription }: { prescription: PrescriptionRow }) {
  // 4. Funciones de manejo
  const handleView = () => {
    console.log("Ver detalles:", prescription.id);
    // Lógica para abrir panel de detalles
  };

  const handlePrint = () => {
    const fullData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
    
    if (fullData) {
      printPrescriptionPDF(fullData);
      toast.success('Reimprimiendo receta', {
        description: `Receta ${prescription.prescriptionNumber} lista para imprimir`,
        duration: 3000,
      });
    } else {
      toast.error('No se pudo cargar la receta');
    }
  };

  const handleExport = () => {
    const fullData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
    
    if (fullData) {
      downloadPrescriptionPDF(fullData);
      toast.success('Exportando PDF', {
        description: 'Seleccione "Guardar como PDF" en el diálogo de impresión',
        duration: 4000,
      });
    } else {
      toast.error('No se pudo cargar la receta');
    }
  };

  const handleCancel = () => {
    if (confirm('¿Está seguro de que desea anular esta receta?')) {
      console.log("Anular receta:", prescription.id);
      toast.success('Receta anulada correctamente');
    }
  };

  // 5. Renderizar menú desplegable
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Ver detalles */}
        <DropdownMenuItem onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          Ver detalles
        </DropdownMenuItem>
        
        {/* Reimprimir */}
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Reimprimir
        </DropdownMenuItem>
        
        {/* Exportar PDF */}
        <DropdownMenuItem onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </DropdownMenuItem>
        
        {/* Anular (solo si está emitida) */}
        {prescription.status === 'emitted' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleCancel}
              className="text-red-600 focus:text-red-600"
            >
              <Ban className="w-4 h-4 mr-2" />
              Anular receta
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🎨 Ejemplo 6: Exportación con Datos Formateados

### **Caso de Uso:** Exportar datos complejos (arrays, objetos) a CSV/Excel

```typescript
// 1. Importaciones necesarias
import { ExportButtons } from "../components/ExportButtons";

// 2. Datos con estructuras complejas
const prescriptions = [
  {
    id: "RX-001",
    prescriptionNumber: "RX-2025-001234",
    patient: "María González",
    medicines: ["Ibuprofeno 400mg", "Omeprazol 20mg"],
    allergies: ["Penicilina", "Sulfas"],
    status: "emitted",
    date: "07/10/2025"
  },
  {
    id: "RX-002",
    prescriptionNumber: "RX-2025-001235",
    patient: "Juan Martínez",
    medicines: ["Losartán 50mg"],
    allergies: [],
    status: "dispensed",
    date: "06/10/2025"
  }
];

// 3. Función para formatear datos antes de exportar
const formatPrescriptionsForExport = (data: typeof prescriptions) => {
  return data.map(rx => ({
    "Número de Receta": rx.prescriptionNumber,
    "Paciente": rx.patient,
    "Medicamentos": rx.medicines.join(", "), // Array a string
    "Alergias": rx.allergies.length > 0 ? rx.allergies.join(", ") : "Ninguna",
    "Estado": rx.status === "emitted" ? "Emitida" : "Dispensada",
    "Fecha": rx.date
  }));
};

// 4. Componente funcional
export function TablaPrescripcionesExportable() {
  // Formatear datos para exportación
  const formattedData = formatPrescriptionsForExport(prescriptions);
  
  return (
    <div>
      <ExportButtons
        data={formattedData}
        filename="prescripciones"
        title="Listado de Prescripciones - ePrescription"
      />
      
      {/* ... tabla ... */}
    </div>
  );
}
```

---

## 🚀 Ejemplo 7: Exportación con Filtros Aplicados

### **Caso de Uso:** Exportar solo los datos filtrados en una tabla

```typescript
// 1. Importaciones necesarias
import { useState } from "react";
import { ExportButtons } from "../components/ExportButtons";
import { Input } from "../components/ui/input";
import { normalizedIncludes } from "../utils/searchUtils";

// 2. Componente funcional
export function TablaConFiltros() {
  // 3. Estados
  const [searchTerm, setSearchTerm] = useState("");
  
  // 4. Datos originales
  const allPatients = [
    { id: "PAT-001", name: "María González", age: 45, city: "Bogotá" },
    { id: "PAT-002", name: "Juan Martínez", age: 52, city: "Medellín" },
    { id: "PAT-003", name: "Ana Ruiz", age: 33, city: "Cali" }
  ];
  
  // 5. Filtrar datos según búsqueda (insensible a mayúsculas y tildes)
  const filteredPatients = allPatients.filter(patient =>
    normalizedIncludes(patient.name, searchTerm) ||
    normalizedIncludes(patient.city, searchTerm)
  );
  
  // 6. Renderizar
  return (
    <div>
      {/* Búsqueda */}
      <Input
        placeholder="Buscar paciente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Exportar SOLO datos filtrados */}
      <ExportButtons
        data={filteredPatients}
        filename="pacientes_filtrados"
        title="Pacientes Filtrados - ePrescription"
      />
      
      {/* Información */}
      <p>Mostrando {filteredPatients.length} de {allPatients.length} pacientes</p>
      
      {/* ... tabla ... */}
    </div>
  );
}
```

---

## 📄 Ejemplo 8: Exportación con Paginación

### **Caso de Uso:** Exportar todos los datos aunque estén paginados

```typescript
// 1. Importaciones necesarias
import { useState } from "react";
import { ExportButtons } from "../components/ExportButtons";
import { TablePagination } from "../components/TablePagination";
import { usePagination } from "../utils/usePagination";

// 2. Componente funcional
export function TablaPaginadaExportable() {
  // 3. Datos (simulación de 100 registros)
  const allData = Array.from({ length: 100 }, (_, i) => ({
    id: `ID-${i + 1}`,
    name: `Paciente ${i + 1}`,
    age: 20 + (i % 60)
  }));
  
  // 4. Paginación (muestra 10 por página)
  const { 
    currentPage, 
    setCurrentPage, 
    paginatedData, 
    totalPages 
  } = usePagination(allData, 10);
  
  // 5. Renderizar
  return (
    <div>
      {/* Exportar TODOS los datos (no solo la página actual) */}
      <ExportButtons
        data={allData}  {/* <-- Importante: usar allData, no paginatedData */}
        filename="todos_los_pacientes"
        title="Listado Completo de Pacientes"
      />
      
      <p>Total de registros: {allData.length}</p>
      
      {/* Tabla muestra solo 10 registros */}
      <table>
        <tbody>
          {paginatedData.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Paginación */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

---

## 🎯 Ejemplo 9: Exportación Personalizada (Usando directamente las funciones)

### **Caso de Uso:** Necesitas control total sobre el formato del PDF

```typescript
// 1. Importaciones necesarias
import { exportToPDF } from "../utils/exportUtils";
import { toast } from "sonner@2.0.3";
import { Button } from "../components/ui/button";
import { FileDown } from "lucide-react";

// 2. Componente funcional
export function ExportacionPersonalizada() {
  // 3. Función personalizada de exportación
  const handleCustomExport = () => {
    // Preparar datos personalizados
    const customData = [
      {
        "Código": "MED-001",
        "Medicamento": "Ibuprofeno",
        "Presentación": "400mg - Tableta",
        "Stock": "150 unidades",
        "Precio": "$2.50"
      },
      {
        "Código": "MED-002",
        "Medicamento": "Omeprazol",
        "Presentación": "20mg - Cápsula",
        "Stock": "200 unidades",
        "Precio": "$3.00"
      }
    ];
    
    // Headers personalizados
    const customHeaders = [
      "Código",
      "Medicamento",
      "Presentación",
      "Stock",
      "Precio"
    ];
    
    // Título personalizado
    const customTitle = "Inventario de Medicamentos - ePrescription";
    
    // Filename personalizado
    const customFilename = `inventario_${new Date().toISOString().split('T')[0]}`;
    
    try {
      // Exportar usando la función directa
      exportToPDF(
        customData,
        customFilename,
        customTitle,
        customHeaders
      );
      
      // Notificar
      toast.success('PDF generado exitosamente', {
        description: 'Se ha generado el reporte de inventario',
        duration: 3000
      });
    } catch (error) {
      toast.error('Error al generar PDF', {
        description: 'Intente nuevamente más tarde',
        duration: 3000
      });
    }
  };
  
  // 4. Renderizar
  return (
    <Button onClick={handleCustomExport}>
      <FileDown className="w-4 h-4 mr-2" />
      Exportar Inventario Personalizado
    </Button>
  );
}
```

---

## 🔧 Ejemplo 10: Función Reutilizable de Exportación

### **Caso de Uso:** Crear una función helper reutilizable en múltiples componentes

```typescript
// 1. Archivo: /utils/prescriptionExportHelpers.ts

import { printPrescriptionPDF, downloadPrescriptionPDF } from "./pdfGenerator";
import { EmittedPrescriptionsAPI } from "./emittedPrescriptionsStore";
import { toast } from "sonner@2.0.3";

/**
 * Helper para imprimir receta con validaciones y notificaciones
 */
export function imprimirReceta(prescriptionNumber: string): boolean {
  const fullData = EmittedPrescriptionsAPI.getPrescription(prescriptionNumber);
  
  if (!fullData) {
    toast.error('No se pudo cargar la receta', {
      description: 'Los datos de la receta no están disponibles',
      duration: 3000
    });
    return false;
  }
  
  printPrescriptionPDF(fullData);
  
  toast.success('Imprimiendo receta', {
    description: `Receta ${prescriptionNumber} lista para imprimir`,
    duration: 3000
  });
  
  return true;
}

/**
 * Helper para exportar receta con validaciones y notificaciones
 */
export function exportarRecetaPDF(prescriptionNumber: string): boolean {
  const fullData = EmittedPrescriptionsAPI.getPrescription(prescriptionNumber);
  
  if (!fullData) {
    toast.error('No se pudo cargar la receta', {
      description: 'Los datos de la receta no están disponibles',
      duration: 3000
    });
    return false;
  }
  
  downloadPrescriptionPDF(fullData);
  
  toast.success('Exportando PDF', {
    description: 'Seleccione "Guardar como PDF" en el diálogo',
    duration: 4000
  });
  
  return true;
}

/**
 * Helper para validar si una receta se puede imprimir
 */
export function puedeImprimirse(status: string): boolean {
  return status !== 'draft' && status !== 'cancelled';
}

// 2. Uso en componentes:

import { imprimirReceta, exportarRecetaPDF, puedeImprimirse } from "../utils/prescriptionExportHelpers";

export function MiComponente() {
  const prescription = {
    prescriptionNumber: "RX-2025-001234",
    status: "emitted"
  };
  
  const handlePrint = () => {
    if (puedeImprimirse(prescription.status)) {
      imprimirReceta(prescription.prescriptionNumber);
    } else {
      toast.error("Esta receta no se puede imprimir");
    }
  };
  
  const handleExport = () => {
    exportarRecetaPDF(prescription.prescriptionNumber);
  };
  
  return (
    <>
      <button onClick={handlePrint}>Imprimir</button>
      <button onClick={handleExport}>Exportar</button>
    </>
  );
}
```

---

## ✨ Mejores Prácticas

### **DO ✅**

1. **Siempre validar datos antes de exportar**
   ```typescript
   if (!data || data.length === 0) {
     toast.error('No hay datos para exportar');
     return;
   }
   ```

2. **Usar notificaciones para feedback al usuario**
   ```typescript
   toast.success('Exportando PDF', {
     description: 'El archivo se descargará automáticamente',
     duration: 3000
   });
   ```

3. **Manejar errores apropiadamente**
   ```typescript
   try {
     exportToPDF(data, filename, title);
   } catch (error) {
     console.error('Error al exportar:', error);
     toast.error('Error al exportar los datos');
   }
   ```

4. **Formatear datos complejos antes de exportar**
   ```typescript
   const formattedData = data.map(item => ({
     ...item,
     medicines: item.medicines.join(', '),
     allergies: item.allergies.length > 0 ? item.allergies.join(', ') : 'Ninguna'
   }));
   ```

---

### **DON'T ❌**

1. **No permitir exportar borradores**
   ```typescript
   // ❌ MAL
   exportarReceta(prescription); // Sin validar status
   
   // ✅ BIEN
   if (prescription.status !== 'draft') {
     exportarReceta(prescription);
   }
   ```

2. **No exportar datos sin validar**
   ```typescript
   // ❌ MAL
   exportToPDF(data); // Podría estar vacío
   
   // ✅ BIEN
   if (data && data.length > 0) {
     exportToPDF(data, filename, title);
   }
   ```

3. **No olvidar las notificaciones al usuario**
   ```typescript
   // ❌ MAL
   printPrescriptionPDF(data); // Usuario no sabe qué pasó
   
   // ✅ BIEN
   printPrescriptionPDF(data);
   toast.success('Imprimiendo receta...');
   ```

---

## 📚 Recursos Adicionales

- **Documentación principal:** `/EXPORTACION_IMPRESION_GUIDE.md`
- **Utilidades de exportación:** `/utils/exportUtils.ts`
- **Generador de PDFs:** `/utils/pdfGenerator.ts`
- **Componente de botones:** `/components/ExportButtons.tsx`

---

**Última actualización:** 7 de octubre de 2025  
**Versión:** 1.0  
**Autor:** ePrescription Development Team
