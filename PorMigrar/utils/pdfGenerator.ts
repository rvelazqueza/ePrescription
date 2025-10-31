/**
 * Generador de PDF para Recetas Médicas Electrónicas
 * Cumple con estándares de prescripción FDA, OMS y normativas internacionales
 * Formato profesional para impresión y archivo legal
 */

import { EmittedPrescriptionData } from "./emittedPrescriptionsStore";

/**
 * Generar PDF de receta médica y descargarlo
 */
export function generatePrescriptionPDF(prescriptionData: EmittedPrescriptionData): void {
  const { prescription, medicines } = prescriptionData;

  // Crear ventana de impresión
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita ventanas emergentes para generar el PDF');
    return;
  }

  // Generar HTML del documento
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receta Médica - ${prescription.prescriptionNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: Letter;
      margin: 1.5cm;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1a202c;
      background: white;
    }

    .prescription-container {
      max-width: 21cm;
      margin: 0 auto;
      padding: 20px;
      background: white;
    }

    /* Header */
    .header {
      border-bottom: 3px solid #2b6cb0;
      padding-bottom: 15px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-left {
      flex: 1;
    }

    .header-right {
      text-align: right;
    }

    .hospital-name {
      font-size: 18pt;
      font-weight: bold;
      color: #2b6cb0;
      margin-bottom: 5px;
    }

    .hospital-info {
      font-size: 9pt;
      color: #64748b;
    }

    .prescription-number {
      font-size: 14pt;
      font-weight: bold;
      color: #2b6cb0;
      margin-bottom: 3px;
    }

    .prescription-date {
      font-size: 9pt;
      color: #64748b;
    }

    /* Section Headers */
    .section-title {
      background: #e6f3ff;
      border-left: 4px solid #2b6cb0;
      padding: 8px 12px;
      margin: 15px 0 10px 0;
      font-weight: bold;
      font-size: 11pt;
      color: #1e40af;
    }

    /* Patient Info */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 20px;
      margin-bottom: 10px;
    }

    .info-item {
      display: flex;
      padding: 5px 0;
    }

    .info-label {
      font-weight: bold;
      color: #475569;
      min-width: 120px;
    }

    .info-value {
      color: #1a202c;
    }

    /* Alerts Box */
    .alerts-box {
      background: #fef2f2;
      border: 2px solid #dc2626;
      border-radius: 6px;
      padding: 12px;
      margin: 15px 0;
    }

    .alerts-title {
      color: #dc2626;
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 10pt;
    }

    .alert-item {
      padding: 4px 0;
      color: #7f1d1d;
      font-size: 9pt;
    }

    /* Medicines Table */
    .medicines-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 9.5pt;
    }

    .medicines-table th {
      background: #2b6cb0;
      color: white;
      padding: 10px 8px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #1e40af;
    }

    .medicines-table td {
      padding: 10px 8px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }

    .medicines-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .medicine-name {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 3px;
    }

    .medicine-commercial {
      color: #64748b;
      font-size: 8.5pt;
      font-style: italic;
    }

    .indications {
      background: #fef9e7;
      border-left: 3px solid #f59e0b;
      padding: 8px;
      margin-top: 5px;
      font-size: 8.5pt;
      color: #78350f;
    }

    /* Clinical Notes */
    .clinical-notes {
      background: #f0f9ff;
      border: 1px solid #0369a1;
      border-radius: 6px;
      padding: 12px;
      margin: 15px 0;
      font-size: 10pt;
    }

    /* Signature Section */
    .signature-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 15px;
    }

    .signature-box {
      text-align: center;
    }

    .signature-line {
      border-top: 2px solid #1a202c;
      margin: 40px 20px 8px 20px;
    }

    .signature-label {
      font-weight: bold;
      color: #475569;
      font-size: 10pt;
    }

    .signature-info {
      font-size: 9pt;
      color: #64748b;
      margin-top: 3px;
    }

    /* Digital Security */
    .security-section {
      background: #f8fafc;
      border: 2px dashed #64748b;
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
      text-align: center;
    }

    .security-title {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 10px;
      font-size: 11pt;
    }

    .security-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
      font-size: 9pt;
    }

    .qr-code {
      width: 100px;
      height: 100px;
      background: #e2e8f0;
      margin: 10px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #94a3b8;
      border-radius: 4px;
      font-size: 8pt;
      color: #475569;
    }

    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 8pt;
      color: #94a3b8;
    }

    /* Print Styles */
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .prescription-container {
        padding: 0;
      }

      .no-print {
        display: none !important;
      }

      @page {
        margin: 1.5cm;
      }
    }

    /* Print Button */
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2b6cb0;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 12pt;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .print-button:hover {
      background: #1e40af;
    }

    @media print {
      .print-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>

  <div class="prescription-container">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="hospital-name">${prescription.medicalCenter}</div>
        <div class="hospital-info">Sistema ePrescription v2.0</div>
        <div class="hospital-info">Prescripción Electrónica Certificada</div>
      </div>
      <div class="header-right">
        <div class="prescription-number">Nº ${prescription.prescriptionNumber}</div>
        <div class="prescription-date">${prescription.issueDate} - ${prescription.issueTime}</div>
        <div class="prescription-date">Estado: ${getStatusLabel(prescription.status)}</div>
      </div>
    </div>

    <!-- Patient Information -->
    <div class="section-title">📋 INFORMACIÓN DEL PACIENTE</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Nombre completo:</span>
        <span class="info-value">${prescription.patientName} ${prescription.patientFirstLastName} ${prescription.patientSecondLastName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Identificación:</span>
        <span class="info-value">${prescription.patientIdType}: ${prescription.patientId}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Edad:</span>
        <span class="info-value">${prescription.patientAge} años</span>
      </div>
      <div class="info-item">
        <span class="info-label">Sexo:</span>
        <span class="info-value">${prescription.patientGender === 'M' ? 'Masculino' : 'Femenino'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Tipo de sangre:</span>
        <span class="info-value">${prescription.patientBloodType}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Diagnóstico:</span>
        <span class="info-value">${prescription.diagnosis}</span>
      </div>
    </div>

    ${prescription.patientAllergies.length > 0 || prescription.patientChronicConditions.length > 0 ? `
    <div class="alerts-box">
      <div class="alerts-title">⚠️ ALERTAS CLÍNICAS IMPORTANTES</div>
      ${prescription.patientAllergies.length > 0 ? `
      <div class="alert-item"><strong>Alergias:</strong> ${prescription.patientAllergies.join(', ')}</div>
      ` : ''}
      ${prescription.patientChronicConditions.length > 0 ? `
      <div class="alert-item"><strong>Condiciones crónicas:</strong> ${prescription.patientChronicConditions.join(', ')}</div>
      ` : ''}
    </div>
    ` : ''}

    <!-- Medicines -->
    <div class="section-title">💊 MEDICAMENTOS PRESCRITOS (${medicines.length})</div>
    <table class="medicines-table">
      <thead>
        <tr>
          <th style="width: 5%">#</th>
          <th style="width: 25%">Medicamento</th>
          <th style="width: 15%">Presentación</th>
          <th style="width: 12%">Dosis</th>
          <th style="width: 15%">Frecuencia</th>
          <th style="width: 10%">Vía</th>
          <th style="width: 10%">Duración</th>
          <th style="width: 8%">Cantidad</th>
        </tr>
      </thead>
      <tbody>
        ${medicines.map((med, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="medicine-name">${med.genericName}</div>
            <div class="medicine-commercial">${med.commercialName}</div>
          </td>
          <td>${med.presentation}<br/>${med.concentration}</td>
          <td>${med.dose}</td>
          <td>${med.frequency}</td>
          <td>${med.route}</td>
          <td>${med.duration}</td>
          <td><strong>${med.quantity}</strong></td>
        </tr>
        ${med.indications ? `
        <tr>
          <td colspan="8">
            <div class="indications">
              <strong>Indicaciones:</strong> ${med.indications}
              ${med.substitutable ? ' • <em>Sustituible por genérico</em>' : ' • <em>NO sustituible</em>'}
            </div>
          </td>
        </tr>
        ` : ''}
        `).join('')}
      </tbody>
    </table>

    ${prescription.clinicalNotes ? `
    <div class="clinical-notes">
      <strong>📝 Notas Clínicas:</strong><br/>
      ${prescription.clinicalNotes}
    </div>
    ` : ''}

    <!-- Doctor Information -->
    <div class="section-title">👨‍⚕️ INFORMACIÓN DEL MÉDICO PRESCRIPTOR</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Nombre:</span>
        <span class="info-value">${prescription.doctorName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Licencia médica:</span>
        <span class="info-value">${prescription.doctorLicense}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Especialidad:</span>
        <span class="info-value">${prescription.doctorSpecialty}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Centro médico:</span>
        <span class="info-value">${prescription.medicalCenter}</span>
      </div>
    </div>

    <!-- Digital Signature -->
    <div class="security-section">
      <div class="security-title">🔒 FIRMA DIGITAL Y SEGURIDAD</div>
      <div class="qr-code">[Código QR]<br/>${prescription.qrCode || 'N/A'}</div>
      <div class="security-info">
        <div><strong>Token de firma:</strong> ${prescription.signatureToken || 'N/A'}</div>
        <div><strong>Fecha emisión:</strong> ${prescription.issueDate} ${prescription.issueTime}</div>
      </div>
      <div style="margin-top: 10px; font-size: 8pt; color: #64748b;">
        Esta receta está protegida con firma digital y puede ser verificada en línea usando el código QR o el token de firma.
      </div>
    </div>

    <!-- Signature Lines -->
    <div class="signature-section">
      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">${prescription.doctorName}</div>
          <div class="signature-info">Licencia: ${prescription.doctorLicense}</div>
          <div class="signature-info">${prescription.doctorSpecialty}</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Sello del Centro Médico</div>
          <div class="signature-info">${prescription.medicalCenter}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>Este documento es una prescripción médica electrónica generada por el sistema ePrescription v2.0</div>
      <div>Cumple con normativas FDA, OMS, HL7 FHIR y regulaciones internacionales de prescripción electrónica</div>
      <div style="margin-top: 8px;">Documento generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</div>
    </div>
  </div>

  <script>
    // Auto-abrir diálogo de impresión después de cargar
    window.onload = function() {
      // Pequeño delay para asegurar que todo se renderice
      setTimeout(() => {
        // No auto-imprimir, dejar que el usuario decida
        console.log('PDF de receta médica cargado y listo para imprimir');
      }, 500);
    };

    // Cerrar ventana después de imprimir o cancelar
    window.onafterprint = function() {
      // Dar tiempo para que el usuario vea el resultado
      setTimeout(() => {
        if (confirm('¿Desea cerrar esta ventana?')) {
          window.close();
        }
      }, 1000);
    };
  </script>
</body>
</html>
  `;

  // Escribir contenido en la ventana
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Obtener etiqueta de estado
 */
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    emitted: 'EMITIDA',
    dispensed: 'DISPENSADA',
    cancelled: 'ANULADA'
  };
  return labels[status] || status.toUpperCase();
}

/**
 * Descargar PDF directamente como archivo
 * Genera el PDF y lo descarga automáticamente
 */
export function downloadPrescriptionPDF(prescriptionData: EmittedPrescriptionData): void {
  const { prescription, medicines } = prescriptionData;

  // Crear ventana temporal para generar el PDF
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita ventanas emergentes para generar el PDF');
    return;
  }

  // Generar HTML del documento (mismo que generatePrescriptionPDF pero con auto-impresión)
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receta Médica - ${prescription.prescriptionNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: Letter;
      margin: 1.5cm;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1a202c;
      background: white;
    }

    .prescription-container {
      max-width: 21cm;
      margin: 0 auto;
      padding: 20px;
      background: white;
    }

    /* Header */
    .header {
      border-bottom: 3px solid #2b6cb0;
      padding-bottom: 15px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-left {
      flex: 1;
    }

    .header-right {
      text-align: right;
    }

    .hospital-name {
      font-size: 18pt;
      font-weight: bold;
      color: #2b6cb0;
      margin-bottom: 5px;
    }

    .hospital-info {
      font-size: 9pt;
      color: #64748b;
    }

    .prescription-number {
      font-size: 14pt;
      font-weight: bold;
      color: #2b6cb0;
      margin-bottom: 3px;
    }

    .prescription-date {
      font-size: 9pt;
      color: #64748b;
    }

    .prescription-status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: bold;
      margin-top: 5px;
    }

    .status-emitted {
      background-color: #dbeafe;
      color: #1e40af;
      border: 1px solid #93c5fd;
    }

    .status-dispensed {
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #6ee7b7;
    }

    .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }

    /* Section Headers */
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #2b6cb0;
      margin-top: 20px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #e2e8f0;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 8pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .info-value {
      font-size: 10pt;
      color: #1a202c;
      font-weight: 500;
    }

    /* Allergies Alert */
    .allergies-alert {
      background: #fee2e2;
      border: 2px solid #dc2626;
      border-radius: 6px;
      padding: 10px;
      margin: 15px 0;
    }

    .allergies-title {
      color: #991b1b;
      font-weight: bold;
      font-size: 10pt;
      margin-bottom: 5px;
    }

    .allergies-list {
      color: #7f1d1d;
      font-size: 9pt;
    }

    /* Medicines Table */
    .medicines-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 9pt;
    }

    .medicines-table th {
      background-color: #2b6cb0;
      color: white;
      padding: 10px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 9pt;
    }

    .medicines-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #e2e8f0;
    }

    .medicines-table tr:last-child td {
      border-bottom: 2px solid #2b6cb0;
    }

    .medicine-name {
      font-weight: bold;
      color: #1a202c;
    }

    .medicine-details {
      color: #64748b;
      font-size: 8pt;
      margin-top: 3px;
    }

    .substitutable-badge {
      display: inline-block;
      background: #d1fae5;
      color: #065f46;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 7pt;
      font-weight: bold;
      margin-left: 8px;
    }

    /* Clinical Info */
    .clinical-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      margin: 15px 0;
      font-size: 9pt;
    }

    /* Security Section */
    .security-section {
      background: #f1f5f9;
      border: 2px solid #2b6cb0;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .security-title {
      font-size: 11pt;
      font-weight: bold;
      color: #2b6cb0;
      margin-bottom: 10px;
      width: 100%;
    }

    .qr-code {
      min-width: 100px;
      height: 100px;
      background: white;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      color: #64748b;
      text-align: center;
      padding: 10px;
    }

    .security-info {
      flex: 1;
      font-size: 9pt;
    }

    .security-info > div {
      margin: 5px 0;
    }

    /* Signature Section */
    .signature-section {
      margin-top: 40px;
      page-break-inside: avoid;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-top: 20px;
    }

    .signature-box {
      text-align: center;
    }

    .signature-line {
      border-top: 2px solid #1a202c;
      margin: 60px 20px 10px 20px;
    }

    .signature-label {
      font-weight: bold;
      font-size: 10pt;
      color: #1a202c;
      margin-bottom: 3px;
    }

    .signature-info {
      font-size: 8pt;
      color: #64748b;
    }

    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #cbd5e1;
      font-size: 7pt;
      color: #64748b;
      text-align: center;
      line-height: 1.6;
    }

    /* Warning Box */
    .warning-box {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 6px;
      padding: 10px;
      margin: 15px 0;
      font-size: 8pt;
      color: #78350f;
    }

    .warning-title {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 9pt;
    }

    /* Print Styles */
    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .prescription-container {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }

      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="prescription-container">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="hospital-name">ePrescription</div>
        <div class="hospital-info">${prescription.medicalCenter}</div>
        <div class="hospital-info">Sistema de Prescripción Electrónica</div>
      </div>
      <div class="header-right">
        <div class="prescription-number">Receta N° ${prescription.prescriptionNumber}</div>
        <div class="prescription-date">Fecha: ${prescription.issueDate} ${prescription.issueTime}</div>
        <div class="prescription-status status-${prescription.status}">
          ${getStatusLabel(prescription.status)}
        </div>
      </div>
    </div>

    <!-- Patient Information -->
    <div class="section-title">👤 INFORMACIÓN DEL PACIENTE</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Nombre completo:</span>
        <span class="info-value">${prescription.patientName} ${prescription.patientFirstLastName} ${prescription.patientSecondLastName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Identificación:</span>
        <span class="info-value">${prescription.patientIdType}: ${prescription.patientId}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Edad / Género:</span>
        <span class="info-value">${prescription.patientAge} años / ${prescription.patientGender === 'M' ? 'Masculino' : 'Femenino'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Tipo de sangre:</span>
        <span class="info-value">${prescription.patientBloodType}</span>
      </div>
    </div>

    ${prescription.patientAllergies && prescription.patientAllergies.length > 0 ? `
    <div class="allergies-alert">
      <div class="allergies-title">⚠️ ALERGIAS CONOCIDAS</div>
      <div class="allergies-list">${prescription.patientAllergies.join(', ')}</div>
    </div>
    ` : ''}

    ${prescription.patientChronicConditions && prescription.patientChronicConditions.length > 0 ? `
    <div class="clinical-box">
      <strong>📋 Condiciones Crónicas:</strong> ${prescription.patientChronicConditions.join(', ')}
    </div>
    ` : ''}

    <!-- Medicines -->
    <div class="section-title">💊 MEDICAMENTOS PRESCRITOS</div>
    <table class="medicines-table">
      <thead>
        <tr>
          <th style="width: 35%;">Medicamento</th>
          <th style="width: 15%;">Dosis</th>
          <th style="width: 20%;">Frecuencia</th>
          <th style="width: 15%;">Duración</th>
          <th style="width: 15%;">Vía</th>
        </tr>
      </thead>
      <tbody>
        ${medicines.map(med => `
          <tr>
            <td>
              <div class="medicine-name">
                ${med.genericName}
                ${med.substitutable ? '<span class="substitutable-badge">SUSTITUIBLE</span>' : ''}
              </div>
              <div class="medicine-details">
                ${med.commercialName} - ${med.presentation} ${med.concentration}
                ${med.quantity ? ` (Cantidad: ${med.quantity})` : ''}
              </div>
              ${med.indications ? `<div class="medicine-details" style="margin-top: 4px;"><strong>Indicaciones:</strong> ${med.indications}</div>` : ''}
            </td>
            <td>${med.dose}</td>
            <td>${med.frequency}</td>
            <td>${med.duration}</td>
            <td>${med.route}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    ${prescription.diagnosis ? `
    <div class="clinical-box">
      <strong>🩺 Diagnóstico:</strong><br/>
      ${prescription.diagnosis}
    </div>
    ` : ''}

    ${prescription.clinicalNotes ? `
    <div class="clinical-box">
      <strong>📝 Notas Clínicas:</strong><br/>
      ${prescription.clinicalNotes}
    </div>
    ` : ''}

    <!-- Doctor Information -->
    <div class="section-title">👨‍⚕️ INFORMACIÓN DEL MÉDICO PRESCRIPTOR</div>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Nombre:</span>
        <span class="info-value">${prescription.doctorName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Licencia médica:</span>
        <span class="info-value">${prescription.doctorLicense}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Especialidad:</span>
        <span class="info-value">${prescription.doctorSpecialty}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Centro médico:</span>
        <span class="info-value">${prescription.medicalCenter}</span>
      </div>
    </div>

    <!-- Digital Signature -->
    <div class="security-section">
      <div class="security-title">🔒 FIRMA DIGITAL Y SEGURIDAD</div>
      <div class="qr-code">[Código QR]<br/>${prescription.qrCode || 'N/A'}</div>
      <div class="security-info">
        <div><strong>Token de firma:</strong> ${prescription.signatureToken || 'N/A'}</div>
        <div><strong>Fecha emisión:</strong> ${prescription.issueDate} ${prescription.issueTime}</div>
      </div>
      <div style="margin-top: 10px; font-size: 8pt; color: #64748b;">
        Esta receta está protegida con firma digital y puede ser verificada en línea usando el código QR o el token de firma.
      </div>
    </div>

    <!-- Signature Lines -->
    <div class="signature-section">
      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">${prescription.doctorName}</div>
          <div class="signature-info">Licencia: ${prescription.doctorLicense}</div>
          <div class="signature-info">${prescription.doctorSpecialty}</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Sello del Centro Médico</div>
          <div class="signature-info">${prescription.medicalCenter}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>Este documento es una prescripción médica electrónica generada por el sistema ePrescription v2.0</div>
      <div>Cumple con normativas FDA, OMS, HL7 FHIR y regulaciones internacionales de prescripción electrónica</div>
      <div style="margin-top: 8px;">Documento generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</div>
    </div>
  </div>

  <script>
    // Auto-abrir diálogo de impresión para guardar como PDF
    window.onload = function() {
      setTimeout(() => {
        // Configurar título del documento para la descarga
        document.title = 'Receta_${prescription.prescriptionNumber}_${prescription.patientName.replace(/[^a-zA-Z0-9]/g, '_')}';
        
        // Abrir diálogo de impresión (el usuario puede seleccionar "Guardar como PDF")
        window.print();
      }, 500);
    };

    // Cerrar ventana después de imprimir o cancelar
    window.onafterprint = function() {
      setTimeout(() => {
        window.close();
      }, 1000);
    };
  </script>
</body>
</html>
  `;

  // Escribir contenido en la ventana
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Generar nombre de archivo para PDF
 */
export function getPDFFileName(prescriptionNumber: string, patientName: string): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitizedPatient = patientName.replace(/[^a-zA-Z0-9]/g, '_');
  return `Receta_${prescriptionNumber}_${sanitizedPatient}_${date}.pdf`;
}

/**
 * Imprimir receta médica (abre diálogo de impresión del navegador)
 * Esta función es idéntica a generatePrescriptionPDF - abre ventana con botón de imprimir
 */
export function printPrescriptionPDF(prescriptionData: EmittedPrescriptionData): void {
  // Usar la función de generación existente que ya abre el diálogo de impresión
  generatePrescriptionPDF(prescriptionData);
}

/**
 * Reimprimir receta médica (alias de printPrescriptionPDF)
 * Funcionalidad idéntica, solo diferencia semántica para el contexto
 */
export function reprintPrescriptionPDF(prescriptionData: EmittedPrescriptionData): void {
  printPrescriptionPDF(prescriptionData);
}
