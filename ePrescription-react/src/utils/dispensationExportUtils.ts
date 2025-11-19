import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DispensationRecord } from "../components/DispensationTable";

export interface DispensationExportData {
  // Información de la receta
  prescriptionNumber: string;
  prescriptionDate: string;
  prescriptionTime: string;
  validUntil: string;
  
  // Información del paciente
  patientName: string;
  patientId: string;
  patientAge: number;
  patientGender: string;
  
  // Información del médico
  doctorName: string;
  doctorCode: string;
  specialty?: string;
  
  // Información de la farmacia
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacistName: string;
  pharmacistLicense: string;
  
  // Información de la dispensación
  dispensationDate: string;
  dispensationTime: string;
  dispensationNumber: string;
  
  // Medicamentos dispensados
  medicines: Array<{
    name: string;
    prescribedQuantity: string;
    dispensedQuantity: number;
    dispensedQuantityUnit: string;
    dose: string;
    frequency: string;
    administration: string;
    duration: string;
    status: DispensationRecord["status"];
    batchNumber?: string;
    expirationDate?: string;
    dispensationNotes?: string;
    rejectionReason?: string;
  }>;
  
  // Observaciones generales
  generalNotes?: string;
  
  // QR y verificación
  qrCode?: string;
  verificationToken?: string;
}

/**
 * Genera un PDF profesional de la dispensación
 */
