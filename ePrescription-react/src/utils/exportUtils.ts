/**
 * Utilidades para exportación de datos a diferentes formatos
 * Soporta: PDF, CSV, Excel
 */

/**
 * Convierte datos a formato CSV
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  if (data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Obtener headers de las claves del primer objeto si no se proporcionan
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Crear filas CSV
  const csvRows = [
    csvHeaders.join(','), // Header row
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Escapar valores que contienen comas, comillas o saltos de línea
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Convierte datos a formato Excel (usando CSV con extensión .xls)
 */
export function exportToExcel(data: any[], filename: string, headers?: string[]) {
  if (data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  const csvHeaders = headers || Object.keys(data[0]);
  
  // Crear contenido HTML para Excel
  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Datos</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <table border="1">
        <thead>
          <tr>
            ${csvHeaders.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${csvHeaders.map(h => `<td>${row[h] !== null && row[h] !== undefined ? row[h] : ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, `${filename}.xls`);
}

/**
 * Convierte datos a formato PDF usando tabla HTML
 */
export function exportToPDF(
  data: any[], 
  filename: string, 
  title: string,
  headers?: string[]
) {
  if (data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  const csvHeaders = headers || Object.keys(data[0]);
  
  // Crear contenido HTML para imprimir como PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #2b6cb0;
          font-size: 24px;
          margin-bottom: 20px;
          border-bottom: 2px solid #2b6cb0;
          padding-bottom: 10px;
        }
        .metadata {
          font-size: 12px;
          color: #666;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 11px;
        }
        th {
          background-color: #2b6cb0;
          color: white;
          padding: 10px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        tr:hover {
          background-color: #e6f3ff;
        }
        .footer {
          margin-top: 30px;
          font-size: 10px;
          color: #666;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }
        @media print {
          body { margin: 0; }
          @page { margin: 1cm; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="metadata">
        <strong>Fecha de generación:</strong> ${new Date().toLocaleString('es-ES')}<br>
        <strong>Total de registros:</strong> ${data.length}
      </div>
      <table>
        <thead>
          <tr>
            ${csvHeaders.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${csvHeaders.map(h => `<td>${row[h] !== null && row[h] !== undefined ? row[h] : '-'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        ePrescription - Sistema de Prescripción Electrónica | Generado el ${new Date().toLocaleDateString('es-ES')}
      </div>
    </body>
    </html>
  `;

  // Abrir ventana de impresión
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Descarga un blob como archivo
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Formatea datos para exportación, convirtiendo objetos complejos a strings
 */
export function formatDataForExport(data: any[], columnsMap?: Record<string, string>): any[] {
  return data.map(item => {
    const formatted: Record<string, any> = {};
    
    Object.keys(item).forEach(key => {
      // Usar nombre personalizado de columna si existe
      const columnName = columnsMap?.[key] || key;
      
      const value = item[key];
      
      // Convertir arrays a string separado por comas
      if (Array.isArray(value)) {
        formatted[columnName] = value.join(', ');
      }
      // Convertir objetos a JSON string
      else if (typeof value === 'object' && value !== null) {
        formatted[columnName] = JSON.stringify(value);
      }
      // Valores simples
      else {
        formatted[columnName] = value;
      }
    });
    
    return formatted;
  });
}