export function generateDispensationPDF(data: DispensationExportData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPos = 20;

  // ============================================
  // HEADER - Logo y título
  // ============================================
  doc.setFillColor(43, 108, 176); // Primary blue
  doc.rect(0, 0, pageWidth, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("ePrescription", 15, 15);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema Hospitalario de Prescripción Electrónica", 15, 22);
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("COMPROBANTE DE DISPENSACIÓN", pageWidth - 15, 15, { align: "right" });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Nº ${data.dispensationNumber}`, pageWidth - 15, 22, { align: "right" });
  
  yPos = 45;

  // ============================================
  // SECCIÓN 1: Información de la Receta Original
  // ============================================
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(230, 243, 255);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 108, 176);
  doc.text("RECETA MÉDICA ORIGINAL", 20, yPos + 5.5);
  
  yPos += 13;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Número de Receta:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.prescriptionNumber, 65, yPos);
  
  doc.setFont("helvetica", "bold");
  doc.text("Fecha de Emisión:", 120, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.prescriptionDate} ${data.prescriptionTime}`, 160, yPos);
  
  yPos += 5;
  
  doc.setFont("helvetica", "bold");
  doc.text("Válida hasta:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.validUntil, 65, yPos);
  
  if (data.qrCode) {
    doc.setFont("helvetica", "bold");
    doc.text("Código QR:", 120, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.qrCode, 160, yPos);
  }
  
  yPos += 10;

  // ============================================
  // SECCIÓN 2: Información del Paciente
  // ============================================
  doc.setFillColor(230, 243, 255);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 108, 176);
  doc.text("DATOS DEL PACIENTE", 20, yPos + 5.5);
  
  yPos += 13;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Nombre Completo:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.patientName, 65, yPos);
  
  doc.setFont("helvetica", "bold");
  doc.text("Identificación:", 120, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.patientId, 160, yPos);
  
  yPos += 5;
  
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.patientAge} años`, 65, yPos);
  
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", 120, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.patientGender, 160, yPos);
  
  yPos += 10;

  // ============================================
  // SECCIÓN 3: Información del Médico
  // ============================================
  doc.setFillColor(230, 243, 255);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 108, 176);
  doc.text("MÉDICO PRESCRIPTOR", 20, yPos + 5.5);
  
  yPos += 13;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Nombre:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.doctorName, 65, yPos);
  
  doc.setFont("helvetica", "bold");
  doc.text("Registro Médico:", 120, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.doctorCode, 160, yPos);
  
  if (data.specialty) {
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Especialidad:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(data.specialty, 65, yPos);
  }
  
  yPos += 10;

  // ============================================
  // SECCIÓN 4: Información de la Farmacia
  // ============================================
  doc.setFillColor(5, 150, 105); // Green
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FARMACIA DISPENSADORA", 20, yPos + 5.5);
  
  yPos += 13;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Farmacia:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.pharmacyName, 65, yPos);
  
  yPos += 5;
  
  doc.setFont("helvetica", "bold");
  doc.text("Dirección:", 20, yPos);
  doc.setFont("helvetica", "normal");
  const addressLines = doc.splitTextToSize(data.pharmacyAddress, 120);
  doc.text(addressLines, 65, yPos);
  yPos += addressLines.length * 5;
  
  doc.setFont("helvetica", "bold");
  doc.text("Farmacéutico:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.pharmacistName, 65, yPos);
  
  doc.setFont("helvetica", "bold");
  doc.text("Licencia:", 120, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(data.pharmacistLicense, 160, yPos);
  
  yPos += 5;
  
  doc.setFont("helvetica", "bold");
  doc.text("Fecha de Dispensación:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.dispensationDate} ${data.dispensationTime}`, 65, yPos);
  
  yPos += 10;

  // ============================================
  // SECCIÓN 5: Tabla de Medicamentos Dispensados
  // ============================================
  doc.setFillColor(230, 243, 255);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 108, 176);
  doc.text("MEDICAMENTOS DISPENSADOS", 20, yPos + 5.5);
  
  yPos += 13;

  // Preparar datos de la tabla
  const tableData = data.medicines.map((med) => {
    const statusLabels = {
      fully_dispensed: "Dispensado ✓",
      partially_dispensed: "Parcial ⚠",
      not_available: "No Disponible ✗",
      rejected: "Rechazado ✗",
      pending: "Pendiente"
    };
    
    return [
      med.name,
      med.dose,
      med.prescribedQuantity,
      med.status === "fully_dispensed" || med.status === "partially_dispensed"
        ? `${med.dispensedQuantity} ${med.dispensedQuantityUnit}`
        : "N/A",
      statusLabels[med.status],
      med.batchNumber || "-",
      med.expirationDate || "-"
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["Medicamento", "Dosis", "Prescrito", "Dispensado", "Estado", "Lote", "Vencimiento"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [43, 108, 176],
      textColor: 255,
      fontSize: 8,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: {
      fontSize: 8,
      textColor: 0
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 28, halign: "center" },
      5: { cellWidth: 25, halign: "center" },
      6: { cellWidth: 25, halign: "center" }
    },
    margin: { left: 15, right: 15 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // ============================================
  // SECCIÓN 6: Detalles de Dispensación por Medicamento
  // ============================================
  const medicinesWithNotes = data.medicines.filter(
    m => m.dispensationNotes || m.rejectionReason
  );

  if (medicinesWithNotes.length > 0) {
    // Verificar si necesitamos una nueva página
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(230, 243, 255);
    doc.rect(15, yPos, pageWidth - 30, 8, "F");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 108, 176);
    doc.text("OBSERVACIONES DE DISPENSACIÓN", 20, yPos + 5.5);
    
    yPos += 13;

    medicinesWithNotes.forEach((med) => {
      // Verificar espacio en la página
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`• ${med.name}:`, 20, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      if (med.dispensationNotes) {
        const notes = doc.splitTextToSize(med.dispensationNotes, pageWidth - 50);
        doc.text(notes, 25, yPos);
        yPos += notes.length * 5 + 3;
      }

      if (med.rejectionReason) {
        doc.setFont("helvetica", "bold");
        doc.text("Motivo de no dispensación:", 25, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 5;
        const rejectionReasons: Record<string, string> = {
          stock_out: "Medicamento fuera de stock",
          discontinued: "Medicamento descontinuado",
          unavailable_presentation: "Presentación no disponible",
          quarantine: "Lote en cuarentena",
          patient_rejection: "Paciente rechaza el medicamento",
          requires_refrigeration: "Requiere refrigeración no disponible",
          other: "Otro motivo"
        };
        doc.text(rejectionReasons[med.rejectionReason] || med.rejectionReason, 25, yPos);
        yPos += 8;
      }
    });

    yPos += 5;
  }

  // ============================================
  // SECCIÓN 7: Observaciones Generales
  // ============================================
  if (data.generalNotes) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(230, 243, 255);
    doc.rect(15, yPos, pageWidth - 30, 8, "F");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 108, 176);
    doc.text("OBSERVACIONES GENERALES", 20, yPos + 5.5);
    
    yPos += 13;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const generalNotesLines = doc.splitTextToSize(data.generalNotes, pageWidth - 40);
    doc.text(generalNotesLines, 20, yPos);
    yPos += generalNotesLines.length * 5 + 10;
  }

  // ============================================
  // SECCIÓN 8: Firmas
  // ============================================
  if (yPos > pageHeight - 50) {
    doc.addPage();
    yPos = 20;
  }

  yPos = pageHeight - 50;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  
  // Firma del farmacéutico
  doc.line(20, yPos, 80, yPos);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Firma y Sello del Farmacéutico", 50, yPos + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(data.pharmacistName, 50, yPos + 10, { align: "center" });
  doc.text(`Lic. ${data.pharmacistLicense}`, 50, yPos + 15, { align: "center" });

  // Firma del paciente o receptor
  doc.line(pageWidth - 80, yPos, pageWidth - 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.text("Firma del Paciente/Receptor", pageWidth - 50, yPos + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("Recibí conforme", pageWidth - 50, yPos + 10, { align: "center" });

  // ============================================
  // FOOTER
  // ============================================
  const footerY = pageHeight - 15;
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Este comprobante certifica la dispensación de medicamentos según prescripción médica. Documento generado electrónicamente.",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
  
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado: ${new Date().toLocaleString("es-ES")} | ePrescription v1.0 | Cumple normativas HL7, FDA, OMS`,
    pageWidth / 2,
    footerY + 4,
    { align: "center" }
  );

  // Número de página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - 15, footerY, { align: "right" });
  }

  return doc;
}

/**
 * Imprime directamente el PDF de dispensación
 */
export function printDispensation(data: DispensationExportData) {
  const doc = generateDispensationPDF(data);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}

/**
 * Descarga el PDF de dispensación
 */
export function downloadDispensationPDF(data: DispensationExportData) {
  const doc = generateDispensationPDF(data);
  const fileName = `Dispensacion_${data.dispensationNumber}_${data.prescriptionNumber}.pdf`;
  doc.save(fileName);
}

/**
 * Exporta la dispensación a formato JSON
 */
export function exportDispensationToJSON(data: DispensationExportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Descarga la dispensación como JSON
 */
export function downloadDispensationJSON(data: DispensationExportData) {
  const jsonData = exportDispensationToJSON(data);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Dispensacion_${data.dispensationNumber}_${data.prescriptionNumber}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta la dispensación a formato CSV
 */
export function exportDispensationToCSV(data: DispensationExportData): string {
  const headers = [
    "Medicamento",
    "Dosis",
    "Prescrito",
    "Dispensado",
    "Unidad",
    "Estado",
    "Lote",
    "Vencimiento",
    "Observaciones"
  ];

  const rows = data.medicines.map((med) => {
    const statusLabels = {
      fully_dispensed: "Dispensado",
      partially_dispensed: "Parcial",
      not_available: "No Disponible",
      rejected: "Rechazado",
      pending: "Pendiente"
    };

    return [
      `"${med.name}"`,
      `"${med.dose}"`,
      `"${med.prescribedQuantity}"`,
      med.dispensedQuantity.toString(),
      `"${med.dispensedQuantityUnit}"`,
      `"${statusLabels[med.status]}"`,
      `"${med.batchNumber || ""}"`,
      `"${med.expirationDate || ""}"`,
      `"${med.dispensationNotes || ""}"`
    ];
  });

  const csv = [
    `Dispensación: ${data.dispensationNumber}`,
    `Receta: ${data.prescriptionNumber}`,
    `Paciente: ${data.patientName} (${data.patientId})`,
    `Fecha: ${data.dispensationDate} ${data.dispensationTime}`,
    `Farmacia: ${data.pharmacyName}`,
    `Farmacéutico: ${data.pharmacistName}`,
    "",
    headers.join(","),
    ...rows.map((row) => row.join(","))
  ].join("\n");

  return csv;
}

/**
 * Descarga la dispensación como CSV
 */
export function downloadDispensationCSV(data: DispensationExportData) {
  const csvData = exportDispensationToCSV(data);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Dispensacion_${data.dispensationNumber}_${data.prescriptionNumber}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Copia el resumen de dispensación al portapapeles
 */
export async function copyDispensationToClipboard(data: DispensationExportData): Promise<void> {
  const summary = `
COMPROBANTE DE DISPENSACIÓN
═══════════════════════════════════════════════════

DISPENSACIÓN: ${data.dispensationNumber}
RECETA: ${data.prescriptionNumber}
FECHA: ${data.dispensationDate} ${data.dispensationTime}

PACIENTE:
${data.patientName}
${data.patientId} | ${data.patientAge} años | ${data.patientGender}

MÉDICO PRESCRIPTOR:
${data.doctorName}
Registro: ${data.doctorCode}

FARMACIA:
${data.pharmacyName}
${data.pharmacyAddress}
Farmacéutico: ${data.pharmacistName} (Lic. ${data.pharmacistLicense})

MEDICAMENTOS DISPENSADOS:
${data.medicines
  .map((med, index) => {
    const statusLabels = {
      fully_dispensed: "✓ Dispensado",
      partially_dispensed: "⚠ Parcial",
      not_available: "✗ No Disponible",
      rejected: "✗ Rechazado",
      pending: "○ Pendiente"
    };

    return `
${index + 1}. ${med.name}
   Dosis: ${med.dose} | Frecuencia: ${med.frequency}
   Prescrito: ${med.prescribedQuantity}
   Dispensado: ${
     med.status === "fully_dispensed" || med.status === "partially_dispensed"
       ? `${med.dispensedQuantity} ${med.dispensedQuantityUnit}`
       : "N/A"
   }
   Estado: ${statusLabels[med.status]}
   ${med.batchNumber ? `Lote: ${med.batchNumber} | Venc: ${med.expirationDate}` : ""}
   ${med.dispensationNotes ? `Obs: ${med.dispensationNotes}` : ""}`;
  })
  .join("\n")}

${data.generalNotes ? `\nOBSERVACIONES GENERALES:\n${data.generalNotes}\n` : ""}
═══════════════════════════════════════════════════
Documento generado por ePrescription
Fecha de generación: ${new Date().toLocaleString("es-ES")}
  `.trim();

  await navigator.clipboard.writeText(summary);
}
